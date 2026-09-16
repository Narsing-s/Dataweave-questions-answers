(() => {
  const KEY = 'dataweave-lab-user';
  const FIRST_LOGIN_KEY = 'dataweave-lab-first-login-greeted';

  function getUser() {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (_) { return null; }
  }

  function saveUser(user) {
    localStorage.setItem(KEY, JSON.stringify(user));
  }

  function logout() {
    localStorage.removeItem(KEY);
    window.location.href = 'login.html';
  }

  function greetingMailto(user) {
    const subject = encodeURIComponent('Welcome to DataWeave Lab 🎉');
    const body = encodeURIComponent(
      `Hi ${user.name},\n\nWelcome to DataWeave Lab! 🎉\n\nYour first login was successful. Start learning DataWeave with practical questions, input/output examples, and challenges.\n\nHappy learning!\nDataWeave Lab`
    );
    return `mailto:${encodeURIComponent(user.email)}?subject=${subject}&body=${body}`;
  }

  function markFirstLogin(user) {
    if (localStorage.getItem(FIRST_LOGIN_KEY)) return false;
    localStorage.setItem(FIRST_LOGIN_KEY, new Date().toISOString());
    return true;
  }

  window.DataWeaveAuth = { getUser, saveUser, logout, greetingMailto, markFirstLogin };

  document.addEventListener('DOMContentLoaded', () => {
    const user = getUser();
    document.querySelectorAll('[data-auth-user]').forEach(el => {
      el.textContent = user ? user.name : 'Login';
    });
    document.querySelectorAll('[data-logout]').forEach(el => {
      el.addEventListener('click', e => { e.preventDefault(); logout(); });
    });
  });
})();
