/* Shared, deterministic recap statistics. Tournament rules live in scoring.js. */
(function (root) {
  const scoring = typeof module !== 'undefined' ? require('./scoring.js') : root.PIUScore;
  const judgments = ['perfect', 'great', 'good', 'bad', 'miss'];
  function analyze(data, catalog, playerId = '') {
    const standings = scoring.standings(data.players, data.results, data.event);
    const player = playerId ? data.players.find(p => p.id === playerId) : null;
    if (playerId && !player) throw new Error('Unknown player');
    const counted = scoring.counted(data.results, data.event);
    const plays = counted.filter(p => !player || p.result.player === player.id);
    const songs = new Map(catalog.songs.map(s => [s.id, s]));
    const players = new Map(data.players.map(p => [p.id, p]));
    const describe = p => ({...p, song: songs.get(p.result.songId), player: players.get(p.result.player)});
    const grades = Object.keys(scoring.factors).reverse().map(grade => ({grade, count: plays.filter(p => p.result.grade === grade).length})).filter(x => x.count);
    const bestPoints = plays.length ? Math.max(...plays.map(p => p.points)) : null;
    const complete = plays.filter(p => judgments.every(k => Number.isFinite(p.result[k]) && p.result[k] >= 0));
    const judgmentTotals = Object.fromEntries(judgments.map(k => [k, complete.reduce((sum, p) => sum + p.result[k], 0)]));
    const judgmentCount = Object.values(judgmentTotals).reduce((a,b) => a+b, 0);
    const songCounts = new Map();
    for (const p of plays) {
      if (p.result.songIdentityVerified === false || !songs.has(p.result.songId)) continue;
      const entry = songCounts.get(p.result.songId) || {song: songs.get(p.result.songId), count: 0};
      entry.count++; songCounts.set(p.result.songId, entry);
    }
    const popular = [...songCounts.values()].sort((a,b) => b.count-a.count || a.song.title.localeCompare(b.song.title));
    const combos = plays.filter(p => Number.isFinite(p.result.combo));
    const maxCombo = combos.length ? Math.max(...combos.map(p => p.result.combo)) : null;
    return {
      player, standings, standing: player ? standings.find(s => s.player.id === player.id) : null,
      plays: plays.map(describe), count: plays.length, submitted: data.results.filter(r => !player || r.player === player.id).length,
      total: plays.reduce((sum,p) => sum+p.points,0), grades,
      best: plays.filter(p => p.points === bestPoints).map(describe),
      maxCombo, comboBest: combos.filter(p => p.result.combo === maxCombo).map(describe),
      popular, singles: plays.filter(p => p.result.mode === 'Single').length,
      doubles: plays.filter(p => p.result.mode === 'Double').length,
      highLevel: plays.length ? Math.max(...plays.map(p => p.result.level)) : null,
      lowLevel: plays.length ? Math.min(...plays.map(p => p.result.level)) : null,
      sOrBetter: plays.filter(p => scoring.factors[p.result.grade] >= 1.3).length,
      completeJudgments: complete.length, judgmentTotals, judgmentCount,
      perfectPercent: judgmentCount ? 100*judgmentTotals.perfect/judgmentCount : null,
      missingScores: plays.filter(p => !Number.isFinite(p.result.score)).length,
      unknownSongs: plays.filter(p => p.result.songIdentityVerified === false || !songs.has(p.result.songId)).length,
    };
  }
  const api = {analyze};
  if (typeof module !== 'undefined') module.exports = api;
  root.PIURewind = api;
})(typeof window !== 'undefined' ? window : globalThis);
