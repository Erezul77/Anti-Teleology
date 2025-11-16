// Moore/VonNeumann, Clip or Wrap edges.
// Inputs: stateIn[u32], stateOut[u32], uniforms with width/height, birth/survive bitmasks, flags.

export default /* wgsl */ `
struct Uniforms {
  width : u32,
  height : u32,
  birthMask : u32,    // bit i set => birth on i neighbors
  surviveMask : u32,  // bit i set => survive on i neighbors
  useMoore : u32,     // 1 Moore, 0 VonNeumann
  wrapEdges : u32     // 1 wrap, 0 clip
};

@group(0) @binding(0) var<storage, read> stateIn : array<u32>;
@group(0) @binding(1) var<storage, read_write> stateOut : array<u32>;
@group(0) @binding(2) var<uniform> U : Uniforms;

fn idx(x:u32, y:u32) -> u32 { return y * U.width + x; }

fn inBounds(x:i32, y:i32) -> bool {
  return x >= 0 && y >= 0 && x < i32(U.width) && y < i32(U.height);
}

fn wrap(x:i32, m:i32) -> i32 { var r = x % m; return select(r + m, r, r >= 0); }

@compute @workgroup_size(16, 16, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (gid.x >= U.width || gid.y >= U.height) { return; }

  let x = i32(gid.x);
  let y = i32(gid.y);
  let current = stateIn[idx(gid.x, gid.y)];

  var n : u32 = 0u;
  if (U.useMoore == 1u) {
    // 8 neighbors
    for (var dy:i32 = -1; dy <= 1; dy++) {
      for (var dx:i32 = -1; dx <= 1; dx++) {
        if (dx == 0 && dy == 0) { continue; }
        var nx = x + dx; var ny = y + dy;
        if (U.wrapEdges == 1u) {
          nx = wrap(nx, i32(U.width));
          ny = wrap(ny, i32(U.height));
          let alive = stateIn[idx(u32(nx), u32(ny))];
          n += alive & 1u;
        } else {
          if (inBounds(nx, ny)) { let alive = stateIn[idx(u32(nx), u32(ny))]; n += alive & 1u; }
        }
      }
    }
  } else {
    // VonNeumann 4 neighbors
    let offs = array<vec2<i32>,4>(vec2<i32>(1,0), vec2<i32>(-1,0), vec2<i32>(0,1), vec2<i32>(0,-1));
    for (var i:i32=0; i<4; i++) {
      var nx = x + offs[i].x; var ny = y + offs[i].y;
      if (U.wrapEdges == 1u) {
        nx = wrap(nx, i32(U.width));
        ny = wrap(ny, i32(U.height));
        let alive = stateIn[idx(u32(nx), u32(ny))];
        n += alive & 1u;
      } else {
        if (inBounds(nx, ny)) { let alive = stateIn[idx(u32(nx), u32(ny))]; n += alive & 1u; }
      }
    }
  }

  // Apply B/S rule
  let alive = current & 1u;
  let newState = select(
    select(0u, 1u, (U.birthMask >> n) & 1u),    // dead -> alive if birth rule matches
    select(1u, 0u, (U.surviveMask >> n) & 1u),  // alive -> dead if survive rule doesn't match
    alive
  );

  stateOut[idx(gid.x, gid.y)] = newState;
}
`;
