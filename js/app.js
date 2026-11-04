import { AdminAuth, ADMIN_HOLD_MS } from './admin-auth.js?v=archive404-auth-5';
import { menuMarkup, profileMarkup, favouriteButton, stockCard } from './presentation.js?v=archive404-auth-5';
import { createRepository } from './storage.js?v=archive404-auth-5';
import { uid, now, totalRemaining, availableProfiles, brewOne, adjustBatch, undoEvent, surpriseCandidates, validateBackup, priceFields, toggleFavourite, PRICE_CURRENCIES, assertShelfCapacity } from './domain.js?v=archive404-auth-5';

const placeholder = 'assets/coffee-placeholder.svg';
const seed = { schemaVersion:1, profiles:[
  {id:'ethiopia-guji',name:'Ethiopia Guji',origin:'Guji, Ethiopia',producer:'Smallholder farmers',process:'Natural',roastLevel:'Light',roastMethod:'Omni roast',notes:'Blueberry · jasmine · cacao nib',image:placeholder,brew:'V60 · 15g coffee · 250g water · 94°C · 2:45',onShelf:true,archived:false},
  {id:'colombia-huila',name:'Colombia Huila',origin:'Huila, Colombia',producer:'Finca El Paraíso',process:'Washed',roastLevel:'Medium-light',roastMethod:'Filter roast',notes:'Red apple · panela · almond',image:placeholder,brew:'Aeropress · 16g coffee · 230g water · 92°C · 2:00',onShelf:true,archived:false},
  {id:'kenya-kirinyaga',name:'Kenya Kirinyaga',origin:'Kirinyaga, Kenya',producer:'Kii Factory',process:'Washed',roastLevel:'Light',roastMethod:'Filter roast',notes:'Blackcurrant · grapefruit · brown sugar',image:placeholder,brew:'Kalita 185 · 15g coffee · 250g water · 95°C · 3:00',onShelf:false,archived:false}
], batches:[
  {id:'batch-ethiopia-1',profileId:'ethiopia-guji',purchaseDate:'2026-10-20',roastDate:'2026-10-17',initialServings:12,remainingServings:8,archived:false},
  {id:'batch-colombia-1',profileId:'colombia-huila',purchaseDate:'2026-10-22',roastDate:'2026-10-19',initialServings:10,remainingServings:5,archived:false},
  {id:'batch-kenya-1',profileId:'kenya-kirinyaga',purchaseDate:'2026-10-25',roastDate:'2026-10-21',initialServings:8,remainingServings:6,archived:false}
], history:[] };

const repo = createRepository(); let state = await repo.load() || structuredClone(seed); let view = location.hash.slice(1) || 'menu';
const app = document.querySelector('#app'), dialog = document.querySelector('#dialog'), dialogBody = document.querySelector('#dialog-body'), toast = document.querySelector('#toast');
const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const image = p => esc(p.image || placeholder); const profile = id => state.profiles.find(p => p.id === id);
let persistedState=structuredClone(state);
const auth=new AdminAuth();
let setupToken='';
if(view.startsWith('setup=')){const token=view.slice(6);if(/^[a-f0-9]{64}$/.test(token))setupToken=token;view='admin';history.replaceState(null,'','#admin');}
let adminRenderId=0;
const save = async message => {try{await repo.save(state);persistedState=structuredClone(state);render();if(message)notify(message);return true;}catch(error){state=structuredClone(persistedState);render();notify('Could not save: '+error.message);return false;}};
let toastTimer;
const notify = message => { clearTimeout(toastTimer); toast.textContent=message; toast.classList.add('show'); toastTimer=setTimeout(()=>toast.classList.remove('show'),6500); };



const adminPrice=p=>p.pricePer100g==null?'Price not set':`${p.currency==='$'?'$':esc(p.currency||'$')+' '}${Number(p.pricePer100g).toFixed(2)} / 100 g`;
async function favourite(id){state=toggleFavourite(state,id);await save(profile(id).favourite?'Added to favourites':'Removed from favourites');if(dialog.open&&dialogBody.querySelector('[data-favourite]')){dialog.close();openProfile(id);}}


