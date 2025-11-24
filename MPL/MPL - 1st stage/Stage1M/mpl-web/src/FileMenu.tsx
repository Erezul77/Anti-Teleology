import React from "react";
import { importMPLFile, exportMPLFile } from "mpl-core/fileio";

export const FileMenu: React.FC<{ source: string, setSource: (src: string) => void }> = ({ source, setSource }) => {
  const onImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const content = await importMPLFile(file);
    setSource(content);
  };

  const onExport = () => {
    exportMPLFile("program.mpl", source);
  };

  return (
    <div className="file-menu">
      <label>
        Import
        <input type="file" accept=".mpl" onChange={onImport} style={{ display: 'none' }} />
      </label>
      <button onClick={onExport}>Export</button>
    </div>
  );
};
