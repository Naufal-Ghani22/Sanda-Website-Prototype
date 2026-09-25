const assert = require('node:assert/strict');
const { suggestPairings, costPerWear } = require('./dist/plus.js');

const items = [
  { id: 'top-1', category: 'Atasan', wears: 1 },
  { id: 'top-2', category: 'Atasan', wears: 3 },
  { id: 'bottom-1', category: 'Bawahan', wears: 2 },
  { id: 'bottom-2', category: 'Bawahan', wears: 4 },
  { id: 'outer-1', category: 'Luaran', wears: 0 }
];

assert.deepEqual(suggestPairings({ category: 'Luaran' }, items).map(pair => pair.map(item => item.id)), [
  ['top-1', 'bottom-1'], ['top-1', 'bottom-2'], ['top-2', 'bottom-1']
]);
assert.deepEqual(suggestPairings({ category: 'Atasan' }, items).map(pair => pair.map(item => item.id)), [
  ['bottom-1'], ['bottom-2'], ['bottom-1', 'outer-1']
]);
assert.deepEqual(suggestPairings({ category: 'Bawahan' }, [], 3), []);
assert.deepEqual(costPerWear(300000), [
  { wears: 10, cost: 30000 }, { wears: 20, cost: 15000 }, { wears: 30, cost: 10000 }
]);
assert.deepEqual(costPerWear(0), []);
console.log('PASS: category pairings, low-wear ordering, empty wardrobe, cost-per-wear scenarios.');
