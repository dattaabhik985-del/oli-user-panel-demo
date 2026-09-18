import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { SERVICES_SEED, INVOICES_SEED, RECEIPTS_SEED, PROFILE_SEED, CALLBACKS_SEED, EXPERTS } from './data';
import { genPdfDataUrl, genPngDataUrl } from './pdf';

const KEY = 'oli_panel_state_v1';

const uid = (p) => p + '-' + Math.random().toString(36).slice(2, 9);

export function fmtNow() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  let h = d.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}, ${String(h).padStart(2, '0')}:${min} ${ampm}`;
}

function materializeDocs(svc) {
  return (svc.docsSeed || []).map(d => ({
    id: uid('doc'),
    name: d.name,
    typeLabel: d.typeLabel,
    mime: d.mime,
    date: d.date,
    dataUrl: d.mime === 'application/pdf'
      ? genPdfDataUrl(d.name.replace(/\.[^.]+$/, ''), [
          `Service: ${svc.name}`, `OLI ID: ${svc.oliId}`,
          'Uploaded by customer.', 'This is a demo document stored in your browser.',
        ])
      : genPngDataUrl(d.name),
  }));
}

function buildSeed() {
  return {
    v: 1,
    session: { loggedIn: false, via: null },
    auth: { password: 'Demo123@' },
    profile: { ...PROFILE_SEED },
    services: SERVICES_SEED.map(s => ({ ...s, docsSeed: undefined, docs: materializeDocs(s) })),
    invoices: INVOICES_SEED.map(i => ({ ...i })),
    receipts: RECEIPTS_SEED.map(r => ({ ...r })),
    callbacks: CALLBACKS_SEED.map(c => ({ ...c })),
    complaints: [],
    suggestions: [],
    feedbackLog: [],
    deletionLog: [],
  };
}

const StoreCtx = createContext(null);
export const useStore = () => useContext(StoreCtx);

export function StoreProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.v === 1) {
          if (!parsed.auth) parsed.auth = { password: 'Demo123@' };
          if (!parsed.deletionLog) parsed.deletionLog = [];
          const session = sessionStorage.getItem('oli_panel_session');
          parsed.session = session ? JSON.parse(session) : { loggedIn: false, via: null };
          return parsed;
        }
      }
    } catch (e) { /* reseed */ }
    return buildSeed();
  });
  const t = useRef(null);
  useEffect(() => {
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => {
      try {
        const savedState = { ...state, session: { loggedIn: false, via: null } };
        localStorage.setItem(KEY, JSON.stringify(savedState));
        sessionStorage.setItem('oli_panel_session', JSON.stringify(state.session));
      } catch (e) { /* quota */ }
    }, 250);
    return () => clearTimeout(t.current);
  }, [state]);

  const set = (fn) => setState(prev => fn(structuredClone(prev)));
  const reset = () => { localStorage.removeItem(KEY); window.location.reload(); };

  const value = {
    state, set, reset,
    experts: EXPERTS,
    expertOf: (svc) => (svc && svc.expert != null ? EXPERTS[svc.expert] : null),
    getService: (oliId) => state.services.find(s => s.oliId === oliId),
    newOliId: () => 'OLI' + String(Math.floor(Math.random() * 1e14)).padStart(14, '0'),
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function pickFile(accept) {
  return new Promise(resolve => {
    const i = document.createElement('input');
    i.type = 'file';
    if (accept) i.accept = accept;
    i.onchange = () => resolve(i.files && i.files[0] ? i.files[0] : null);
    i.click();
  });
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export function downloadDataUrl(dataUrl, name) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export const docTypeLabel = (mime, name) => {
  if (mime === 'application/pdf' || /\.pdf$/i.test(name)) return 'PDF';
  if (/^image\/png/.test(mime) || /\.png$/i.test(name)) return 'PNG Image';
  if (/^image\//.test(mime) || /\.(jpe?g|gif|webp)$/i.test(name)) return 'Image';
  if (/\.docx?$/i.test(name)) return 'Word Document';
  if (/\.xlsx?$/i.test(name)) return 'Excel Spreadsheet';
  if (/\.zip$/i.test(name)) return 'ZIP';
  return 'File';
};
