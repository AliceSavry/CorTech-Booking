/* Lecteur commun à l'accueil et au Labo : le site reste ouvert derrière le jeu. */
(()=>{
  const dialog=document.createElement('dialog');
  dialog.className='ct-game-dialog';
  dialog.setAttribute('aria-label','Jeu COR-TECH');
  const shell=document.createElement('div');shell.className='ct-game-shell';
  const bar=document.createElement('div');bar.className='ct-game-bar';
  const back=document.createElement('button');back.className='ct-game-back';back.type='button';back.textContent='← Retour au site';
  const title=document.createElement('span');title.className='ct-game-title';title.id='ct-game-title';
  const close=document.createElement('button');close.className='ct-game-close';close.type='button';close.textContent='×';close.setAttribute('aria-label','Quitter le jeu');
  const frame=document.createElement('iframe');frame.className='ct-game-frame';frame.title='Jeu COR-TECH';frame.setAttribute('allow','fullscreen; gamepad; autoplay');frame.setAttribute('allowfullscreen','');
  bar.append(back,title,close);shell.append(bar,frame);dialog.append(shell);document.body.append(dialog);
  let previousFocus=null;let previousOverflow='';
  function leave(){if(dialog.open)dialog.close()}
  function open(file,name){
    const url=new URL(file,location.href);
    if(url.origin!==location.origin||!url.pathname.toLowerCase().endsWith('.html'))return;
    if(dialog.open)leave();
    previousFocus=document.activeElement;previousOverflow=document.body.style.overflow;
    title.textContent=name||'Jeu COR-TECH';frame.title=title.textContent;
    frame.src=url.href;document.body.style.overflow='hidden';
    dialog.showModal();back.focus();
  }
  back.addEventListener('click',leave);close.addEventListener('click',leave);
  dialog.addEventListener('close',()=>{frame.removeAttribute('src');document.body.style.overflow=previousOverflow;previousFocus?.focus?.()});
  dialog.addEventListener('cancel',event=>{event.preventDefault();leave()});
  frame.addEventListener('load',()=>{try{frame.contentWindow.addEventListener('keydown',event=>{if(event.key==='Escape')leave()})}catch{}});
  document.querySelectorAll('[data-game]').forEach(link=>link.addEventListener('click',event=>{
    if(event.defaultPrevented||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();open(link.getAttribute('href'),link.dataset.title||link.querySelector('strong')?.textContent?.trim());
  }));
  window.CorTechGamePlayer={open,close:leave};
})();
