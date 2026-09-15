import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Star, PartyPopper, Frown } from 'lucide-react';
import { Modal, ConfirmModal, Btn, Field, inputCls } from './ui';
import { useStore, pickFile, fileToDataUrl, fmtNow, docTypeLabel, downloadDataUrl } from './store';
import { EXPERTS } from './data';
import { invoiceDoc, receiptDoc } from './pdf';

export function commitUpload(set, oliId, file, dataUrl, reqDocName) {
  set(st => {
    const s = st.services.find(x => x.oliId === oliId);
    if (!s) return st;
    s.docs.push({
      id: 'doc-' + Math.random().toString(36).slice(2, 9),
      name: file.name,
      typeLabel: docTypeLabel(file.type, file.name),
      mime: file.type || 'application/octet-stream',
      date: fmtNow(),
      dataUrl,
    });
    if (reqDocName) {
      const r = s.requiredDocs.find(r => r.name === reqDocName);
      if (r) r.uploaded = true;
    }
    return st;
  });
}

export function useUploadFlow() {
  const { set } = useStore();
  const [pending, setPending] = useState(null);
  const requestUpload = async (oliId, reqDocName, accept) => {
    const f = await pickFile(accept);
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { toast.error('File exceeds the maximum size of 5 MB. Please select another file.'); return; }
    const dataUrl = await fileToDataUrl(f);
    setPending({ file: f, dataUrl, oliId, reqDoc: reqDocName });
  };
  const uploadConfirmNode = (
    <ConfirmModal
      open={!!pending}
      onClose={() => setPending(null)}
      message={`Are you sure you want to upload "${pending ? pending.file.name : ''}"?`}
      confirmLabel="Yes, Upload"
      color="blue"
      testid="upload-confirm-modal"
      onConfirm={() => {
        commitUpload(set, pending.oliId, pending.file, pending.dataUrl, pending.reqDoc);
        toast.success('Document uploaded successfully.');
        setPending(null);
      }}
    />
  );
  return { requestUpload, uploadConfirmNode };
}

export function OtpModal({ open, onClose, onVerified, title = 'OTP Verification', sub = 'OTP sent to your registered mobile number and email address.', verifyLabel = 'Verify & Save' }) {
  const [otp, setOtp] = useState('');
  const [err, setErr] = useState('');
  useEffect(() => { if (open) { setOtp(''); setErr(''); } }, [open]);
  const verify = () => {
    if (otp === '123456') { onVerified(); }
    else setErr('Incorrect OTP. Demo OTP is 123456.');
  };
  return (
    <Modal open={open} onClose={onClose} title={title} sub={sub} testid="otp-modal">
      <Field label="Enter 6-digit OTP">
        <input
          data-testid="otp-input"
          className={`${inputCls} tracking-[0.6em] text-center font-semibold`}
          placeholder="• • • • • •"
          maxLength={6}
          value={otp}
          onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setErr(''); }}
        />
      </Field>
      {err && <p data-testid="otp-error" className="text-xs text-red-500 mt-1.5">{err}</p>}
      <div className="flex items-center justify-between mt-5">
        <button data-testid="resend-otp-btn" className="text-xs text-[#2E6BEA] hover:underline" onClick={() => toast.info('OTP resent (demo OTP: 123456)')}>Resend OTP</button>
        <div className="flex gap-2">
          <Btn color="gray" onClick={onClose} data-testid="otp-cancel-btn">Cancel</Btn>
          <Btn color="blue" onClick={verify} data-testid="otp-verify-btn">{verifyLabel}</Btn>
        </div>
      </div>
    </Modal>
  );
}

