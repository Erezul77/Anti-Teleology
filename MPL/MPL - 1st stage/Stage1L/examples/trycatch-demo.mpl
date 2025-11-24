// Try/catch example
try {
  grid.set(grid, "bad", 2) // wrong arg type
} catch {
  io.log("Caught error and recovered")
}
