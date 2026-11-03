(() => {
  'use strict';
  const data = window.TOURNAMENT_DATA;
  const catalog = window.PHOENIX_CATALOG;
  const calc = window.PIUScore;
  const $ = id => document.getElementById(id);
  const number = value => value == null ? 'N/A' : new Intl.NumberFormat('en-US').format(value);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const playerFor = id => data.players.find(player => player.id === id);
  const songFor = attempt => catalog.songs.find(song => song.sourceSongId === attempt.sourceSongId);
  const chartName = record => `${record.mode === 'Single' ? 'S' : 'D'}${record.level}`;
  const titleFor = attempt => songFor(attempt)?.title ?? attempt.song;
  const bpm = song => song.bpmMin === song.bpmMax ? number(song.bpmMin) : `${number(song.bpmMin)}–${number(song.bpmMax)}`;
  const counted = calc.counted(data.results, data.event);
  const countedIds = new Set(counted.map(item => item.result.id));
  const standings = calc.standings(data.players, data.results, data.event);
  const params = new URLSearchParams(location.search);
  let returnFocus = null;

  function avatar(player, large = false) {
    const photo = player.photo ? `<img src="${escape(player.photo)}" alt="${escape(player.name)} profile photo" style="object-position:${escape(player.photoPosition || '50% 50%')}" loading="lazy">` : escape(player.name.slice(0, 2));
    return `<span class="avatar${large ? ' profile-avatar' : ''}">${photo}</span>`;
  }

  function image(song, large = false) {
    return `<span class="cover-wrap${large ? ' large-cover' : ''}"><img src="${escape(large ? song.cover : song.thumbnail)}" alt="${escape(song.title)} song artwork" loading="lazy" decoding="async"></span>`;
  }

  function fields(items, className = 'detail-grid') {
    return `<dl class="${className}">${items.map(([label, value]) => `<div><dt>${escape(label)}</dt><dd>${escape(value ?? 'N/A')}</dd></div>`).join('')}</dl>`;
  }

  function recordedResult(attempt) {
    return `<button class="profile-result recorded-result" data-attempt="${escape(attempt.id)}"><span><strong>${escape(playerFor(attempt.player)?.name)}</strong><small>${chartName(attempt)} · ${escape(attempt.grade)} · Score ${number(attempt.score)}</small><span class="judgment-counts">${['perfect','great','good','bad','miss'].map(field => `<span>${field[0].toUpperCase() + field.slice(1)} <b>${number(attempt[field])}</b></span>`).join('')}</span></span><b>${number(calc.points(attempt, data.event))} <small>pts ↗</small></b></button>`;
  }

  function sourceReference(attempt) {
    const source = attempt.sourceReference;
    if (!source) return '';
    const location = source.sheet ? `${source.sheet}!${source.range} · Judgments ${source.judgmentRange}` : `CSV row ${source.row}`;
    return `<div class="result-source"><strong>Result data source</strong><span>${escape(source.file)}</span><span>${escape(location)}</span><a href="data/validation.json" target="_blank" rel="noopener">Source validation report ↗</a></div>`;
  }

  function showDialog(content) {
    const wasOpen = $('detail-dialog').open;
    if (!wasOpen) returnFocus = document.activeElement;
    $('detail-content').innerHTML = `<button class="close" aria-label="Close details">×</button>${content}`;
    $('detail-content').querySelector('.close').addEventListener('click', () => $('detail-dialog').close());
    if (!wasOpen) $('detail-dialog').showModal();
    $('detail-content').querySelector('.close').focus();
  }

  function songMetadata(song, attempt) {
    const chart = attempt && song.charts.find(item => item.mode === attempt.mode && item.level === attempt.level);
    return fields([
      ['Artist', song.artist], ['BPM', bpm(song)], ['Cut', song.cut],
      ['Category', song.category], ['Main-series debut', song.mainSeriesDebut],
      [chart ? 'Chart author' : 'Catalog', chart?.stepmaker ?? song.catalogVersion],
      ['Korean title', song.koreanTitle], ['Game song ID', song.gameIdentifier],
    ], 'metadata-grid');
  }

  function showAttempt(id) {
    const attempt = data.results.find(record => record.id === id);
    if (!attempt) return;
    const song = songFor(attempt);
    const points = calc.points(attempt, data.event);
    showDialog(`
      <div class="detail-top"><span class="section-number">RESULT / ${escape(attempt.id.toUpperCase())}</span><h2 id="detail-title">${escape(titleFor(attempt))}</h2><p>${escape(playerFor(attempt.player)?.name)}</p></div>
      ${song ? image(song, true) : '<div class="unidentified-cover">Artwork N/A · title not recovered</div>'}
      <div class="detail-summary"><span class="chart ${attempt.mode === 'Double' ? 'double-chart' : ''}">${chartName(attempt)}</span><span class="grade">${escape(attempt.grade)}</span><strong>${number(points)} pts</strong><span class="counted-label">${countedIds.has(attempt.id) ? 'COUNTED' : 'NOT COUNTED'}</span></div>
      <div class="formula"><span class="formula-base">Base points: Lv. ${attempt.level} × 100 = ${number(attempt.level * 100)}</span><p><b>${number(attempt.level * 100)}</b> × <b>${calc.factors[attempt.grade].toFixed(2)} (${escape(attempt.grade)})</b> = <b>${number(points)} tournament points</b></p><small>The recorded grade determines the multiplier.</small></div>
      ${song ? songMetadata(song, attempt) : ''}
      ${fields([
        ['Perfect', number(attempt.perfect)], ['Great', number(attempt.great)], ['Good', number(attempt.good)],
        ['Bad', number(attempt.bad)], ['Miss', number(attempt.miss)], ['Max combo', number(attempt.combo)],
        ['Calories', number(attempt.kcal)], ['Machine score', number(attempt.score)], ['Pass / break', attempt.passStatus],
        ['Performance', attempt.performance], ['Selected at (seconds)', number(attempt.selectionSecond)],
      ])}

      <div class="detail-note">${escape(attempt.reviewNote || 'Results are final. N/A marks an unverified or unavailable value.')}</div>
      ${sourceReference(attempt)}
      ${song ? `<div class="source-links"><a href="${escape(song.source)}" target="_blank" rel="noopener noreferrer">Phoenix 2 catalog source ↗</a><a href="${escape(song.artworkSource)}" target="_blank" rel="noopener noreferrer">Artwork source ↗</a></div>` : ''}
    `);
  }

  function showSong(id) {
    const song = catalog.songs.find(record => record.id === id);
    if (!song) return;
    const plays = data.results.filter(record => record.songId === id);
    const bestScore = plays.filter(record => record.score != null).reduce((best, record) => Math.max(best, record.score), 0);
    const bestPoints = plays.reduce((best, record) => Math.max(best, calc.points(record, data.event) ?? 0), 0);
    showDialog(`
      <div class="detail-top"><span class="section-number">SONG / PHOENIX 2</span><h2 id="detail-title">${escape(song.title)}</h2><p>${escape(song.artist)}</p></div>
      ${image(song, true)}${songMetadata(song)}
      <div class="chart-list">${['Single', 'Double'].map(mode => `<div><h3>AVAILABLE ${mode.toUpperCase()} CHARTS</h3><div class="chart-chips">${song.charts.filter(chart => chart.mode === mode).map(chart => `<span class="chart ${mode === 'Double' ? 'double-chart' : ''}" title="Chart author: ${escape(chart.stepmaker ?? 'Unverified')}">${chartName(chart)}</span>`).join('')}</div></div>`).join('')}</div>
      ${fields([['Recorded plays', plays.length], ['Best machine score', bestScore ? number(bestScore) : 'N/A'], ['Best tournament points', number(bestPoints)]])}
      <section class="song-results"><h3>RECORDED RESULTS</h3><p>Perfect, Great, Good, Bad and Miss belong to each player's attempt. Select a result for combo, calories and its source row.</p>${plays.map(recordedResult).join('') || '<p>No recorded results.</p>'}</section>
      <div class="detail-note">Available chart levels: ${escape(song.catalogVersion)} · Recorded player results are listed above. Community catalog. Chart authors appear when available. Song duration and note counts are not verified.</div>
      <div class="source-links"><a href="${escape(song.source)}" target="_blank" rel="noopener noreferrer">Metadata source ↗</a><a href="${escape(song.artworkSource)}" target="_blank" rel="noopener noreferrer">Artwork source ↗</a></div>
    `);
  }

  function showPlayer(id) {
    const player = playerFor(id);
    if (!player) return;
    const standing = standings.find(row => row.player.id === id);
    const plays = data.results.filter(attempt => attempt.player === id);
    const grades = plays.reduce((all, attempt) => ({ ...all, [attempt.grade]: (all[attempt.grade] ?? 0) + 1 }), {});
    showDialog(`
      <div class="detail-top player-detail-heading">${avatar(player, true)}<div><span class="section-number">PLAYER PROFILE</span><h2 id="detail-title">${escape(player.name)}</h2><p>${escape(player.publicName === player.name ? '' : player.publicName ?? '')}</p></div></div>
      ${fields([['Tournament points', number(standing?.total)], ['Counted songs', standing?.plays.length ?? 0], ['Location', [player.location, player.country].filter(Boolean).join(', ') || 'N/A']])}
      <div class="profile-grades">${Object.entries(grades).map(([grade, count]) => `<span><b>${escape(grade)}</b> ${count}</span>`).join('')}</div>
      <div class="profile-results">${plays.map(attempt => `<button class="profile-result" data-attempt="${escape(attempt.id)}"><span>${escape(titleFor(attempt))}<small>${chartName(attempt)} · ${escape(attempt.grade)}</small></span><b>${number(calc.points(attempt, data.event))} <small>pts ↗</small></b></button>`).join('')}</div>
    `);
  }

  $('player-count').textContent = number(data.players.length);
  $('score-count').textContent = number(counted.length);
  $('max-level').textContent = counted.length ? chartName(counted.reduce((a, b) => a.result.level > b.result.level ? a : b).result) : 'N/A';
  $('top-total').textContent = number(standings[0]?.total);
  $('coverage').textContent = `${data.results.length}/${data.results.length} songs completed · ${data.results.filter(attempt => ['perfect','great','good','bad','miss'].every(field => attempt[field] != null)).length}/${data.results.length} complete judgment sets · ${data.results.filter(attempt => attempt.score == null).length} unreadable machine score · ${data.results.filter(attempt => !attempt.songIdentityVerified).length} song titles N/A`;
  data.players.forEach(player => $('player-filter').add(new Option(player.name, player.id)));
  $('standings-body').innerHTML = standings.map(row => `
    <tr><td class="rank">${String(row.rank).padStart(2, '0')}</td>
    <td><button class="player-cell" data-player="${escape(row.player.id)}">${avatar(row.player)}<span>${escape(row.player.name)}</span></button></td>
    <td>${row.plays.length}</td><td>${chartName(row.plays.reduce((a, b) => a.result.level > b.result.level ? a : b).result)}</td>
    <td class="numeric points">${number(row.total)}</td></tr>`).join('');

  [...new Set(data.results.map(attempt => attempt.level))].sort((a, b) => b - a).forEach(level => $('level').add(new Option(`Level ${level}`, level)));
  ['search', 'player-filter', 'level', 'mode', 'sort'].forEach(id => {
    const value = params.get(id);
    if (value != null && (id === 'search' || [...$(id).options].some(option => option.value === value))) $(id).value = value;
  });

  function renderResults(updateURL = false) {
    const query = normalize($('search').value.trim());
    const rows = data.results.filter(attempt => {
      const song = songFor(attempt);
      return (!$('player-filter').value || attempt.player === $('player-filter').value)
        && (!$('level').value || String(attempt.level) === $('level').value)
        && (!$('mode').value || attempt.mode === $('mode').value)
        && normalize(`${titleFor(attempt)} ${attempt.song} ${song?.artist ?? ''} ${playerFor(attempt.player)?.name ?? ''}`).includes(query);
    });
    rows.sort((a, b) => $('sort').value === 'song' ? titleFor(a).localeCompare(titleFor(b))
      : $('sort').value === 'level' ? b.level - a.level
      : $('sort').value === 'score' ? (b.score ?? -1) - (a.score ?? -1)
      : (calc.points(b, data.event) ?? -1) - (calc.points(a, data.event) ?? -1));
    $('result-count').textContent = `${rows.length} RESULT${rows.length === 1 ? '' : 'S'}`;
    $('empty').hidden = rows.length > 0;
    $('results').innerHTML = rows.map(attempt => {
      const song = songFor(attempt);
      return `<tr data-attempt="${escape(attempt.id)}">
        <td class="song-cell"><div class="song-entry">${song ? image(song) : '<span class="cover-wrap cover-na">N/A</span>'}<span><button class="song-name" data-attempt="${escape(attempt.id)}">${escape(titleFor(attempt))}</button><span class="song-player">${escape(playerFor(attempt.player)?.name)} <span>·</span> ${escape(song?.artist ?? '')}</span></span></div></td>
        <td data-label="Chart"><span class="chart ${attempt.mode === 'Double' ? 'double-chart' : ''}">${chartName(attempt)}</span></td><td data-label="Grade" class="grade">${escape(attempt.grade)}</td>
        <td data-label="Machine score">${number(attempt.score)}</td><td data-label="Points" class="numeric points">${number(calc.points(attempt, data.event))}</td>
        <td class="row-action"><button class="detail-button" data-attempt="${escape(attempt.id)}" aria-label="View ${escape(titleFor(attempt))} details">↗</button></td></tr>`;
    }).join('');
    if (updateURL) {
      const url = new URL(location.href);
      ['search', 'player-filter', 'level', 'mode', 'sort'].forEach(id => {
        const value = $(id).value;
        if (value && !(id === 'sort' && value === 'points')) url.searchParams.set(id, value);
        else url.searchParams.delete(id);
      });
      history.replaceState(null, '', url);
    }
  }

  function renderCatalog() {
    const query = normalize($('song-search').value.trim());
    const songs = catalog.songs.filter(song => normalize(`${song.title} ${song.artist} ${song.category}`).includes(query));
    $('song-count').textContent = `${songs.length} SONGS`;
    $('song-grid').innerHTML = songs.map(song => `<button class="song-card" data-song="${escape(song.id)}">
      ${image(song, true)}<span class="song-card-body"><strong>${escape(song.title)}</strong><small>${escape(song.artist)}</small><span class="song-tags"><span>${bpm(song)} BPM</span><span>${escape(song.cut)}</span></span></span></button>`).join('') || '<p class="footnote">No songs match this search.</p>';
  }

  $('players-list').innerHTML = data.players.map(player => `<button class="player-card" data-player="${escape(player.id)}">${avatar(player)}<span><strong>${escape(player.name)}</strong><small>${escape([player.location, player.country].filter(Boolean).join(', ') || 'Location N/A')} · ${counted.filter(item => item.result.player === player.id).length} counted songs</small></span><span class="profile-arrow">↗</span></button>`).join('') + '<article class="player-card pending-player"><span class="avatar">?</span><span><strong>More player profiles</strong><small>Individual photos, gamer tags and results to be added.</small></span></article>';
  ['search', 'player-filter', 'level', 'mode', 'sort'].forEach(id => $(id).addEventListener(id === 'search' ? 'input' : 'change', () => renderResults(true)));
  $('song-search').addEventListener('input', renderCatalog);
  document.addEventListener('click', event => {
    const attempt = event.target.closest('[data-attempt]');
    const song = event.target.closest('[data-song]');
    const player = event.target.closest('[data-player]');
    if (attempt) {
      showAttempt(attempt.dataset.attempt);
    } else if (song) showSong(song.dataset.song);
    else if (player) showPlayer(player.dataset.player);
  });
  $('detail-dialog').addEventListener('click', event => { if (event.target === event.currentTarget) event.currentTarget.close(); });
  $('detail-dialog').addEventListener('close', () => { if (returnFocus?.isConnected) returnFocus.focus(); });
  renderResults();
  renderCatalog();
})();
