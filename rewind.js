/* Canvas is both the preview and the full-resolution export: no screenshot service. */
(() => {
  const $ = id => document.getElementById(id);
  const canvas = $('story');
  const ctx = canvas.getContext('2d');
  const fmt = n => n == null ? 'N/A' : n.toLocaleString('en-US');
  const pct = n => n == null ? 'N/A' : `${n.toFixed(1)}%`;
  const chart = r => `${r.mode === 'Double' ? 'D' : 'S'}${r.level}`;
  const palettes = [ ['#d4fa72','#17200e','#607634'], ['#181b25','#eceeff','#b6a0ff'], ['#bba8f5','#201839','#615083'], ['#fc9b6d','#301e17','#86543c'], ['#a7e6e8','#142d30','#49787c'], ['#20261b','#eff3e7','#d4fa72'], ['#d4fa72','#17200e','#607634'] ];
  let data, catalog, stats, slides = [], index = 0, snapshot, generation = 0, busy = false;
  const images = new Map();
  let foreground, secondary;
  function text(value, x, y, size = 40, weight = 700, color = foreground, maxWidth = 920) {
    ctx.fillStyle = color; ctx.font = `${weight} ${size}px Arial, Helvetica, sans-serif`;
    while (ctx.measureText(String(value)).width > maxWidth && size > 14) { size--; ctx.font = `${weight} ${size}px Arial, Helvetica, sans-serif`; }
    ctx.fillText(String(value), x, y);
  }
  function lines(value, x, y, size = 60, maxWidth = 920, maxLines = 3, color = foreground) {
    ctx.font = `700 ${size}px Arial, Helvetica, sans-serif`;
    const words = String(value).split(/\s+/); const result = []; let line = '';
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width > maxWidth && line) { result.push(line); line = word; } else line = next;
    }
    if (line) result.push(line);
    result.slice(0,maxLines).forEach((line,i) => text(i === maxLines-1 && result.length > maxLines ? `${line}…` : line,x,y+i*size*1.12,size,700,color,maxWidth));
    return y + Math.min(result.length,maxLines)*size*1.12;
  }
  function rule(y) { ctx.globalAlpha=.25; ctx.fillStyle=foreground;ctx.fillRect(80,y,920,2);ctx.globalAlpha=1; }
  function metric(value,label,x,y,width=420) { text(value,x,y,105,800,foreground,width); text(label.toUpperCase(),x,y+48,24,700,secondary,width); }
  function base(slide) {
    const [bg,fg,muted] = palettes[index % palettes.length]; foreground=fg;secondary=muted;
    ctx.fillStyle=bg;ctx.fillRect(0,0,1080,1920);
    // Five-panel geometry echoes the game pad without imitating a product logo.
    ctx.save();ctx.translate(900,280);ctx.rotate(Math.PI/4);ctx.strokeStyle=fg;ctx.globalAlpha=.07;ctx.lineWidth=30;
    for(let j=0;j<4;j++)ctx.strokeRect(-140-j*65,-140-j*65,280+j*130,280+j*130);
    ctx.restore();
    text('PIU / WEST SIDE 2026',80,164,28,800);text(`${String(index+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`,835,164,26,700,foreground,165);
    rule(202);text(slide.kicker.toUpperCase(),80,270,26,700,secondary);
    rule(1700);text('PROVISIONAL · MORE RESULTS TO COME',80,1754,23,700);
    text('piu.kazza.jp · '+snapshot.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'America/Puerto_Rico'}),80,1800,24,400);
    text(`${stats.player ? stats.player.name+' · ' : ''}${data.players.length} players · ${data.results.length} uploaded attempts · ${snapshot.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'America/Puerto_Rico'})} AST`,80,1842,21,400,secondary);
  }
  async function getImage(path) {
    if (!path) return null;
    const url = new URL(path,location.href); if(url.origin!==location.origin)return null;
    if(!images.has(path))images.set(path,new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>resolve(null);img.src=url.href;}));
    return images.get(path);
  }
  function photo(img,x,y,w,h,position='50% 50%') {
    if(!img)return;
    const scale=Math.max(w/img.naturalWidth,h/img.naturalHeight);
    const parts=position.split(' ').map(p=>parseFloat(p)/100);
    ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
    ctx.drawImage(img,x-(img.naturalWidth*scale-w)*(parts[0]||.5),y-(img.naturalHeight*scale-h)*(parts[1]||.5),img.naturalWidth*scale,img.naturalHeight*scale);ctx.restore();
  }
  function gradeRows() {
    return [{label:'SSS+ / PG',count:stats.grades.filter(g=>['SSS+','SSS+ PG'].includes(g.grade)).reduce((s,g)=>s+g.count,0)},
      {label:'SSS',count:stats.grades.find(g=>g.grade==='SSS')?.count||0},
      {label:'SS / SS+',count:stats.grades.filter(g=>['SS','SS+'].includes(g.grade)).reduce((s,g)=>s+g.count,0)},
      {label:'S / S+',count:stats.grades.filter(g=>['S','S+'].includes(g.grade)).reduce((s,g)=>s+g.count,0)},
      {label:'AAA / AAA+',count:stats.grades.filter(g=>['AAA','AAA+'].includes(g.grade)).reduce((s,g)=>s+g.count,0)},
      {label:'AA / AA+',count:stats.grades.filter(g=>['AA','AA+'].includes(g.grade)).reduce((s,g)=>s+g.count,0)},
      {label:'A+ OR LOWER',count:stats.grades.filter(g=>PIUScore.factors[g.grade]===.75).reduce((s,g)=>s+g.count,0)}];
  }
  function buildSlides() {
    const personal=!!stats.player;
    const best=stats.best[0];
    const leaders=stats.standings.filter(s=>s.rank===1);
    const popular=stats.popular[0];
    const combo=stats.comboBest[0];
    const who=personal?stats.player.name:'THE TOURNAMENT';
    return [
      {title:'The session',kicker:personal?'PLAYER REWIND':'TOURNAMENT REWIND',image:personal?stats.player.photo:'assets/event/participants.webp',
        description:`${who}: ${fmt(stats.total)} tournament points across ${stats.count} counted songs. ${stats.submitted} submitted attempts.`,
        draw(img){text('WEST SIDE',80,410,112,900);text('REWIND.',80,535,145,900);text(personal?stats.player.name:'AGUADILLA, PUERTO RICO',80,610,35,800);if(img)photo(img,80,680,920,480,stats.player?.photoPosition);else {text('SINGLE. DOUBLE.',80,865,75,800);text('EVERY POINT COUNTS.',80,960,67,800);}metric(fmt(stats.total),'TOURNAMENT POINTS',80,1330,920);metric(stats.count,'COUNTED SONGS',80,1540);metric(personal?`#${stats.standing?.rank||'—'}`:stats.standings.length,personal?'CURRENT RANK':'PLAYERS WITH RESULTS',580,1540);}},
      {title:personal?'Your position':'Current standings',kicker:'THE POINTS ADD UP',
        description:personal?`${stats.player.name} is rank ${stats.standing?.rank??'N/A'} of ${stats.standings.length}, with ${fmt(stats.total)} points. Tied totals share a rank.`:`Current leaders: ${leaders.map(s=>s.player.name).join(', ')}. ${stats.standings.map(s=>`${s.rank}. ${s.player.name}: ${s.total}`).join('; ')}.`,
        draw(){text(personal?'YOUR POSITION.':'THE STANDINGS.',80,410,87,900);text(personal?`#${stats.standing?.rank||'—'}`:fmt(leaders[0]?.total),80,620,170,900);text(personal?`${fmt(stats.total)} POINTS · ${stats.count} COUNTED SONGS`:'POINTS AT THE TOP · NOT FINAL RANKINGS',80,685,29,700,secondary);
          const position=stats.standings.findIndex(s=>s.player.id===stats.player?.id);
          const rows=personal?stats.standings.slice(Math.max(0,position-2),Math.max(0,position-2)+5):stats.standings;
          rows.slice(0,10).forEach((s,i)=>{const y=800+i*80;text(String(s.rank).padStart(2,'0'),80,y,29,800,secondary,65);text(s.player.name,170,y,34,800,foreground,520);text(fmt(s.total),730,y,36,800,foreground,270);rule(y+26);});
          text((!personal&&stats.standings.length>10?'Top 10 shown. ':'')+'Equal totals share the same rank.',80,1640,25,400,secondary);}},
      {title:'Strongest play',kicker:best&&stats.best.length>1?'JOINT HIGHEST TOURNAMENT POINTS':'HIGHEST TOURNAMENT POINTS',image:best?.song?.cover,
        description:best?`${stats.best.length>1?stats.best.length+' tied plays. Featured: ':''}${best.player?.name}, ${best.song?.title||best.result.song}, ${chart(best.result)}, ${best.result.grade}. ${best.result.level} × 100 × ${PIUScore.factors[best.result.grade].toFixed(2)} = ${best.points} points.`:'No counted play available.',
        draw(img){text('BIGGEST PLAY.',80,410,96,900);if(!best){text('N/A',80,650,120);return;}photo(img,80,500,920,500);if(!img)text('ARTWORK N/A',80,730,54);let y=lines(best.song?.title||best.result.song,80,1100,60,920,2);text(`${best.player?.name||'N/A'} · ${chart(best.result)} · ${best.result.grade}`,80,y+20,36,800);metric(fmt(best.points),'TOURNAMENT POINTS',80,1405,920);text(`${best.result.level} × 100 × ${PIUScore.factors[best.result.grade].toFixed(2)} (${best.result.grade})`,80,1540,45,700);text(stats.best.length>1?`${stats.best.length} plays tied at this point total. One shown.`:'Level × base points × grade multiplier.',80,1610,25,400,secondary);}},
      {title:'Grade mix',kicker:'THE GRADE MATTERS',description:`${stats.sOrBetter} of ${stats.count} counted plays earned S or higher. ${stats.grades.map(g=>`${g.grade}: ${g.count}`).join('; ')}.`,
        draw(){text('MAKE THE GRADE.',80,410,86,900);text(pct(stats.count?100*stats.sOrBetter/stats.count:null),80,620,170,900);text(`${stats.sOrBetter} OF ${stats.count} COUNTED PLAYS · S OR HIGHER`,80,690,29,800);gradeRows().forEach((g,i)=>{const y=825+i*110;text(g.label,80,y,27,800,foreground,300);text(fmt(g.count),920,y,30,800,foreground,80);ctx.globalAlpha=.15;ctx.fillStyle=foreground;ctx.fillRect(80,y+22,920,20);ctx.globalAlpha=1;ctx.fillRect(80,y+22,stats.count?920*g.count/stats.count:0,20);});text('Each counted play appears in one grade group.',80,1640,25,400,secondary);}},
      {title:'Judgment breakdown',kicker:'EVERY JUDGMENT, ACCOUNTED FOR',description:`Perfect share ${pct(stats.perfectPercent)} from ${stats.completeJudgments} complete records. ${Object.entries(stats.judgmentTotals).map(([k,v])=>`${k}: ${v}`).join('; ')}. This is not the game's accuracy rating.`,
        draw(){text('ON THE BEAT.',80,410,105,900);text(pct(stats.perfectPercent),80,640,170,900);text('PERFECT SHARE OF RECORDED JUDGMENTS',80,710,28,800);Object.entries(stats.judgmentTotals).forEach(([name,value],i)=>{const y=875+i*130;text(name.toUpperCase(),80,y,33,800);text(stats.completeJudgments?fmt(value):'N/A',640,y,48,800,foreground,360);rule(y+40);});text(`${stats.completeJudgments} / ${stats.count} counted plays with complete judgments`,80,1575,27,700,secondary);text('Perfect ÷ (Perfect + Great + Good + Bad + Miss)',80,1625,24,400,secondary);}},
      {title:personal?'Longest combo':'Songs on repeat',kicker:personal?'YOUR LONGEST RECORDED COMBO':'THE SHARED SOUNDTRACK',image:personal?combo?.song?.cover:popular?.song.cover,
        description:personal?(combo?`${fmt(stats.maxCombo)} max combo on ${combo.song?.title||combo.result.song}, ${chart(combo.result)}. ${stats.comboBest.length} play(s) share this maximum.`:'Max combo is unavailable.'):`Most played identified songs by unique players: ${stats.popular.slice(0,5).map(p=>`${p.song.title}: ${p.count}`).join('; ')}. ${stats.unknownSongs} unidentified records excluded.`,
        draw(img){text(personal?'KEEP IT GOING.':'ON REPEAT.',80,410,103,900);photo(img,80,490,920,440);if(!img)text('ARTWORK N/A',80,720,54);if(personal){text(fmt(stats.maxCombo),80,1150,165,900);text('MAX COMBO · NOT A FULL-COMBO CLAIM',80,1210,25,800,secondary);const y=lines(combo?.song?.title||combo?.result.song||'Song N/A',80,1340,59,920,2);text(combo?`${chart(combo.result)} · ${combo.result.grade}`:'No recorded combo',80,y+35,36);text(stats.comboBest.length>1?`${stats.comboBest.length} plays tied. One shown.`:'From your counted plays.',80,1630,25,400,secondary);}else{stats.popular.slice(0,5).forEach((p,i)=>{const y=1040+i*112;text(p.song.title,80,y,34,800,foreground,740);text(String(p.count),905,y,42,800,foreground,95);text('UNIQUE PLAYERS',80,y+35,20,700,secondary);});text(`${stats.unknownSongs} unidentified records excluded · ties share a count`,80,1645,23,400,secondary);}}},
      {title:'The session in numbers',kicker:'ONE MORE LOOK',description:`${stats.singles} Singles and ${stats.doubles} Doubles counted. Levels ${stats.lowLevel??'N/A'} through ${stats.highLevel??'N/A'}. ${stats.missingScores} missing machine scores and ${stats.unknownSongs} unidentified songs. Provisional snapshot; regenerate after uploads.`,
        draw(){text('YOUR NEXT',80,410,113,900);text('REWIND AWAITS.',80,535,91,900);text('MORE UPLOADS. A NEW SNAPSHOT.',80,635,31,800,secondary);metric(stats.singles,'SINGLE PLAYS',80,850);metric(stats.doubles,'DOUBLE PLAYS',580,850);rule(950);metric(stats.lowLevel==null?'N/A':`${stats.lowLevel}–${stats.highLevel}`,'LEVEL RANGE',80,1110);metric(stats.count,'COUNTED SONGS',580,1110);rule(1210);text(`${stats.missingScores} unreadable machine score${stats.missingScores===1?'':'s'}`,80,1320,36,700);text(`${stats.unknownSongs} song identit${stats.unknownSongs===1?'y':'ies'} pending`,80,1380,36,700);text('Points use level and grade, not machine score.',80,1450,27,400,secondary);text('RETURN. REGENERATE. SHARE.',80,1590,46,900);}},
    ];
  }
  async function render() {
    const token=++generation; busy=true;toggleButtons();document.querySelector('.viewer').setAttribute('aria-busy','true');
    const slide=slides[index];const img=await getImage(slide.image);if(token!==generation)return;
    base(slide);slide.draw(img);canvas.setAttribute('aria-label',slide.description);$('story-description').textContent=slide.description;
    $('slide-count').textContent=`${index+1} / ${slides.length} · ${slide.title}`;
    $('progress').replaceChildren(...slides.map((s,i)=>{const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',`Story ${i+1}: ${s.title}`);button.setAttribute('aria-current',String(i===index));button.addEventListener('click',()=>go(i));return button;}));
    busy=false;toggleButtons();document.querySelector('.viewer').setAttribute('aria-busy','false');
  }
  function toggleButtons(){for(const id of ['download','share','previous','next'])$(id).disabled=busy||!slides.length;}
  function go(i){if(busy||!slides.length)return;index=(i+slides.length)%slides.length;render();}
  function rebuild(){stats=PIURewind.analyze(data,catalog,$('recap-player').value);slides=buildSlides();index=0;const url=new URL(location.href);if(stats.player)url.searchParams.set('player',stats.player.id);else url.searchParams.delete('player');history.replaceState(null,'',url);render();}
  async function regenerate(){
    $('regenerate').disabled=true;$('recap-player').disabled=true;$('status').textContent='Loading latest published results…';
    try{const stamp=Date.now();const responses=await Promise.all(['results','catalog'].map(name=>fetch(`data/${name}.json?rewind=${stamp}`,{cache:'no-store'})));if(responses.some(r=>!r.ok))throw new Error('Could not fetch the latest data.');const [nextData,nextCatalog]=await Promise.all(responses.map(r=>r.json()));
      if(!Array.isArray(nextData.players)||!Array.isArray(nextData.results)||!Array.isArray(nextCatalog.songs))throw new Error('Unexpected data format.');
      const selected=$('recap-player').value||new URL(location.href).searchParams.get('player')||'';
      // Analyze before replacing a working snapshot.
      PIURewind.analyze(nextData,nextCatalog);
      data=nextData;catalog=nextCatalog;snapshot=new Date();images.clear();
      $('recap-player').replaceChildren(...[{id:'',name:'Entire tournament'},...data.players].map(p=>{const option=document.createElement('option');option.value=p.id;option.textContent=p.name;return option;}));
      $('recap-player').value=data.players.some(p=>p.id===selected)?selected:'';
      $('snapshot').textContent=`Snapshot · ${snapshot.toLocaleString('en-US',{timeZone:'America/Puerto_Rico',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})} AST · ${data.players.length} players / ${data.results.length} attempts`;
      rebuild();$('status').textContent='Recap generated from the latest published results.';
    }catch(error){$('status').textContent=`${error.message} ${data?'Your previous snapshot is still available.':'Use Regenerate to retry.'}`;}
    finally{$('regenerate').disabled=false;$('recap-player').disabled=!data;}
  }
  function png(){return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Image export failed. Please try again.')),'image/png'));}
  function filename(){return `west-side-2026-${stats.player?stats.player.name.toLowerCase().replace(/[^a-z0-9_-]/g,''):'tournament'}-${index+1}-${snapshot.toISOString().replace(/[:.]/g,'-')}.png`;}
  async function download(){try{const name=filename();const blob=await png();const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);$('status').textContent='Story saved as a 1080 × 1920 PNG. Upload it from your downloads to Instagram.';}catch(error){$('status').textContent=error.message;}}
  $('download').addEventListener('click',download);
  if(navigator.canShare&&navigator.canShare({files:[new File([''],'story.png',{type:'image/png'})]})){$('share').hidden=false;$('share').addEventListener('click',async()=>{try{const file=new File([await png()],filename(),{type:'image/png'});await navigator.share({files:[file],title:'West Side 2026 Rewind'});}catch(e){if(e.name!=='AbortError')$('status').textContent='Sharing is unavailable. Use Download this story instead.';}});}
  $('regenerate').addEventListener('click',regenerate);$('recap-player').addEventListener('change',rebuild);
  $('previous').addEventListener('click',()=>go(index-1));$('next').addEventListener('click',()=>go(index+1));
  $('story-frame').addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();go(index+(e.key==='ArrowLeft'?-1:1));}});
  let touch;canvas.addEventListener('touchstart',e=>{touch={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};},{passive:true});canvas.addEventListener('touchend',e=>{if(!touch)return;const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))go(index+(dx<0?1:-1));touch=null;},{passive:true});
  regenerate();
})();
