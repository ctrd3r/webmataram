// Simple script to create favicon.ico from SVG
// This would typically be run with Node.js and appropriate libraries

const fs = require('fs');
const { createCanvas } = require('canvas');

function createFavicon() {
    const canvas = createCanvas(32, 32);
    const ctx = canvas.getContext('2d');
    
    // Draw BMKG logo simplified for 32x32
    const center = 16;
    const radius = 14;
    
    // Background circle
    const gradient = ctx.createLinearGradient(0, 0, 32, 32);
    gradient.addColorStop(0, '#1e3a8a');
    gradient.addColorStop(1, '#0ea5e9');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.fill();
    
    // White elements
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 1;
    
    // Globe
    ctx.beginPath();
    ctx.arc(center, center, 10, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Compass point
    ctx.beginPath();
    ctx.moveTo(center, center - 6);
    ctx.lineTo(center - 2, center - 10);
    ctx.lineTo(center, center - 8);
    ctx.lineTo(center + 2, center - 10);
    ctx.closePath();
    ctx.fill();
    
    // Center dot
    ctx.beginPath();
    ctx.arc(center, center, 1, 0, 2 * Math.PI);
    ctx.fill();
    
    // Save as PNG (would need conversion to ICO format)
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('favicon-32.png', buffer);
    
    console.log('Favicon created as favicon-32.png');
    console.log('Convert to .ico format using online tools or imagemagick');
}

// Note: This requires canvas package: npm install canvas
// For production, use proper favicon generation tools
console.log('Favicon generation script created');
console.log('Run with Node.js after installing canvas package');