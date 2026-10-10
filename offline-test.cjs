const fs=require('node:fs');const vm=require('node:vm');const assert=require('node:assert/strict');
const handlers={};const stored=new Map();let network=0;const origin='https://example.test';
const sandbox={URL,Promise,self:{location:{origin},registration:{scope:origin+'/'},addEventListener:(type,callback)=>handlers[type]=callback,skipWaiting:async()=>{},clients:{claim:async()=>{}}},caches:{open:async()=>({addAll:async files=>{for(const file of files){assert.ok(file==='./'||fs.existsSync(file.slice(2)),'Missing offline asset '+file);stored.set(new URL(file,origin+'/').href,{ok:true,url:file})}},match:async request=>stored.get(new URL(typeof request==='string'?request:request.url).href.split('?')[0])}),keys:async()=>[],delete:async()=>true},fetch:async()=>{network++;throw Error('Network is offline')}};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync('sw.js','utf8'),sandbox);
(async()=>{
 let installed;handlers.install({waitUntil:promise=>installed=promise});await installed;
 for(const file of ['index.html','game.js','style.css','audio-storage.js','install.html','img/friends-v2.png','img/vasilisa-toy-avatar.png']){let response;handlers.fetch({request:{url:origin+'/'+file,method:'GET'},respondWith:promise=>response=promise});assert.ok((await response).ok,'Not cached '+file)}
 assert.equal(network,0,'Cached game must not need network');
 let intercepted=false;handlers.fetch({request:{url:'https://open.spotify.com/embed/song',method:'GET'},respondWith:()=>intercepted=true});assert.equal(intercepted,false);
 const html=fs.readFileSync('install.html','utf8');assert.ok(html.includes('Vasilisa-Setup-0.2.0.exe'));assert.ok(html.includes('Vasilisa-Android-0.2.0.apk'));
 console.log('PASS: all offline assets exist; cached game works with failed network; third-party player is not cached; installer links match release filenames.');
})().catch(error=>{console.error(error);process.exitCode=1});
