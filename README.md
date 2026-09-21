# FotoSort — Rapid Photo Culling App

A high-speed desktop application for photo culling and categorization built with **Tauri v2**, **React**, **TypeScript**, and a **Soft Neubrutalism** UI system.

## Features
- **Rapid Photo Culling**: Lightning-fast photo loading & hotkey classification (`Q`, `W`, `E`, `R`).
- **Custom Categories**: Add, rename, and customize photo sorting categories dynamically.
- **Soft Neubrutalism UI**: Beautiful soft pastel palette, bold 2.5px borders, and tactile micro-animations.
- **Safe Separation Engine**: Non-destructive photo workflow (Copy mode).

---

## 💻 Building Windows Executable (`.exe` / `.msi`)

Since Windows native builds require Microsoft WebView2 & Windows SDK toolchains, automated Windows build configuration is included via GitHub Actions.

### Steps to get `.exe` installer for Windows:

1. Initalize Git repository & Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: soft neubrutalism theme & custom categories"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. Go to your GitHub Repository -> **Actions** tab.
3. The **Build Windows Application** workflow will run automatically on Windows servers.
4. Download the generated `FotoSort-Windows-Installer` artifact containing:
   - `FotoSort_1.0.0_x64-setup.exe` (Windows NSIS Installer)
   - `FotoSort_1.0.0_x64_en-US.msi` (Windows MSI Package)

---

## 🍏 Building macOS Installer (`.dmg`)

Run the following command directly on Mac:
```bash
npx tauri build
```
The output will be saved in:
`src-tauri/target/release/bundle/dmg/FotoSort_1.0.0_aarch64.dmg`
