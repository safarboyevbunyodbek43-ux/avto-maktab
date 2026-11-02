import { createCore } from './core.js';
import { REGIONS } from './regions.js';
window.REGIONS = REGIONS;

const cfg = window.APP_CONFIG || {};
const exam = { count: 20, minutes: 25, maxErrors: 2, ...(cfg.exam || {}) };
const fbOk = cfg.firebase && cfg.firebase.apiKey && !/SIZNING|YOUR_/i.test(cfg.firebase.apiKey);

function fail(msg) {
  const app = document.getElementById('app');
  app.textContent = '';
  const p = document.createElement('p'); p.style.cssText = 'max-width:560px;margin:10vh auto;padding:0 16px;color:#b3261e'; p.textContent = msg; app.append(p);
}

try {
  let backend; let mode;
  if (fbOk) {
    const { createFirebaseBackend } = await import('./store-firebase.js');
    backend = await createFirebaseBackend(cfg.firebase); mode = 'firebase';
  } else {
    const { createLocalBackend } = await import('./store-local.js');
    backend = createLocalBackend(); mode = 'demo';
  }
  window.BACKEND = Object.assign(createCore({ store: backend.store, auth: backend.auth, exam }), { mode });
  const s = document.createElement('script'); s.src = 'app.js?v=2'; document.body.append(s);
} catch (e) {
  fail("Ilovani yuklab bo'lmadi: " + (e && e.message ? e.message : e) + ". Internet aloqasi va config.js dagi Firebase sozlamasini tekshiring.");
}
