// DEMO rejimi: ma'lumot faqat shu brauzerda (localStorage) saqlanadi. Firebase ulanmagan paytda ishlaydi.
const mem = {};
const ls = {
  get(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return mem[k] ?? null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { mem[k] = v; } },
};
const rid = () => Array.from(crypto.getRandomValues(new Uint8Array(8)), (b) => b.toString(16).padStart(2, '0')).join('');
const clone = (x) => JSON.parse(JSON.stringify(x));
const col = (c) => ls.get('am_c_' + c) || {};

export function createLocalBackend() {
  const store = {
    async get(c, id) { const d = col(c)[String(id)]; return d ? clone(d) : null; },
    async set(c, id, data) { const all = col(c); all[String(id)] = clone(data); ls.set('am_c_' + c, all); },
    async update(c, id, data) { const all = col(c); if (!all[String(id)]) throw new Error('Hujjat topilmadi'); all[String(id)] = { ...all[String(id)], ...clone(data) }; ls.set('am_c_' + c, all); },
    async add(c, data) { const id = rid(); await store.set(c, id, data); return id; },
    async del(c, id) { const all = col(c); delete all[String(id)]; ls.set('am_c_' + c, all); },
    async query(c, filters = []) {
      return Object.entries(col(c)).map(([id, d]) => ({ id, ...clone(d) })).filter((row) => filters.every(([f, op, v]) => (op === '==' ? row[f] === v : op === 'in' ? v.includes(row[f]) : false)));
    },
    async batch(ops) {
      for (const o of ops) { if (o.op === 'set') await store.set(o.col, o.id, o.data); else if (o.op === 'update') await store.update(o.col, o.id, o.data); else if (o.op === 'del') await store.del(o.col, o.id); }
    },
  };
  const users = () => ls.get('am_auth') || {};
  const err = (m, extra) => Object.assign(new Error(m), extra);
  const auth = {
    async signIn(login, password) { const u = users()[login]; if (!u || u.password !== password) throw err("Login yoki parol noto'g'ri", { status: 401 }); ls.set('am_session', u.uid); return u.uid; },
    async createUser(login, password) { const all = users(); if (all[login]) throw err('Bu login band', { code: 'exists' }); const uid = rid(); all[login] = { uid, password }; ls.set('am_auth', all); return uid; },
    async createAndSignIn(login, password) { const uid = await auth.createUser(login, password); ls.set('am_session', uid); return uid; },
    async setPassword(login, oldPw, newPw) { const all = users(); if (!all[login] || all[login].password !== oldPw) throw err("Eski parol noto'g'ri"); all[login].password = newPw; ls.set('am_auth', all); },
    async changePassword(login, oldPw, newPw) { return auth.setPassword(login, oldPw, newPw); },
    async deleteUser(login, password) { const all = users(); if (all[login] && all[login].password === password) { delete all[login]; ls.set('am_auth', all); } },
    async signOut() { ls.set('am_session', null); },
    async restore() { return ls.get('am_session'); },
  };
  return { store, auth };
}
