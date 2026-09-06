// scratch/build-ico.js
// Generates a valid 16x16 32-bit RGBA .ico file.

const fs = require('fs');
const path = require('path');

const width = 16;
const height = 16;

// Palette colors (RGBA)
const BG = [0x0e, 0x11, 0x17, 0xff]; // #0e1117
const GOLD = [0xe3, 0xb3, 0x41, 0xff]; // #e3b341
const GREEN = [0x2e, 0xa0, 0x43, 0xff]; // #2ea043
const DOC = [0x16, 0x1b, 0x22, 0xff]; // #161b22
const TRANS = [0x00, 0x00, 0x00, 0x00];

// 16x16 pixel grid (row 0 to 15, top to bottom)
// Note: BMP stores rows bottom to top!
const grid = Array.from({ length: 16 }, () => Array(16).fill(BG));

// Draw border rounded rectangle
for (let y = 0; y < 16; y++) {
  for (let x = 0; x < 16; x++) {
    // Round corners
    if ((x === 0 || x === 15) && (y === 0 || y === 15)) {
      grid[y][x] = TRANS;
    }
  }
}

// Draw document outline
// Top 2 to 13, Left 3 to 12
for (let y = 2; y <= 13; y++) {
  for (let x = 3; x <= 12; x++) {
    if (x === 3 || x === 12 || y === 2 || y === 13) {
      grid[y][x] = GOLD;
    } else {
      grid[y][x] = DOC;
    }
  }
}

// Fold in top right
grid[2][11] = GOLD;
grid[2][12] = TRANS;
grid[3][12] = GOLD;

// "JS" letter pixels
// 'J' at x=5,6
grid[6][6] = GOLD;
grid[7][6] = GOLD;
grid[8][6] = GOLD;
grid[9][6] = GOLD;
grid[10][6] = GOLD;
grid[10][5] = GOLD;
grid[9][4] = GOLD;

// 'S' at x=8,9,10
grid[6][9] = GOLD;
grid[6][10] = GOLD;
grid[7][8] = GOLD;
grid[8][9] = GOLD;
grid[9][10] = GOLD;
grid[10][8] = GOLD;
grid[10][9] = GOLD;

// Green accent line at bottom
grid[12][5] = GREEN;
grid[12][6] = GREEN;
grid[12][7] = GREEN;
grid[12][8] = GREEN;
grid[12][9] = GREEN;

// Construct BMP pixel data (bottom-up: row 15 down to 0)
const xorSize = width * height * 4;
const andSize = Math.ceil(width / 32) * 4 * height; // 1-bit mask
const bmpHeaderSize = 40;
const imageSize = bmpHeaderSize + xorSize + andSize;

const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0); // reserved
icoHeader.writeUInt16LE(1, 2); // image type 1 = icon
icoHeader.writeUInt16LE(1, 4); // 1 image

const dirEntry = Buffer.alloc(16);
dirEntry.writeUInt8(width, 0);
dirEntry.writeUInt8(height, 1);
dirEntry.writeUInt8(0, 2); // colors
dirEntry.writeUInt8(0, 3); // reserved
dirEntry.writeUInt16LE(1, 4); // color planes
dirEntry.writeUInt16LE(32, 6); // bpp
dirEntry.writeUInt32LE(imageSize, 8); // size
dirEntry.writeUInt32LE(22, 12); // offset (6 + 16 = 22)

const bmpHeader = Buffer.alloc(40);
bmpHeader.writeUInt32LE(40, 0); // header size
bmpHeader.writeInt32LE(width, 4); // width
bmpHeader.writeInt32LE(height * 2, 8); // height * 2 (for XOR + AND mask)
bmpHeader.writeUInt16LE(1, 12); // planes
bmpHeader.writeUInt16LE(32, 14); // bpp
bmpHeader.writeUInt32LE(0, 16); // compression (BI_RGB)
bmpHeader.writeUInt32LE(xorSize + andSize, 20); // image size
bmpHeader.writeInt32LE(0, 24); // horiz resolution
bmpHeader.writeInt32LE(0, 28); // vert resolution
bmpHeader.writeUInt32LE(0, 32); // colors in palette
bmpHeader.writeUInt32LE(0, 36); // important colors

const pixelBuffer = Buffer.alloc(xorSize);
let pOffset = 0;
// Bottom-up row order
for (let y = 15; y >= 0; y--) {
  for (let x = 0; x < 16; x++) {
    const [r, g, b, a] = grid[y][x];
    // BMP stores in BGRA order
    pixelBuffer.writeUInt8(b, pOffset++);
    pixelBuffer.writeUInt8(g, pOffset++);
    pixelBuffer.writeUInt8(r, pOffset++);
    pixelBuffer.writeUInt8(a, pOffset++);
  }
}

// 1-bit AND mask (all 0 for transparent or opaque)
const andMask = Buffer.alloc(andSize, 0);

const fullIco = Buffer.concat([icoHeader, dirEntry, bmpHeader, pixelBuffer, andMask]);

const outPath1 = path.join(__dirname, '../images/favicon.ico');
const outPath2 = path.join(__dirname, '../favicon.ico');

fs.writeFileSync(outPath1, fullIco);
fs.writeFileSync(outPath2, fullIco);

console.log(`Generated favicon.ico successfully (${fullIco.length} bytes)!`);
