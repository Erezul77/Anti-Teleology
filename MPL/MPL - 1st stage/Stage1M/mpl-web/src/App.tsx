import React, { useState } from "react";
import { FileMenu } from "./FileMenu";
import { useMPL } from "./state/useMPL";

export default function App() {
  const { source, setSource, run } = useMPL();

  return (
    <div className="app">
      <FileMenu source={source} setSource={setSource} />
      <textarea value={source} onChange={(e) => setSource(e.target.value)} />
      <button onClick={run}>Run</button>
    </div>
  );
}
