const menuButton=document.querySelector('#menu-button');
const mobileNav=document.querySelector('#mobile-nav');
function closeMenu(){menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Ouvrir le menu');mobileNav.hidden=true}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');mobileNav.hidden=!open});
mobileNav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
document.querySelector('#year').textContent=new Date().getFullYear();
addEventListener('scroll',()=>document.querySelector('.site-header').classList.toggle('scrolled',scrollY>12),{passive:true});
document.querySelectorAll('[data-scroll]').forEach(button=>button.addEventListener('click',()=>document.querySelector('#game-list').scrollBy({left:Number(button.dataset.scroll)*420,behavior:'smooth'})));

const svgIcon=(id)=>{const s=document.createElementNS('http://www.w3.org/2000/svg','svg');const u=document.createElementNS('http://www.w3.org/2000/svg','use');u.setAttribute('href','#'+id);s.append(u);return s};
document.querySelectorAll('[data-event-date]').forEach(card=>{if(new Date(card.dataset.eventDate+'T23:59:59')<new Date())card.remove()});
function safeLink(link){try{const url=new URL(link,location.href);return url.protocol==='https:'||url.protocol==='http:'||url.protocol==='mailto:'?url.href:null}catch{return null}}
async function loadEvents(){
  try{
    const response=await fetch('events.json',{cache:'no-store'});if(!response.ok)throw Error('events');
    const data=await response.json();if(!Array.isArray(data))throw Error('format');
    const today=new Date();today.setHours(0,0,0,0);
    const events=data.filter(e=>/^\d{4}-\d{2}-\d{2}$/.test(e.date)&&new Date(e.date+'T23:59:59')>=today&&e.title).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4);
    if(!events.length){const list=document.querySelector('#event-list');list.replaceChildren();const p=document.createElement('p');p.className='empty-message';p.textContent='Le programme arrive bientôt. Écrivez-nous pour connaître les prochains rendez-vous.';list.append(p);return}
    const list=document.querySelector('#event-list');list.replaceChildren();
    events.forEach(event=>{
      const date=new Date(event.date+'T12:00:00');const card=document.createElement('article');card.className='event-card';
      const top=document.createElement('div');top.className='event-top';
      const box=document.createElement('div');box.className='date-box';
      const number=document.createElement('strong');number.textContent=String(date.getDate()).padStart(2,'0');
      const month=document.createElement('span');month.textContent=new Intl.DateTimeFormat('fr-FR',{month:'short'}).format(date).replace('.','').toUpperCase();
      box.append(number,month);top.append(box,svgIcon('calendar'));
      const body=document.createElement('div');body.className='event-body';
      const title=document.createElement('h3');title.textContent=event.title;body.append(title);
      if(event.description){const p=document.createElement('p');p.className='event-description';p.textContent=event.description;body.append(p)}
      if(event.time){const p=document.createElement('p');p.className='event-time';p.textContent='◉ '+event.time;body.append(p)}
      if(event.place){const p=document.createElement('p');p.textContent='⌖ '+event.place;body.append(p)}
      if(Number.isFinite(event.price)&&Number.isFinite(event.capacity)){const facts=document.createElement('div');facts.className='event-facts';for(const label of [event.price===0?'Gratuit':event.price+' €','Jauge : '+event.capacity+' pers.']){const span=document.createElement('span');span.textContent=label;facts.append(span)}body.append(facts)}
      const bottom=document.createElement('div');bottom.className='event-bottom';
      const link=safeLink(event.link);if(link){const a=document.createElement('a');a.href=link;a.textContent=event.linkText||'En savoir plus →';bottom.append(a)}
      card.append(top,body,bottom);list.append(card);
    });
  }catch(e){/* La page conserve un message lisible hors ligne. */}
}
async function loadNews(){
  try{
    const response=await fetch('news.html');if(!response.ok)throw Error('news');
    const html=new DOMParser().parseFromString(await response.text(),'text/html');
    const articles=[...html.querySelectorAll('.news-container > article.news-card')].slice(0,3);
    if(!articles.length)return;
    const list=document.querySelector('#news-list');list.replaceChildren();
    articles.forEach(article=>{
      const card=document.createElement('article');card.className='news-card';
      const thumb=document.createElement('div');thumb.className='news-thumb';
      const sourceImage=article.querySelector('img.news-image');
      if(sourceImage){const src=sourceImage.getAttribute('src');const valid=safeLink(src);if(valid){const img=document.createElement('img');img.src=valid;img.alt=sourceImage.getAttribute('alt')||'';img.loading='lazy';thumb.append(img)}}
      if(!thumb.childNodes.length)thumb.textContent='✦';
      const body=document.createElement('div');body.className='news-body';
      const meta=document.createElement('div');meta.className='news-meta';meta.textContent=[article.querySelector('.news-tag')?.textContent,article.querySelector('.news-date')?.textContent].filter(Boolean).join(' · ');
      const title=document.createElement('h3');title.textContent=article.querySelector('.news-title')?.textContent?.trim()||'Actualité COR-TECH';
      const summary=document.createElement('p');summary.textContent=(article.querySelector('.news-content')?.textContent||'').replace(/\s+/g,' ').trim().slice(0,135)+'…';
      const link=document.createElement('a');link.href='news.html';link.textContent='Lire la suite →';
      body.append(meta,title,summary,link);card.append(thumb,body);list.append(card);
    });
  }catch(e){/* L’accès direct à news.html reste disponible. */}
}
loadEvents();loadNews();
