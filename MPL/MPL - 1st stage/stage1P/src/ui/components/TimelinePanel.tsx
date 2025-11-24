// src/ui/components/TimelinePanel.tsx
import React, { useMemo } from 'react';
import { useHistory } from '../state/history';

export default function TimelinePanel() {
  const {
    count, playbackIndex, mode, isPlaying, fps,
    enterPlayback, exitPlayback, stepBy, setFps, play, pause, clear
  } = useHistory();

  const idx = playbackIndex ?? (count ? count - 1 : 0);
  const live = mode === 'live';

  return (
    <div className="p-3 rounded-xl bg-neutral-900 text-neutral-100 shadow space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs opacity-80">Timeline</div>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-xs"
            onClick={live ? () => enterPlayback(count ? count - 1 : 0) : exitPlayback}>
            {live ? 'Enter Playback' : 'Follow Live'}
          </button>
          <button className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-xs" onClick={clear}>
            Clear
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-xs" onClick={() => stepBy(-1)} disabled={count===0}>◀︎</button>
        {isPlaying ? (
          <button className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-xs" onClick={pause} disabled={count===0}>Pause ▮▮</button>
        ) : (
          <button className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-xs" onClick={() => { if (live) enterPlayback(count?0:0); play(); }} disabled={count===0}>Play ▶︎</button>
        )}
        <button className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-xs" onClick={() => stepBy(1)} disabled={count===0}>▶︎</button>

        <div className="ml-auto flex items-center gap-2 text-xs">
          <span className="opacity-70">FPS</span>
          <input type="number" min={1} max={60} value={fps}
            className="w-16 bg-neutral-800 px-2 py-1 rounded"
            onChange={(e) => setFps(parseInt(e.target.value || '12', 10))} />
        </div>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={0}
        max={Math.max(0, count - 1)}
        value={idx}
        onChange={(e) => enterPlayback(parseInt(e.target.value, 10))}
        className="w-full accent-white"
        disabled={count===0}
      />

      <div className="flex justify-between text-xs opacity-80">
        <span>0</span>
        <span>{count ? count - 1 : 0}</span>
      </div>
    </div>
  );
}