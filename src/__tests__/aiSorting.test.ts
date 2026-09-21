import { describe, it, expect, vi } from 'vitest';
import { analyzePhotoWithAI } from '../domain/services/AISortingService';
import { DEFAULT_CLASSIFICATIONS } from '../domain/models/Classification';
import { AISettings } from '../domain/models/AISettings';

describe('AISortingService', () => {
  it('throws an error if API key is missing', async () => {
    const settings: AISettings = {
      enabled: true,
      provider: 'gemini',
      apiKey: '',
      model: 'gemini-1.5-flash',
      autoConfidenceThreshold: 0.7,
    };

    await expect(
      analyzePhotoWithAI('data:image/png;base64,123', DEFAULT_CLASSIFICATIONS, settings)
    ).rejects.toThrow('API Key belum diisi');
  });

  it('parses valid Gemini AI response correctly', async () => {
    const settings: AISettings = {
      enabled: true,
      provider: 'gemini',
      apiKey: 'test-key',
      model: 'gemini-1.5-flash',
      autoConfidenceThreshold: 0.7,
    };

    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  recommendedClassificationId: 'PERFECT',
                  confidence: 0.92,
                  reasoning: 'Fokus sangat tajam dan komposisi bagus',
                }),
              },
            ],
          },
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as any);

    const result = await analyzePhotoWithAI('data:image/png;base64,123', DEFAULT_CLASSIFICATIONS, settings);

    expect(result.recommendedClassificationId).toBe('PERFECT');
    expect(result.confidence).toBe(0.92);
    expect(result.reasoning).toContain('Fokus sangat tajam');
  });
});