export function CallbackModal({ open, preselect, onClose }) {
  const { state, set } = useStore();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [remark, setRemark] = useState('');
  useEffect(() => {
    if (open) {
      setQ(''); setDate(''); setTime(''); setRemark('');
      setSel(preselect || null);
    }
  }, [open, preselect]);

  const matches = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return state.services.slice(0, 5);
    return state.services.filter(x =>
      x.oliId.toLowerCase().includes(s) ||
      x.name.toLowerCase().includes(s) ||
      (x.expert != null && ['Abhik Datta','Rahul Verma','Sneha Iyer','Arjun Mehta','Kavita Rao','Meera Nair','Priya Sharma','Vikram Singh'][x.expert].toLowerCase().includes(s))
    ).slice(0, 6);
  }, [q, state.services]);

  const svc = sel ? state.services.find(x => x.oliId === sel) : null;
  const existing = sel ? state.callbacks.find(c => c.oliId === sel && c.status === 'Pending') : null;
  const selExpert = svc && svc.expert != null ? EXPERTS[svc.expert] : { name: 'To be assigned', did: '—' };

  const submit = () => {
    if (!svc) { toast.error('Please select a service / OLI ID.'); return; }
    if (!date || !time) { toast.error('Please pick a preferred date and time.'); return; }
    set(st => {
      const cur = st.callbacks.find(c => c.oliId === svc.oliId && c.status === 'Pending');
      if (cur) {
        cur.revisedAt = fmtNow();
        cur.preferred = `${date} ${time}`;
        cur.remark = remark || cur.remark;
        cur.history.push({ at: fmtNow(), action: 'Revised', detail: `Preferred updated to ${date} ${time}` });
      } else {
        st.callbacks.unshift({
          id: 'cb-' + Math.random().toString(36).slice(2, 8),
          oliId: svc.oliId, service: svc.name, expert: selExpert.name, did: selExpert.did,
          requestedAt: fmtNow(), revisedAt: '—', preferred: `${date} ${time}`,
          status: 'Pending', remark: remark || '—',
          history: [{ at: fmtNow(), action: 'Requested', detail: `Preferred ${date} ${time}` }],
        });
      }
      return st;
    });
    toast.success(existing ? 'Callback request revised.' : 'Callback request submitted.');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Request a Callback" sub="Search by OLI ID, service name or assigned expert, then pick a convenient time." testid="callback-modal">
      {!svc && (
        <>
          <input data-testid="callback-search-input" className={inputCls} placeholder="e.g. OLI12345678914785 or GST or Abhik" value={q} onChange={e => setQ(e.target.value)} />
          <div className="mt-2 max-h-44 overflow-y-auto oli-scroll divide-y divide-gray-50 border border-gray-100 rounded-md">
            {matches.map(m => {
              const exp = m.expert != null ? EXPERTS[m.expert].name : 'To be assigned';
              const did = m.expert != null ? EXPERTS[m.expert].did : '';
              const hasActive = state.callbacks.some(c => c.oliId === m.oliId && c.status === 'Pending');
              return (
                <button
                  key={m.oliId}
                  data-testid={`callback-option-${m.oliId}`}
                  onClick={() => setSel(m.oliId)}
                  className="w-full text-left px-3 py-2 hover:bg-orange-50/60"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-gray-800">{m.name} · <span className="text-gray-400">{m.oliId}</span></span>
                    {hasActive && <span className="text-[9px] font-semibold text-orange-500 bg-orange-50 border border-orange-200 rounded-full px-2 py-0.5 whitespace-nowrap">Active request — will be revised</span>}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">Expert: {exp}{did ? ` · DID: ${did}` : ''}</p>
                </button>
              );
            })}
          </div>
        </>
      )}
      {svc && (
        <div className="rounded-lg border border-orange-200 bg-orange-50/60 p-3" data-testid="callback-selected-box">
          <div className="flex items-start justify-between gap-2">
            <div className="text-xs space-y-1">
              <p className="text-gray-500">Selected Service: <b className="text-gray-800" data-testid="callback-selected-service">{svc.name}</b></p>
              <p className="text-gray-500">Selected OLI ID: <b className="text-gray-800" data-testid="callback-selected-oliid">{svc.oliId}</b></p>
              <p className="text-gray-500">Assigned Expert: <b className="text-gray-800" data-testid="callback-selected-expert">{selExpert.name}</b></p>
              <p className="text-gray-500">DID: <b className="text-gray-800" data-testid="callback-selected-did">{selExpert.did}</b></p>
            </div>
            <button data-testid="callback-change-btn" className="text-[11px] text-[#2E6BEA] hover:underline shrink-0" onClick={() => setSel(null)}>Change</button>
          </div>
          {existing && <span className="inline-block mt-2 text-[9px] font-semibold text-orange-500 bg-orange-50 border border-orange-200 rounded-full px-2 py-0.5">Active request — will be revised</span>}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 mt-3">
        <Field label="Preferred Date"><input data-testid="callback-date-input" type="date" className={inputCls} value={date} onChange={e => setDate(e.target.value)} /></Field>
        <Field label="Preferred Time"><input data-testid="callback-time-input" type="time" className={inputCls} value={time} onChange={e => setTime(e.target.value)} /></Field>
      </div>
      <div className="mt-3">
        <Field label="Remark / Reason">
          <textarea data-testid="callback-remark-input" rows={2} className={inputCls} placeholder="Briefly describe what you want to discuss" value={remark} onChange={e => setRemark(e.target.value)} />
        </Field>
      </div>
      <div className="flex justify-end gap-2 mt-5">
        <Btn color="gray" onClick={onClose} data-testid="callback-cancel-btn">Cancel</Btn>
        <Btn color="orange" onClick={submit} data-testid="callback-submit-btn">Submit Request</Btn>
      </div>
    </Modal>
  );
}

export function ComplaintModal({ open, preselect, onClose }) {
  const { state, set } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState('form');
  const [svc, setSvc] = useState('General');
  const [subject, setSubject] = useState('');
  const [desc, setDesc] = useState('');
  const [ticket, setTicket] = useState(null);
  useEffect(() => {
    if (open) {
      setStep('form'); setSubject(''); setDesc(''); setTicket(null);
      setSvc(preselect || 'General');
    }
  }, [open, preselect]);

  const doSubmit = () => {
    const t = String(Math.floor(10000 + Math.random() * 90000));
    const now = fmtNow();
    set(st => {
      st.complaints.unshift({
        id: t, service: svc, subject, desc, at: now,
        status: 'Assigned to Escalation Department', statusIndex: 1,
        workCompleted: ['Complaint registered by the customer', 'Ticket assigned to the Escalation Department'],
        pendingWork: ['Detailed review of your complaint', 'Callback from the escalation team', 'Final resolution'],
        latestUpdate: `${now} — Ticket assigned to the Escalation Department.`,
        teamRemark: 'We have received your complaint. Our escalation team will reach out to you shortly.',
      });
      return st;
    });
    setTicket(t);
    setStep('done');
  };

  return (
    <>
      <Modal open={open && step === 'form'} onClose={onClose} title="Raise a Complaint" sub="Tell us what went wrong. We take every complaint seriously." testid="complaint-modal">
        <Field label="Related Service">
          <select data-testid="complaint-service-select" className={inputCls} value={svc} onChange={e => setSvc(e.target.value)}>
            <option value="General" label="General" />
            {state.services.map(s => <option key={s.oliId} value={s.oliId} label={`${s.name} · ${s.oliId}`} />)}
          </select>
        </Field>
        <div className="mt-3"><Field label="Subject"><input data-testid="complaint-subject-input" className={inputCls} placeholder="e.g. Delay in filing" value={subject} onChange={e => setSubject(e.target.value)} /></Field></div>
        <div className="mt-3"><Field label="Description"><textarea data-testid="complaint-desc-input" rows={3} className={inputCls} placeholder="Describe your issue in detail" value={desc} onChange={e => setDesc(e.target.value)} /></Field></div>
        <div className="flex justify-end gap-2 mt-5">
          <Btn color="gray" onClick={onClose} data-testid="complaint-cancel-btn">Cancel</Btn>
          <Btn color="red" data-testid="complaint-submit-btn" onClick={() => {
            if (!subject.trim()) { toast.error('Please enter a subject.'); return; }
            setStep('confirm');
          }}>Submit Complaint</Btn>
        </div>
      </Modal>
      <ConfirmModal
        open={open && step === 'confirm'}
        onClose={() => setStep('form')}
        onConfirm={doSubmit}
        message="Are you sure you want to submit this complaint?"
        confirmLabel="Submit Complaint"
        color="red"
        testid="complaint-confirm-modal"
      />
      <Modal open={open && step === 'done'} onClose={onClose} title="Complaint Registered" testid="complaint-success-modal">
        <div className="flex flex-col items-center text-center py-2">
          <Frown size={44} className="text-amber-400" data-testid="complaint-sad-icon" />
          <p className="text-xs text-gray-500 mt-3 max-w-[240px]">Sorry for the inconvenience, we will reach out to you soon to make your service better.</p>
          <p data-testid="complaint-ticket-id" className="text-sm font-semibold text-gray-800 mt-3">Ticket ID: {ticket}</p>
          <div className="flex gap-2 mt-4">
            <Btn color="gray" onClick={onClose} data-testid="complaint-done-btn">Done</Btn>
            <Btn color="blue" data-testid="track-ticket-btn" onClick={() => { onClose(); navigate(`/ticket/${ticket}`); }}>Track Ticket ID</Btn>
          </div>
        </div>
      </Modal>
    </>
  );
}

export function FeedbackModal({ open, preselect, onClose }) {
  const { state, set } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState('form');
  const [svc, setSvc] = useState('');
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(null);
  useEffect(() => {
    if (open) { setStep('form'); setSvc(preselect || ''); setStars(0); setReview(''); setSubmitted(null); }
  }, [open, preselect]);
  const submit = () => {
    if (!stars) { toast.error('Please select a star rating.'); return; }
    const target = svc ? state.services.find(x => x.oliId === svc) : null;
    set(st => {
      if (svc) {
        const s = st.services.find(x => x.oliId === svc);
        if (s) s.feedback = { stars, review, at: fmtNow() };
      }
      st.feedbackLog.unshift({ oliId: svc || null, stars, review, at: fmtNow() });
      return st;
    });
    setSubmitted({ stars, forCompleted: !!(target && target.completed) });
    setStep('response');
  };
  const positive = submitted ? submitted.stars >= 4 : true;
  useEffect(() => {
    if (step === 'response' && submitted && submitted.forCompleted) {
      const t = setTimeout(() => { onClose(); navigate('/recommended'); }, 2500);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, submitted]);
  return (
    <>
      <Modal open={open && step === 'form'} onClose={onClose} title="Share Your Feedback" sub="Rate your experience with Online Legal India." testid="feedback-modal">
        <Field label="Service (optional)">
          <select data-testid="feedback-service-select" className={inputCls} value={svc} onChange={e => setSvc(e.target.value)}>
            <option value="" label="General feedback" />
            {state.services.map(s => <option key={s.oliId} value={s.oliId} label={`${s.name} · ${s.oliId}`} />)}
          </select>
        </Field>
        <div className="flex gap-1 mt-3" data-testid="feedback-stars">
          {[1, 2, 3, 4, 5].map(i => (
            <button key={i} data-testid={`feedback-star-${i}`} onClick={() => setStars(i)}>
              <Star size={24} className={i <= stars ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
            </button>
          ))}
        </div>
        <div className="mt-3"><Field label="Write a review"><textarea data-testid="feedback-review-input" rows={3} className={inputCls} placeholder="Please share your experience..." value={review} onChange={e => setReview(e.target.value)} /></Field></div>
        <div className="flex justify-end gap-2 mt-5">
          <Btn color="gray" onClick={onClose} data-testid="feedback-cancel-btn">Cancel</Btn>
          <Btn color="green" onClick={submit} data-testid="feedback-submit-btn">Submit Review</Btn>
        </div>
      </Modal>
      <Modal open={open && step === 'response'} onClose={onClose} title="Feedback Submitted" testid="feedback-response-modal">
        <div className="flex flex-col items-center text-center py-2">
          {positive ? (
            <p data-testid="feedback-response-positive" className="text-sm font-medium text-gray-800">Your feedback is valuable for us 🙏</p>
          ) : (
            <>
              <Frown size={42} className="text-amber-400" data-testid="feedback-sad-icon" />
              <p data-testid="feedback-response-negative" className="text-sm font-medium text-gray-800 mt-3 max-w-[260px]">Sorry for the inconvenience, we are committed to serve you better in future</p>
            </>
          )}
          <div className="flex gap-2 mt-5">
            {submitted && submitted.forCompleted ? (
              <Btn color="orange" size="md" data-testid="feedback-view-reco-btn" onClick={() => { onClose(); navigate('/recommended'); }}>View Recommended Services</Btn>
            ) : (
              <Btn color="blue" size="md" data-testid="feedback-done-btn" onClick={onClose}>Done</Btn>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

export function SuggestionModal({ open, onClose }) {
  const { set } = useStore();
  const [text, setText] = useState('');
  const [confirm, setConfirm] = useState(false);
  useEffect(() => { if (open) { setText(''); setConfirm(false); } }, [open]);
  const submit = () => {
    set(st => { st.suggestions.unshift({ text, at: fmtNow() }); return st; });
    setConfirm(false);
    toast.success('Thank you! Your suggestion has been submitted.');
    onClose();
  };
  return (
    <>
      <Modal open={open && !confirm} onClose={onClose} title="Give a Suggestion" sub="Help us improve your experience." testid="suggestion-modal">
        <Field label="How can we improve our service?">
          <textarea data-testid="suggestion-input" rows={4} className={inputCls} placeholder="Share your suggestion..." value={text} onChange={e => setText(e.target.value)} />
        </Field>
        <div className="flex justify-end gap-2 mt-5">
          <Btn color="gray" onClick={onClose} data-testid="suggestion-cancel-btn">Cancel</Btn>
          <Btn color="green" data-testid="suggestion-submit-btn" onClick={() => {
            if (!text.trim()) { toast.error('Please write your suggestion.'); return; }
            setConfirm(true);
          }}>Submit</Btn>
        </div>
      </Modal>
      <ConfirmModal open={open && confirm} onClose={() => setConfirm(false)} onConfirm={submit} message="Are you sure you want to submit this suggestion?" confirmLabel="Submit" color="green" testid="suggestion-confirm-modal" />
    </>
  );
}

export function CheckoutModal({ open, item, onClose }) {
  const { set, newOliId } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState('review');
  const [oliId, setOliId] = useState(null);
  useEffect(() => { if (open) { setStep('review'); setOliId(null); } }, [open]);
  if (!item) return null;
  const pay = () => {
    const id = newOliId();
    set(st => {
      st.services.push({
        key: 'custom', name: item.name, oliId: id, sub: 'Purchased via ExploreServices', meta: [],
        stage: 1, progress: 5, live: false, liveSince: null, pendingExpert: true,
        startedOn: fmtNow().split(',')[0], lastUpdated: fmtNow(),
        nextAction: 'Awaiting expert assignment (within 24 hrs)',
        remark: 'Your request has been received. An expert will be assigned within 24 hours.',
        expert: null, lastCall: null,
        requiredDocs: [{ name: 'Basic KYC Document', accepted: '.pdf,.jpg,.png', uploaded: false }],
        docs: [], completed: false, completedAt: null, cert: null, feedback: null,
      });
      st.invoices.unshift({ no: 'OLI/2026/' + Math.floor(1100 + Math.random() * 800), oliId: id, service: item.name, date: fmtNow().split(',')[0], amount: item.fee, status: 'Paid' });
      return st;
    });
    setOliId(id);
    setStep('success');
  };
  return (
    <>
      <Modal open={open && step === 'review'} onClose={onClose} title="Checkout" sub="Demo checkout — no real payment is processed." testid="checkout-modal">
        <div className="divide-y divide-gray-100 text-sm">
          {[['Service', item.name], ['Timeline', item.timeline], ['Professional Fee', `₹${item.fee}`]].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2.5"><span className="font-semibold text-gray-700 text-xs">{k}</span><span className="text-xs text-gray-500 text-right">{v}</span></div>
          ))}
          <div className="flex justify-between py-2.5"><span className="font-semibold text-gray-700 text-xs">Total Payable</span><span className="text-xs font-bold text-gray-800">₹{item.fee}</span></div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <Btn color="gray" onClick={onClose} data-testid="checkout-cancel-btn">Cancel</Btn>
          <Btn color="orange" onClick={pay} data-testid="checkout-pay-btn">Pay ₹{item.fee} (Simulated)</Btn>
        </div>
      </Modal>
      <Modal open={open && step === 'success'} onClose={onClose} title="Payment Successful" testid="payment-success-modal">
        <div className="flex flex-col items-center text-center py-2">
          <PartyPopper size={44} className="text-[#EA6D27]" />
          <p className="text-xs text-gray-500 mt-3 max-w-[260px]">Your order for <b>{item.name}</b> is confirmed. A new OLI ID has been created for this service.</p>
          <p data-testid="payment-new-oliid" className="text-sm font-semibold text-gray-800 mt-3 bg-gray-50 rounded-md px-3 py-1.5">OLI ID: {oliId}</p>
          <Btn color="blue" className="mt-4" data-testid="payment-goto-services-btn" onClick={() => { onClose(); navigate('/services'); }}>Go to My Services</Btn>
        </div>
      </Modal>
    </>
  );
}

export function WelcomeBackModal({ open, onClose }) {
  const { state } = useStore();
  const navigate = useNavigate();
  const { requestUpload, uploadConfirmNode } = useUploadFlow();
  const pending = state.services.filter(s => s.requiredDocs.some(r => !r.uploaded));
  return (
    <Modal open={open} onClose={onClose} title="Welcome Back 👋" sub="Required Documents — please upload the following to keep your services moving." wide testid="welcome-back-modal">
      <p className="text-[10px] text-gray-400 mb-3" data-testid="welcome-max-size">Maximum file size: 5 MB per document.</p>
      <div className="space-y-3">
        {pending.map(s => (
          <div key={s.oliId} data-testid={`welcome-docs-${s.oliId}`} className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
              <p className="text-xs font-semibold text-gray-800">{s.name}</p>
              <p className="text-[10px] text-gray-400">{s.oliId}</p>
            </div>
            <div className="px-3 py-2.5">
              <p className="text-[9px] font-semibold tracking-widest text-gray-400 mb-1.5">REQUIRED DOCUMENTS</p>
              <div className="space-y-1.5">
                {s.requiredDocs.filter(r => !r.uploaded).map(r => (
                  <div key={r.name} className="flex items-center justify-between gap-2 py-1">
                    <span className="text-xs text-gray-600">{r.name}</span>
                    <span className="flex items-center gap-2">
                      <span className="rounded-full bg-red-50 text-red-500 border border-red-100 px-2 py-0.5 text-[10px] font-medium">Required</span>
                      <Btn color="blue" data-testid={`welcome-upload-${s.oliId}-${r.name}`} onClick={() => requestUpload(s.oliId, r.name, r.accepted)}>Upload</Btn>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        {pending.length === 0 && <p className="text-xs text-gray-400">All required documents have been uploaded. Thank you!</p>}
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Btn color="gray" size="md" onClick={onClose} data-testid="welcome-later-btn">Later</Btn>
        <Btn color="orange" size="md" data-testid="welcome-proceed-btn" onClick={() => { onClose(); navigate('/documents'); }}>Proceed To Upload</Btn>
      </div>
      {uploadConfirmNode}
    </Modal>
  );
}

export function InstrModal({ open, doc, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Upload Instructions" testid="instructions-modal">
      {doc && (
        <div className="text-xs text-gray-600 space-y-2 leading-relaxed">
          <p>Please upload a clear, legible scan or photo of your <b>{doc.name}</b>.</p>
          <p>Accepted formats: <b>{doc.accepted}</b></p>
          <ul className="list-disc pl-4 space-y-1 text-gray-500">
            <li>Make sure all four corners of the document are visible.</li>
            <li>The document should be valid and not expired.</li>
            <li>Maximum file size: 5 MB.</li>
            <li>Your file is stored securely in your browser for this demo.</li>
          </ul>
        </div>
      )}
      <div className="flex justify-end mt-5"><Btn color="blue" onClick={onClose} data-testid="instructions-ok-btn">Got It</Btn></div>
    </Modal>
  );
}

export function PreviewModal({ open, doc, onClose }) {
  if (!doc) return null;
  const isPdf = doc.mime === 'application/pdf' || /\.pdf$/i.test(doc.name);
  const isImg = /^image\//.test(doc.mime) || /\.(png|jpe?g|gif|webp)$/i.test(doc.name);
  return (
    <Modal open={open} onClose={onClose} title={doc.name} sub={`${doc.typeLabel} · ${doc.date}`} wide testid="preview-modal">
      <div className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden" data-testid="preview-content">
        {isPdf && <iframe title="preview" src={doc.dataUrl} className="w-full h-[55vh]" />}
        {isImg && <img src={doc.dataUrl} alt={doc.name} className="max-h-[55vh] w-auto mx-auto" />}
        {!isPdf && !isImg && (
          <div className="p-10 text-center text-xs text-gray-400">Preview is not available for this file type. Please download the file to view it.</div>
        )}
      </div>
      <div className="flex justify-end mt-4">
        <Btn color="blue" onClick={() => downloadDataUrl(doc.dataUrl, doc.name)} data-testid="preview-download-btn">Download</Btn>
      </div>
    </Modal>
  );
}

export function InvoiceViewModal({ open, item, kind, onClose }) {
  if (!item) return null;
  const isInv = kind === 'invoice';
  const amount = isInv ? item.amount : item.fee;
  const download = () => {
    const d = isInv ? invoiceDoc(item) : receiptDoc(item);
    d.save(`${(isInv ? item.no : item.ref).replaceAll('/', '-')}.pdf`);
  };
  return (
    <Modal open={open} onClose={onClose} wide testid="invoice-view-modal">
      <div className="border border-gray-200 rounded-lg overflow-hidden" data-testid="invoice-document">
        <div className="flex items-start justify-between gap-3 p-4 border-b-2 border-[#EA6D27]">
          <div>
            <p className="text-sm font-bold text-[#EA6D27]">Online Legal India</p>
            <p className="text-[9px] text-gray-400 mt-0.5">A unit of Rapid Innovation Pvt. Ltd. · support@onlinelegalindia.com · www.onlinelegalindia.com</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-bold text-[#2F346E]">{isInv ? 'TAX INVOICE' : 'GOVT FEE RECEIPT'}</p>
            {isInv ? (
              <>
                <p className="text-[10px] text-gray-500 mt-0.5">Invoice No: <b>{item.no}</b></p>
                <p className="text-[10px] text-gray-500">Invoice Date: <b>{item.date}</b></p>
              </>
            ) : (
              <>
                <p className="text-[10px] text-gray-500 mt-0.5">Receipt Ref: <b>{item.ref}</b></p>
                <p className="text-[10px] text-gray-500">Date: <b>{item.date}</b></p>
              </>
            )}
          </div>
        </div>
        <div className="p-4">
          <p className="text-[9px] font-semibold tracking-widest text-gray-400">BILL TO</p>
          <p className="text-xs font-semibold text-gray-800 mt-0.5">Vamsee Krishna</p>
          <p className="text-[10px] text-gray-400">ABC Foods Private Limited · demo@email.com · +91 98765 43210 · Delhi, India</p>
          <table className="w-full mt-3">
            <thead>
              <tr className="bg-[#2F346E] text-white">
                <th className="text-left px-2 py-1.5 text-[9px] font-medium rounded-l">S.No</th>
                <th className="text-left px-2 py-1.5 text-[9px] font-medium">SERVICE DESCRIPTION</th>
                <th className="text-left px-2 py-1.5 text-[9px] font-medium">OLI ID</th>
                <th className="text-right px-2 py-1.5 text-[9px] font-medium rounded-r">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 text-xs text-gray-600">
                <td className="px-2 py-2">1</td>
                <td className="px-2 py-2">{item.service}</td>
                <td className="px-2 py-2">{item.oliId}</td>
                <td className="px-2 py-2 text-right font-medium">₹{amount}</td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-between items-start mt-3">
            <span className="rounded bg-green-100 text-green-600 px-2 py-0.5 text-[10px] font-bold" data-testid="invoice-paid-badge">PAID</span>
            <div className="text-right">
              <p className="text-[10px] text-gray-400">Taxes (GST): Included</p>
              <p className="text-xs font-bold text-gray-800 mt-0.5">Total Payable: ₹{amount}</p>
            </div>
          </div>
          <p className="text-[9px] text-gray-300 text-center mt-4">Thank you for choosing Online Legal India. This is a computer-generated document and does not require a signature.</p>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Btn color="blue" onClick={download} data-testid="invoice-modal-download-btn">Download</Btn>
      </div>
    </Modal>
  );
}
