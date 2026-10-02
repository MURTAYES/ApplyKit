const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Create pure uncompressed/deflated PNG encoder
function createPNG(width, height, pixelFn) {
  // RGBA buffer: (width * 4 + 1) * height (1 filter byte per scanline)
  const scanlineLength = width * 4 + 1;
  const rawData = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelFn(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // Standard precomputed CRC32 table
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c >>> 0;
  }

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const chunkData = Buffer.concat([typeBuf, data]);
    crcBuf.writeUInt32BE(crc32(chunkData), 0);
    return Buffer.concat([len, chunkData, crcBuf]);
  }

  // PNG Signature: 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: 6 (RGBA)
  ihdr[10] = 0; // Compression: 0
  ihdr[11] = 0; // Filter: 0
  ihdr[12] = 0; // Interlace: 0
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // IDAT chunk
  const idatChunk = makeChunk('IDAT', deflated);

  // IEND chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Pixel function drawing the Swiss Brutalist Donna icon
function getPixel(x, y, size) {
  // Normalize coordinates to 0..128 coordinate space
  const scale = size / 128;
  const nx = x / scale;
  const ny = y / scale;

  // Background: Obsidian Black #0A0A0A
  let r = 10;
  let g = 10;
  let b = 10;
  let a = 255;

  // Layout parameters:
  // Margin = 24, Col Width = 34, Gap = 12, Row Gap = 12
  // Left col: [24 .. 58], Right col: [70 .. 104]
  // Top row: [24 .. 58], Bottom row: [70 .. 104]

  const inLeftCol = nx >= 24 && nx < 58;
  const inRightCol = nx >= 70 && nx < 104;
  const inTopRow = ny >= 24 && ny < 58;
  const inBottomRow = ny >= 70 && ny < 104;
  const inFullRow = ny >= 24 && ny < 104;

  // Top-Left Red Square: #BC0009 (188, 0, 9)
  if (inLeftCol && inTopRow) {
    return [188, 0, 9, 255];
  }

  // Bottom-Left White Square: #FFFFFF (255, 255, 255)
  if (inLeftCol && inBottomRow) {
    return [255, 255, 255, 255];
  }

  // Right Column White Vertical Bar: #FFFFFF (255, 255, 255)
  if (inRightCol && inFullRow) {
    return [255, 255, 255, 255];
  }

  return [r, g, b, a];
}

const outDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Generate sizes: 16, 32, 48, 128
const sizes = [16, 32, 48, 128];
sizes.forEach((size) => {
  const pngBuf = createPNG(size, size, (x, y) => getPixel(x, y, size));
  fs.writeFileSync(path.join(outDir, `icon-${size}.png`), pngBuf);
  console.log(`Generated icon-${size}.png`);
});

// Also create SVG version
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <rect width="128" height="128" fill="#0A0A0A"/>
  <!-- Top Left: Crimson Accent -->
  <rect x="24" y="24" width="34" height="34" fill="#BC0009"/>
  <!-- Bottom Left: White Square -->
  <rect x="24" y="70" width="34" height="34" fill="#FFFFFF"/>
  <!-- Right: White Vertical Pillar -->
  <rect x="70" y="24" width="34" height="80" fill="#FFFFFF"/>
</svg>`;

fs.writeFileSync(path.join(outDir, 'icon.svg'), svgContent);
console.log('Generated icon.svg');
