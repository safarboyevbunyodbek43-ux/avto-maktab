// Firebase rejimi: kirish (Authentication) va ma'lumotlar (Firestore) Google serverlarida saqlanadi.
import { initializeApp, deleteApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged,
  updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser as fbDeleteUser,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  getFirestore, collection, doc, getDoc, setDoc, updateDoc, addDoc, deleteDoc, getDocs, query as fsQuery, where, writeBatch,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const emailOf = (login) => `${login}@avto.local`;

function mapError(e, where) {
  const c = (e && e.code) || '';
  const m = (msg, extra) => Object.assign(new Error(msg), extra);
  if (['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found', 'auth/invalid-email', 'auth/invalid-login-credentials'].includes(c)) return m("Login yoki parol noto'g'ri", { status: 401 });
  if (c === 'auth/email-already-in-use') return m('Bu login band', { code: 'exists' });
  if (c === 'auth/too-many-requests') return m("Juda ko'p urinish. Birozdan keyin qayta urining", { status: 429 });
  if (c === 'auth/operation-not-allowed') return m("Firebase'da Email/Password kirish usuli yoqilmagan (Authentication > Sign-in method)");
  if (c === 'auth/network-request-failed' || c === 'unavailable') return m("Internet bilan aloqa yo'q");
  if (c === 'auth/weak-password') return m("Parol juda qisqa (kamida 6 belgi)");
  if (c === 'auth/requires-recent-login') return m("Xavfsizlik uchun chiqib, qayta kiring va yana urinib ko'ring");
  if (c === 'permission-denied') return m("Ruxsat yo'q" + (where ? ' [' + where + ']' : '') + ". Firestore qoidalari (firestore.rules) to'g'ri qo'yilganini tekshiring", { status: 403 });
  if (c === 'failed-precondition') return m("Firestore bazasi yaratilmagan yoki indeks kerak: " + (e.message || ''));
  return e instanceof Error ? e : m(String(e));
}
const wrap = (fn, name) => async (...a) => {
  try { return await fn(...a); } catch (e) {
    // qaysi amal va qaysi yig'ma (collection) rad etilgani xabarda ko'rinadi: nosozlikni tez topish uchun
    const col = Array.isArray(a[0]) ? [...new Set(a[0].map((o) => o.col))].join(',') : a[0];
    const extra = name === 'query' && Array.isArray(a[1]) ? ' ' + a[1].map((f) => f[0]).join('+') : '';
    throw mapError(e, name ? name + ': ' + col + extra : '');
  }
};

export async function createFirebaseBackend(config) {
  const app = initializeApp(config);
  const fbAuth = getAuth(app);
  const db = getFirestore(app);

  const store = {
    get: wrap(async (c, id) => { const s = await getDoc(doc(db, c, String(id))); return s.exists() ? s.data() : null; }, 'get'),
    set: wrap(async (c, id, data) => { await setDoc(doc(db, c, String(id)), data); }, 'set'),
    update: wrap(async (c, id, data) => { await updateDoc(doc(db, c, String(id)), data); }, 'update'),
    add: wrap(async (c, data) => (await addDoc(collection(db, c), data)).id, 'add'),
    del: wrap(async (c, id) => { await deleteDoc(doc(db, c, String(id))); }, 'del'),
    query: wrap(async (c, filters = []) => {
      const inF = filters.find((f) => f[1] === 'in'); const rest = filters.filter((f) => f !== inF);
      const base = rest.map(([f, op, v]) => where(f, op, v));
      const run = async (extra) => (await getDocs(fsQuery(collection(db, c), ...base, ...extra))).docs.map((d) => ({ id: d.id, ...d.data() }));
      if (!inF) return run([]);
      const [f, , vals] = inF; const out = [];
      for (let i = 0; i < vals.length; i += 30) out.push(...(await run([where(f, 'in', vals.slice(i, i + 30))])));
      return out;
    }, 'query'),
    batch: wrap(async (ops) => {
      for (let i = 0; i < ops.length; i += 400) {
        const b = writeBatch(db);
        for (const o of ops.slice(i, i + 400)) {
          const ref = doc(db, o.col, String(o.id));
          if (o.op === 'set') b.set(ref, o.data); else if (o.op === 'update') b.update(ref, o.data); else if (o.op === 'del') b.delete(ref);
        }
        await b.commit();
      }
    }, 'batch'),
  };

  // Boshqa foydalanuvchi hisobi ustida ishlash o'qituvchi sessiyasini buzmasligi uchun alohida "ikkinchi ilova" ishlatiladi
  async function withSecondary(fn) {
    const app2 = initializeApp(config, 'sec' + Date.now());
    const a2 = getAuth(app2);
    try { return await fn(a2); } finally { try { await fbSignOut(a2); } catch { /* */ } await deleteApp(app2).catch(() => {}); }
  }

  const auth = {
    signIn: wrap(async (login, password) => (await signInWithEmailAndPassword(fbAuth, emailOf(login), password)).user.uid),
    createAndSignIn: wrap(async (login, password) => (await createUserWithEmailAndPassword(fbAuth, emailOf(login), password)).user.uid),
    createUser: wrap(async (login, password) => withSecondary(async (a2) => (await createUserWithEmailAndPassword(a2, emailOf(login), password)).user.uid)),
    setPassword: wrap(async (login, oldPw, newPw) => withSecondary(async (a2) => { const c = await signInWithEmailAndPassword(a2, emailOf(login), oldPw); await updatePassword(c.user, newPw); })),
    deleteUser: wrap(async (login, password) => withSecondary(async (a2) => { const c = await signInWithEmailAndPassword(a2, emailOf(login), password); await fbDeleteUser(c.user); })),
    changePassword: wrap(async (login, oldPw, newPw) => {
      const u = fbAuth.currentUser; if (!u) throw new Error('Qayta kiring');
      await reauthenticateWithCredential(u, EmailAuthProvider.credential(emailOf(login), oldPw)); await updatePassword(u, newPw);
    }),
    signOut: wrap(async () => { await fbSignOut(fbAuth); }),
    restore: () => new Promise((res) => { const un = onAuthStateChanged(fbAuth, (u) => { un(); res(u ? u.uid : null); }); }),
  };
  return { store, auth };
}
