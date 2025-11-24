// Stage 1F Test: Functions with Parameters and Return Values

// Simple function with no parameters
function hello() {
  set(25, 25);
  return 42;
}

// Function with parameters
function place(x, y) {
  set(x, y);
  return x + y;
}

// Math function
function square(n) {
  return n * n;
}

// Function that uses return value
function calculate(a, b) {
  var sum = a + b;
  var product = a * b;
  return sum + product;
}

// Test the functions
var result1 = hello();
set(result1 % 20, result1 % 20);

var result2 = place(10, 15);
set(result2, result2);

var result3 = square(5);
set(result3, result3);

var result4 = calculate(3, 4);
set(result4, result4);

// Function chain
var final = square(place(2, 3));
set(final, final);
