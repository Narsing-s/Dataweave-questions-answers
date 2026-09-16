(() => {
  const KEY='dataweave-lab-learning-v2';
  const OLD='dataweave-lab-learning-v1';
  const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
  const clean=x=>({completed:Array.isArray(x?.completed)?x.completed.map(String):[],bookmarks:Array.isArray(x?.bookmarks)?x.bookmarks.map(String):[],wrong:Array.isArray(x?.wrong)?x.wrong.map(String):[],attempts:x?.attempts&&typeof x.attempts==='object'?x.attempts:{},streak:Number(x?.streak||0),lastDay:x?.lastDay||null});
  const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(_){return{}}};
  const save=x=>localStorage.setItem(KEY,JSON.stringify(x));
  const migrate=()=>{if(localStorage.getItem(KEY)||!localStorage.getItem(OLD))return;try{const old=JSON.parse(localStorage.getItem(OLD));if(old&&typeof old==='object'){const x=clean(old);save(x)}}catch(_){} };
  const state=()=>{migrate();return clean(load())};
  function mark(id,ok=true,meta={}){const x=state(),key=String(id),d=today();if(ok){if(!x.completed.includes(key))x.completed.push(key);x.wrong=x.wrong.filter(v=>v!==key)}else{if(!x.wrong.includes(key))x.wrong.push(key)}x.attempts[key]={ok:!!ok,at:new Date().toISOString(),difficulty:meta.difficulty||x.attempts[key]?.difficulty||'',topic:meta.topic||x.attempts[key]?.topic||''};if(x.lastDay!==d){const p=new Date();p.setDate(p.getDate()-1);const prev=`${p.getFullYear()}-${String(p.getMonth()+1).padStart(2,'0')}-${String(p.getDate()).padStart(2,'0')}`;x.streak=x.lastDay===prev?x.streak+1:1;x.lastDay=d}save(x);return x}
  function toggleBookmark(id){const x=state(),key=String(id),i=x.bookmarks.indexOf(key);i<0?x.bookmarks.push(key):x.bookmarks.splice(i,1);save(x);return x}
  function isBookmarked(id){return state().bookmarks.includes(String(id))}
  function clearReview(id){const x=state(),key=String(id);x.wrong=x.wrong.filter(v=>v!==key);save(x);return x}
  function clearCompleted(id){const x=state(),key=String(id);x.completed=x.completed.filter(v=>v!==key);save(x);return x}
  function reset(){localStorage.removeItem(KEY);localStorage.removeItem(OLD)}
  function stats(){const x=state(),topics={},levels={Easy:0,Medium:0,Advanced:0};Object.values(x.attempts).forEach(a=>{if(a.topic)topics[a.topic]=(topics[a.topic]||0)+1;if(a.difficulty&&levels[a.difficulty]!==undefined)levels[a.difficulty]++});return{completed:x.completed.length,bookmarks:x.bookmarks.length,wrong:x.wrong.length,streak:x.streak,topics,levels}}
  function qotd(){const d=new Date(),n=d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();return `DW-${String(((n-1)%10000)+1).padStart(5,'0')}`}
  window.DataWeaveLearning={state,mark,toggleBookmark,isBookmarked,clearReview,clearCompleted,reset,stats,qotd,migrate};
})();
