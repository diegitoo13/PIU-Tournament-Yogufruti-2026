// Initial transcription from the referenced tournament handoff and available score photographs.
// Missing values remain null until the original workbook can be imported and checked.
window.TOURNAMENT_DATA = {
  event: { id:'yogufruti-2026', title:'West Side Tournament 2026', location:'Aguadilla, Puerto Rico', date:'2026-11-01', status:'provisional', minLevel:5, maxLevel:null, sessionSeconds:1800 },
  players: [{ id:'diegitoo113', name:'DIEGITOO113', publicName:'Diego Acevedo', location:'', country:'', photo:'' }],
  results: [
    {id:'r01',player:'diegitoo113',song:'Eternal Universe',mode:'Single',level:20,score:992330,grade:'SSS',perfect:1040,great:7,good:1,bad:1,miss:1,combo:534,kcal:45.044},
    {id:'r02',player:'diegitoo113',song:'Curiosity Overdrive',mode:'Single',level:20,score:983067,grade:'SS',perfect:1077,great:12,good:4,bad:5,miss:3,combo:457,kcal:49.641},
    {id:'r03',player:'diegitoo113',song:'We Love Your Step',mode:'Single',level:20,score:null,grade:'SS'},
    {id:'r04',player:'diegitoo113',song:'Solve My Hurt',mode:'Single',level:21,score:null,grade:'S'},
    {id:'r05',player:'diegitoo113',song:'Vanish 2',mode:'Single',level:20,score:null,grade:'S+'},
    {id:'r06',player:'diegitoo113',song:'Burn Out',mode:'Single',level:20,score:974183,grade:'S',perfect:1158,great:24,good:8,bad:2,miss:10,combo:528,kcal:43.925},
    {id:'r07',player:'diegitoo113',song:'Bluish Rose',mode:'Single',level:20,score:null,grade:'S'},
    {id:'r08',player:'diegitoo113',song:'Dream To Nightmare',mode:'Single',level:21,score:null,grade:'AAA+'},
    {id:'r09',player:'diegitoo113',song:'Ghost Bloody Train',mode:'Single',level:23,score:null,grade:'AA'},
    {id:'r10',player:'diegitoo113',song:'Super Akuma Emperor',mode:'Single',level:20,score:984233,grade:'SS',perfect:1178,great:11,good:1,bad:2,miss:8,combo:401,kcal:44.982},
    {id:'r11',player:'diegitoo113',song:'Break Through Myself feat. Risa Yuzuki',mode:'Single',level:21,score:956766,grade:'AAA',perfect:1118,great:49,good:18,bad:10,miss:5,combo:376,kcal:57.532},
    {id:'r12',player:'diegitoo113',song:'Overnight Flower',mode:'Single',level:22,score:957630,grade:'AAA',perfect:1160,great:42,good:27,bad:6,miss:6,combo:635,kcal:64.863}
  ].map(r => ({
    ...r,
    sourceSongId: ({r01:1033,r02:947,r03:1082,r04:1032,r05:1030,r06:1024,r07:952,r08:208,r09:1102,r10:1022,r11:1007,r12:1065})[r.id],
    songId: 'pumpout:' + ({r01:1033,r02:947,r03:1082,r04:1032,r05:1030,r06:1024,r07:952,r08:208,r09:1102,r10:1022,r11:1007,r12:1065})[r.id],
    cut: 'Arcade', valid: true, verification: 'Tournament handoff',
    selectionSecond: null, passStatus: 'Unverified'
  }))
};