function renderMenu(){app.innerHTML=menuMarkup(state);}
function renderFavourites(){const items=state.profiles.filter(p=>p.favourite&&!p.archived);app.innerHTML=`<section class="menu-section"><h2>Favourites</h2><div class="stock-list">${items.map((p,i)=>stockCard(state,p,i)).join('')||'<p class="empty-stock">Tap a coffee’s heart to keep it here.</p>'}</div><p class="detail-links"><a href="#menu">Back to the menu</a><a href="#admin">Manage inventory</a></p></section>`;}
let draw = [], spinTimer;
const wheelColors=['#b9bab4','#e2e2dd','#a2a49b','#d2d3cb','#c1c3ba','#eeeee9'];
const surpriseDialog=document.querySelector('#surprise-dialog');
function renderSurprise(){clearTimeout(spinTimer);draw=surpriseCandidates(state);document.querySelector('#surprise-body').innerHTML=`<section class="surprise-page"><header class="surprise-intro"><div class="eyebrow">Leave it to chance</div><h2 id="surprise-title">Your next discovery.</h2><p>Every available coffee. An equal chance for each, wherever you keep it.</p></header><div class="draw-layout"><div class="wheel-stage"><div class="pointer"></div><div class="wheel" id="wheel"></div></div><div class="draw-panel"><div class="eyebrow">${draw.length} coffees in the draw</div><div id="draw-list"></div><div class="result" id="result" aria-live="polite"><p>${draw.length?'A good cup is one spin away.':'Add or replenish a coffee to get started.'}</p></div><button class="primary spin-button" id="spin" ${draw.length?'':'disabled'}>Spin the wheel ↻</button><p class="quiet">Only brewing uses a serving.</p></div></div></section>`;paintDraw();document.querySelector('#spin').onclick=spin;}
function openSurprise(){renderSurprise();if(!surpriseDialog.open)surpriseDialog.showModal();}
function paintDraw(){const n=draw.length, wheel=document.querySelector('#wheel');wheel.style.background=n?`conic-gradient(${draw.map((p,i)=>`${wheelColors[i%wheelColors.length]} ${i*100/n}% ${(i+1)*100/n}%`).join(',')})`:'#d8e0eb';wheel.innerHTML=draw.map((p,i)=>`<span class="wheel-label" style="--angle:${(i+.5)*360/n}deg">${i+1}</span>`).join('');document.querySelector('#draw-list').innerHTML=draw.map((p,i)=>`<div class="draw-item"><span class="draw-number" style="background:${wheelColors[i%wheelColors.length]}">${i+1}</span><div><b>${esc(p.name)}</b><small>${p.onShelf?'On the shelf':'Other in stock'} · ${totalRemaining(state,p.id)} servings</small></div><span class="draw-chance">1 in ${n}</span></div>`).join('');}
function renderAdminContent(){const rows=state.profiles.map(p=>{const rem=totalRemaining(state,p.id), archived=p.archived;return `<article class="admin-row ${archived?'archived':''}"><img src="${image(p)}" alt=""><div><h3>${esc(p.name)}</h3><div class="meta">${esc(p.origin)} · ${rem} remaining · ${archived?'Archived':rem?'Active':'Finished'}</div><div class="admin-price">${adminPrice(p)}</div></div><div class="row-actions">${favouriteButton(p)}<button class="secondary" data-edit="${p.id}">Edit</button><button class="secondary" data-replenish="${p.id}">Replenish</button><button class="secondary" data-adjust="${p.id}">Adjust</button><button class="${archived?'secondary':'danger'}" data-archive="${p.id}">${archived?'Restore':'Archive'}</button></div></article>`}).join('');const history=state.history.slice(0,30).map(e=>{const p=profile(e.profileId);return `<div class="history-item"><div><b>${e.type==='brew'?'Brewed 1 serving':e.type==='undo'?'Undid change':'Adjusted stock'}</b> · ${esc(p?.name||'Deleted coffee')} ${e.autoArchived?'· automatically archived ':''}${e.undone?'(undone)':''}<br><time>${new Date(e.at).toLocaleString()}</time></div>${e.type!=='undo'&&!e.undone?`<button class="secondary" data-undo="${e.id}">Undo</button>`:''}</div>`}).join('');app.innerHTML=`<header class="admin-head"><div><div class="eyebrow">Archive 404 · L13 - W105/W106</div><h1>Inventory</h1><p>Profiles are reusable. Replenishment creates a new stock batch and preserves history.</p></div><div class="toolbar"><a class="secondary" href="#menu">Back to menu</a><a class="secondary" href="#favourites">Favourites</a><button class="secondary" id="admin-signout">Sign out</button><button class="primary" id="add-profile">Add coffee</button><button class="secondary" id="export">Export backup</button><button class="secondary" id="import">Import backup</button></div></header>${state.profiles.filter(p=>p.onShelf&&!p.archived).length>2?'<p class="inventory-warning">More than two legacy shelf assignments are saved. No records have been moved; adjust the assignments here. Additional available beans remain accessible in the stock list.</p>':''}<div class="admin-list">${rows||'<div class="empty">No coffee profiles yet.</div>'}</div><section class="history"><div class="section-head"><h2>Recent history</h2></div>${history||'<div class="empty">Brew and adjustment events appear here.</div>'}</section>`;bindAdmin();guardAdminControls();document.querySelector('#admin-signout').onclick=async()=>{const pending=auth.logout();render();await pending;};}
function renderSignIn(message=''){
  const setup=!!setupToken;
  app.innerHTML=`<section class="admin-login"><div class="eyebrow">Archive 404</div><h1>${setup?'Create your admin account':'Admin sign in'}</h1><p>${setup?'Choose a username and a password of at least 12 characters. This owner setup link can be used once.':'Sign in to manage your coffee collection.'}</p><form id="admin-login-form"><label>Username<input name="username" autocomplete="username" required pattern="[A-Za-z][A-Za-z0-9._-]{2,31}" minlength="3" maxlength="32" autocapitalize="none" spellcheck="false"></label><label>Password<input name="password" type="password" autocomplete="${setup?'new-password':'current-password'}" required minlength="${setup?12:1}" maxlength="128"></label>${setup?'<label>Confirm password<input name="confirmation" type="password" autocomplete="new-password" required minlength="12" maxlength="128"></label>':''}<p id="login-error" role="alert">${esc(message)}</p><button class="primary" type="submit">${setup?'Create admin account':'Sign in'}</button></form><p class="detail-links"><a href="#menu">Back to the menu</a></p></section>`;
  document.querySelector('#admin-login-form').onsubmit=async e=>{
    e.preventDefault();const form=e.currentTarget,button=form.querySelector('button'),error=form.querySelector('#login-error');
    if(button.disabled)return;
    const username=form.elements.username.value,password=form.elements.password.value;
    if(setup&&password!==form.elements.confirmation.value){error.textContent='The passwords do not match.';return;}
    button.disabled=true;error.textContent='';
    form.elements.password.value='';if(setup)form.elements.confirmation.value='';
    try{await auth.login(username,password,setupToken);setupToken='';if(view==='admin')render();}
    catch(err){error.textContent=err.message;button.disabled=false;}
  };
}
async function renderAdmin(){
  const attempt=++adminRenderId;
  if(!auth.active())return renderSignIn();
  app.innerHTML='<section class="empty"><p>Verifying admin access…</p></section>';
  const verified=await auth.check();
  if(view!=='admin'||attempt!==adminRenderId)return;
  if(!verified)return renderSignIn('Please sign in again. An online connection is required.');
  renderAdminContent();
}
async function requireAdmin(){
  if(await auth.check())return true;
  if(dialog.open)dialog.close();view='admin';location.hash='admin';renderSignIn('Please sign in again before changing inventory.');return false;
}
function guardAdminControls(){
  for(const button of app.querySelectorAll('#add-profile,#export,#import,[data-edit],[data-replenish],[data-adjust],[data-archive],[data-undo]')){
    const action=button.onclick;button.onclick=async e=>{if(button.disabled)return;button.disabled=true;try{if(await requireAdmin())await action.call(button,e);}finally{button.disabled=false;}};
  }
}
setInterval(()=>{if(view==='admin'&&!auth.active()&&document.querySelector('.admin-list')){if(dialog.open)dialog.close();renderSignIn('Your session expired. Please sign in again.');}},15000);

