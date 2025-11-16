// src/ui/state/ruleEditor.ts
import React, { createContext, useContext, useState } from 'react';
import { ruleHotReload } from '../../engine/ruleHotReload';

type EditorState = {
  text: string;
  status: 'idle' | 'valid' | 'error' | 'applied';
  errors: string[];
};

type Ctx = EditorState & {
  setText: (t: string) => void;
  loadActive: () => void;
  validate: () => void;
  apply: () => void;
  discard: () => void;
};

const Ctx = createContext<Ctx | null>(null);

export function RuleEditorProvider({ children }: { children: React.ReactNode }) {
  const [text, setText] = useState<string>('');
  const [status, setStatus] = useState<EditorState['status']>('idle');
  const [errors, setErrors] = useState<string[]>([]);

  const loadActive = () => {
    const src = ruleHotReload.getActiveSourceText();
    setText(src);
    setStatus('idle');
    setErrors([]);
  };

  const validate = () => {
    const res = ruleHotReload.stage(text);
    if (res.ok) { setStatus('valid'); setErrors([]); }
    else { setStatus('error'); setErrors(res.errors); }
  };

  const apply = () => {
    const ok = ruleHotReload.apply();
    if (ok) { setStatus('applied'); setErrors([]); }
    else { setStatus('error'); }
  };

  const discard = () => {
    ruleHotReload.clearStaged();
    setStatus('idle');
    setErrors([]);
  };

  return (
    <Ctx.Provider value={{ text, status, errors, setText, loadActive, validate, apply, discard }}>
      {children}
    </Ctx.Provider>
  );
}

export function useRuleEditor() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useRuleEditor must be used within RuleEditorProvider');
  return ctx;
}