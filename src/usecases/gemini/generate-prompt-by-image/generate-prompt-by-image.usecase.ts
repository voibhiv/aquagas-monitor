import { GenerativeModel } from '@google/generative-ai';
import { GoogleGateway } from '@src/domain/gateway/google.gateway';

export class GenerateImagePromptUseCase implements GoogleGateway {
  private constructor(private readonly geminiModel: GenerativeModel) {}

  public static create(geminiModel: GenerativeModel) {
    return new GenerateImagePromptUseCase(geminiModel);
  }

  public async execute(base64Image: string) {
    const promptConfig = [];
    const mimeType = this.identifyMimeType(base64Image);

    const prompt = `
    I have an image of a water or gas meter. Please analyze the image and provide the value shown on the meter. 
    Be careful to distinguish between the serial number and the actual reading value. 
    The meter may have a specific color, which can help in identifying the correct numbers. 
    To ensure accuracy, focus on identifying the value that is followed by "m³" (cubic meters). 
    The correct reading will have "m³" after it and should be in an 8-digit format. If "m³" is not present, return the value that is in colored and larger numbers. Both water and gas meters follow this pattern. Please return only the numeric value without the "m³".
  `;

    promptConfig.push({ text: prompt });

    promptConfig.push({
      inlineData: {
        mimeType,
        data: base64Image,
      },
    });

    const result = await this.geminiModel.generateContent(promptConfig);

    return {
      text: result.response.text(),
      mimeType,
    };
  }

  private identifyMimeType(base64Image: string): string {
    const signatures: Record<string, string> = {
      iVBORw0KGgo: 'image/png',
      '/9j/': 'image/jpeg',
      UklGR: 'image/webp',
      LE: 'image/heic',
      ftypheic: 'image/heif',
    };

    for (const s in signatures) {
      if (base64Image.startsWith(s)) {
        return signatures[s];
      }
    }

    return 'image/jpeg';
  }
}
