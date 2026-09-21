export interface AISettings {
  enabled: boolean;
  provider: 'gemini' | 'openai';
  apiKey: string;
  model: string;
  autoConfidenceThreshold: number; // e.g. 0.70 (70%)
}

export const DEFAULT_AI_SETTINGS: AISettings = {
  enabled: false,
  provider: 'gemini',
  apiKey: '',
  model: 'gemini-1.5-flash',
  autoConfidenceThreshold: 0.7,
};

export interface AIAnalysisResult {
  photoId: string;
  recommendedClassificationId: string;
  confidence: number; // 0.0 to 1.0
  reasoning: string;
  analyzedAt: string;
}
