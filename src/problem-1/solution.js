// Problem 1: Three Ways to Sum to N
// Provide 3 unique implementations of summing integers from 1 to n

// ============================================
// Method A: Mathematical Formula (Gauss Formula)
// ============================================
// Time Complexity: O(1) - Constant time
// Space Complexity: O(1) - Constant space
// Pros: Most efficient, handles large numbers well
// Cons: May not be intuitive for beginners
var sum_to_n_a = function(n) {
    return (n * (n + 1)) / 2;
};

// ============================================
// Method B: For Loop (Iterative Approach)
// ============================================
// Time Complexity: O(n) - Linear time
// Space Complexity: O(1) - Constant space
// Pros: Easy to understand, straightforward logic
// Cons: Less efficient for large n
var sum_to_n_b = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

// ============================================
// Method C: Functional Programming (Array.reduce)
// ============================================
// Time Complexity: O(n) - Linear time
// Space Complexity: O(n) - Creates array in memory
// Pros: Modern JavaScript, declarative style
// Cons: Uses more memory
var sum_to_n_c = function(n) {
    return Array.from({ length: n }, (_, i) => i + 1)
        .reduce((acc, curr) => acc + curr, 0);
};

// ============================================
// Test Cases
// ============================================
console.log('=== Testing sum_to_n_a (Mathematical Formula) ===');
console.log('sum_to_n_a(5):', sum_to_n_a(5));   // Expected: 15
console.log('sum_to_n_a(10):', sum_to_n_a(10)); // Expected: 55
console.log('sum_to_n_a(0):', sum_to_n_a(0));   // Expected: 0
console.log('sum_to_n_a(1):', sum_to_n_a(1));   // Expected: 1
console.log('sum_to_n_a(100):', sum_to_n_a(100)); // Expected: 5050

console.log('\n=== Testing sum_to_n_b (For Loop) ===');
console.log('sum_to_n_b(5):', sum_to_n_b(5));   // Expected: 15
console.log('sum_to_n_b(10):', sum_to_n_b(10)); // Expected: 55
console.log('sum_to_n_b(0):', sum_to_n_b(0));   // Expected: 0
console.log('sum_to_n_b(1):', sum_to_n_b(1));   // Expected: 1
console.log('sum_to_n_b(100):', sum_to_n_b(100)); // Expected: 5050

console.log('\n=== Testing sum_to_n_c (Array.reduce) ===');
console.log('sum_to_n_c(5):', sum_to_n_c(5));   // Expected: 15
console.log('sum_to_n_c(10):', sum_to_n_c(10)); // Expected: 55
console.log('sum_to_n_c(0):', sum_to_n_c(0));   // Expected: 0
console.log('sum_to_n_c(1):', sum_to_n_c(1));   // Expected: 1
console.log('sum_to_n_c(100):', sum_to_n_c(100)); // Expected: 5050

console.log('\n=== All tests completed! ===');
