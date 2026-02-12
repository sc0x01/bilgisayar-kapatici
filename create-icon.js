import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT = path.join(__dirname, 'public', 'logo.png');

async function createIcon() {
    const size = 1024;
    const cx = 512, cy = 512, r = 160;

    const gapAngleDeg = 55;
    const startAngle = (270 + gapAngleDeg / 2) * Math.PI / 180;
    const endAngle = (270 - gapAngleDeg / 2) * Math.PI / 180;

    const sx = cx + r * Math.cos(startAngle);
    const sy = cy + r * Math.sin(startAngle);
    const ex = cx + r * Math.cos(endAngle);
    const ey = cy + r * Math.sin(endAngle);

    // Vertical line centered in gap
    const lineTop = cy - r + 10;
    const lineBottom = cy - 20;
    const lineHeight = lineBottom - lineTop;

    const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur"/>
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
            <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="25"/>
            </filter>
            <radialGradient id="bgGrad" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stop-color="#141414"/>
                <stop offset="100%" stop-color="#0a0a0a"/>
            </radialGradient>
            <linearGradient id="amberGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stop-color="#fbbf24"/>
                <stop offset="50%" stop-color="#f59e0b"/>
                <stop offset="100%" stop-color="#d97706"/>
            </linearGradient>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.65"/>
                <stop offset="60%" stop-color="#d97706" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="#b45309" stop-opacity="0.06"/>
            </linearGradient>
        </defs>
        
        <!-- Solid black background - fills entire square -->
        <rect width="${size}" height="${size}" fill="#0a0a0a"/>
        <rect width="${size}" height="${size}" fill="url(#bgGrad)"/>
        
        <!-- Outer timer arc -->
        <circle cx="${cx}" cy="${cy}" r="300" fill="none" stroke="url(#ringGrad)" stroke-width="3.5" 
                stroke-dasharray="1885" stroke-dashoffset="470" stroke-linecap="round"
                transform="rotate(-90 ${cx} ${cy})"/>
        
        <!-- Subtle inner guide ring -->
        <circle cx="${cx}" cy="${cy}" r="265" fill="none" stroke="#f59e0b" stroke-width="1" stroke-opacity="0.06"/>
        
        <!-- Ambient glow behind power symbol -->
        <circle cx="${cx}" cy="${cy}" r="150" fill="#f59e0b" fill-opacity="0.04" filter="url(#softGlow)"/>
        
        <!-- Power button arc (open circle, gap at top) -->
        <path d="M ${sx} ${sy} A ${r} ${r} 0 1 0 ${ex} ${ey}" 
              fill="none" stroke="url(#amberGrad)" stroke-width="28" 
              stroke-linecap="round" filter="url(#glow)"/>
        
        <!-- Power button vertical line -->
        <rect x="${cx - 14}" y="${lineTop}" width="28" height="${lineHeight}" rx="14" ry="14"
              fill="url(#amberGrad)" filter="url(#glow)"/>
    </svg>`;

    const pngBuffer = await sharp(Buffer.from(svg))
        .resize(size, size)
        .png()
        .toBuffer();

    fs.writeFileSync(OUTPUT, pngBuffer);
    console.log('✅ Icon created successfully');
}

createIcon().catch(e => {
    console.error('Error:', e);
    process.exit(1);
});
