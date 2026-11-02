const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const data=require('../data/results.json');
const catalog=require('../data/catalog.json');
const nodes=new Map();let drawn=[];let failed=false;let currentData=data;let exported=false;
const context2d=new Proxy({measureText:s=>({width:String(s).length*22}),fillText(s,x,y){assert.ok(Number.isFinite(x)&&Number.isFinite(y));drawn.push(String(s));}}, {get:(o,k)=>k in o?o[k]:()=>{}});
function node(id){if(!nodes.has(id))nodes.set(id,{value:'',handlers:{},attributes:{},disabled:false,children:[],textContent:'',addEventListener(k,f){this.handlers[k]=f;},setAttribute(k,v){this.attributes[k]=v;},replaceChildren(...children){this.children=children;},append(){},remove(){},click(){},getContext:()=>context2d,toBlob(fn,type){assert.equal(type,'image/png');exported=true;fn(new Blob(['test'],{type}));}});return nodes.get(id);}
const context={document:{getElementById:node,querySelector:node,createElement:node,body:node('body')},location:{href:'https://piu.kazza.jp/rewind.html',origin:'https://piu.kazza.jp'},history:{replaceState(){}},navigator:{},URL,Date,Blob,console,PIUScore:require('../scoring.js'),PIURewind:require('../rewind-data.js'),setTimeout(){},Image:class{set src(v){this.naturalWidth=900;this.naturalHeight=600;queueMicrotask(()=>this.onload());}},fetch:async path=>({ok:!failed,json:async()=>path.includes('results')?currentData:catalog})};
const tick=()=>new Promise(resolve=>setImmediate(resolve));
(async()=>{
vm.runInNewContext(fs.readFileSync('rewind.js','utf8'),context);await tick();
assert.match(node('slide-count').textContent,/1 \/ 7/);
assert.equal(node('download').disabled,false);
for(const p of [null,...data.players]){
 node('recap-player').value=p?.id||'';node('recap-player').handlers.change();await tick();
 for(let i=0;i<7;i++){
  assert.ok(node('story').attributes['aria-label']);
  assert.ok(drawn.every(s=>!s.includes('undefined')&&!s.includes('NaN')));
  drawn=[];node('next').handlers.click();await tick();
 }
 assert.match(node('slide-count').textContent,/1 \/ 7/,'navigation wraps');
}
await node('download').handlers.click();assert.ok(exported);
node('recap-player').value='';currentData={...data,results:data.results.slice(0,12)};
await node('regenerate').handlers.click();await tick();assert.match(node('story').attributes['aria-label'],/12 counted songs/);
const previous=node('story').attributes['aria-label'];failed=true;
await node('regenerate').handlers.click();await tick();assert.equal(node('story').attributes['aria-label'],previous);assert.match(node('status').textContent,/previous snapshot/);
console.log('All 70 story renders passed; player switching, PNG export, regeneration, and fetch failure preserve correct state.');
})().catch(e=>{console.error(e);process.exitCode=1;});
