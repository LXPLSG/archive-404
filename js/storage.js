const KEY = 'coffee-menu-pwa:v1';

export class LocalStorageRepository {
  constructor(storage = window.localStorage) { this.storage = storage; }
  async load() { const raw = this.storage.getItem(KEY); return raw ? JSON.parse(raw) : null; }
  async save(state) { this.storage.setItem(KEY, JSON.stringify(state)); }
  async clear() { this.storage.removeItem(KEY); }
}

// Future SupabaseRepository can implement the same async load/save contract.
export const createRepository = () => new LocalStorageRepository();
