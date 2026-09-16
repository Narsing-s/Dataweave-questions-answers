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
  function createAccount({name:n,email:e,password:p}){
    n=String(n||'').trim();e=email(e);p=String(p||'');const a=read(),nk=nameKey(n);
    if(!n||!e||!p)return{ok:false,message:'Enter username, email and password.'};
    if(n.length<3)return{ok:false,message:'Username must contain at least 3 characters.'};
    if(n.length>40)return{ok:false,message:'Username must be 40 characters or fewer.'};
    if(!/^[A-Za-z0-9][A-Za-z0-9._ -]*$/.test(n))return{ok:false,message:'Username can use letters, numbers, dots, underscores, spaces and hyphens only.'};
    if(p.length<8)return{ok:false,message:'Password must contain at least 8 characters.'};
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))return{ok:false,message:'Enter a valid email address.'};
    if(a.some(x=>x.email===e))return{ok:false,message:'This email already has an account. Use Login instead.'};
    if(a.some(x=>x.nameKey===nk))return{ok:false,message:'This username is already registered. Choose another username.'};
    const u={id:(crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random()),name:n,nameKey:nk,email:e,passwordHash:hash(p),createdAt:new Date().toISOString()};
    a.push(u);write(a);localStorage.setItem(USER_KEY,JSON.stringify({id:u.id,name:u.name,email:u.email}));return{ok:true,user:getUser()};
  }
  function login({name:n,email:e,password:p}){
    n=String(n||'').trim();e=email(e);p=String(p||'');const u=read().find(x=>x.email===e);
    if(!n||!e||!p)return{ok:false,message:'Enter username, email and password.'};
    if(!u)return{ok:false,message:'No account exists for this email. Create an account first.'};
    if(u.nameKey!==nameKey(n))return{ok:false,message:'Username does not match this account.'};
    if(u.passwordHash!==hash(p))return{ok:false,message:'Incorrect password.'};
    localStorage.setItem(USER_KEY,JSON.stringify({id:u.id,name:u.name,email:u.email}));return{ok:true,user:getUser()};
  }
  function deleteAccount({name:n,email:e,password:p}){
    n=String(n||'').trim();e=email(e);p=String(p||'');const a=read(),i=a.findIndex(x=>x.email===e);
    if(i<0)return{ok:false,message:'No account exists for this email.'};
    const u=a[i];
    if(u.nameKey!==nameKey(n)||u.passwordHash!==hash(p))return{ok:false,message:'Credentials do not match. Account was not deleted.'};
    a.splice(i,1);write(a);localStorage.removeItem(USER_KEY);localStorage.removeItem(FIRST_LOGIN_KEY);return{ok:true};
  }
  function logout(){localStorage.removeItem(USER_KEY);location.href='index.html'}
  function greetingMailto(u){const s=encodeURIComponent('Welcome to DataWeave Lab 🎉');const b=encodeURIComponent(`Hi ${u.name},\n\nWelcome to DataWeave Lab! 🎉\n\nYour first login was successful.\n\nDataWeave Lab`);return`mailto:${encodeURIComponent(u.email)}?subject=${s}&body=${b}`}
  function markFirstLogin(){if(localStorage.getItem(FIRST_LOGIN_KEY))return false;localStorage.setItem(FIRST_LOGIN_KEY,new Date().toISOString());return true}
  function renderAccount(target=document){const u=getUser();target.querySelectorAll('[data-auth-user]').forEach(x=>{x.textContent=u?u.name:'Login';x.title=u?`${u.name} · ${u.email}`:'Login'});target.querySelectorAll('[data-logout]').forEach(x=>{x.hidden=!u;x.addEventListener('click',e=>{e.preventDefault();logout()},{once:true})})}
  window.DataWeaveAuth={getUser,createAccount,login,deleteAccount,logout,greetingMailto,markFirstLogin,renderAccount};
  document.addEventListener('DOMContentLoaded',()=>renderAccount());
})();
