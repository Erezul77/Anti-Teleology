// Stage 1G Test: Arrays, Array Indexing, and For-Of Loops

// Simple array creation and indexing
var coords = [10, 20];
set(coords[0], coords[1]);
set(coords[0] + 5, coords[1] + 5);

// Array of arrays (nested arrays)
var points = [[5, 5], [15, 15], [25, 25]];
for (var i = 0; i < 3; i = i + 1) {
  set(points[i][0], points[i][1]);
}

// For-of loop with simple array
var numbers = [10, 20, 30, 40];
for (var x of numbers) {
  set(x, x);
}

// For-of loop with nested arrays
var grid = [[0, 0], [1, 1], [2, 2]];
for (var point of grid) {
  set(point[0] * 10, point[1] * 10);
}

// Array math operations
var arr = [5, 10, 15];
var sum = arr[0] + arr[1] + arr[2];
set(sum, sum);
set(arr[1], arr[1]);

// Function that creates and returns arrays
function createArray(n) {
  var result = [];
  for (var i = 0; i < n; i = i + 1) {
    result = result + [i];
  }
  return result;
}

// Use the array function
var arr2 = createArray(5);
for (var x of arr2) {
  set(x * 5, x * 5);
}

// Complex nested array pattern
var pattern = [[0, 0], [1, 1], [2, 2], [3, 3]];
for (var row of pattern) {
  var x = row[0];
  var y = row[1];
  set(x * 8, y * 8);
  set(x * 8 + 1, y * 8);
  set(x * 8, y * 8 + 1);
  set(x * 8 + 1, y * 8 + 1);
}
