// Ilovaning "miyasi": avvalgi server.js dagi qoidalar, endi brauzer ichida.
// Ma'lumotni saqlash `store` (demo yoki Firebase), kirish esa `auth` orqali bajariladi.
const WEAK_PCT = 70;
const WEAK_MIN = 3;

class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }
const bad = (m) => new HttpError(400, m);
const nowIso = () => new Date().toISOString();
const today = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };

const randInt = (n) => { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % n; };
function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = randInt(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function randomPassword() { const abc = 'abcdefghjkmnpqrstuvwxyz23456789'; let s = ''; for (let i = 0; i < 7; i++) s += abc[randInt(abc.length)]; return s; }
function slugLogin(name) {
  const map = { 'ў': 'o', 'ғ': 'g', 'қ': 'q', 'ҳ': 'h', 'ш': 'sh', 'ч': 'ch', 'ё': 'yo', 'ю': 'yu', 'я': 'ya', 'й': 'y', 'х': 'x', 'ж': 'j', 'ц': 's', 'э': 'e', 'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'з': 'z', 'и': 'i', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f' };
  let base = String(name).toLowerCase().trim().split(/\s+/)[0] || 'oquvchi';
  base = [...base].map((c) => map[c] || c).join('').replace(/[^a-z0-9]/g, '') || 'oquvchi';
  return base.slice(0, 16) + (100 + randInt(900));
}
const normLogin = (v) => {
  const l = String(v || '').trim().toLowerCase();
  if (!/^[a-z0-9._-]{3,30}$/.test(l)) throw bad("Login 3-30 ta belgi bo'lsin: lotin harf, raqam, nuqta, tire");
  return l;
};
const needStr = (v, name, max = 200) => { if (typeof v !== 'string' || !v.trim()) throw bad(`${name} kerak`); return v.trim().slice(0, max); };
const needDate = (v) => { if (!/^\d{4}-\d{2}-\d{2}$/.test(String(v))) throw bad("Sana noto'g'ri"); return v; };
const needInt = (v, name, min, max) => { const n = Number(v); if (!Number.isInteger(n) || n < min || n > max) throw bad(`${name} noto'g'ri`); return n; };
const byName = (a, b) => String(a.name).localeCompare(String(b.name), 'uz');

export function createCore({ store, auth, exam }) {
  let me = null; // joriy foydalanuvchi {id, role, name, login, group_id, schoolId, status}
  let mySchool = null; // joriy o'quv markaz {id, name, region, district, ownerId}
  const SC = () => ['schoolId', '==', me.schoolId]; // har bir so'rov faqat o'z markazi ma'lumotini oladi
  const pub = (u) => ({ id: u.id, role: u.role, name: u.name, login: u.login, group_id: u.group_id ?? null, must_change: false, status: u.status || 'active', owner: !!mySchool && mySchool.ownerId === u.id, school: mySchool ? { id: mySchool.id, name: mySchool.name, region: mySchool.region, district: mySchool.district } : null });

  // ---------- savollar (sayt bilan birga turgan questions.json) ----------
  let qcache = null;
  function validQ(x) {
    if (!x || typeof x.topic !== 'string' || !x.q || typeof x.q.uz !== 'string') return false;
    const o = x.options; if (!o || !Array.isArray(o.uz) || o.uz.length < 2) return false;
    if (!Number.isInteger(x.correct) || x.correct < 0 || x.correct >= o.uz.length) return false;
    for (const l of ['ru', 'en']) if (o[l] && o[l].length !== o.uz.length) return false;
    return true;
  }
  async function questions() {
    if (qcache) return qcache;
    const r = await fetch('questions.json?v=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) throw new Error("questions.json topilmadi");
    let arr; try { arr = await r.json(); } catch { throw new Error("questions.json faylida xato bor (vergul yoki qavs). jsonlint.com da tekshiring"); }
    if (!Array.isArray(arr)) throw new Error("questions.json ro'yxat [ ... ] bo'lishi kerak");
    qcache = [];
    arr.forEach((x, i) => {
      if (!validQ(x)) { console.warn('questions.json: yaroqsiz savol #' + (i + 1)); return; }
      qcache.push({ id: String(x.id || 'q' + (i + 1)), topic: x.topic, q: x.q, options: x.options, correct: x.correct, image: x.image || null });
    });
    return qcache;
  }

  // ---------- yordamchilar ----------
  async function studentsOf(groupId) {
    const all = await store.query('users', [SC(), ['role', '==', 'student'], ['status', '==', 'active']]);
    return all.filter((s) => (groupId == null ? true : String(s.group_id) === String(groupId))).sort(byName);
  }
  async function studentIdsOf(gid) { return (await studentsOf(gid)).map((s) => s.id); }
  async function studentOrSelf(id) {
    if (me.role === 'student') return me.id;
    const s = await store.get('users', String(id));
    if (!s || s.role !== 'student' || s.schoolId !== me.schoolId) throw new HttpError(404, "O'quvchi topilmadi");
    return String(id);
  }
  async function byStudentIds(col, ids, extra = []) {
    if (!ids.length) return [];
    // bitta o'quvchi bo'lsa '==' ishlatiladi: Firebase qoidalari 'in' ro'yxatini o'quvchining o'ziniki deb tasdiqlay olmaydi
    return store.query(col, [SC(), ids.length === 1 ? ['student_id', '==', ids[0]] : ['student_id', 'in', ids], ...extra]);
  }
  function topicAgg(statsDocs) { // statsDocs: [{id, topics}]
    const byStudent = {}; const byTopic = {};
    for (const d of statsDocs) {
      const topics = d.topics || {};
      for (const [tp, v] of Object.entries(topics)) {
        if (!v || !v.n) continue;
        const pct = Math.round((100 * v.ok) / v.n);
        (byStudent[d.id] ||= {})[tp] = { ok: v.ok, n: v.n, pct };
        const t = (byTopic[tp] ||= { ok: 0, n: 0, weak: 0, students: 0 });
        t.ok += v.ok; t.n += v.n; t.students += 1;
        if (v.n >= WEAK_MIN && (100 * v.ok) / v.n < WEAK_PCT) t.weak += 1;
      }
    }
    for (const t of Object.values(byTopic)) t.pct = Math.round((100 * t.ok) / t.n);
    return { byStudent, byTopic };
  }
  async function wipeStudentData(id) {
    for (const col of ['attendance', 'grades', 'payments', 'attempts']) {
      const rows = await store.query(col, [SC(), ['student_id', '==', id]]);
      if (rows.length) await store.batch(rows.map((r) => ({ op: 'del', col, id: r.id })));
    }
    await store.batch([{ op: 'del', col: 'stats', id }, { op: 'del', col: 'credentials', id }, { op: 'del', col: 'users', id }]);
  }

  // ---------- marshrutlar ----------
  const routes = [];
  const route = (method, pattern, roles, handler) => routes.push({ method, roles, handler, re: new RegExp('^' + pattern.replace(/:(\w+)/g, '(?<$1>[^/]+)') + '$') });
  const T = ['teacher']; const S = ['student']; const ANY = ['teacher', 'student'];
  const G = (c) => c.query.group;

  route('GET', '/api/me', ANY, () => ({ user: pub(me), exam }));
  route('POST', '/api/password', T, async (c) => {
    const pw = String(c.body.password || ''); if (pw.length < 6) throw bad("Parol kamida 6 belgi bo'lsin");
    await auth.changePassword(me.login, String(c.body.old || ''), pw); return { ok: true };
  });

  route('GET', '/api/groups', T, async () => {
    const [groups, students] = await Promise.all([store.query('groups', [SC()]), studentsOf(null)]);
    return groups.map((g) => ({ ...g, students: students.filter((s) => String(s.group_id) === String(g.id)).length })).sort((a, b) => (b.created || '').localeCompare(a.created || ''));
  });
  route('POST', '/api/groups', T, async (c) => {
    const id = await store.add('groups', { name: needStr(c.body.name, 'Guruh nomi', 80), price: needInt(c.body.price || 0, 'Narx', 0, 1e10), start_date: c.body.start_date || null, schoolId: me.schoolId, created: nowIso() });
    return { id };
  });
  route('PUT', '/api/groups/:id', T, async (c) => { await store.update('groups', c.params.id, { name: needStr(c.body.name, 'Guruh nomi', 80), price: needInt(c.body.price || 0, 'Narx', 0, 1e10) }); return { ok: true }; });
  route('DELETE', '/api/groups/:id', T, async (c) => {
    const st = await studentsOf(c.params.id);
    if (st.length) await store.batch(st.map((s) => ({ op: 'update', col: 'users', id: s.id, data: { group_id: null } })));
    await store.del('groups', c.params.id); return { ok: true };
  });

  route('GET', '/api/students', T, async (c) => (await studentsOf(G(c) || null)).map((s) => ({ id: s.id, name: s.name, login: s.login, phone: s.phone || null, group_id: s.group_id })));
  route('POST', '/api/students', T, async (c) => {
    const name = needStr(c.body.name, 'Ism', 100); const gid = needStr(String(c.body.group_id || ''), 'Guruh', 60);
    const grp = await store.get('groups', gid); if (!grp || grp.schoolId !== me.schoolId) throw bad('Guruh topilmadi');
    const password = randomPassword(); let login; let uid;
    for (let i = 0; i < 6; i++) {
      login = slugLogin(name);
      try { uid = await auth.createUser(login, password); break; } catch (e) { if (e.code !== 'exists') throw e; }
    }
    if (!uid) throw bad('Login yaratib bo\'lmadi, qayta urinib ko\'ring');
    await store.batch([
      { op: 'set', col: 'users', id: uid, data: { role: 'student', status: 'active', schoolId: me.schoolId, name, login, group_id: gid, phone: c.body.phone ? String(c.body.phone).slice(0, 30) : null, created: nowIso() } },
      { op: 'set', col: 'credentials', id: uid, data: { login, password, schoolId: me.schoolId } },
    ]);
    return { id: uid, login, password };
  });
  route('POST', '/api/students/:id/reset', T, async (c) => {
    const id = await studentOrSelf(c.params.id); const cred = await store.get('credentials', id);
    if (!cred) throw bad("Bu o'quvchining eski paroli saqlanmagan, parolni yangilab bo'lmaydi");
    const password = randomPassword(); await auth.setPassword(cred.login, cred.password, password);
    await store.set('credentials', id, { login: cred.login, password, schoolId: me.schoolId }); return { login: cred.login, password };
  });
  route('PUT', '/api/students/:id', T, async (c) => {
    const id = await studentOrSelf(c.params.id);
    await store.update('users', id, { name: needStr(c.body.name, 'Ism', 100), group_id: String(c.body.group_id), phone: c.body.phone ? String(c.body.phone).slice(0, 30) : null }); return { ok: true };
  });
  route('DELETE', '/api/students/:id', T, async (c) => {
    const id = String(c.params.id); const cred = await store.get('credentials', id);
    if (cred) { try { await auth.deleteUser(cred.login, cred.password); } catch { /* login hisobi qolishi mumkin, ma'lumot baribir o'chadi */ } }
    await wipeStudentData(id); return { ok: true };
  });

  // yangi ro'yxatdan o'tganlarni tasdiqlash
  route('GET', '/api/requests', T, async () => {
    const rows = await store.query('users', [SC(), ['status', '==', 'pending']]);
    const owner = mySchool.ownerId === me.id;
    return rows.filter((u) => owner || u.role === 'student').map((u) => ({ id: u.id, name: u.name, login: u.login, role: u.role, created: u.created || '' })).sort((a, b) => b.created.localeCompare(a.created));
  });
  route('POST', '/api/requests/:id/approve', T, async (c) => {
    const id = String(c.params.id); const u = await store.get('users', id);
    if (!u || u.schoolId !== me.schoolId || u.status !== 'pending') throw new HttpError(404, "So'rov topilmadi");
    if (u.role === 'teacher') { if (mySchool.ownerId !== me.id) throw new HttpError(403, "O'qituvchini faqat markaz rahbari tasdiqlaydi"); await store.update('users', id, { status: 'active' }); return { ok: true }; }
    const gid = needStr(String(c.body.group_id || ''), 'Guruh', 60); const g = await store.get('groups', gid); if (!g || g.schoolId !== me.schoolId) throw bad('Guruh topilmadi');
    await store.update('users', id, { status: 'active', group_id: gid }); return { ok: true };
  });
  route('DELETE', '/api/requests/:id', T, async (c) => {
    const id = String(c.params.id); const u = await store.get('users', id);
    if (!u || u.schoolId !== me.schoolId || u.status !== 'pending') throw new HttpError(404, "So'rov topilmadi");
    if (u.role === 'teacher' && mySchool.ownerId !== me.id) throw new HttpError(403, "Faqat markaz rahbari rad etadi");
    await store.batch([{ op: 'del', col: 'credentials', id }, { op: 'del', col: 'users', id }]); return { ok: true };
  });

  // davomat
  route('GET', '/api/attendance', T, async (c) => {
    const date = needDate(c.query.date); const ids = await studentsOf(needStr(String(G(c) || ''), 'Guruh', 60));
    const docs = await store.query('attendance', [SC(), ['date', '==', date]]); const m = Object.fromEntries(docs.map((d) => [d.student_id, d.status]));
    return ids.map((s) => ({ id: s.id, name: s.name, status: m[s.id] || null }));
  });
  route('POST', '/api/attendance', T, async (c) => {
    const date = needDate(c.body.date); if (!Array.isArray(c.body.records)) throw bad('records kerak');
    const ok = ['present', 'absent', 'late', 'excused']; const ops = [];
    for (const r of c.body.records) { if (!ok.includes(r.status)) continue; ops.push({ op: 'set', col: 'attendance', id: `${r.student_id}_${date}`, data: { student_id: String(r.student_id), date, status: r.status, schoolId: me.schoolId } }); }
    if (ops.length) await store.batch(ops); return { ok: true };
  });
  route('GET', '/api/attendance/summary', ANY, async (c) => {
    const studs = me.role === 'student' ? [{ id: me.id, name: me.name }] : await studentsOf(needStr(String(G(c) || ''), 'Guruh', 60));
    const docs = await byStudentIds('attendance', studs.map((s) => s.id));
    return studs.map((s) => {
      const mine = docs.filter((d) => d.student_id === s.id); const n = (k) => mine.filter((d) => d.status === k).length;
      return { id: s.id, name: s.name, present: n('present'), late: n('late'), absent: n('absent'), excused: n('excused'), total: mine.length };
    });
  });

  // baholar
  route('GET', '/api/grades', ANY, async (c) => {
    const sort = (a) => a.sort((x, y) => (y.date || '').localeCompare(x.date || '') || (y.created || '').localeCompare(x.created || ''));
    if (me.role === 'student') return sort(await store.query('grades', [SC(), ['student_id', '==', me.id]]));
    if (c.query.student) return sort(await store.query('grades', [SC(), ['student_id', '==', String(c.query.student)]]));
    const studs = await studentsOf(needStr(String(G(c) || ''), 'Guruh', 60)); const names = Object.fromEntries(studs.map((s) => [s.id, s.name]));
    return sort(await byStudentIds('grades', studs.map((s) => s.id))).slice(0, 300).map((g) => ({ ...g, name: names[g.student_id] }));
  });
  route('POST', '/api/grades', T, async (c) => {
    const sid = await studentOrSelf(c.body.student_id);
    await store.add('grades', { schoolId: me.schoolId, student_id: sid, date: needDate(c.body.date || today()), kind: needStr(c.body.kind, 'Tur', 30), score: needInt(c.body.score, 'Baho', 1, 5), note: c.body.note ? String(c.body.note).slice(0, 300) : null, created: nowIso() });
    return { ok: true };
  });
  route('DELETE', '/api/grades/:id', T, async (c) => { await store.del('grades', c.params.id); return { ok: true }; });

  // to'lovlar (faqat o'qituvchi)
  route('GET', '/api/payments/summary', T, async (c) => {
    const gid = needStr(String(G(c) || ''), 'Guruh', 60); const g = await store.get('groups', gid); if (!g || g.schoolId !== me.schoolId) throw new HttpError(404, 'Guruh topilmadi');
    const studs = await studentsOf(gid); const pays = await byStudentIds('payments', studs.map((s) => s.id));
    return { price: g.price || 0, students: studs.map((s) => { const paid = pays.filter((p) => p.student_id === s.id).reduce((a, p) => a + p.amount, 0); return { id: s.id, name: s.name, phone: s.phone || null, paid, debt: Math.max(0, (g.price || 0) - paid) }; }) };
  });
  route('GET', '/api/payments', T, async (c) => (await store.query('payments', [SC(), ['student_id', '==', String(c.query.student)]])).sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.created || '').localeCompare(a.created || '')));
  route('POST', '/api/payments', T, async (c) => {
    const sid = await studentOrSelf(c.body.student_id);
    await store.add('payments', { schoolId: me.schoolId, student_id: sid, date: needDate(c.body.date || today()), amount: needInt(c.body.amount, 'Summa', 1, 1e10), note: c.body.note ? String(c.body.note).slice(0, 200) : null, created: nowIso() });
    return { ok: true };
  });
  route('DELETE', '/api/payments/:id', T, async (c) => { await store.del('payments', c.params.id); return { ok: true }; });

  // tahlil
  route('GET', '/api/analytics/group', T, async (c) => {
    const studs = await studentsOf(needStr(String(G(c) || ''), 'Guruh', 60));
    const docs = await Promise.all(studs.map(async (s) => ({ id: s.id, ...((await store.get('stats', s.id)) || {}) })));
    const a = topicAgg(docs);
    return { students: studs.map((s) => ({ id: s.id, name: s.name })), byStudent: a.byStudent, byTopic: a.byTopic, weakPct: WEAK_PCT, minAnswers: WEAK_MIN };
  });
  route('GET', '/api/analytics/student', ANY, async (c) => {
    const id = await studentOrSelf(c.query.student);
    const stats = (await store.get('stats', id)) || {}; const a = topicAgg([{ id, ...stats }]);
    const attempts = (await store.query('attempts', [SC(), ['student_id', '==', id]])).sort((x, y) => y.started - x.started).slice(0, 20);
    return { topics: a.byStudent[id] || {}, attempts, weakPct: WEAK_PCT, minAnswers: WEAK_MIN };
  });

  // savollar
  route('GET', '/api/topics', ANY, async () => {
    const m = {}; for (const q of await questions()) m[q.topic] = (m[q.topic] || 0) + 1;
    return Object.keys(m).sort().map((topic) => ({ topic, n: m[topic] }));
  });
  route('GET', '/api/samples', ANY, async (c) => (await questions()).filter((q) => !c.query.topic || q.topic === c.query.topic));

  // test va imtihon
  const attempts = new Map(); let attemptSeq = 1;
  route('POST', '/api/test/start', S, async (c) => {
    const mode = c.body.mode === 'exam' ? 'exam' : 'topic'; const all = await questions();
    const pool = mode === 'exam' ? all : all.filter((q) => q.topic === c.body.topic);
    if (!pool.length) throw bad("Bu mavzuda savol yo'q");
    const want = mode === 'exam' ? exam.count : needInt(c.body.count || 10, 'Soni', 1, 50);
    const picked = shuffle(pool).slice(0, want); const perms = {};
    const questionsOut = picked.map((q) => {
      const perm = shuffle(q.options.uz.map((_, i) => i)); perms[q.id] = perm;
      const options = {}; for (const l of Object.keys(q.options)) options[l] = perm.map((i) => q.options[l][i]);
      return { id: q.id, topic: q.topic, image: q.image, q: q.q, options };
    });
    const id = attemptSeq++; attempts.set(id, { mode, topic: mode === 'topic' ? c.body.topic : null, started: Date.now(), picked, perms });
    return { attempt_id: id, mode, limit_seconds: mode === 'exam' ? exam.minutes * 60 : 0, max_errors: exam.maxErrors, questions: questionsOut };
  });
  route('POST', '/api/test/submit', S, async (c) => {
    const at = attempts.get(Number(c.body.attempt_id)); if (!at) throw new HttpError(404, 'Urinish topilmadi'); attempts.delete(Number(c.body.attempt_id));
    const given = c.body.answers && typeof c.body.answers === 'object' ? c.body.answers : {};
    const late = at.mode === 'exam' && Date.now() - at.started > (exam.minutes * 60 + 60) * 1000;
    let correct = 0; const details = []; const stats = (await store.get('stats', me.id)) || {}; const topics = stats.topics || {};
    for (const q of at.picked) {
      const perm = at.perms[q.id]; const right = perm.indexOf(q.correct); const chosen = Number.isInteger(given[q.id]) ? given[q.id] : -1; const ok = chosen === right;
      if (ok) correct += 1; details.push({ id: q.id, topic: q.topic, chosen, correct: right, ok });
      const t = (topics[q.topic] ||= { ok: 0, n: 0 }); t.n += 1; if (ok) t.ok += 1;
    }
    const total = at.picked.length; const errors = total - correct;
    const passed = at.mode === 'exam' ? errors <= exam.maxErrors && !late : null;
    await store.set('stats', me.id, { topics, schoolId: me.schoolId });
    await store.add('attempts', { schoolId: me.schoolId, student_id: me.id, mode: at.mode, topic: at.topic, started: at.started, finished: Date.now(), total, correct, passed, late });
    return { total, correct, errors, passed, late, details };
  });

  // ---------- tashqi interfeys ----------
  async function loadMe(uid) {
    const u = await store.get('users', uid);
    if (!u) { await auth.signOut(); throw new HttpError(401, "Hisob topilmadi (markaz rahbari rad etgan yoki o'chirgan bo'lishi mumkin)"); }
    me = { id: uid, ...u };
    const sch = u.schoolId ? await store.get('schools', u.schoolId) : null;
    if (!sch) { await auth.signOut(); me = null; throw new HttpError(401, "O'quv markaz topilmadi"); }
    mySchool = { id: u.schoolId, ...sch };
    return me;
  }
  const rid = () => Array.from(crypto.getRandomValues(new Uint8Array(10)), (b) => b.toString(16).padStart(2, '0')).join('');
  async function createWithLogin(name, password) {
    for (let i = 0; i < 8; i++) {
      const login = slugLogin(name);
      try { return { login, uid: await auth.createAndSignIn(login, password) }; } catch (e) { if (e.code !== 'exists') throw e; }
    }
    throw bad("Login yaratib bo'lmadi, qayta urinib ko'ring");
  }
  return {
    exam,
    // ro'yxatdan o'tish oynasi uchun: tanlangan hudud bo'yicha o'quv markazlar (kirmasdan ham ko'rinadi)
    async listSchools(region, district) {
      const rows = await store.query('schools', [['region', '==', String(region)], ['district', '==', String(district)]]);
      return rows.map((r) => ({ id: r.id, name: r.name })).sort(byName);
    },
    // yangi o'quv markaz + uning rahbari (o'qituvchi) hisobi
    async registerSchool({ region, district, schoolName, name, login, password }) {
      region = needStr(region, 'Viloyat', 80); district = needStr(district, 'Tuman', 80); schoolName = needStr(schoolName, "O'quv markaz nomi", 120);
      name = needStr(name, 'Ism familiya', 100); login = normLogin(login);
      if (String(password || '').length < 6) throw bad("Parol kamida 6 belgi bo'lsin");
      const uid = await auth.createAndSignIn(login, password);
      const sid = rid();
      try {
        await store.batch([
          { op: 'set', col: 'schools', id: sid, data: { name: schoolName, region, district, ownerId: uid, created: nowIso() } },
          { op: 'set', col: 'users', id: uid, data: { role: 'teacher', status: 'active', schoolId: sid, name, login, group_id: null, phone: null, created: nowIso() } },
        ]);
      } catch (e) { await auth.signOut().catch(() => {}); throw new HttpError(403, "Markazni yaratib bo'lmadi. Firestore qoidalari (firestore.rules) qo'yilganini tekshiring: " + (e.message || e)); }
      await loadMe(uid); return { user: pub(me), exam };
    },
    // mavjud markazga qo'shilish: login va parol shu zahoti beriladi, kirish esa rahbar tasdiqlagach ochiladi
    async joinSchool({ schoolId, firstName, lastName, role }) {
      firstName = needStr(firstName, 'Ism', 50); lastName = needStr(lastName, 'Familiya', 50);
      if (!['student', 'teacher'].includes(role)) throw bad('Rolni tanlang');
      const sch = await store.get('schools', String(schoolId || '')); if (!sch) throw bad("O'quv markaz topilmadi");
      const name = `${firstName} ${lastName}`; const password = randomPassword();
      const { login, uid } = await createWithLogin(firstName, password);
      const ops = [{ op: 'set', col: 'users', id: uid, data: { role, status: 'pending', schoolId, name, login, group_id: null, phone: null, created: nowIso() } }];
      if (role === 'student') ops.push({ op: 'set', col: 'credentials', id: uid, data: { login, password, schoolId } });
      try { await store.batch(ops); } catch (e) { await auth.signOut().catch(() => {}); throw new HttpError(403, "Ro'yxatdan o'tib bo'lmadi. Firestore qoidalarini tekshiring: " + (e.message || e)); }
      await auth.signOut().catch(() => {});
      return { login, password, name, role, school: sch.name };
    },
    async login(login, password) { const uid = await auth.signIn(normLogin(login), String(password || '')); await loadMe(uid); return { user: pub(me), exam }; },
    async restore() { const uid = await auth.restore(); if (!uid) return null; try { await loadMe(uid); return pub(me); } catch { return null; } },
    async refreshMe() { if (!me) return null; await loadMe(me.id); return pub(me); },
    async logout() { me = null; mySchool = null; await auth.signOut(); },
    async api(path, method = 'GET', body) {
      const [p, qs] = path.split('?'); const query = Object.fromEntries(new URLSearchParams(qs || ''));
      const r = routes.find((x) => x.method === method && x.re.test(p)); if (!r) throw new HttpError(404, 'Topilmadi');
      if (!me) throw new HttpError(401, 'Qayta kiring');
      if (me.status === 'pending') throw new HttpError(403, 'Hisobingiz hali tasdiqlanmagan');
      if (!r.roles.includes(me.role)) throw new HttpError(403, "Ruxsat yo'q");
      return r.handler({ params: r.re.exec(p).groups || {}, query, body: body || {} });
    },
  };
}
