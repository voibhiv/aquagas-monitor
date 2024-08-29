import { GoogleGenerativeAI, ModelParams } from '@google/generative-ai';

export class GoogleGenerative extends GoogleGenerativeAI {
  constructor(private readonly API_KEY: string) {
    super(API_KEY);
  }

  private static modelParams: ModelParams = {
    model: 'gemini-1.5-flash',
  };
  
  private static create(API_KEY: string) {
    return new GoogleGenerative(API_KEY);
  }

  private static generateModel(genAI: GoogleGenerative) {
    return genAI.getGenerativeModel(this.modelParams);
  }

}
