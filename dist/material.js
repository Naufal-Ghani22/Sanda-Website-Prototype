(function (root) {
  'use strict';
  const fibers = {
    cotton: 'Katun', katun: 'Katun', polyester: 'Poliester', poliester: 'Poliester',
    rayon: 'Rayon', viscose: 'Rayon', viskosa: 'Rayon', linen: 'Linen',
    wool: 'Wol', wol: 'Wol', silk: 'Sutra', sutra: 'Sutra',
    nylon: 'Nilon', nilon: 'Nilon', polyamide: 'Nilon', poliamida: 'Nilon',
    elastane: 'Elastan', elastan: 'Elastan', spandex: 'Elastan', lycra: 'Elastan',
    acrylic: 'Akrilik', akrilik: 'Akrilik'
  };
  const patterns = [/(\d{1,3}(?:[.,]\d+)?)\s*%\s*([a-zA-Z]+)/g, /([a-zA-Z]+)\s*(\d{1,3}(?:[.,]\d+)?)\s*%/g];
  function parseComposition(input) {
    const value = String(input || '').trim();
    if (!value) return { ok: false, reason: 'empty' };
    for (const [index, pattern] of patterns.entries()) {
      pattern.lastIndex = 0;
      const matches = [...value.matchAll(pattern)];
      if (!matches.length) continue;
      const remainder = value.replace(pattern, '').replace(/[\s,;/|+]+/g, '');
      if (remainder) continue;
      const composition = [];
      for (const match of matches) {
        const label = index === 0 ? match[2] : match[1];
        const fiber = fibers[label.toLowerCase()];
        if (!fiber) return { ok: false, reason: 'unknown', word: label };
        const percent = Number((index === 0 ? match[1] : match[2]).replace(',', '.'));
        if (percent <= 0 || percent > 100) return { ok: false, reason: 'percent' };
        const existing = composition.find(part => part.fiber === fiber);
        if (existing) existing.percent += percent;
        else composition.push({ fiber, percent });
      }
      const total = composition.reduce((sum, part) => sum + part.percent, 0);
      if (Math.abs(total - 100) > 0.01) return { ok: false, reason: 'total', total };
      composition.sort((a, b) => b.percent - a.percent);
      return { ok: true, composition, primary: composition[0].fiber };
    }
    return { ok: false, reason: 'format' };
  }
  root.SandaMaterial = { parseComposition };
  if (typeof module !== 'undefined' && module.exports) module.exports = { parseComposition };
})(globalThis);
