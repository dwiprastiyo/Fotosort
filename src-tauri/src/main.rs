// Prevents additional console window on Windows in release, do not remove!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use tauri::Manager;
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_shell::ShellExt;

// ═══════════════════════════════════════════════════════════════════════
//  COMMAND DATA TRANSFER OBJECTS (DTOs)
// ═══════════════════════════════════════════════════════════════════════

#[derive(Debug, Serialize, Deserialize)]
struct ScanRequest {
    folder_path: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct ScanResponse {
    photo_count: usize,
    photos: Vec<PhotoInfo>,
}

#[derive(Debug, Serialize, Deserialize)]
struct PhotoInfo {
    filename: String,
    source_path: String,
    file_size: u64,
    mime_type: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct FileOperationRequest {
    source_path: String,
    destination_path: String,
    strategy: String, // "REPLACE", "RENAME", "SKIP"
    operation: Option<String>, // "COPY" or "MOVE"
}

#[derive(Debug, Serialize, Deserialize)]
struct FileOperationResponse {
    success: bool,
    destination_path: String,
    error: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct CreateDirRequest {
    dir_path: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct DirResponse {
    success: bool,
    error: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct VerifyRequest {
    file_path: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct VerifyResponse {
    exists: bool,
}

#[derive(Debug, Serialize, Deserialize)]
struct OpenFolderResponse {
    path: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct OpenFileResponse {
    success: bool,
    error: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct TrashItem {
    file_path: String,
    operation: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct TrashResponse {
    items: Vec<TrashItem>,
}

// ═══════════════════════════════════════════════════════════════════════
//  APPLICATION ENTRY POINT
// ═══════════════════════════════════════════════════════════════════════

fn main() {
    tauri::Builder::default()
        // Single instance: only one FotoSort window at a time
        .plugin(tauri_plugin_single_instance::init(|_app, _cwd, _notification| {
            // When a second instance is launched, focus the existing window
        }))
        // Setup lifecycle hooks
        .setup(|app| {
            let window = app.get_webview_window("main").expect("main window not found");
            window.set_title("FotoSort — Rapid Photo Culling");
            Ok(())
        })
        // Register all invoke (command) handlers
        .invoke_handler(tauri::generate_handler![
            // ── Folder & File Discovery ──
            select_folder,
            scan_directory,
            read_directory,
            // ── Directory Management ──
            create_directory,
            // ── File Operations (Copy / Move) ──
            copy_file,
            verify_file_exists,
            // ── System Integration ──
            open_folder_in_explorer,
            open_file_in_default_app,
            move_to_trash,
            // ── Application Info ──
            get_app_version,
            get_platform_info,
            get_system_temp_path,
        ])
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("error while running FotoSort application");
}

// ═══════════════════════════════════════════════════════════════════════
//  COMMAND HANDLERS
// ═══════════════════════════════════════════════════════════════════════

/// Open the native folder picker dialog. Returns the selected path or null.
#[tauri::command]
async fn select_folder(app: tauri::AppHandle) -> OpenFolderResponse {
    let path = app
        .dialog()
        .file()
        .blocking_pick_folder()
        .and_then(|file_path| file_path.into_path().ok())
        .map(|path| path.to_string_lossy().to_string());
    OpenFolderResponse { path }
}

/// Scan a directory for supported image files (JPG, PNG, HEIC, WebP).
/// Returns total count and a list of detected photos with metadata.
#[tauri::command]
async fn scan_directory(req: ScanRequest) -> Result<ScanResponse, String> {
    let folder_path = &req.folder_path;

    let entries = match std::fs::read_dir(folder_path) {
        Ok(e) => e,
        Err(src) => {
            return Err(format!(
                "Failed to read directory '{}': {}",
                folder_path, src
            ));
        }
    };

    // Supported image extensions for photo culling
    let supported_exts: Vec<&str> = vec!["jpg", "jpeg", "png", "heic", "heif", "webp"];
    let mut photos: Vec<PhotoInfo> = Vec::new();

    for entry in entries.flatten() {
        let path = entry.path();
        if !path.is_file() {
            continue;
        }

        let ext = path
            .extension()
            .and_then(|e| e.to_str())
            .map(|e| e.to_lowercase())
            .unwrap_or_default();

        if !supported_exts.contains(&ext.as_str()) {
            continue;
        }

        let metadata = match std::fs::metadata(&path) {
            Ok(m) => m,
            Err(_) => continue,
        };

        let filename = path
            .file_name()
            .and_then(|n| n.to_str())
            .unwrap_or_default()
            .to_string();

        let source_path = path.to_string_lossy().to_string();

        photos.push(PhotoInfo {
            filename,
            source_path,
            file_size: metadata.len(),
            mime_type: match ext.as_str() {
                "jpg" | "jpeg" => "image/jpeg".to_string(),
                "png" => "image/png".to_string(),
                "heic" | "heif" => "image/heic".to_string(),
                "webp" => "image/webp".to_string(),
                _ => "image/jpeg".to_string(),
            },
        });
    }

    // Deterministic order: sort by filename
    photos.sort_by(|a, b| a.filename.cmp(&b.filename));

    Ok(ScanResponse {
        photo_count: photos.len(),
        photos,
    })
}

/// Read all file names in a directory (useful for debugging / directory listing).
#[tauri::command]
async fn read_directory(folder_path: String) -> Result<Vec<String>, String> {
    let entries = std::fs::read_dir(&folder_path)
        .map_err(|e| format!("Failed to read '{}': {}", folder_path, e))?;

    let mut names: Vec<String> = Vec::new();
    for entry in entries.flatten() {
        if let Some(name) = entry.file_name().to_str() {
            names.push(name.to_string());
        }
    }

    Ok(names)
}

/// Create a directory recursively (creates all parent directories if needed).
#[tauri::command]
async fn create_directory(req: CreateDirRequest) -> DirResponse {
    match std::fs::create_dir_all(&req.dir_path) {
        Ok(_) => DirResponse {
            success: true,
            error: None,
        },
        Err(e) => DirResponse {
            success: false,
            error: Some(format!(
                "Failed to create directory '{}': {}",
                req.dir_path, e
            )),
        },
    }
}

/// Copy a file from source to destination with duplicate strategy handling.
/// Strategies:
///   - "REPLACE": Overwrite destination if it exists
///   - "RENAME":  Append a timestamp suffix to avoid overwriting
///   - "SKIP":    Abort if destination already exists
#[tauri::command]
async fn copy_file(req: FileOperationRequest) -> FileOperationResponse {
    let src = std::path::Path::new(&req.source_path);
    let dst = std::path::Path::new(&req.destination_path);

    // Safety check: source must exist
    if !src.exists() {
        return FileOperationResponse {
            success: false,
            destination_path: req.destination_path,
            error: Some(format!("Source file does not exist: {}", req.source_path)),
        };
    }

    // Safety check: source must be a file, not a directory
    if !src.is_file() {
        return FileOperationResponse {
            success: false,
            destination_path: req.destination_path,
            error: Some(format!("Source is not a file: {}", req.source_path)),
        };
    }

    let final_dest = match req.strategy.as_str() {
        "SKIP" => {
            if dst.exists() {
                return FileOperationResponse {
                    success: true,
                    destination_path: req.destination_path,
                    error: Some("SKIP: Destination already exists, skipped".to_string()),
                };
            }
            dst.to_path_buf()
        }
        "RENAME" => {
            if dst.exists() {
                // Generate unique name: photo.jpg → photo_copy_1718000000000.jpg
                if let Some(ext) = dst.extension() {
                    let stem = dst.file_stem().unwrap_or_default().to_string_lossy();
                    let timestamp = std::time::SystemTime::now()
                        .duration_since(std::time::UNIX_EPOCH)
                        .map(|d| d.as_millis() as u64)
                        .unwrap_or(0);
                    let unique_name = format!("{}_copy_{}.{}", stem, timestamp, ext.to_string_lossy());
                    dst.with_file_name(unique_name)
                } else {
                    dst.to_path_buf()
                }
            } else {
                dst.to_path_buf()
            }
        }
        // "REPLACE" or any other value: use destination as-is
        _ => dst.to_path_buf(),
    };

    // Ensure parent directory exists
    if let Some(parent) = final_dest.parent() {
        if let Err(e) = std::fs::create_dir_all(parent) {
            return FileOperationResponse {
                success: false,
                destination_path: req.destination_path,
                error: Some(format!("Failed to create parent directory: {}", e)),
            };
        }
    }

    // MOVE uses copy-then-delete so it works across volumes such as an SD card to the Mac disk.
    let operation = req.operation.as_deref().unwrap_or("COPY");
    let result = if operation == "MOVE" {
        match std::fs::copy(src, &final_dest) {
            Ok(_) => std::fs::remove_file(src),
            Err(error) => Err(error),
        }
    } else {
        std::fs::copy(src, &final_dest).map(|_| ())
    };

    match result {
        Ok(_) => FileOperationResponse {
            success: true,
            destination_path: final_dest.to_string_lossy().to_string(),
            error: None,
        },
        Err(e) => FileOperationResponse {
            success: false,
            destination_path: req.destination_path.clone(),
            error: Some(format!(
                "Failed to copy '{}' to '{}': {}",
                req.source_path, req.destination_path, e
            )),
        },
    }
}

/// Verify whether a file exists at the specified path.
#[tauri::command]
async fn verify_file_exists(req: VerifyRequest) -> VerifyResponse {
    VerifyResponse {
        exists: std::path::Path::new(&req.file_path).exists(),
    }
}

/// Open a folder in the system file explorer (Finder on macOS, Explorer on Windows, Nautilus on Linux).
#[tauri::command]
async fn open_folder_in_explorer(app: tauri::AppHandle, path: String) -> OpenFileResponse {
    match app.shell().open(path, None) {
        Ok(_) => OpenFileResponse {
            success: true,
            error: None,
        },
        Err(e) => OpenFileResponse {
            success: false,
            error: Some(format!("Failed to open folder: {}", e)),
        },
    }
}

/// Open a file in the system's default associated application.
#[tauri::command]
async fn open_file_in_default_app(app: tauri::AppHandle, path: String) -> OpenFileResponse {
    match app.shell().open(path, None) {
        Ok(_) => OpenFileResponse {
            success: true,
            error: None,
        },
        Err(e) => OpenFileResponse {
            success: false,
            error: Some(format!("Failed to open file: {}", e)),
        },
    }
}

/// Move files to the system trash/recycle bin (platform-appropriate).
/// Returns a list of items that were processed.
#[tauri::command]
async fn move_to_trash(items: Vec<String>) -> TrashResponse {
    // Platform-specific trash implementation using the `trash` crate
    // would be ideal here. For now, we return the structure and
    // the frontend can use shell to open the trash or use platform APIs.
    let processed: Vec<TrashItem> = items
        .iter()
        .map(|path| TrashItem {
            file_path: path.clone(),
            operation: "trash".to_string(),
        })
        .collect();

    TrashResponse { items: processed }
}

// ═══════════════════════════════════════════════════════════════════════
//  APPLICATION INFO & UTILITY COMMANDS
// ═══════════════════════════════════════════════════════════════════════

/// Return the current application version from Cargo.toml.
#[tauri::command]
async fn get_app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

/// Return platform information for debugging / telemetry.
#[tauri::command]
async fn get_platform_info() -> String {
    let os = if cfg!(target_os = "macos") {
        "macOS"
    } else if cfg!(target_os = "windows") {
        "Windows"
    } else if cfg!(target_os = "linux") {
        "Linux"
    } else {
        "Unknown"
    };
    let arch = option_env!("TARGET").unwrap_or("unknown");
    let bits = std::mem::size_of::<usize>() * 8;
    format!("{} {} ({}-bit)", os, arch, bits)
}

/// Return the system's temporary directory path for scratch operations.
#[tauri::command]
async fn get_system_temp_path() -> String {
    std::env::temp_dir()
        .to_string_lossy()
        .to_string()
}
