const menu=document.querySelector('#menu-button'),mobile=document.querySelector('#mobile-nav');
function closeMenu(){menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Ouvrir le menu');if(mobile)mobile.hidden=true}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');mobile.hidden=!open});
mobile?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
addEventListener('scroll',()=>document.querySelector('.site-header')?.classList.toggle('scrolled',scrollY>12),{passive:true});
document.querySelector('#year').textContent=new Date().getFullYear();
document.querySelectorAll('[data-event-date]').forEach(card=>{if(new Date(card.dataset.eventDate+'T23:59:59')<new Date())card.remove()});
document.querySelectorAll('.filter-btn').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.filter-btn').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  const filter=button.dataset.filter;
  document.querySelectorAll('.library-card').forEach(card=>card.hidden=filter!=='all'&&card.dataset.category!==filter);
}));
const news=document.querySelector('.news-page-list');
if(news){news.classList.add('enhanced');news.querySelectorAll('article.news-card').forEach((article,i)=>{
  const button=document.createElement('button');button.type='button';button.className='news-toggle';button.textContent='Lire l’article →';
  const content=article.querySelector('.news-content');
  if(!content)return;
  const contentId='article-'+(i+1);content.id=contentId;button.setAttribute('aria-controls',contentId);button.setAttribute('aria-expanded','false');
  article.querySelector('.news-title')?.after(button);
  button.addEventListener('click',()=>{const expanded=article.classList.toggle('expanded');button.textContent=expanded?'Réduire l’article ↑':'Lire l’article →';button.setAttribute('aria-expanded',String(expanded))});
})}
const upcoming=document.querySelector('#all-events');
if(upcoming){fetch('events.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(events=>{
  const today=new Date();today.setHours(0,0,0,0);
  const valid=events.filter(e=>/^\d{4}-\d{2}-\d{2}$/.test(e.date)&&new Date(e.date+'T23:59:59')>=today&&e.title).sort((a,b)=>a.date.localeCompare(b.date));
  if(!valid.length){upcoming.replaceChildren();const p=document.createElement('p');p.className='empty-message';p.textContent='Le programme arrive bientôt. Contactez-nous pour les prochaines dates.';upcoming.append(p);return}
  upcoming.replaceChildren();
  valid.forEach(event=>{
    const date=new Date(event.date+'T12:00:00'),article=document.createElement('article');article.className='event-card';
    const top=document.createElement('div');top.className='event-top';const box=document.createElement('div');box.className='date-box';
    const day=document.createElement('strong');day.textContent=String(date.getDate()).padStart(2,'0');
    const month=document.createElement('span');month.textContent=new Intl.DateTimeFormat('fr-FR',{month:'short'}).format(date).replace('.','').toUpperCase();
    box.append(day,month);top.append(box);
    const body=document.createElement('div');body.className='event-body';const title=document.createElement('h3');title.textContent=event.title;body.append(title);
    if(event.description){const p=document.createElement('p');p.className='event-description';p.textContent=event.description;body.append(p)}
    for(const [value,className] of [[event.time,'event-time'],[event.place,'']])if(value){const p=document.createElement('p');p.className=className;p.textContent=value;body.append(p)}
    if(Number.isFinite(event.price)&&Number.isFinite(event.capacity)){const facts=document.createElement('div');facts.className='event-facts';for(const label of [event.price===0?'Gratuit':event.price+' €','Jauge : '+event.capacity+' pers.']){const span=document.createElement('span');span.textContent=label;facts.append(span)}body.append(facts)}
    const bottom=document.createElement('div');bottom.className='event-bottom';
    if(event.link){try{const url=new URL(event.link,location.href);if(['https:','http:','mailto:'].includes(url.protocol)){const a=document.createElement('a');a.href=url.href;a.textContent=event.linkText||'En savoir plus →';bottom.append(a)}}catch{}}
    article.append(top,body,bottom);upcoming.append(article);
  });
}).catch(()=>{})}
