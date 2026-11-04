export const uid = (prefix = 'id') => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
export const now = () => new Date().toISOString();

export const PRICE_CURRENCIES=['$','SGD','USD','AUD','EUR','GBP','JPY'];
export function priceFields(value, currency='$') {
  const amount=value==null||String(value).trim()===''?null:Number(value);
  if(amount!==null&&(!Number.isFinite(amount)||amount<0))throw new Error('Price must be zero or a positive number.');
  if(!PRICE_CURRENCIES.includes(currency))throw new Error('Choose a supported currency.');
  return {pricePer100g:amount===null?null:Math.round((amount+Number.EPSILON)*100)/100,currency};
}
export function toggleFavourite(state, profileId) {
  const next=structuredClone(state),p=next.profiles.find(p=>p.id===profileId);
  if(!p)throw new Error('Coffee not found');
  p.favourite=!p.favourite;
  return next;
}

export function assertShelfCapacity(state, candidate) {
  if(!candidate.onShelf||candidate.archived)return;
  const others=state.profiles.filter(p=>p.id!==candidate.id&&p.onShelf&&!p.archived);
  if(others.length>=2)throw new Error('Only two coffees fit on the shelf. Move one to Others in Stock first.');
}

export function totalRemaining(state, profileId) {
  return state.batches.filter(b => b.profileId === profileId && !b.archived).reduce((sum, b) => sum + Math.max(0, Number(b.remainingServings) || 0), 0);
}

export function availableProfiles(state) {
  return state.profiles.filter(p => !p.archived && totalRemaining(state, p.id) > 0);
}

export function brewOne(state, profileId, at = now()) {
  if(!state.profiles.some(p=>p.id===profileId&&!p.archived))return {state,changed:false};
  const candidates = state.batches.filter(b => b.profileId === profileId && !b.archived && b.remainingServings > 0).sort((a,b) => (a.roastDate || '').localeCompare(b.roastDate || ''));
  if (!candidates.length) return { state, changed: false };
  const batch = candidates[0];
  const next = structuredClone(state);
  const target = next.batches.find(b => b.id === batch.id);
  target.remainingServings -= 1;
  const event={ id: uid('event'), type:'brew', profileId, batchId:batch.id, delta:-1, at, undone:false };
  if(totalRemaining(next,profileId)===0){
    const coffee=next.profiles.find(p=>p.id===profileId);
    coffee.archived=true;
    coffee.autoArchivedBy=event.id;
    event.autoArchived=true;
  }
  next.history.unshift(event);
  return { state: next, changed: true };
}

export function adjustBatch(state, batchId, nextRemaining, note = '', at = now()) {
  const next = structuredClone(state);
  const batch = next.batches.find(b => b.id === batchId);
  if (!batch) throw new Error('Batch not found');
  const value = Math.max(0, Math.floor(Number(nextRemaining)));
  if (!Number.isFinite(value)) throw new Error('Servings must be a number');
  const delta = value - batch.remainingServings;
  if (!delta) return { state, changed:false };
  batch.remainingServings = value;
  batch.initialServings = Math.max(batch.initialServings, value);
  next.history.unshift({ id:uid('event'), type:'adjustment', profileId:batch.profileId, batchId, delta, note, at, undone:false });
  return { state:next, changed:true };
}

export function undoEvent(state, eventId, at = now()) {
  const next = structuredClone(state);
  const event = next.history.find(e => e.id === eventId);
  if (!event || event.undone) return { state, changed:false };
  const batch = next.batches.find(b => b.id === event.batchId);
  if (!batch) return { state, changed:false };
  batch.remainingServings = Math.max(0, batch.remainingServings - event.delta);
  let restoredToStock=false;
  const coffee=next.profiles.find(p=>p.id===event.profileId);
  if(event.autoArchived&&coffee?.autoArchivedBy===event.id){
    coffee.archived=false;
    delete coffee.autoArchivedBy;
    if(coffee.onShelf&&next.profiles.filter(p=>p.id!==coffee.id&&p.onShelf&&!p.archived).length>=2){
      coffee.onShelf=false;
      restoredToStock=true;
    }
  }
  event.undone = true;
  event.undoneAt = at;
  next.history.unshift({ id:uid('event'), type:'undo', profileId:event.profileId, batchId:event.batchId, delta:-event.delta, sourceEventId:event.id, at, undone:false });
  return { state:next, changed:true, restoredToStock };
}

export function surpriseCandidates(state) {
  return availableProfiles(state);
}

export function pickSurprise(state, random = Math.random) {
  const eligible = surpriseCandidates(state, random);
  if (!eligible.length) return null;
  return eligible[Math.min(eligible.length - 1, Math.floor(random() * eligible.length))];
}

export function validateBackup(data) {
  if (!data || data.schemaVersion !== 1 || !Array.isArray(data.profiles) || !Array.isArray(data.batches) || !Array.isArray(data.history)) throw new Error('This is not a valid Coffee Menu v1 backup.');
  return structuredClone(data);
}
