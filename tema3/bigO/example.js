// O(n) Algorithm
function sumRangeON(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
      sum += i;
    }
    return sum;
  }
  
  // O(1) Algorithm
  function sumRangeO1(n) {
    return (n * (n + 1)) / 2;
  }
  
  // Measure time for O(n) algorithm
  console.time('O(n) Time');
  console.log(`Sum (O(n)): ${sumRangeON(10000000)}`);
  console.timeEnd('O(n) Time');
  
  // Measure time for O(1) algorithm
  console.time('O(1) Time');
  console.log(`Sum (O(1)): ${sumRangeO1(10000000)}`);
  console.timeEnd('O(1) Time');
  console.log('+++++++++++++++++++++++++++++');
// Direct O(1) Algorithm
function sumRangeDirect(m, n) {
    return ((n - m + 1) * (m + n)) / 2;
  }
  
  
  // Measure time for Direct O(1) algorithm
  console.time('Direct O(1) Time');
  console.log(`Sum from m to n (Direct O(1)): ${sumRangeDirect(5, 10000000)}`);
  console.timeEnd('Direct O(1) Time');
