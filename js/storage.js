const KEY = 'coffee-menu-pwa:v1';

export class LocalStorageRepository {
  constructor(storage = window.localStorage) { this.storage = storage; }
  async load() { const raw = this.storage.getItem(KEY); return raw ? JSON.parse(raw) : null; }
  async save(state) { this.storage.setItem(KEY, JSON.stringify(state)); }
  async clear() { this.storage.removeItem(KEY); }
}

export {SharedInventoryRepository,createRepository} from './shared-storage.js?v=archive404-mystery-20';
