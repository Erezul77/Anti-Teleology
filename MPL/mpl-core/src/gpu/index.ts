export { GPUStepper, type GPUStepperConfig } from './stepper';
export { default as lifeShader } from './life.wgsl';

// Conway's Game of Life rule presets
export const LIFE_RULES = {
  CONWAY: { birthMask: 0b000001000, surviveMask: 0b000001100 }, // B3/S23
  HIGH_LIFE: { birthMask: 0b000001000, surviveMask: 0b000001110 }, // B36/S23
  DAY_AND_NIGHT: { birthMask: 0b000001111, surviveMask: 0b000001111 }, // B3678/S34678
  SEEDS: { birthMask: 0b000000100, surviveMask: 0b000000000 }, // B2/S
  REPLICATOR: { birthMask: 0b000001111, surviveMask: 0b000001111 }, // B1357/S1357
  WIREWORLD: { birthMask: 0b000000100, surviveMask: 0b000001100 }, // B1/S12
} as const;

// Helper function to create rule masks from B/S notation
export function createRuleMask(birth: number[], survive: number[]): { birthMask: number; surviveMask: number } {
  let birthMask = 0;
  let surviveMask = 0;
  
  for (const count of birth) {
    if (count >= 0 && count <= 8) {
      birthMask |= 1 << count;
    }
  }
  
  for (const count of survive) {
    if (count >= 0 && count <= 8) {
      surviveMask |= 1 << count;
    }
  }
  
  return { birthMask, surviveMask };
}

// Helper function to parse B/S notation strings like "B3/S23"
export function parseRuleString(rule: string): { birthMask: number; surviveMask: number } | null {
  const match = rule.match(/^B(\d*)\/S(\d*)$/i);
  if (!match) return null;
  
  const birth = match[1].split('').map(Number);
  const survive = match[2].split('').map(Number);
  
  return createRuleMask(birth, survive);
}
