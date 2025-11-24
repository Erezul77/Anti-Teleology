// src/ui/components/SnapshotPanel.tsx
import React, { useState } from 'react';
import { downloadCanvasPNG } from '../utils/canvasExport';
import { recordHistoryToWebM } from '../utils/webmTimelapse';
import { useHistory } from '../state/history';

export default function SnapshotPanel() {
  const history = useHistory();
  const [fps, setFps] = useState(20);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(Math.max(0, history.count - 1));
  const [busy, setBusy] = useState(false);

  const onSnapshot = async () => {
    try {
      await downloadCanvasPNG('snapshot.png');
    } catch (e:any) {
      alert('Snapshot failed: ' + (e?.message || e));
    }
  };

  const onRecord = async () => {
    setBusy(true);
    try {
      const s = Math.max(0, Math.min(start, history.count - 1));
      const e = Math.max(s, Math.min(end, history.count - 1));
      await recordHistoryToWebM({ start: s, end: e, fps, filename: `timelapse_${s}-${e}_${fps}fps.webm` });
    } catch (e:any) {
      alert('Record failed: ' + (e?.message || e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-3 rounded-xl bg-neutral-900 text-neutral-100 shadow space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs opacity-80">Snapshots & Timelapse</div>
        {busy ? <div className="text-[11px] opacity-70">Recording…</div> : null}
      </div>

      <div className="rounded-lg bg-neutral-800 p-2 space-y-2">
        <div className="text-xs opacity-80">Image</div>
        <button className="px-2 py-1 rounded bg-neutral-700 hover:bg-neutral-600 text-xs" onClick={onSnapshot}>
          Save PNG (current view)
        </button>
      </div>

      <div className="rounded-lg bg-neutral-800 p-2 space-y-2">
        <div className="text-xs opacity-80">Timelapse (WebM)</div>
        <div className="grid grid-cols-6 gap-2 items-center text-xs">
          <label className="opacity-70">Start</label>
          <input type="number" value={start} onChange={(e)=>setStart(parseInt(e.target.value||'0',10))} className="bg-neutral-700 rounded px-2 py-1" />
          <label className="opacity-70">End</label>
          <input type="number" value={end} onChange={(e)=>setEnd(parseInt(e.target.value||'0',10))} className="bg-neutral-700 rounded px-2 py-1" />
          <label className="opacity-70">FPS</label>
          <input type="number" min={1} max={60} value={fps} onChange={(e)=>setFps(parseInt(e.target.value||'20',10))} className="bg-neutral-700 rounded px-2 py-1" />
        </div>
        <button
          className="px-2 py-1 rounded bg-green-700 hover:bg-green-600 text-xs disabled:opacity-50"
          onClick={onRecord}
          disabled={busy || history.count === 0}
        >
          Record WebM
        </button>
        {history.count ? (
          <div className="text-[11px] opacity-70">History frames: 0…{history.count-1}</div>
        ) : (
          <div className="text-[11px] opacity-70">No history frames yet — run the sim to record.</div>
        )}
      </div>
    </div>
  );
}