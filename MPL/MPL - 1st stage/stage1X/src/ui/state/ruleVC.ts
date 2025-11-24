// src/ui/state/ruleVC.ts
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ruleRepo, RuleCommit, fnv1a } from '../../engine/ruleRepo';
import { eventBus } from '../../engine/events';
import { ruleHotReload } from '../../engine/ruleHotReload';
import { useRuleEditor } from './ruleEditor';

type Ctx = {
  commits: RuleCommit[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  autoCommit: boolean;
  setAutoCommit: (v: boolean) => void;
  commitFromEditor: (message: string) => void;
  checkoutToEditor: (id: string) => void;
  applyToEngine: (id: string) => Promise<boolean>;
  deleteCommit: (id: string) => void;
};

const VC = createContext<Ctx | null>(null);
const AUTO_KEY = 'mpl.ruleVC.autoCommit';

export function RuleVCProvider({ children }: { children: React.ReactNode }) {
  const [commits, setCommits] = useState<RuleCommit[]>(ruleRepo.list());
  const [selectedId, setSelectedId] = useState<string | null>(commits[0]?.id ?? null);
  const [autoCommit, setAutoCommit] = useState<boolean>(() => localStorage.getItem(AUTO_KEY) === '1');
  const { text, setText } = useRuleEditor();

  useEffect(() => {
    const off = eventBus.on('rulesReloaded', ({ sourceHash }) => {
      if (!autoCommit) return;
      const src = ruleHotReload.getActiveSourceText();
      if (!src) return;
      if (fnv1a(src) !== sourceHash) return;
      ruleRepo.commit(`apply ${sourceHash}`, src);
      setCommits(ruleRepo.list());
    });
    return () => off();
  }, [autoCommit]);

  const commitFromEditor = (message: string) => {
    ruleRepo.commit(message, text);
    setCommits(ruleRepo.list());
  };

  const checkoutToEditor = (id: string) => {
    const c = ruleRepo.get(id);
    if (!c) return;
    setText(c.source);
  };

  const applyToEngine = async (id: string) => {
    const c = ruleRepo.get(id);
    if (!c) return false;
    const res = ruleHotReload.stage(c.source);
    if (res.ok) { return ruleHotReload.apply(); }
    return false;
  };

  const deleteCommit = (id: string) => {
    ruleRepo.delete(id);
    setCommits(ruleRepo.list());
    if (selectedId === id) setSelectedId(null);
  };

  useEffect(() => {
    localStorage.setItem(AUTO_KEY, autoCommit ? '1' : '0');
  }, [autoCommit]);

  const value: Ctx = { commits, selectedId, setSelectedId, autoCommit, setAutoCommit, commitFromEditor, checkoutToEditor, applyToEngine, deleteCommit };
  return <VC.Provider value={value}>{children}</VC.Provider>;
}

export function useRuleVC() {
  const ctx = useContext(VC);
  if (!ctx) throw new Error('useRuleVC must be used within RuleVCProvider');
  return ctx;
}