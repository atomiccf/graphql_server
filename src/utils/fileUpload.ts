import fs from 'fs';
import path from 'node:path';
import { getStoragePath } from '@configuration/index.js';
import type { File } from '@graphql/types/taskInput.js';

export async function saveUploadedFile(image: Promise<File>, userId: string): Promise<string> {
    const uploadDir = path.join(getStoragePath(), userId);
    const uploadedImage = await image;

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}_${uploadedImage.filename}`;
    const filePath = path.join(uploadDir, fileName);

    const readStream = uploadedImage.createReadStream();
    const writeStream = fs.createWriteStream(filePath);

    await new Promise<void>((resolve, reject) => {
        readStream.on('error', reject);
        writeStream.on('error', reject);
        writeStream.on('finish', resolve);
        readStream.pipe(writeStream);
    });

    return filePath;
}
