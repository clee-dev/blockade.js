const Chain = require('./Chain.js');

let test = new Chain();
test.push({ amount: 4 });
test.push({ amount: 50 });

console.log('VALID BEFORE: ' + test.isValid());
test.blocks[1].data.amount = 3000;
console.log('VALID  AFTER: ' + test.isValid());
