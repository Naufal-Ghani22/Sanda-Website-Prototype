(function (root) {
  'use strict';
  function suggestPairings(candidate, items, limit = 3) {
    const byWear = category => items.filter(item => item.category === category).sort((a, b) => a.wears - b.wears);
    const tops = byWear('Atasan');
    const bottoms = byWear('Bawahan');
    const outers = byWear('Luaran');
    let pairs = [];
    if (candidate.category === 'Luaran') {
      pairs = tops.flatMap(top => bottoms.map(bottom => [top, bottom]));
      pairs.sort((a, b) => a[0].wears + a[1].wears - b[0].wears - b[1].wears);
    } else if (candidate.category === 'Atasan') {
      pairs = bottoms.map(bottom => [bottom]);
      pairs.push(...bottoms.flatMap(bottom => outers.map(outer => [bottom, outer])));
    } else if (candidate.category === 'Bawahan') {
      pairs = tops.map(top => [top]);
      pairs.push(...tops.flatMap(top => outers.map(outer => [top, outer])));
    }
    return pairs.slice(0, Math.max(0, limit));
  }
  function costPerWear(price) {
    const amount = Number(price);
    if (!Number.isFinite(amount) || amount <= 0) return [];
    return [10, 20, 30].map(wears => ({ wears, cost: amount / wears }));
  }
  root.SandaPlus = { suggestPairings, costPerWear };
  if (typeof module !== 'undefined' && module.exports) module.exports = { suggestPairings, costPerWear };
})(globalThis);
