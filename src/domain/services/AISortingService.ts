import { AISettings, AIAnalysisResult } from '../models/AISettings';
import { ClassificationMeta } from '../models/Classification';

/**
 * Service to call Gemini or OpenAI Vision API for photo auto-classification.
 */
export async function analyzePhotoWithAI(
  base64ImageData: string,
  categories: ClassificationMeta[],
  settings: AISettings
): Promise<Omit<AIAnalysisResult, 'photoId' | 'analyzedAt'>> {
  if (!settings.apiKey) {
    throw new Error('API Key belum diisi. Silakan atur di Pengaturan AI.');
  }

  const categoryListText = categories
    .map((c) => `- ID: "${c.id}", Nama: "${c.label}", Deskripsi Kategori: "${c.folderName}"`)
    .join('\n');

  const prompt = `Anda adalah asisten fotografer profesional penyortir foto.
Tugas Anda adalah menganalisis gambar ini dan mengelompokkannya ke SALAH SATU dari kategori berikut:
${categoryListText}

Kembalikan jawaban HANYA dalam format JSON valid tanpa tanda backtick markdown seperti berikut:
{
  "recommendedClassificationId": "<SALAH_SATU_ID_KATEGORI_DI_ATAS>",
  "confidence": <ANGKA_DESIMAL_ANTARA_0.0_HINGGA_1.0>,
  "reasoning": "<ALASAN_SINGKAT_DALAM_BAHASA_INDONESIA_MAKS_15_KATA>"
}`;

  if (settings.provider === 'gemini') {
    return analyzeWithGemini(base64ImageData, prompt, settings);
  } else {
    return analyzeWithOpenAI(base64ImageData, prompt, settings);
  }
}

async function analyzeWithGemini(
  base64ImageData: string,
  prompt: string,
  settings: AISettings
): Promise<Omit<AIAnalysisResult, 'photoId' | 'analyzedAt'>> {
  const cleanBase64 = base64ImageData.replace(/^data:image\/\w+;base64,/, '');
  const modelName = settings.model || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${settings.apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: cleanBase64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        response_mime_type: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) {
    throw new Error('Respons AI kosong dari Gemini.');
  }

  return parseAIJSON(textOutput);
}

async function analyzeWithOpenAI(
  base64ImageData: string,
  prompt: string,
  settings: AISettings
): Promise<Omit<AIAnalysisResult, 'photoId' | 'analyzedAt'>> {
  const modelName = settings.model || 'gpt-4o-mini';
  const url = 'https://api.openai.com/v1/chat/completions';
  const dataUrl = base64ImageData.startsWith('data:')
    ? base64ImageData
    : `data:image/jpeg;base64,${base64ImageData}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: { url: dataUrl },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 200,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const textOutput = data?.choices?.[0]?.message?.content;
  if (!textOutput) {
    throw new Error('Respons AI kosong dari OpenAI.');
  }

  return parseAIJSON(textOutput);
}

function parseAIJSON(rawText: string): Omit<AIAnalysisResult, 'photoId' | 'analyzedAt'> {
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : rawText;
    const parsed = JSON.parse(jsonStr);

    return {
      recommendedClassificationId: String(parsed.recommendedClassificationId || ''),
      confidence: typeof parsed.confidence === 'number' ? Math.min(1, Math.max(0, parsed.confidence)) : 0.8,
      reasoning: String(parsed.reasoning || 'Kategorisasi AI.'),
    };
  } catch {
    throw new Error('Gagal memproses format respons dari AI.');
  }
}