function render(){if(view==='admin')renderAdmin();else if(view==='favourites')renderFavourites();else renderMenu();if(view==='surprise')openSurprise();}
function go(next){view=next;location.hash=next;render();scrollTo({top:0,behavior:'smooth'});}

function openProfile(id){const p=profile(id);if(!p)return;dialogBody.innerHTML=profileMarkup(state,p);if(!dialog.open)dialog.showModal();}
let brewing=false;
const actionDialog=document.querySelector('#action-dialog');
function confirmAction(title,message,label='Confirm'){
  if(actionDialog.open)return Promise.resolve(false);
  document.querySelector('#action-title').textContent=title;
  document.querySelector('#action-message').textContent=message;
  const confirm=document.querySelector('#action-confirm');confirm.textContent=label;confirm.disabled=false;
  return new Promise(resolve=>{
    let resolved=false;const settle=value=>{if(resolved)return;resolved=true;confirm.disabled=true;actionDialog.close();resolve(value);};
    confirm.onclick=()=>settle(true);
    document.querySelector('#action-cancel').onclick=()=>settle(false);
    actionDialog.onclose=()=>{if(!resolved){resolved=true;resolve(false);}};
    actionDialog.showModal();
  });
}
async function undoChange(eventId,message='Change undone'){const result=undoEvent(state,eventId);state=result.state;await save(message+(result.restoredToStock?' · returned to Others in Stock because the shelf is full':''));}
async function brew(id){
  if(brewing)return;const p=profile(id);if(!p||p.archived||totalRemaining(state,id)<1)return notify('No servings available');
  brewing=true;
  try{
    const confirmed=await confirmAction('Brew a cup',`Record one brewed serving of ${p.name}? This will deduct 1 serving from your inventory.${totalRemaining(state,id)===1?' This is the last serving, so the bean will move to archive.':''}`,'Confirm brew');
    if(!confirmed)return;
    const commit=async()=>{const latest=await repo.load()||state;const result=brewOne(latest,id);if(!result.changed)throw new Error('No servings available');await repo.save(result.state);return result.state;};
    state=navigator.locks?await navigator.locks.request('coffee-menu-stock',commit):await commit();
    persistedState=structuredClone(state);
    if(dialog.open)dialog.close();if(surpriseDialog.open)surpriseDialog.close();
    if(view==='surprise')view='menu';render();notify(`Brew recorded · ${p.name}${profile(id).archived?' · moved to archive':''}`);
    const undo=document.createElement('button');undo.className='toast-undo';undo.textContent='Undo';
    const eventId=state.history[0].id;undo.onclick=()=>undoChange(eventId,'Serving restored');toast.append(undo);
  }catch(error){notify('Brew not recorded: '+error.message);}finally{brewing=false;}
}
function spin(){if(!draw.length)return;const wheel=document.querySelector('#wheel'),button=document.querySelector('#spin');button.disabled=true;button.textContent='Finding your coffee…';const index=Math.floor(Math.random()*draw.length), chosen=draw[index];wheel.style.transform=`rotate(${1080+360-(index+.5)*360/draw.length}deg)`;spinTimer=setTimeout(()=>{if(!wheel.isConnected)return;document.querySelector('#result').innerHTML=`<div class="eyebrow">Your next cup</div><h2>${esc(chosen.name)}</h2><p>${esc(chosen.notes)}</p><button class="primary" id="result-brew">Brew 1 serving →</button><button class="text-button" data-profile="${chosen.id}">Coffee details ↗</button>`;document.querySelector('#result-brew').onclick=()=>brew(chosen.id);button.textContent='Draw again ↻';button.disabled=false;button.onclick=()=>{renderSurprise();};},matchMedia('(prefers-reduced-motion: reduce)').matches?50:1500);}

