const form=document.querySelector('#registration-form');
const eventSelect=document.querySelector('#event-select');
const status=document.querySelector('#registration-status');
const requestBox=document.querySelector('#request-copy');
const requestText=document.querySelector('#request-text');
const selectedEvent=new URLSearchParams(location.search).get('event');
const dateIsFuture=date=>/^\d{4}-\d{2}-\d{2}$/.test(date)&&new Date(date+'T23:59:59')>=new Date();
function selectRequestedEvent(){
  if(!selectedEvent)return;
  const option=[...eventSelect.options].find(item=>item.value===selectedEvent||item.dataset.date===selectedEvent);
  if(option)eventSelect.value=option.value;
}
function emptyEvents(){
  eventSelect.replaceChildren(new Option('Aucun événement annoncé pour le moment',''));
  eventSelect.disabled=true;document.querySelector('#send-request').disabled=true;
  status.textContent='Aucun événement à venir n’est disponible. Vous pouvez contacter COR-TECH pour connaître le programme.';
}
function cleanFallback(){
  for(const option of [...eventSelect.options])if(option.dataset.date&&!dateIsFuture(option.dataset.date))option.remove();
  if(![...eventSelect.options].some(option=>option.value))emptyEvents();
  else selectRequestedEvent();
}
async function updateEventOptions(){
  try{
    const response=await fetch('events.json',{cache:'no-store'});if(!response.ok)throw Error('calendar');
    const events=await response.json();if(!Array.isArray(events))throw Error('calendar');
    const future=events.filter(event=>event.title&&dateIsFuture(event.date)).sort((a,b)=>a.date.localeCompare(b.date));
    if(!future.length){emptyEvents();return}
    eventSelect.replaceChildren(new Option('Choisir un événement',''));
    for(const event of future){
      const day=new Date(event.date+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});
      const option=new Option([event.title,day,event.time].filter(Boolean).join(' · '),event.id||event.date);
      option.dataset.date=event.date;eventSelect.add(option);
    }
    selectRequestedEvent();
  }catch{cleanFallback()}
}
function requestBody(){
  const event=eventSelect.selectedOptions[0]?.textContent?.trim()||'';
  const name=document.querySelector('#full-name').value.trim();
  const email=document.querySelector('#email').value.trim();
  const phone=document.querySelector('#phone').value.trim();
  const places=document.querySelector('#places').value;
  const message=document.querySelector('#message').value.trim();
  return [
    'Bonjour COR-TECH,',
    '',
    'Je souhaite demander une inscription à l’événement suivant :',
    event,
    '',
    'Nom et prénom : '+name,
    'Adresse e-mail : '+email,
    'Téléphone : '+(phone||'Non renseigné'),
    'Nombre de participants : '+places,
    'Précision : '+(message||'Aucune'),
    '',
    'Merci de me confirmer si mon inscription est possible.',
    '',
    name
  ].join('\n');
}
function validatedRequest(){
  if(!form.reportValidity())return null;
  if(!eventSelect.value){eventSelect.focus();return null}
  return requestBody();
}
form.addEventListener('submit',event=>{
  event.preventDefault();
  const body=validatedRequest();if(!body)return;
  const subject='Demande d’inscription COR-TECH — '+eventSelect.selectedOptions[0].textContent.trim();
  status.textContent='Votre messagerie va s’ouvrir. Envoyez l’e-mail pour transmettre votre demande ; attendez ensuite la confirmation de COR-TECH.';
  location.href='mailto:contact@cor-tech.fr?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
});
document.querySelector('#show-request').addEventListener('click',()=>{
  const body=validatedRequest();if(!body)return;
  requestText.value=body;requestBox.hidden=false;requestText.focus();requestText.select();
  status.textContent='Copiez ce texte dans un e-mail adressé à contact@cor-tech.fr, puis envoyez-le.';
});
document.querySelector('#copy-request').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(requestText.value);status.textContent='Texte copié. Envoyez-le à contact@cor-tech.fr depuis votre messagerie.'}
  catch{requestText.focus();requestText.select();status.textContent='Sélectionnez le texte puis copiez-le dans votre messagerie.'}
});
updateEventOptions();
