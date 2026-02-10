import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE = path.join(__dirname, 'public', 'logo.png');
const ICONS_DIR = path.join(__dirname, 'src-tauri', 'icons');

async function generateIcons() {
    // First, let's check if we can read the source file
    const sourceBuffer = fs.readFileSync(SOURCE);
    console.log(`Source file size: ${sourceBuffer.length} bytes`);

    // Generate all required PNG sizes
    const sizes = [
        { name: '32x32.png', size: 32 },
        { name: '128x128.png', size: 128 },
        { name: '128x128@2x.png', size: 256 },
        { name: 'icon.png', size: 1024 },
        { name: 'Square30x30Logo.png', size: 30 },
        { name: 'Square44x44Logo.png', size: 44 },
        { name: 'Square71x71Logo.png', size: 71 },
        { name: 'Square89x89Logo.png', size: 89 },
        { name: 'Square107x107Logo.png', size: 107 },
        { name: 'Square142x142Logo.png', size: 142 },
        { name: 'Square150x150Logo.png', size: 150 },
        { name: 'Square284x284Logo.png', size: 284 },
        { name: 'Square310x310Logo.png', size: 310 },
        { name: 'StoreLogo.png', size: 50 },
    ];

    for (const { name, size } of sizes) {
        const outPath = path.join(ICONS_DIR, name);
        await sharp(sourceBuffer)
            .resize(size, size)
            .png()
            .toFile(outPath);
        console.log(`✅ ${name} (${size}x${size})`);
    }

    // Generate ICO with multiple sizes embedded
    const icoSizes = [16, 24, 32, 48, 64, 128, 256];
    const pngBuffers = [];
    for (const size of icoSizes) {
        const buf = await sharp(sourceBuffer)
            .resize(size, size)
            .png()
            .toBuffer();
        pngBuffers.push(buf);
    }

    const icoBuffer = await pngToIco(pngBuffers);
    fs.writeFileSync(path.join(ICONS_DIR, 'icon.ico'), icoBuffer);
    console.log('✅ icon.ico');

    console.log('\\n🎉 All icons generated successfully!');
}

generateIcons().catch(e => {
    console.error('Error:', e);
    process.exit(1);
});
