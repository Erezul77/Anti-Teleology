// src/ui/utils/webmTimelapse.ts
import { visPlayback } from '../../engine/visPlayback';
import type { Snapshot } from '../../engine/visBridge';
import { getCanvas } from './canvasExport';
import { useHistory } from '../state/history';

type Options = {
  selector?: string;     // CSS selector for the canvas (default '#mpl-canvas canvas')
  fps?: number;          // recording FPS
  start?: number;        // start frame index in history (inclusive)
  end?: number;          // end frame index in history (inclusive)
  filename?: string;     // download file name
};

/**
 * Records a WebM by stepping through history frames and streaming the canvas.
 * Assumes Stage 1P patch is applied (visBridge.setExternalSnapshot is available via visPlayback).
 */
export async function recordHistoryToWebM(opts: Options = {}) {
  const {
    selector = '#mpl-canvas canvas',
    fps = 20,
    start = 0,
    end,
    filename = 'timelapse.webm'
  } = opts;

  const canvas = getCanvas(selector);
  if (!canvas) throw new Error('Canvas not found. Add id="mpl-canvas" to your viewer wrapper.');

  // MediaRecorder on canvas stream
  const stream: MediaStream = (canvas as any).captureStream(fps);
  const mime =
    MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' :
    MediaRecorder.isTypeSupported('video/webm;codecs=vp8') ? 'video/webm;codecs=vp8' :
    'video/webm';
  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 4_000_000 });
  const chunks: Blob[] = [];
  rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };

  // Step through frames while recording
  const history = (useHistory as any)?.(); // if called inside React, you can also pass snapshots directly
  const total = history?.count ?? 0;
  const last = typeof end === 'number' ? end : (total ? total - 1 : 0);
  if (last < start) throw new Error('Invalid start/end range.');

  // helper to wait next animation frame
  const nextFrame = () => new Promise<void>((res) => requestAnimationFrame(() => res()));
  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

  rec.start(100); // timeslice to get chunks periodically

  for (let idx = start; idx <= last; idx++) {
    const snap: Snapshot | null = history?.getDecodedAt ? history.getDecodedAt(idx) : null;
    if (!snap) continue;
    visPlayback.show(snap);     // override current view with this frame
    await nextFrame();          // let r3f/three render
    await sleep(1000 / fps);    // pace frames to match desired FPS
  }

  rec.stop();

  // Give MediaRecorder a moment to flush 'dataavailable'
  await new Promise((res) => setTimeout(res, 200));

  const blob = new Blob(chunks, { type: mime });
  // download
  const a = document.createElement('a');
  const url = URL.createObjectURL(blob);
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}