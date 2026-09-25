const assert = require('node:assert/strict');
const { parseComposition } = require('./dist/material.js');

assert.deepEqual(parseComposition('80% cotton, 20% polyester'), {
  ok: true,
  composition: [{ fiber: 'Katun', percent: 80 }, { fiber: 'Poliester', percent: 20 }],
  primary: 'Katun'
});
assert.deepEqual(parseComposition('60% Rayon / 40% Linen'), {
  ok: true,
  composition: [{ fiber: 'Rayon', percent: 60 }, { fiber: 'Linen', percent: 40 }],
  primary: 'Rayon'
});
assert.deepEqual(parseComposition('Cotton 80%, Polyester 20%').composition, [
  { fiber: 'Katun', percent: 80 }, { fiber: 'Poliester', percent: 20 }
]);
assert.equal(parseComposition('70% Katun, 40% Poliester').reason, 'total');
assert.equal(parseComposition('100% Denim').reason, 'unknown');
assert.equal(parseComposition('').reason, 'empty');
console.log('PASS: composition parsing, blend, invalid total, weave is not fiber, empty label.');
