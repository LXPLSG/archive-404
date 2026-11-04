import { availableProfiles, totalRemaining } from './domain.js?v=archive404-auth-6';

export const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const beanIcon='<svg viewBox="0 0 28 28" aria-hidden="true"><ellipse cx="14" cy="14" rx="9" ry="11" transform="rotate(36 14 14)"/><path d="M8 22c1-8 10-8 12-17"/></svg>';
export const cupIcon='<svg viewBox="0 0 34 30" aria-hidden="true"><path d="m5 12 3 13h15l3-13H5Zm21 2h3c5 0 3 8-4 8M14 8c-4-4 4-4 0-8m7 8c-4-4 4-4 0-8M3 28h24"/></svg>';
export const arrowIcon='<svg viewBox="0 0 28 24" aria-hidden="true"><path d="M2 12h22m-7-8 8 8-8 8"/></svg>';
export function favouriteButton(p){return `<button class="favourite-button ${p.favourite?'selected':''}" data-favourite="${esc(p.id)}" aria-pressed="${!!p.favourite}" aria-label="${p.favourite?'Remove':'Add'} ${esc(p.name)} ${p.favourite?'from':'to'} favourites"><svg viewBox="0 0 32 30" aria-hidden="true"><path d="M16 26 4 14C-4 5 9-3 16 6 23-3 36 5 28 14Z"/></svg></button>`;}
const preview=(text,n=145)=>String(text||'').length>n?String(text).slice(0,n).trimEnd()+'…':String(text||'');
function roastDots(value){const roast=String(value||'').toLowerCase();const count=roast.includes('dark')?3:roast.includes('medium')?2:roast.includes('light')?1:0;return count?`<span class="roast-dots" aria-hidden="true">${[1,2,3].map(i=>`<i class="${i<=count?'filled':''}"></i>`).join('')}</span>`:'';}
export function shelfCard(state,p,index){
  if(!p)return `<article class="shelf-card empty-slot ${index===1?'charcoal':''}" aria-label="Empty shelf slot"><div class="slot-message"><span>An open place</span><p>Awaiting the next coffee.</p></div></article>`;
  const left=totalRemaining(state,p.id);
  return `<article class="shelf-card ${index===1?'charcoal':'ivory'}" data-coffee-id="${esc(p.id)}">
    <div class="shelf-zone zone-a"><span class="roaster">${esc(p.roaster||'')}</span>${favouriteButton(p)}</div>
    <div class="shelf-zone zone-b"><button class="coffee-name" data-profile="${esc(p.id)}" aria-label="View ${esc(p.name)} details">${esc(p.name)}</button><div class="coffee-origin">${esc(p.country||p.origin||'')}</div></div>
    <p class="shelf-zone zone-c tasting-notes">${esc(preview(p.notes))}</p>
    <div class="shelf-zone zone-d technical-band"><div><span class="field-label">Process</span><span class="field-value">${esc(p.process||'')}</span></div><div><span class="field-label">Roast</span><span class="field-value">${esc(p.roastLevel||'')} ${roastDots(p.roastLevel)}</span></div></div>
    <div class="shelf-zone zone-e serving-count">${beanIcon}<span><strong>${left}</strong> <span>servings left</span></span></div>
    <div class="shelf-zone zone-f"><button class="brew-button" data-brew="${esc(p.id)}" aria-label="Brew a cup of ${esc(p.name)}">${cupIcon}<span>Brew a cup</span>${arrowIcon}</button></div>
  </article>`;
}
export function stockCard(state,p,index=0){return `<button class="stock-card accent-${index%2}" data-profile="${esc(p.id)}" aria-label="View ${esc(p.name)} details"><span class="stock-identity"><span class="coffee-origin">${esc(p.country||p.origin||'')}</span><span class="stock-name">${esc(p.name)}</span><span class="stock-notes">${esc(preview(p.notes,100))}</span></span><span class="stock-technical"><span>${esc(p.process||'')}</span><span>${esc(p.roastLevel||'')}</span></span><span class="stock-servings">${beanIcon}<strong>${totalRemaining(state,p.id)}</strong><span class="sr-only">servings left</span></span><span class="stock-arrow" aria-hidden="true">›</span></button>`;}
export function menuMarkup(state){
  const available=availableProfiles(state),shelf=available.filter(p=>p.onShelf),reserve=available.filter(p=>!p.onShelf);
  // Legacy excess assignments remain saved and accessible; never silently move records.
  const overflow=shelf.slice(2);
  return `<section class="menu-section" aria-labelledby="shelf-title"><h2 id="shelf-title">On the Shelf</h2><div class="shelf-grid">${[0,1].map(i=>shelfCard(state,shelf[i],i)).join('')}</div></section><section class="menu-section stock-section" aria-labelledby="stock-title"><h2 id="stock-title">Others in Stock</h2><div class="stock-list">${[...reserve,...overflow].map((p,i)=>stockCard(state,p,i)).join('')||'<p class="empty-stock">The reserve is quiet for now.</p>'}</div></section>`;
}
export function profileMarkup(state,p){
  const batches=state.batches.filter(b=>b.profileId===p.id),active=batches.filter(b=>!b.archived),remaining=totalRemaining(state,p.id);
  const rows=[['Roaster',p.roaster],['Origin',p.origin],['Country',p.country],['Region',p.region],['Producer / farm',p.producer],['Variety',p.variety],['Process',p.process],['Roast level',p.roastLevel],['Roast method',p.roastMethod],['Roast date',active.map(b=>b.roastDate).filter(Boolean).sort().at(-1)],['Purchase date',active.map(b=>b.purchaseDate).filter(Boolean).sort().at(-1)]];
  return `<article class="coffee-detail"><header><div class="roaster">${esc(p.roaster||'')}</div><div class="detail-title-row"><h2>${esc(p.name)}</h2>${favouriteButton(p)}</div>${p.notes?`<p class="tasting-notes">${esc(p.notes)}</p>`:''}</header>${p.image&&!p.image.includes('coffee-placeholder.svg')?`<img class="profile-hero" src="${esc(p.image)}" alt="${esc(p.name)}">`:''}<dl class="profile-fields">${rows.filter(([,v])=>v).map(([label,value])=>`<div><dt>${label}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl><div class="detail-stock"><span><strong>${remaining}</strong> servings remaining</span><small>${batches.reduce((s,b)=>s+Number(b.initialServings||0),0)} initially registered across ${batches.length} batch${batches.length===1?'':'s'} · ${state.history.filter(e=>e.profileId===p.id&&e.type==='brew'&&!e.undone).length} recorded brews</small></div>${p.brew?`<section class="brewing-info"><h3>Brewing notes</h3><p>${esc(p.brew)}</p></section>`:''}<button class="primary" data-brew="${esc(p.id)}" ${remaining>0&&!p.archived?'':'disabled'}>Brew a cup</button><nav class="detail-links" aria-label="Collection"><a href="#favourites" data-close-dialog>View favourites</a><a href="#admin" data-close-dialog>Manage inventory</a></nav></article>`;
}
