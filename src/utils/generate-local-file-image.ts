import fs from 'fs';
import path from 'path';
import config from 'config';

const rootDirectory = path.join(__dirname, '../');
const imagesDirectory = path.join(rootDirectory, 'images');

export const generateLocalFileImage = async function (
  base64Image: string,
  mimeType: string,
) {
  try {
    if (!fs.existsSync(imagesDirectory)) {
      await fs.promises.mkdir(imagesDirectory, { recursive: true });
    }

    const filename =
      crypto.randomUUID().toString() + `.${mimeType.split('/')[1]}`;
    const filePath = path.join(imagesDirectory, filename);

    await fs.promises.writeFile(filePath, base64Image, 'base64');

    return `http://localhost:${config.get('App.port')}/images/${filename}`;
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
};
