// src/engine/ruleDebug.ts
import { eventBus, VoxelPos, RuleDebugEntry, RuleDebugTrace } from './events';

class RuleDebugger {
  private target: VoxelPos | null = null;
  private capturing = false;
  private step = 0;
  private pos: VoxelPos | null = null;
  private entries: RuleDebugEntry[] = [];
  private matchedRules = new Set<string>();
  private evalProvider: ((pos: VoxelPos) => void) | null = null;

  setTarget(pos: VoxelPos | null) { this.target = pos; }
  getTarget() { return this.target; }
  hasTarget() { return !!this.target; }
  clearTarget() { this.target = null; }
  setEvalProvider(fn: (pos: VoxelPos) => void) { this.evalProvider = fn; }
  stepOnce() { if (this.evalProvider && this.target) this.evalProvider(this.target); }

  shouldCapture(pos: VoxelPos) {
    return !!this.target && this.target.x === pos.x && this.target.y === pos.y && this.target.z === pos.z;
  }

  begin(step: number, pos: VoxelPos) {
    if (!this.shouldCapture(pos)) return;
    this.capturing = true;
    this.step = step;
    this.pos = { ...pos };
    this.entries = [];
    this.matchedRules.clear();
  }

  markStart(ruleId: string) {
    if (!this.capturing) return;
    this.entries.push({ kind: 'start', ruleId });
  }

  predicate(ruleId: string, label: string, ok: boolean, details?: any) {
    if (!this.capturing) return;
    this.entries.push({ kind: 'predicate', ruleId, label, ok, details });
    if (ok) this.matchedRules.add(ruleId);
  }

  action(ruleId: string, desc: string, delta?: any) {
    if (!this.capturing) return;
    this.entries.push({ kind: 'action', ruleId, desc, delta });
  }

  markEnd(ruleId: string) {
    if (!this.capturing) return;
    this.entries.push({ kind: 'end', ruleId });
  }

  end() {
    if (!this.capturing || !this.pos) return;
    const trace: RuleDebugTrace = {
      step: this.step,
      pos: this.pos,
      entries: this.entries.slice(),
      summary: { matchedRules: Array.from(this.matchedRules) }
    };
    // flush
    this.capturing = false;
    this.pos = null;
    this.entries = [];
    this.matchedRules.clear();
    eventBus.emit('ruleDebug', { step: trace.step, pos: trace.pos, trace });
  }
}

export const ruleDebug = new RuleDebugger();