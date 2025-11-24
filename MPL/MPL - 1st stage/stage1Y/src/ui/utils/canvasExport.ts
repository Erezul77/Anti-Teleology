// src/ui/utils/canvasExport.ts
export function getCanvas(selector: string = '#mpl-canvas canvas'): HTMLCanvasElement | null {
  const el = document.querySelector(selector) as HTMLCanvasElement | null;
  if (el) return el;
  // fallback: first canvas on page
  return document.querySelector('canvas') as HTMLCanvasElement | null;
}

export function canvasToPNGBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'));
}

export async function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export async function downloadCanvasPNG(filename = 'snapshot.png', selector?: string) {
  const canvas = getCanvas(selector);
  if (!canvas) throw new Error('Canvas not found. Add id="mpl-canvas" to your viewer wrapper.');
  const blob = await canvasToPNGBlob(canvas);
  await downloadBlob(blob, filename);
}