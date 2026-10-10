const assert=require('node:assert/strict');
const handler=require('./api/installer');
const cloud=require('./cloud-downloads.json');
function response(){return {headers:{},code:0,setHeader(name,value){this.headers[name]=value},status(code){this.code=code;return this},end(){return this},json(data){this.body=data;return this},send(data){this.body=data;return this}}}
(async()=>{
 assert.match(cloud.folder,/^https:\/\/(disk\.yandex\.(ru|com)|yadi\.sk)\//);
 const originalFetch=global.fetch;let calls=0;
 try{
  global.fetch=async url=>{calls++;assert.equal(url.searchParams.get('public_key'),cloud.folder);assert.ok(['/Vasilisa-Setup-0.2.0.exe','/Vasilisa-Android-0.2.0.apk'].includes(url.searchParams.get('path')));return {ok:true,json:async()=>({href:'https://downloader.disk.yandex.ru/disk/download-test'})}};
  for(const device of ['windows','android']){const res=response();await handler({method:'GET',query:{device}},res);assert.equal(res.code,302);assert.equal(res.headers['Cache-Control'],'no-store')}
  const invalid=response();await handler({method:'GET',query:{device:'https://example.com'}},invalid);assert.equal(invalid.code,400);assert.equal(calls,2);
  global.fetch=async()=>({ok:false});const unavailable=response();await handler({method:'GET',query:{device:'windows'}},unavailable);assert.equal(unavailable.code,503);assert.ok(unavailable.body.includes(cloud.folder));
 }finally{global.fetch=originalFetch}
 console.log('PASS: installer links resolve only approved files from the shared Yandex Disk folder; invalid selections and cloud failure are handled.');
})().catch(error=>{console.error(error);process.exitCode=1});
