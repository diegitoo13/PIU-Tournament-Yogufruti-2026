(function (root) {
  const factors = Object.freeze({
    F: 0.75, D: 0.75, C: 0.75, B: 0.75, A: 0.75, 'A+': 0.75,
    AA: 1, 'AA+': 1.05, AAA: 1.1, 'AAA+': 1.2,
    S: 1.3, 'S+': 1.35, SS: 1.4, 'SS+': 1.45,
    SSS: 1.5, 'SSS+': 1.55, 'SSS+ PG': 1.6,
  });

  function exclusionReason(attempt, rules = {}) {
    if (attempt.valid !== true || attempt.verified === false) return 'Not approved';
    if (!Number.isInteger(attempt.level) || attempt.level < (rules.minLevel ?? 5)) return 'Below minimum level';
    if (rules.maxLevel != null && attempt.level > rules.maxLevel) return 'Above maximum level';
    if (!Object.hasOwn(factors, attempt.grade)) return 'Unknown grade';
    if (attempt.cut != null && attempt.cut !== 'Arcade') return 'Normal Arcade only';
    if (attempt.mode != null && !['Single', 'Double'].includes(attempt.mode)) return 'Single or Double only';
    if (attempt.deliberateAbandonment === true) return 'Deliberate abandonment';
    if (attempt.selectionSecond != null && (!Number.isFinite(attempt.selectionSecond) || attempt.selectionSecond < 0 || attempt.selectionSecond >= (rules.sessionSeconds ?? 1800))) return 'Outside selection window';
    return null;
  }

  function points(attempt, rules = {}) {
    return exclusionReason(attempt, rules) ? null : Math.round(attempt.level * 100 * factors[attempt.grade]);
  }

  function counted(results, rules = {}) {
    const best = new Map();
    for (const result of results) {
      if (!result.id || !result.player || !result.songId) continue;
      const value = points(result, rules);
      if (value == null) continue;
      const key = JSON.stringify([result.player, result.songId]);
      const previous = best.get(key);
      if (!previous || value > previous.points || (value === previous.points && result.id.localeCompare(previous.result.id) < 0)) {
        best.set(key, { result, points: value });
      }
    }
    return [...best.values()];
  }

  function standings(players, results, rules = {}) {
    const best = counted(results, rules);
    const rows = players.map(player => {
      const plays = best.filter(item => item.result.player === player.id);
      return { player, plays, total: plays.reduce((sum, item) => sum + item.points, 0) };
    }).filter(row => row.plays.length).sort((a, b) => b.total - a.total || a.player.name.localeCompare(b.player.name));
    return rows.map((row, index) => ({
      ...row,
      rank: rows.findIndex(other => other.total === row.total) + 1,
    }));
  }

  const api = { factors, exclusionReason, points, counted, standings };
  if (typeof module !== 'undefined') module.exports = api;
  root.PIUScore = api;
})(typeof window !== 'undefined' ? window : globalThis);
