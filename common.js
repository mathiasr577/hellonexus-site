(() => {
'use strict';
const root = document.documentElement;
const top = document.querySelector('.top');
const onScroll = () => top && top.classList.toggle('stuck', scrollY > 20);
addEventListener('scroll', onScroll, { passive: true }); onScroll();
const yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();
function scalePreviews() { document.querySelectorAll('[data-preview]').forEach(s => { const f = s.querySelector('iframe'); if (f) f.style.transform = `scale(${s.clientWidth / 1440})`; }); }
addEventListener('resize', scalePreviews);
const fio = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; const f = e.target.querySelector('iframe'); if (f && !f.src) f.src = f.dataset.src; fio.unobserve(e.target); }), { rootMargin: '300px' }) : null;
document.querySelectorAll('[data-preview]').forEach(s => { const f = s.querySelector('iframe'); f.addEventListener('load', () => { if (f.src) s.classList.add('ready'); }); fio ? fio.observe(s) : (f.src = f.dataset.src); });
scalePreviews();

// ── scroll-blended page background (black → purple → green) ──
(function(){
  const secs=[...document.querySelectorAll('[data-bg]')]; if(!secs.length) return;
  const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
  const cols=secs.map(s=>hex(s.dataset.bg));
  let tick=false;
  function paint(){
    tick=false;
    const y=scrollY+innerHeight*.45;
    const c=secs.map(s=>s.getBoundingClientRect().top+scrollY+s.offsetHeight/2);
    let i=c.findIndex((v,k)=>k===c.length-1||y<c[k+1]); let rgb;
    if(y<=c[0]) rgb=cols[0]; else if(i===c.length-1&&y>=c[i]) rgb=cols[i]; else{
      let t=(y-c[i])/(c[i+1]-c[i]);
      rgb=cols[i].map((v,k)=>Math.round(v+(cols[i+1][k]-v)*t));
    }
    document.body.style.setProperty('--page-bg',`rgb(${rgb})`);
  }
  const req=()=>paint();
  addEventListener('scroll',req,{passive:true});addEventListener('resize',req);addEventListener('load',req);paint();
})();
// ── scroll effects: progress bar, ghost-word drift, image parallax, staggered reveal ──
(function(){
  const bar=document.createElement('div');bar.className='progress';bar.setAttribute('aria-hidden','true');document.body.append(bar);
  const bands=[...document.querySelectorAll('[data-word]')];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function fx(){
    const max=document.documentElement.scrollHeight-innerHeight;
    document.documentElement.style.setProperty('--sp',max>0?Math.min(1,scrollY/max):0);
    if(reduce) return;
    bands.forEach(b=>{
      const r=b.getBoundingClientRect();
      const p=Math.min(1,Math.max(0,(innerHeight-r.top)/(innerHeight+r.height)));
      b.style.setProperty('--p',p.toFixed(3));
      const im=b.querySelector('.band-img');
      if(im) im.style.setProperty('--py',((.5-p)*70).toFixed(1)+'px');
    });
  }
  addEventListener('scroll',fx,{passive:true});addEventListener('resize',fx);addEventListener('load',fx);fx();
  const targets=document.querySelectorAll('.band-grid>*,.head,.demo,.contact>*,.steps li,.reel-col,.ph');
  const io2='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io2.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'}):null;
  targets.forEach((el,i)=>{el.classList.add('fx');el.style.transitionDelay=((i%4)*90)+'ms';io2?io2.observe(el):el.classList.add('in')});
})();

})();
