// ── YEAR
document.getElementById('year').textContent = new Date().getFullYear();

// ── THEME TOGGLE
const html = document.documentElement;
const saved = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', saved);
function updateThemeBtns(){
  const isDark = html.getAttribute('data-theme') === 'dark';
  document.querySelectorAll('#themeBtn,#themeBtnMobile').forEach(b => b.textContent = isDark ? '☀️' : '🌙');
}
updateThemeBtns();
function toggleTheme(){
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeBtns();
}
document.getElementById('themeBtn').onclick = toggleTheme;
document.getElementById('themeBtnMobile').onclick = toggleTheme;
// show mobile theme btn when hamburger visible
const observer2 = new ResizeObserver(()=>{
  const mobile = window.innerWidth <= 900;
  document.getElementById('themeBtnMobile').style.display = mobile ? 'flex' : 'none';
  document.getElementById('themeBtn').style.display = mobile ? 'none' : 'flex';
});
observer2.observe(document.body);
window.dispatchEvent(new Event('resize'));

// ── NAV SCROLL + ACTIVE
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', ()=>{
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  document.getElementById('scrollTop').classList.toggle('show', window.scrollY > 400);
  let current = '';
  sections.forEach(s=>{
    if(window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navAs.forEach(a=>{
    a.classList.toggle('active', a.getAttribute('href') === '#'+current);
  });
});

// ── MOBILE MENU
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
hamburger.onclick = () => {
  mobileMenu.classList.toggle('open');
};
mobileClose.onclick = () => {
  mobileMenu.classList.remove('open');
};
document.querySelectorAll('.mobile-nav-link').forEach(a=>{
  a.onclick = ()=> mobileMenu.classList.remove('open');
});

// ── CUSTOM CURSOR
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e=>{
  mx=e.clientX; my=e.clientY;
  cursor.style.left=mx+'px'; cursor.style.top=my+'px';
});
function animRing(){
  rx+=(mx-rx)*0.12; ry+=(my-ry)*0.12;
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(animRing);
}
animRing();
document.querySelectorAll('a,button').forEach(el=>{
  el.addEventListener('mouseenter',()=>{ ring.style.transform='translate(-50%,-50%) scale(1.6)'; ring.style.opacity='0.8'; });
  el.addEventListener('mouseleave',()=>{ ring.style.transform='translate(-50%,-50%) scale(1)'; ring.style.opacity='0.5'; });
});

// ── TYPING ANIMATION
const roles = ['Frontend Developer','React Developer','UI Enthusiast','BSc CS Student','Open Source Lover'];
let ri=0, ci=0, deleting=false;
const typeEl = document.getElementById('typeText');
function type(){
  const word = roles[ri];
  if(!deleting){
    typeEl.textContent = word.slice(0,ci+1); ci++;
    if(ci===word.length){ deleting=true; setTimeout(type, 1800); return; }
  } else {
    typeEl.textContent = word.slice(0,ci-1); ci--;
    if(ci===0){ deleting=false; ri=(ri+1)%roles.length; }
  }
  setTimeout(type, deleting ? 55 : 90);
}
type();

// ── SCROLL REVEAL
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
},{threshold:0.12});
reveals.forEach(el=> io.observe(el));

// ── SKILL BARS (animate on visible)
const bars = document.querySelectorAll('.bar-fill');
const barIO = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.style.width = e.target.dataset.width + '%';
      barIO.unobserve(e.target);
    }
  });
},{threshold:0.3});
bars.forEach(b=> barIO.observe(b));

// ── GITHUB API
const GH_USER = 'shreya098-hue';
async function fetchGitHub(){
  try{
    const res = await fetch(`https://api.github.com/users/${GH_USER}`);
    const user = await res.json();
    if(user.public_repos !== undefined){
      document.getElementById('repoCount').textContent = user.public_repos;
      document.querySelector('.gh-badge').innerHTML = `<span class="gh-dot"></span> ${user.public_repos} public repos · ${user.followers||0} followers`;
    }
    const repoRes = await fetch(`https://api.github.com/users/${GH_USER}/repos?sort=updated&per_page=6`);
    const repos = await repoRes.json();
    const container = document.getElementById('ghRepos');
    if(!Array.isArray(repos) || repos.length===0){
      container.innerHTML = '<div class="gh-error">No public repositories found yet. <a href="https://github.com/'+GH_USER+'" target="_blank" style="color:var(--teal)">Visit GitHub →</a></div>';
      return;
    }
    const langColors = {JavaScript:'#f1e05a',Python:'#3572A5',HTML:'#e34c26',CSS:'#563d7c','C++':'#f34b7d',TypeScript:'#3178c6',Java:'#b07219',default:'#888'};
    container.innerHTML = repos.map(r=>`
      <a href="${r.html_url}" target="_blank" class="repo-card">
        <div class="repo-name">
          <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          ${r.name}
        </div>
        <div class="repo-desc">${r.description || 'No description provided.'}</div>
        <div class="repo-meta">
          ${r.language ? `<span class="repo-lang"><span class="lang-dot" style="background:${langColors[r.language]||langColors.default}"></span>${r.language}</span>` : ''}
          <span class="repo-stars">★ ${r.stargazers_count}</span>
          <span>${r.forks_count} forks</span>
        </div>
      </a>
    `).join('');
  } catch(err){
    document.getElementById('ghRepos').innerHTML = '<div class="gh-error">Could not load GitHub repos right now. <a href="https://github.com/'+GH_USER+'" target="_blank" style="color:var(--teal)">View on GitHub →</a></div>';
    document.getElementById('repoCount').textContent = '—';
    document.querySelector('.gh-badge').innerHTML = '<span class="gh-dot" style="background:#e24b4a"></span> GitHub offline';
  }
}
fetchGitHub();