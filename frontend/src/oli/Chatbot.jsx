import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send } from 'lucide-react';
import { useStore } from './store';
import { useLayout } from './Layout';

const CHIPS = [
  'Service Status', 'Connect with an Expert', 'Connect to Support', 'My Invoices',
  'Govt Receipts', 'Recommended Services', 'Buy Another Service',
];

const EXPERT_NAMES = ['Abhik Datta','Rahul Verma','Sneha Iyer','Arjun Mehta','Kavita Rao','Meera Nair','Priya Sharma','Vikram Singh'];

export default function Chatbot() {
  const { state } = useStore();
  const layout = useLayout();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState([
    { from: 'bot', text: "Hi! How may I help? You can ask me things like 'What is the status of my GST?', 'Show my invoices' or 'Connect with an expert'." },
  ]);
  const bodyRef = useRef(null);

  const push = (m) => {
    setMsgs(prev => [...prev, m]);
    setTimeout(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, 60);
  };

  const svcStatusText = (s) => {
    const stage = s.completed ? 'Completed' : s.pendingExpert ? 'Expert Assignment Pending' : s.stage === 2 ? 'Application and Filing' : 'Documentation';
    return `${s.name} (${s.oliId}) is at ${stage} — ${s.progress}% complete.${s.live ? ' An agent is LIVE on it right now.' : ''}${s.completed && s.completedAt ? ` Completed on ${s.completedAt}.` : ''}`;
  };

  const reply = (qRaw) => {
    const q = qRaw.toLowerCase();
    const oliMatch = qRaw.match(/oli\d{6,}/i);
    if (oliMatch) {
      const s = state.services.find(x => x.oliId.toLowerCase() === oliMatch[0].toLowerCase());
      if (s) return { text: svcStatusText(s), actions: [{ label: 'View Service', to: `/service/${s.oliId}` }] };
      return { text: `I could not find ${oliMatch[0].toUpperCase()} in your account. Please check the OLI ID and try again.` };
    }
    if (q.includes('status')) {
      const named = state.services.find(s => q.includes(s.name.toLowerCase().split(' ')[0].toLowerCase()) && s.name.length > 4);
      if (named && q.includes(named.name.split(' ')[0].toLowerCase())) return { text: svcStatusText(named), actions: [{ label: 'View Service', to: `/service/${named.oliId}` }] };
      const live = state.services.filter(s => s.live);
      return {
        text: `You have ${state.services.length} services. ${live.length ? `${live.length} in Live Work: ${live.map(s => s.name).join(', ')}.` : 'None in Live Work right now.'} Ask me about a specific service or OLI ID for details.`,
        actions: [{ label: 'Go to My Services', to: '/services' }],
      };
    }
    if (q.includes('invoice') || q.includes('bill')) return { text: 'You can view and download all invoices paid to Online Legal India from the OLI Invoices page.', actions: [{ label: 'Go to OLI Invoices', to: '/invoices' }] };
    if (q.includes('receipt')) return { text: 'Government fee receipts paid through/via OLI are available on the Govt Receipt page.', actions: [{ label: 'Go to Govt Receipt', to: '/receipts' }] };
    if (q.includes('download')) return { text: 'Invoices and receipts can be downloaded from their pages. Where would you like to go?', actions: [{ label: 'OLI Invoices', to: '/invoices' }, { label: 'Govt Receipt', to: '/receipts' }] };
    if (q.includes('callback') || q.includes('expert') || q.includes('agent') || q.includes('connect') || q.includes('call')) return { text: 'I can raise a callback request with your assigned expert. Opening the callback form for you.', actions: [{ label: 'Open Callback Form', action: 'callback' }] };
    if (q.includes('support') || q.includes('complaint') || q.includes('issue') || q.includes('problem')) return { text: 'I am sorry you are facing an issue. I can connect you to our escalation team via a complaint ticket.', actions: [{ label: 'Raise a Complaint', action: 'complaint' }] };
    if (q.includes('buy') || q.includes('purchase') || q.includes('another service') || q.includes('new service')) return { text: 'You can explore and instantly buy additional OLI services from ExploreServices.', actions: [{ label: 'ExploreServices', to: '/explore' }] };
    if (q.includes('certificate')) return { text: 'Certificates for your completed services are on the My Certificates page.', actions: [{ label: 'My Certificates', to: '/certificates' }] };
    if (q.includes('document') || q.includes('upload')) return { text: 'All your uploaded files are grouped service-wise on the My Documents page.', actions: [{ label: 'My Documents', to: '/documents' }] };
    return { text: "I can help with service status, callbacks, invoices, govt receipts, certificates, documents or buying a new service. Try: 'What is the status of OLI12345678914797?'" };
  };

  const doAction = (a) => {
    if (a.action === 'callback') { layout.openCallback(); return; }
    if (a.action === 'complaint') { layout.openComplaint(); return; }
    if (a.to) navigate(a.to);
  };

  const send = (text) => {
    const q = (text || input).trim();
    if (!q) return;
    push({ from: 'user', text: q });
    setInput('');
    setTimeout(() => push({ from: 'bot', ...reply(q) }), 350);
  };

  const chipAction = (c) => {
    push({ from: 'user', text: c });
    setTimeout(() => {
      if (c === 'Service Status') push({ from: 'bot', ...reply('status') });
      else if (c === 'Connect with an Expert') { push({ from: 'bot', text: 'Opening the callback form — pick your service and a convenient time.' }); layout.openCallback(); }
      else if (c === 'Connect to Support') { push({ from: 'bot', text: 'Opening the complaint form to connect you with our escalation team.' }); layout.openComplaint(); }
      else if (c === 'My Invoices') { push({ from: 'bot', text: 'Taking you to OLI Invoices.' }); navigate('/invoices'); }
      else if (c === 'Govt Receipts') { push({ from: 'bot', text: 'Taking you to Govt Receipts.' }); navigate('/receipts'); }
      else if (c === 'Recommended Services') { push({ from: 'bot', text: 'Taking you to Recommended Services.' }); navigate('/recommended'); }
      else if (c === 'Buy Another Service') { push({ from: 'bot', text: 'Taking you to ExploreServices to buy another service.' }); navigate('/explore'); }
    }, 300);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-2" data-tour="dash-chatbot">
      {open && (
        <div data-testid="chatbot-panel" className="w-80 max-w-[calc(100vw-2.5rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
          <div className="bg-[#2F346E] text-white px-4 py-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold">OLI Support</p>
              <p className="text-[11px] text-indigo-200">How may I help?</p>
            </div>
            <button data-testid="chatbot-close-btn" onClick={() => setOpen(false)} className="text-indigo-200 hover:text-white"><X size={16} /></button>
          </div>
          <div ref={bodyRef} className="h-72 overflow-y-auto oli-scroll p-3 space-y-2 bg-gray-50/60" data-testid="chatbot-messages">
            {msgs.map((m, i) => (
              <div key={i} className={m.from === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${m.from === 'user' ? 'bg-[#EA6D27] text-white' : 'bg-white border border-gray-100 text-gray-600 shadow-sm'}`}>
                  <p>{m.text}</p>
                  {m.actions && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {m.actions.map((a, j) => (
                        <button key={j} data-testid={`chatbot-action-${j}`} onClick={() => doAction(a)} className="rounded-full bg-[#2E6BEA] text-white text-[10px] px-2.5 py-1 hover:bg-[#245cd0]">{a.label}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 px-3 py-2 border-t border-gray-100">
            {CHIPS.map(c => (
              <button key={c} data-testid={`chatbot-chip-${c.replace(/[^a-z]/gi, '-').toLowerCase()}`} onClick={() => chipAction(c)} className="rounded-full border border-gray-200 text-[10px] text-gray-500 px-2.5 py-1 hover:border-[#EA6D27] hover:text-[#EA6D27]">{c}</button>
            ))}
          </div>
          <div className="flex items-center gap-2 p-3 border-t border-gray-100">
            <input
              data-testid="chatbot-input"
              className="flex-1 rounded-full border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#EA6D27]"
              placeholder="Type your question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') send(); }}
            />
            <button data-testid="chatbot-send-btn" onClick={() => send()} className="w-8 h-8 rounded-full bg-[#EA6D27] hover:bg-[#d95f1d] text-white flex items-center justify-center shrink-0"><Send size={14} /></button>
          </div>
        </div>
      )}
      <div className="flex items-center gap-2">
        {!open && <span data-testid="chatbot-bubble" className="bg-white rounded-full shadow-lg border border-gray-100 px-3 py-1.5 text-[11px] text-gray-500">How may I help?</span>}
        <button
          data-testid="chatbot-toggle-btn"
          onClick={() => setOpen(o => !o)}
          className="w-12 h-12 rounded-full bg-[#2F346E] hover:bg-[#262a5c] text-white flex items-center justify-center shadow-xl"
        >
          {open ? <X size={20} /> : <MessageCircle size={20} />}
        </button>
      </div>
    </div>
  );
}
