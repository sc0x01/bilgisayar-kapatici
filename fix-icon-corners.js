import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE = path.join(__dirname, 'public', 'logo.png');
const TEMP = path.join(__dirname, 'public', 'logo_fixed.png');

async function fixIconCorners() {
    const sourceBuffer = fs.readFileSync(SOURCE);
    const metadata = await sharp(sourceBuffer).metadata();
    const width = metadata.width;
    const height = metadata.height;

    console.log(`Original image: ${width}x${height}`);

    // Composite original onto a solid black background
    const fixedBuffer = await sharp({
        create: {
            width: width,
            height: height,
            channels: 4,
            background: { r: 10, g: 10, b: 10, alpha: 255 }
        }
    })
        .composite([{
            input: await sharp(sourceBuffer).ensureAlpha().toBuffer(),
            blend: 'over'
        }])
        .removeAlpha()
        .png()
        .toBuffer();

    // Write to temp, then rename
    fs.writeFileSync(TEMP, fixedBuffer);
    fs.unlinkSync(SOURCE);
    fs.renameSync(TEMP, SOURCE);

    console.log('✅ Icon corners fixed - solid black background applied');
}

fixIconCorners().catch(e => {
    console.error('Error:', e);
    process.exit(1);
});
