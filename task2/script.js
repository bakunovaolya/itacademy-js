let a = [5, 7, 
         [4, [2], 8, [1,3], 2],
         [9, [] ],
         1, 8];

let sum = 0;

function treeSum(a) {
  for (let i = 0; i <= a.length - 1; i++) {
    if (!Array.isArray(a[i])) {
      sum = sum + a[i];
    } else {
      treeSum(a[i]);
    }
  }
  return sum;
}
console.log(treeSum(a));
