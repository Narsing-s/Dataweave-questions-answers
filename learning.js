(() => {
  const KEY='dataweave-lab-learning-v1';
  const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(_){return{}}};
  const save=x=>localStorage.setItem(KEY,JSON.stringify(x));
  const state=()=>{const x=load();return{completed:Array.isArray(x.completed)?x.completed:[],bookmarks:Array.isArray(x.bookmarks)?x.bookmarks:[],wrong:Array.isArray(x.wrong)?x.wrong:[],streak:Number(x.streak||0),lastDay:x.lastDay||null}};
  const today=()=>new Date().toISOString().slice(0,10);
  function mark(id,ok=true){const x=state();id=String(id);if(ok&&!x.completed.includes(id))x.completed.push(id);if(!ok&&!x.wrong.includes(id))x.wrong.push(id);const d=today();if(x.lastDay!==d){const y=new Date();y.setDate(y.getDate()-1);const prev=y.toISOString().slice(0,10);x.streak=x.lastDay===prev?x.streak+1:1;x.lastDay=d}save(x);return x}
  function toggleBookmark(id){const x=state(),i=x.bookmarks.indexOf(String(id));i<0?x.bookmarks.push(String(id)):x.bookmarks.splice(i,1);save(x);return x}
  function isBookmarked(id){return state().bookmarks.includes(String(id))}
  function reset(){localStorage.removeItem(KEY)}
  function stats(){const x=state();return{completed:x.completed.length,bookmarks:x.bookmarks.length,wrong:x.wrong.length,streak:x.streak}}
  function qotd(){const n=new Date().getUTCFullYear()*10000+(new Date().getUTCMonth()+1)*100+new Date().getUTCDate();return `DW-${String((n%10000)||1).padStart(5,'0')}`}
  window.DataWeaveLearning={state,mark,toggleBookmark,isBookmarked,reset,stats,qotd};
})();
