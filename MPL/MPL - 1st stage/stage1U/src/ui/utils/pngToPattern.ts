// src/ui/utils/pngToPattern.ts
// Browser-side PNG decoding using <img> + <canvas>
// - toGrayChannel: PNG -> Uint8Array (width*height), grayscale 0..255
// - extrudeTo3D: (gray, width, height, zDepth, threshold) -> { size, channel }

export async function fileToImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = document.createElement('img');
    img.decoding = 'async';
    img.src = url;
    await img.decode();
    return img;
  } finally {
    // do not revoke URL immediately; keep till caller draws to canvas
  }
}

export function imageToGrayscale(img: HTMLImageElement): { width:number; height:number; gray: Uint8Array } {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const gray = new Uint8Array(canvas.width * canvas.height);
  for (let i=0, j=0; i<data.length; i+=4, j++) {
    const r = data[i], g = data[i+1], b = data[i+2];
    // luminance
    gray[j] = Math.round(0.2126*r + 0.7152*g + 0.0722*b);
  }
  return { width: canvas.width, height: canvas.height, gray };
}

export function extrudeTo3D(gray: Uint8Array, width:number, height:number, zDepth:number, threshold=1) {
  const size = { x: width, y: height, z: zDepth };
  const channel = new Uint8Array(width*height*zDepth);
  for (let y=0; y<height; y++) {
    for (let x=0; x<width; x++) {
      const h = gray[x + y*width]; // 0..255
      if (h < threshold) continue;
      const filledZ = Math.max(1, Math.round((h / 255) * zDepth));
      for (let z=0; z<filledZ && z<zDepth; z++) {
        const i = x + y*width + z*width*height;
        channel[i] = h; // use height as intensity
      }
    }
  }
  return { size, channel };
}