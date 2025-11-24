// Export and Share Pack functionality
// Stage 4: Export & Share

import type { ExecutionSnapshot } from '../types';

export interface SharePack {
  id: string;
  snapshots: ExecutionSnapshot[];
  metadata: any;
  settings: any;
  timestamp: number;
}

export interface ExportOptions {
  width?: number;
  height?: number;
  background?: string;
  format?: 'png' | 'svg' | 'pdf';
  quality?: number;
}

export interface SharePackOptions {
  includeSnapshots?: boolean;
  includeMetadata?: boolean;
  includeSettings?: boolean;
  compression?: boolean;
}

export class ExportManager {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  constructor() {
    this.initializeCanvas();
  }

  private initializeCanvas(): void {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  async exportToPNG(snapshot: ExecutionSnapshot, options: ExportOptions = {}): Promise<Blob> {
    const { width = 800, height = 600, background = '#ffffff' } = options;
    
    if (!this.canvas || !this.ctx) {
      throw new Error('Canvas not initialized');
    }

    this.canvas.width = width;
    this.canvas.height = height;

    // Clear canvas
    this.ctx.fillStyle = background;
    this.ctx.fillRect(0, 0, width, height);

    // Draw grid
    this.drawGrid(snapshot, width, height);

    return new Promise((resolve) => {
      this.canvas!.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png');
    });
  }

  async exportToSVG(snapshot: ExecutionSnapshot, options: ExportOptions = {}): Promise<string> {
    const { width = 800, height = 600, background = '#ffffff' } = options;
    
    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<rect width="100%" height="100%" fill="${background}"/>`;
    
    // Add grid cells as SVG elements
    const { width: gridWidth, height: gridHeight, data } = snapshot.grid;
    const cellWidth = width / gridWidth;
    const cellHeight = height / gridHeight;
    
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        if (data[y * gridWidth + x] === 1) {
          const canvasX = x * cellWidth;
          const canvasY = y * cellHeight;
          svg += `<rect x="${canvasX}" y="${canvasY}" width="${cellWidth}" height="${cellHeight}" fill="#000000"/>`;
        }
      }
    }
    
    svg += '</svg>';
    return svg;
  }

  async exportToPDF(snapshot: ExecutionSnapshot, options: ExportOptions = {}): Promise<Blob> {
    // For now, export as PNG and convert to PDF
    // In a real implementation, you'd use a PDF library
    const pngBlob = await this.exportToPNG(snapshot, options);
    
    // Create a simple PDF structure (simplified)
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(MPL Export) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
298
%%EOF`;

    return new Blob([pdfContent], { type: 'application/pdf' });
  }

  private drawGrid(snapshot: ExecutionSnapshot, width: number, height: number): void {
    if (!this.ctx) return;

    const { width: gridWidth, height: gridHeight, data } = snapshot.grid;
    const cellWidth = width / gridWidth;
    const cellHeight = height / gridHeight;

    this.ctx.fillStyle = '#000000';
    
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        if (data[y * gridWidth + x] === 1) {
          const canvasX = x * cellWidth;
          const canvasY = y * cellHeight;
          this.ctx.fillRect(canvasX, canvasY, cellWidth, cellHeight);
        }
      }
    }
  }

  // Share Pack functionality
  createSharePack(snapshots: ExecutionSnapshot[], options: SharePackOptions = {}): SharePack {
    const { includeSnapshots = true, includeMetadata = true, includeSettings = true } = options;
    
    const sharePack: SharePack = {
      id: this.generateId(),
      snapshots: includeSnapshots ? snapshots : [],
      metadata: includeMetadata ? this.extractMetadata(snapshots) : {},
      settings: includeSettings ? this.extractSettings() : {},
      timestamp: Date.now()
    };

    return sharePack;
  }

  async exportSharePack(sharePack: SharePack): Promise<Blob> {
    const jsonString = JSON.stringify(sharePack, null, 2);
    return new Blob([jsonString], { type: 'application/json' });
  }

  async importSharePack(blob: Blob): Promise<SharePack> {
    const text = await blob.text();
    return JSON.parse(text) as SharePack;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private extractMetadata(snapshots: ExecutionSnapshot[]): any {
    if (snapshots.length === 0) return {};
    
    const firstSnapshot = snapshots[0];
    const lastSnapshot = snapshots[snapshots.length - 1];
    
    return {
      stepCount: snapshots.length,
      duration: lastSnapshot.timestamp - firstSnapshot.timestamp,
      gridSize: {
        width: firstSnapshot.grid.width,
        height: firstSnapshot.grid.height
      },
      averageFPS: snapshots.reduce((sum, s) => sum + s.performance.fps, 0) / snapshots.length,
      averageMemoryUsage: snapshots.reduce((sum, s) => sum + s.performance.memoryUsage, 0) / snapshots.length
    };
  }

  private extractSettings(): any {
    // Extract current MPL settings
    return {
      version: '1.0.0',
      timestamp: Date.now(),
      // Add more settings as needed
    };
  }

  // Utility methods
  downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  copyToClipboard(text: string): Promise<void> {
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return Promise.resolve();
    }
  }
}