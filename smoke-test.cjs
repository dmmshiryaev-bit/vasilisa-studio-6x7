const vm=require('node:vm');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const elements=new Map();
const element=id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',hidden:false,value:'',className:'',querySelectorAll:()=>[],focus(){},addEventListener(){},showModal(){},close(){},removeAttribute(){}});return elements.get(id)};
const storage=new Map();
const sandbox={document:{getElementById:element,body:{className:''},addEventListener(){}},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},console,Date,Math,Set,JSON,setTimeout,clearInterval,assert};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('game.js','utf8')+`
for(const day of DAYS)for(const q of bank(day)){
 assert.ok(Number.isInteger(answer(q)));
 assert.equal(choicesFor(q).length,4);
 assert.equal(new Set(choicesFor(q)).size,4);
 assert.ok(choicesFor(q).includes(answer(q)));
}
for(let day=0;day<7;day++){
 selected=day;startSession();
 if(day===0){const q=session.queue[0],count=session.queue.length;checkAnswer(answer(q)+1);assert.equal(session.queue.length,count+1);assert.equal(session.helped,true);assert.equal(session.errors,1);}
 let count=0;
 while(!session.done){assert.ok(count++<25);const q=session.queue[session.index];checkAnswer(answer(q));assert.equal(session.answered,true);session.index++;renderQuestion();}
 assert.ok(state.completed.includes(day));
 assert.equal(state.stars,(day+1)*7);
}
assert.equal(state.completed.length,7);assert.equal(state.sessions.length,7);
selected=6;startSession();while(!session.done){checkAnswer(answer(session.queue[session.index]));session.index++;renderQuestion();}assert.equal(state.stars,49);
assert.equal(JSON.parse(localStorage.getItem(KEY)).completed.length,7);
console.log('PASS: all 7 days, multiplication/division answers, four unique choices, error hint and deferred retry, rewards without duplicates, local persistence.');
`,sandbox);
