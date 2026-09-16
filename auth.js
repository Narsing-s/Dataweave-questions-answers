(() => {
  const USER_KEY='dataweave-lab-user';
  const ACCOUNTS_KEY='dataweave-lab-accounts-v2';
  const FIRST_LOGIN_KEY='dataweave-lab-first-login-greeted';
  const read=()=>{try{const a=JSON.parse(localStorage.getItem(ACCOUNTS_KEY)||'[]');return Array.isArray(a)?a:[]}catch(_){return[]}};
  const write=a=>localStorage.setItem(ACCOUNTS_KEY,JSON.stringify(a));
  const email=x=>String(x||'').trim().toLowerCase();
  const nameKey=x=>String(x||'').trim().toLowerCase().replace(/\s+/g,' ');
  function hash(p){let h=2166136261;for(let i=0;i<p.length;i++){h^=p.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(16).padStart(8,'0')}
  function getUser(){try{return JSON.parse(localStorage.getItem(USER_KEY)||'null')}catch(_){return null}}
  function createAccount({name:n,email:e,password:p}){n=String(n||'').trim();e=email(e);p=String(p||'');const a=read(),nk=nameKey(n);if(!n||!e||!p)return{ok:false,message:'Enter username, email and password.'};if(n.length<3)return{ok:false,message:'Username must contain at least 3 characters.'};if(n.length>40)return{ok:false,message:'Username must be 40 characters or fewer.'};if(!/^[A-Za-z0-9][A-Za-z0-9._ -]*$/.test(n))return{ok:false,message:'Username can use letters, numbers, dots, underscores, spaces and hyphens only.'};if(p.length<8)return{ok:false,message:'Password must contain at least 8 characters.'};if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))return{ok:false,message:'Enter a valid email address.'};if(a.some(x=>x.email===e))return{ok:false,message:'This email already has an account. Use Login instead.'};if(a.some(x=>x.nameKey===nk))return{ok:false,message:'This username is already registered. Choose another username.'};const u={id:(crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random()),name:n,nameKey:nk,email:e,passwordHash:hash(p),createdAt:new Date().toISOString()};a.push(u);write(a);localStorage.setItem(USER_KEY,JSON.stringify({id:u.id,name:u.name,email:u.email}));return{ok:true,user:getUser()}}
  function login({name:n,email:e,password:p}){n=String(n||'').trim();e=email(e);p=String(p||'');const u=read().find(x=>x.email===e);if(!n||!e||!p)return{ok:false,message:'Enter username, email and password.'};if(!u)return{ok:false,message:'No account exists for this email. Create an account first.'};if(u.nameKey!==nameKey(n))return{ok:false,message:'Username does not match this account.'};if(u.passwordHash!==hash(p))return{ok:false,message:'Incorrect password.'};localStorage.setItem(USER_KEY,JSON.stringify({id:u.id,name:u.name,email:u.email}));return{ok:true,user:getUser()}}
  function deleteAccount({name:n,email:e,password:p}){n=String(n||'').trim();e=email(e);p=String(p||'');const a=read(),i=a.findIndex(x=>x.email===e);if(i<0)return{ok:false,message:'No account exists for this email.'};const u=a[i];if(u.nameKey!==nameKey(n)||u.passwordHash!==hash(p))return{ok:false,message:'Credentials do not match. Account was not deleted.'};a.splice(i,1);write(a);[USER_KEY,FIRST_LOGIN_KEY,'dataweave-lab-learning-v1'].forEach(k=>localStorage.removeItem(k));return{ok:true}}
  function logout(){localStorage.removeItem(USER_KEY);location.href='index.html'}
  function greetingMailto(u){const s=encodeURIComponent('Welcome to DataWeave Lab 🎉');const b=encodeURIComponent(`Hi ${u.name},\n\nWelcome to DataWeave Lab! 🎉\n\nYour first login was successful.\n\nDataWeave Lab`);return`mailto:${encodeURIComponent(u.email)}?subject=${s}&body=${b}`}
  function markFirstLogin(){if(localStorage.getItem(FIRST_LOGIN_KEY))return false;localStorage.setItem(FIRST_LOGIN_KEY,new Date().toISOString());return true}
  function renderAccount(target=document){const u=getUser();target.querySelectorAll('[data-auth-user]').forEach(x=>{x.textContent=u?u.name:'Login';x.title=u?`${u.name} · ${u.email}`:'Login'});target.querySelectorAll('[data-logout]').forEach(x=>{x.hidden=!u;x.addEventListener('click',e=>{e.preventDefault();logout()},{once:true})})}

  // Cross-browser clipboard fallback. navigator.clipboard requires HTTPS/secure context;
  // this fallback also makes local/static previews usable.
  async function copyText(text){
    text=String(text??'');
    try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);return true}}catch(_){ }
    try{
      const ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';ta.style.pointerEvents='none';
      document.body.appendChild(ta);ta.focus();ta.select();ta.setSelectionRange(0,ta.value.length);
      const ok=document.execCommand('copy');ta.remove();if(ok)return true;
    }catch(_){ }
    return false;
  }
  function buttonFeedback(b,ok,label){const old=label||b.textContent;b.textContent=ok?'✓ Copied':'⚠ Copy failed';setTimeout(()=>{b.textContent=old},1300)}
  function actionId(b,type){
    const v=b.dataset[type];if(v)return v;
    const h=b.getAttribute('onclick')||'';
    const m=h.match(new RegExp(type==='practice'?'openSingleChallenge\\([\\"\\\']([^\\"\\\']+)':'shareQuestion\\([\\"\\\']([^\\"\\\']+)'));
    return m?m[1]:null;
  }
  function showToast(text){let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t)}t.textContent=text;t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),1400)}
  function handleUtilityButton(b){
    const onclick=b.getAttribute('onclick')||'';
    const isCopy=b.hasAttribute('data-copy')||/copyCode\s*\(/.test(onclick)||/^📋/.test(b.textContent.trim())&&/copy/i.test(b.textContent);
    const isPractice=b.hasAttribute('data-practice')||/openSingleChallenge\s*\(/.test(onclick)||/openPractice\s*\(/.test(onclick)||/🧠/.test(b.textContent);
    const isShare=b.hasAttribute('data-share')||/shareQuestion\s*\(/.test(onclick)||/🔗/.test(b.textContent);
    if(!isCopy&&!isPractice&&!isShare)return false;
    const id=actionId(b,'practice')||actionId(b,'share')||b.dataset.copy||b.dataset.practice||b.dataset.share;
    if(isPractice){
      if(typeof window.openSingleChallenge==='function'&&id){window.openSingleChallenge(id);return true}
      if(typeof window.openPractice==='function'&&id){window.openPractice(id);return true}
      return false;
    }
    if(isShare){
      const u=new URL(location.href);u.search='';if(id)u.searchParams.set('id',id);
      copyText(u.href).then(ok=>{showToast(ok?'Question link copied':'Copy blocked — use the link shown in the address bar')});
      return true;
    }
    const solution=b.closest('.card')?.querySelector('.solution .pre, .solution pre, [data-code]');
    const code=b.dataset.code||solution?.textContent||'';
    if(!code)return false;
    copyText(code).then(ok=>buttonFeedback(b,ok,'📋 Copy'));
    return true;
  }
  document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const handled=handleUtilityButton(b);if(handled){e.preventDefault();e.stopImmediatePropagation()}},true);

  window.DataWeaveAuth={getUser,createAccount,login,deleteAccount,logout,greetingMailto,markFirstLogin,renderAccount,copyText};document.addEventListener('DOMContentLoaded',()=>renderAccount());
})();
