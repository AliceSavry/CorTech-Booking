const monthLabel=document.querySelector('#calendar-month');
const calendarDays=document.querySelector('#calendar-days');
const calendarDetails=document.querySelector('#calendar-details');
const prevMonth=document.querySelector('#calendar-prev');
const nextMonth=document.querySelector('#calendar-next');
let calendarEvents=[];
let shownMonth;
let firstMonth;
let lastMonth;
let selectedDate;
const dateKey=(year,month,day)=>`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
const monthKey=date=>Number(date.slice(0,4))*12+Number(date.slice(5,7))-1;
const fullDate=date=>new Date(date+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});
const priceText=price=>Number(price)===0?'Gratuit':`${price} €`;
const isFuture=date=>/^\d{4}-\d{2}-\d{2}$/.test(date)&&new Date(date+'T23:59:59')>=new Date();
function fallbackEvents(){
  return [...document.querySelectorAll('#all-events .event-card[data-event-date]')].map(card=>({
    id:new URL(card.querySelector('.event-bottom a')?.href||location.href).searchParams.get('event'),
    date:card.dataset.eventDate,
    title:card.querySelector('h3')?.textContent,
    description:card.querySelector('.event-description')?.textContent,
    time:card.querySelector('.event-time')?.textContent,
    price:Number(card.querySelector('[data-price]')?.dataset.price),
    capacity:Number(card.querySelector('[data-capacity]')?.dataset.capacity)
  }));
}
function showDate(date){
  selectedDate=date;
  calendarDetails.replaceChildren();
  const items=calendarEvents.filter(event=>event.date===date);
  if(!items.length){const note=document.createElement('p');note.textContent='Aucun événement annoncé pour cette date.';calendarDetails.append(note);return}
  const heading=document.createElement('h4');heading.textContent=fullDate(date);calendarDetails.append(heading);
  items.forEach(event=>{
    const article=document.createElement('article');article.className='calendar-event';
    const details=document.createElement('div');
    const title=document.createElement('strong');title.textContent=event.title;details.append(title);
    if(event.description){const description=document.createElement('p');description.textContent=event.description;details.append(description)}
    const facts=document.createElement('p');facts.className='calendar-event-facts';facts.textContent=[event.time,priceText(event.price),`Jauge : ${event.capacity} pers.`].filter(Boolean).join(' · ');details.append(facts);
    article.append(details);
    if(event.id){const link=document.createElement('a');link.href='inscriptions.html?event='+encodeURIComponent(event.id);link.textContent='Demander une inscription →';article.append(link)}
    calendarDetails.append(article);
  });
}
function drawMonth(){
  const year=Math.floor(shownMonth/12),month=shownMonth%12;
  monthLabel.textContent=new Date(year,month,1).toLocaleDateString('fr-FR',{month:'long',year:'numeric'});
  prevMonth.disabled=shownMonth<=firstMonth;nextMonth.disabled=shownMonth>=lastMonth;
  calendarDays.replaceChildren();
  const daysInMonth=new Date(year,month+1,0).getDate();
  const offset=(new Date(year,month,1).getDay()+6)%7;
  const weeks=Math.ceil((offset+daysInMonth)/7);
  const today=dateKey(new Date().getFullYear(),new Date().getMonth(),new Date().getDate());
  for(let week=0;week<weeks;week++){
    const row=document.createElement('tr');
    for(let weekday=0;weekday<7;weekday++){
      const cell=document.createElement('td');
      const day=week*7+weekday-offset+1;
      if(day>=1&&day<=daysInMonth){
        const date=dateKey(year,month,day);
        const items=calendarEvents.filter(event=>event.date===date);
        if(items.length){
          const button=document.createElement('button');button.type='button';button.className='calendar-day has-event';
          button.setAttribute('aria-label',`${fullDate(date)} · ${items.length} événement${items.length>1?'s':''}`);
          button.setAttribute('aria-pressed',String(date===selectedDate));
          if(date===today)button.setAttribute('aria-current','date');
          const number=document.createElement('span');number.textContent=day;
          const dot=document.createElement('span');dot.className='calendar-dot';dot.setAttribute('aria-hidden','true');
          button.append(number,dot);button.addEventListener('click',()=>{showDate(date);drawMonth()});cell.append(button);
        }else{const number=document.createElement('span');number.className='calendar-day';number.textContent=day;if(date===today)number.setAttribute('aria-current','date');cell.append(number)}
      }
      row.append(cell);
    }
    calendarDays.append(row);
  }
  const monthItems=calendarEvents.filter(event=>monthKey(event.date)===shownMonth);
  if(!monthItems.length){selectedDate=null;calendarDetails.replaceChildren();const note=document.createElement('p');note.textContent='Aucun événement annoncé ce mois-ci.';calendarDetails.append(note)}
  else if(!selectedDate||monthKey(selectedDate)!==shownMonth)showDate(monthItems[0].date);
}
async function loadCalendar(){
  let events;
  try{const response=await fetch('events.json',{cache:'no-store'});if(!response.ok)throw Error('calendar');events=await response.json();if(!Array.isArray(events))throw Error('calendar')}
  catch{events=fallbackEvents()}
  calendarEvents=events.filter(event=>event.title&&event.id&&isFuture(event.date)).sort((a,b)=>a.date.localeCompare(b.date));
  if(!calendarEvents.length){monthLabel.textContent='Pas de rendez-vous à venir';prevMonth.disabled=true;nextMonth.disabled=true;calendarDetails.textContent='Consultez la liste des événements ou contactez COR-TECH pour connaître les prochaines dates.';return}
  firstMonth=monthKey(calendarEvents[0].date);lastMonth=monthKey(calendarEvents[calendarEvents.length-1].date);
  shownMonth=firstMonth;drawMonth();
}
prevMonth.addEventListener('click',()=>{if(shownMonth>firstMonth){shownMonth--;selectedDate=null;drawMonth()}});
nextMonth.addEventListener('click',()=>{if(shownMonth<lastMonth){shownMonth++;selectedDate=null;drawMonth()}});
loadCalendar();
