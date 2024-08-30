export interface GoogleGateway {
  execute(base64Image: string): Promise<{
    text: string;
    mimeType: string;
  }>;
}
