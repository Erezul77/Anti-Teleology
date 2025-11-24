// src/ui/components/ChatDock.tsx
import React, { useState } from 'react';
import { useCollab } from '../state/collab';

export default function ChatDock() {
  const { chat, sendChat, me } = useCollab();
  const [text, setText] = useState('');

  const onSend = () => {
    const t = text.trim();
    if (!t) return;
    sendChat(t);
    setText('');
  };

  return (
    <div className="rounded-xl bg-neutral-900 text-neutral-100 p-2 text-xs space-y-2 h-40 overflow-hidden">
      <div className="opacity-70">Chat</div>
      <div className="bg-neutral-800 rounded p-2 h-24 overflow-auto">
        {chat.map((m, i) => (
          <div key={i} className="mb-1">
            <span className="opacity-70 mr-1">{m.from === me.id ? 'me' : m.from}:</span>
            <span>{m.text}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 bg-neutral-800 rounded px-2 py-1" value={text} onChange={(e)=>setText(e.target.value)} onKeyDown={(e)=>{ if (e.key==='Enter') onSend(); }} />
        <button className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700" onClick={onSend}>Send</button>
      </div>
    </div>
  );
}