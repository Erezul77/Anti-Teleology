// src/engine/ruleHotReload.ts
import { eventBus } from './events';

export type CompileOk<T> = { ok: true; rules: T };
export type CompileErr = { ok: false; errors: string[] };
export type CompileResult<T> = CompileOk<T> | CompileErr;

type Compiler<T> = (source: string) => CompileResult<T>;
type ApplyHandler<T> = (compiledRules: T) => void;

function fnv1a(str: string): string {
  let h = 0x811c9dc5;
  for (let i=0;i<str.length;i++) {
    h ^= str.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h.toString(36);
}

export class RuleHotReloader<T=any> {
  private compiler: Compiler<T> | null = null;
  private applyHandler: ApplyHandler<T> | null = null;
  private getActiveSource: (() => string) | null = null;

  private stagedSource: string | null = null;
  private stagedCompiled: T | null = null;

  setCompiler(fn: Compiler<T>) { this.compiler = fn; }
  setApplyHandler(fn: ApplyHandler<T>) { this.applyHandler = fn; }
  setActiveSourceProvider(fn: () => string) { this.getActiveSource = fn; }

  getActiveSourceText(): string { return this.getActiveSource?.() ?? ''; }

  tryCompile(source: string): CompileResult<T> {
    if (!this.compiler) return { ok: false, errors: ['No compiler has been registered.'] };
    return this.compiler(source);
  }

  stage(source: string): CompileResult<T> {
    const res = this.tryCompile(source);
    if (res.ok) {
      this.stagedSource = source;
      this.stagedCompiled = res.rules;
    }
    return res;
  }

  hasStaged(): boolean { return !!this.stagedSource && !!this.stagedCompiled; }
  clearStaged() { this.stagedSource = null; this.stagedCompiled = null; }

  apply(): boolean {
    if (!this.applyHandler) {
      eventBus.emit('rulesReloadError', { at: Date.now(), errors: ['No apply handler registered.'] });
      return false;
    }
    if (!this.stagedCompiled || this.stagedSource == null) {
      eventBus.emit('rulesReloadError', { at: Date.now(), errors: ['Nothing is staged. Validate first.'] });
      return false;
    }
    try {
      this.applyHandler(this.stagedCompiled);
      const hash = fnv1a(this.stagedSource);
      eventBus.emit('rulesReloaded', { at: Date.now(), sourceHash: hash, byteSize: this.stagedSource.length });
      this.clearStaged();
      return true;
    } catch (e:any) {
      eventBus.emit('rulesReloadError', { at: Date.now(), errors: [String(e.message || e)] });
      return false;
    }
  }
}

export const ruleHotReload = new RuleHotReloader();