function profileForm(existing={}){return `<h2>${existing.id?'Edit coffee':'Add coffee'}</h2><form id="profile-form"><label>Roaster (optional)<input name="roaster" value="${esc(existing.roaster||'')}"></label><label>Name<input name="name" required value="${esc(existing.name||'')}"></label><div class="two"><label>Origin<input name="origin" required value="${esc(existing.origin||'')}"></label><label>Producer / farm<input name="producer" value="${esc(existing.producer||'')}"></label></div><div class="two"><label>Process<input name="process" value="${esc(existing.process||'')}"></label><label>Roast level<input name="roastLevel" value="${esc(existing.roastLevel||'')}"></label></div><fieldset class="price-fields"><legend>Purchase price · admin only</legend><div class="two"><label>Price per 100 g<input type="number" min="0" step="0.01" name="pricePer100g" placeholder="e.g. 12.50" value="${esc(existing.pricePer100g??'')}"></label><label>Currency<select name="currency">${PRICE_CURRENCIES.map(c=>`<option value="${c}" ${(existing.currency||'$')===c?'selected':''}>${c==='$'?'$ (unspecified)':c}</option>`).join('')}</select></label></div><small>Visible only in Inventory. Leave blank if unknown.</small></fieldset><div class="two"><label>Country (optional)<input name="country" value="${esc(existing.country||'')}"></label><label>Region (optional)<input name="region" value="${esc(existing.region||'')}"></label></div><label>Variety (optional)<input name="variety" value="${esc(existing.variety||'')}"></label><label>Roast method<input name="roastMethod" value="${esc(existing.roastMethod||'')}"></label><label>Tasting notes<textarea name="notes">${esc(existing.notes||'')}</textarea></label><label>Image URL (optional)<input name="image" value="${existing.image===placeholder?'':esc(existing.image||'')}"></label><label>Brewing information (optional)<textarea name="brew">${esc(existing.brew||'')}</textarea></label><label><span><input style="width:auto" type="checkbox" name="onShelf" ${existing.onShelf?'checked':''}> On the shelf</span></label>${existing.id?'':`<div class="two"><label>Initial servings<input type="number" min="0" name="servings" required value="10"></label><label>Roast date<input type="date" name="roastDate"></label></div><label>Purchase date<input type="date" name="purchaseDate"></label>`}<button class="primary" type="submit">Save coffee</button></form>`;}
function openProfileForm(id){const existing=id?profile(id):{};dialogBody.innerHTML=profileForm(existing);dialog.showModal();document.querySelector('#profile-form').onsubmit=async e=>{e.preventDefault();const form=e.currentTarget;if(!await requireAdmin())return;const d=Object.fromEntries(new FormData(form));let pricing;try{pricing=priceFields(d.pricePer100g,d.currency);assertShelfCapacity(state,{id,onShelf:d.onShelf==='on',archived:existing.archived||false});}catch(error){notify(error.message);return;}Object.assign(d,pricing);if(id)Object.assign(profile(id),{...d,onShelf:d.onShelf==='on',image:d.image||placeholder});else{const pid=uid('profile');state.profiles.push({id:pid,...d,onShelf:d.onShelf==='on',image:d.image||placeholder,archived:false});const servings=Math.max(0,Number(d.servings));state.batches.push({id:uid('batch'),profileId:pid,purchaseDate:d.purchaseDate,roastDate:d.roastDate,initialServings:servings,remainingServings:servings,archived:false});}dialog.close();await save('Coffee saved');};}
function openReplenish(id){dialogBody.innerHTML=`<h2>Replenish ${esc(profile(id).name)}</h2><form id="batch-form"><div class="two"><label>Servings<input type="number" min="1" name="servings" required value="10"></label><label>Roast date<input type="date" name="roastDate"></label></div><label>Purchase date<input type="date" name="purchaseDate"></label><button class="primary">Add stock batch</button></form>`;dialog.showModal();document.querySelector('#batch-form').onsubmit=async e=>{e.preventDefault();const form=e.currentTarget;if(!await requireAdmin())return;const d=Object.fromEntries(new FormData(form)), servings=Number(d.servings);const p=profile(id);if(p.autoArchivedBy){p.archived=false;delete p.autoArchivedBy;if(p.onShelf&&state.profiles.filter(other=>other.id!==id&&other.onShelf&&!other.archived).length>=2)p.onShelf=false;}state.batches.push({id:uid('batch'),profileId:id,purchaseDate:d.purchaseDate,roastDate:d.roastDate,initialServings:servings,remainingServings:servings,archived:false});dialog.close();await save('Stock replenished');};}
function openAdjust(id){const batches=state.batches.filter(b=>b.profileId===id&&!b.archived);dialogBody.innerHTML=`<h2>Adjust ${esc(profile(id).name)}</h2><form id="adjust-form"><label>Stock batch<select name="batchId">${batches.map(b=>`<option value="${b.id}">${esc(b.roastDate||'Undated')} · ${b.remainingServings} remaining</option>`).join('')}</select></label><label>New remaining servings<input type="number" min="0" name="remaining" required value="${batches[0]?.remainingServings||0}"></label><label>Reason (optional)<input name="note" placeholder="Count correction"></label><button class="primary" ${batches.length?'':'disabled'}>Save adjustment</button></form>`;dialog.showModal();const select=document.querySelector('[name=batchId]'), input=document.querySelector('[name=remaining]');select.onchange=()=>input.value=state.batches.find(b=>b.id===select.value).remainingServings;document.querySelector('#adjust-form').onsubmit=async e=>{e.preventDefault();const form=e.currentTarget;if(!await requireAdmin())return;const d=Object.fromEntries(new FormData(form));state=adjustBatch(state,d.batchId,d.remaining,d.note).state;dialog.close();await save('Stock adjusted');};}
function bindAdmin(){document.querySelector('#add-profile').onclick=()=>openProfileForm();document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>openProfileForm(b.dataset.edit));document.querySelectorAll('[data-replenish]').forEach(b=>b.onclick=()=>openReplenish(b.dataset.replenish));document.querySelectorAll('[data-adjust]').forEach(b=>b.onclick=()=>openAdjust(b.dataset.adjust));document.querySelectorAll('[data-archive]').forEach(b=>b.onclick=async()=>{const p=profile(b.dataset.archive);try{assertShelfCapacity(state,{...p,archived:!p.archived});if(!p.archived&&!await confirmAction('Archive coffee',`Archive ${p.name}? Its batches and consumption history will be kept, and you can restore it later.`,'Archive coffee'))return;if(!await requireAdmin())return;p.archived=!p.archived;delete p.autoArchivedBy;await save(p.archived?'Coffee archived':'Coffee restored');}catch(error){notify(error.message);}});document.querySelectorAll('[data-undo]').forEach(b=>b.onclick=()=>undoChange(b.dataset.undo));document.querySelector('#export').onclick=exportBackup;document.querySelector('#import').onclick=()=>document.querySelector('#import-file').click();}
function exportBackup(){const blob=new Blob([JSON.stringify({...state,exportedAt:now()},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`coffee-menu-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);notify('Backup exported');}

document.addEventListener('click',e=>{const v=e.target.closest('[data-view]')?.dataset.view,g=e.target.closest('[data-go]')?.dataset.go,p=e.target.closest('[data-profile]')?.dataset.profile,b=e.target.closest('[data-brew]')?.dataset.brew;const f=e.target.closest('[data-favourite]')?.dataset.favourite;if(v)go(v);if(g)go(g);if(p)openProfile(p);if(b)brew(b);if(f)favourite(f);if(e.target.closest('[data-close-dialog]'))dialog.close();});
document.querySelector('#open-surprise').onclick=openSurprise;
// A concealed management entry preserves the approved header composition.
const wordmark=document.querySelector('.wordmark');
let holdTimer,holdStart,holdOpened=false;
const cancelHold=()=>{clearTimeout(holdTimer);holdStart=null;};
wordmark.addEventListener('pointerdown',e=>{
  cancelHold();holdOpened=false;
  if(e.button!==0||!e.isPrimary)return;
  holdStart={x:e.clientX,y:e.clientY};
  holdTimer=setTimeout(()=>{holdOpened=true;holdStart=null;go('admin');},ADMIN_HOLD_MS);
});
wordmark.addEventListener('pointermove',e=>{if(holdStart&&Math.hypot(e.clientX-holdStart.x,e.clientY-holdStart.y)>10)cancelHold();});
for(const event of ['pointerup','pointercancel','pointerleave'])wordmark.addEventListener(event,cancelHold);
wordmark.addEventListener('click',e=>{if(holdOpened){e.preventDefault();holdOpened=false;}});
wordmark.addEventListener('contextmenu',e=>e.preventDefault());
wordmark.addEventListener('keydown',e=>{if(e.altKey&&e.key==='Enter'){e.preventDefault();go('admin');}});
window.addEventListener('blur',cancelHold);
document.querySelector('#close-surprise').onclick=()=>surpriseDialog.close();
surpriseDialog.addEventListener('close',()=>{clearTimeout(spinTimer);if(view==='surprise'){view='menu';history.replaceState(null,'','#menu');}});
document.querySelector('.dialog-close').onclick=()=>dialog.close();document.querySelector('#import-file').onchange=async e=>{const file=e.target.files[0];e.target.value='';if(!file||!await requireAdmin())return;try{state=validateBackup(JSON.parse(await file.text()));await save('Backup imported');}catch(err){notify(err.message);}e.target.value='';};window.addEventListener('hashchange',()=>{view=location.hash.slice(1)||'menu';render();});
render();
