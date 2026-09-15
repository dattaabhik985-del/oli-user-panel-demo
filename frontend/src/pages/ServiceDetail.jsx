import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Phone, UploadCloud, Info, Eye, Download, Trash2, PartyPopper, BadgeCheck, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useStore, fmtNow, downloadDataUrl } from '../oli/store';
import { SERVICE_ETA } from '../oli/data';
import { useLayout } from '../oli/Layout';
import { Card, Btn, LiveBadge, StageBadge, Progress, Stepper, Modal } from '../oli/ui';
import { InstrModal, PreviewModal, InvoiceViewModal, useUploadFlow, OtpModal } from '../oli/modals';
import { invoiceDoc, receiptDoc, certificateDoc } from '../oli/pdf';

export default function ServiceDetail() {
  const { oliId } = useParams();
  const { state, set, expertOf } = useStore();
  const layout = useLayout();
  const navigate = useNavigate();
  const svc = state.services.find(s => s.oliId === oliId);
  const { requestUpload, uploadConfirmNode } = useUploadFlow();
  const [instrDoc, setInstrDoc] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [completedOpen, setCompletedOpen] = useState(false);
  const [delDoc, setDelDoc] = useState(null);

  useEffect(() => {
    if (svc && svc.completed && !svc.feedback) {
      const t = setTimeout(() => layout.openFeedback(svc.oliId), 600);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svc && svc.oliId, svc && svc.completed, svc && !!svc.feedback]);

  if (!svc) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <button className="text-xs text-gray-400 hover:text-gray-600 inline-flex items-center gap-1" onClick={() => navigate('/services')}><ArrowLeft size={13} /> Back to All Services</button>
        <Card className="p-8 mt-4 text-center text-sm text-gray-400" data-testid="service-not-found">Service not found.</Card>
      </div>
    );
  }

  const expert = expertOf(svc);
  const invoice = state.invoices.find(i => i.oliId === svc.oliId);
  const receipt = state.receipts.find(r => r.oliId === svc.oliId);

  const updateSvc = (fn) => set(st => { const s = st.services.find(x => x.oliId === svc.oliId); if (s) fn(s); return st; });

  const toggleLive = () => {
    updateSvc(s => {
      s.live = !s.live;
      s.liveSince = s.live ? fmtNow() : null;
      s.lastUpdated = fmtNow();
    });
    toast.success(svc.live ? `Live work stopped for ${svc.oliId}.` : `Live work started for ${svc.oliId}. It now appears under Dashboard Live Work.`);
  };

  const advanceStage = () => {
    if (svc.completed) return;
    if (svc.stage === 1) {
      updateSvc(s => { s.stage = 2; s.progress = Math.max(s.progress, 60); s.remark = 'Your application is being prepared and filed with the department.'; s.lastUpdated = fmtNow(); });
      toast.success('Stage advanced to Application and Filing.');
    } else {
      markDone();
    }
  };

  const markDone = () => {
    updateSvc(s => {
      s.completed = true; s.stage = 3; s.progress = 100; s.live = false; s.liveSince = null;
      s.completedAt = fmtNow().replace(',', ' ·');
      s.nextAction = '—';
      s.remark = 'Work completed successfully. Final documents/certificate delivered.';
      s.lastUpdated = fmtNow();
      if (!s.cert) {
        const prefix = { tm: 'TM', iso: 'ISO', gst: 'GSTIN', fssai: 'FSSAI', company: 'CIN', iec: 'IEC' }[s.key];
        if (prefix) s.cert = { no: `${prefix}-${Math.floor(1000000 + Math.random() * 9000000)}`, issuedOn: fmtNow().split(',')[0] };
      }
    });
    setCompletedOpen(true);
  };

  const closeCompleted = () => {
    setCompletedOpen(false);
    if (!svc.feedback) layout.openFeedback(svc.oliId);
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto" data-testid="service-detail-page">
      <button data-testid="back-to-services-btn" className="text-xs text-gray-400 hover:text-gray-600 inline-flex items-center gap-1" onClick={() => navigate('/services')}>
        <ArrowLeft size={13} /> Back to All Services
      </button>

      <div className="grid lg:grid-cols-3 gap-4 mt-3">
        <Card className="lg:col-span-2 p-5" data-testid="service-header-card">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-gray-800">{svc.name}</h2>
            {svc.live && <LiveBadge />}
            <StageBadge svc={svc} />
          </div>
          <p className="text-[11px] text-gray-400 mt-1">{svc.oliId} · Started on: {svc.startedOn}</p>
          <p className="text-[11px] text-gray-400 mt-0.5" data-testid="expected-completion">Expected Completion: <b className="text-gray-600 font-medium">{SERVICE_ETA[svc.key] || '7-15 Days'}</b></p>
          {svc.live && <p className="text-[11px] text-gray-400 italic mt-1">An Online Legal India agent is currently working on this service.</p>}
          {svc.meta && svc.meta.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {svc.meta.map((m, i) => (
                <span key={i} className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${i === 2 ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-[#2E6BEA]'}`} data-testid={`service-chip-${i}`}>{m}</span>
              ))}
            </div>
          )}
          {svc.completed && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-50 border border-green-100 px-3 py-2" data-testid="completed-banner">
              <BadgeCheck size={15} className="text-[#16A34A]" />
              <p className="text-xs text-[#16A34A] font-medium">{svc.name} Completed <span className="font-normal text-green-600/70">{svc.completedAt}</span></p>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-4">
            <Btn color="orange" outline data-testid="raise-callback-btn" onClick={() => layout.openCallback(svc.oliId)}><Phone size={13} /> Raise Callback</Btn>
            {!svc.completed && <Btn color="blue" data-testid="advance-stage-btn" onClick={advanceStage}>Advance Stage (demo)</Btn>}
            {!svc.completed && <Btn color="green" data-testid="mark-done-btn" onClick={markDone}>Mark Work Done (demo)</Btn>}
            <Btn color={svc.live ? 'gray' : 'orange'} data-testid="toggle-live-btn" onClick={toggleLive}>{svc.live ? 'Stop LIVE (demo)' : 'Start LIVE (demo)'}</Btn>
          </div>
        </Card>

        <Card className="p-5" data-testid="expert-card">
          <p className="text-[10px] font-semibold tracking-widest text-gray-400">ASSIGNED EXPERT</p>
          {expert ? (
            <div className="flex items-center gap-3 mt-3">
              <div className="w-11 h-11 rounded-full bg-[#2E6BEA] text-white flex items-center justify-center text-sm font-bold shrink-0" data-testid="expert-avatar">
                {expert.name.split(' ').map(w => w[0]).join('')}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800" data-testid="expert-name">{expert.name}</p>
                <p className="text-[11px] text-gray-400" data-testid="expert-did">DID: {expert.did}</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400 mt-3" data-testid="expert-pending">Expert assignment pending (within 24 hrs)</p>
          )}
          {svc.lastCall && (
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-100 px-3 py-1.5" data-testid="last-call-pill">
              <Clock size={12} className="text-[#EA6D27]" />
              <span className="text-[10px] text-orange-600">Last call {svc.lastCall.date} at {svc.lastCall.time}</span>
            </div>
          )}
        </Card>
      </div>

      <Card className="p-5 mt-4" data-testid="service-progress-card">
        <p className="text-sm font-semibold text-gray-800">Service Progress</p>
        <div className="mt-4 max-w-xl mx-auto"><Stepper stage={svc.stage} completed={svc.completed} /></div>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1"><Progress value={svc.progress} green={svc.completed} /></div>
          <span className="text-[11px] font-semibold text-[#2E6BEA] whitespace-nowrap" data-testid="progress-label">{svc.progress}% Completed</span>
        </div>
        <div className="mt-4 rounded-md bg-slate-50 border-l-4 border-[#2E6BEA] px-3 py-2.5">
          <p className="text-xs text-gray-600" data-testid="service-remark"><b>Remarks:</b> {svc.remark}</p>
        </div>
      </Card>

      <Card className="p-5 mt-4" data-testid="required-docs-card">
        <p className="text-sm font-semibold text-gray-800">Required Documents</p>
        <p className="text-[10px] text-gray-400 mt-0.5" data-testid="max-filesize-note">Maximum file size: 5 MB</p>
        <div className="mt-3 divide-y divide-gray-50">
          {svc.requiredDocs.map(r => (
            <div key={r.name} className="flex items-center gap-3 py-3" data-testid={`req-doc-${r.name.replace(/[^a-z0-9]/gi, '-')}`}>
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"><UploadCloud size={16} className="text-gray-400" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700">{r.name}</p>
                <p className="text-[10px] text-gray-400">Accepted: {r.accepted}</p>
              </div>
              <Btn color="blue" outline data-testid={`instr-btn-${r.name.replace(/[^a-z0-9]/gi, '-')}`} onClick={() => setInstrDoc(r)}><Info size={12} /> Instructions</Btn>
              {r.uploaded ? (
                <span className="rounded-full bg-green-100 text-green-600 px-2.5 py-1 text-[10px] font-medium" data-testid="req-doc-uploaded-badge">Uploaded</span>
              ) : (
                <Btn color="blue" data-testid={`upload-btn-${r.name.replace(/[^a-z0-9]/gi, '-')}`} onClick={() => requestUpload(svc.oliId, r.name, r.accepted)}>Upload</Btn>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5 mt-4" data-testid="submitted-docs-card">
        <p className="text-sm font-semibold text-gray-800">Uploaded Documents</p>
        <div className="mt-3 divide-y divide-gray-50">
          {svc.docs.length === 0 && <p className="text-xs text-gray-400 py-3">No documents uploaded yet.</p>}
          {svc.docs.map(d => (
            <div key={d.id} className="flex items-center gap-3 py-3" data-testid={`doc-row-${d.id}`}>
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0"><Eye size={15} className="text-[#2E6BEA]" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 truncate">{d.name}</p>
                <p className="text-[10px] text-gray-400">{d.typeLabel} · {d.date}</p>
              </div>
              <Btn color="blue" data-testid={`doc-preview-${d.id}`} onClick={() => setPreviewDoc(d)}>Preview</Btn>
              <button data-testid={`doc-download-${d.id}`} className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#2E6BEA] hover:border-[#2E6BEA]" onClick={() => downloadDataUrl(d.dataUrl, d.name)}><Download size={14} /></button>
              <button data-testid={`doc-delete-${d.id}`} className="w-8 h-8 rounded-md border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-50" onClick={() => setDelDoc(d)}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5 mt-4 mb-6" data-testid="payments-card">
        <p className="text-sm font-semibold text-gray-800">Payments &amp; Receipts</p>
        <div className="mt-3 divide-y divide-gray-50">
          {invoice && (
            <div className="flex items-center gap-3 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700">OLI Invoice {invoice.no}</p>
                <p className="text-[10px] text-gray-400">Paid to Online Legal India · {invoice.date} · ₹{invoice.amount}</p>
              </div>
              <Btn color="blue" data-testid="invoice-view-btn" onClick={() => setViewItem({ item: invoice, kind: 'invoice' })}>View</Btn>
              <Btn color="gray" outline data-testid="invoice-download-btn" onClick={() => invoiceDoc(invoice).save(`${invoice.no.replaceAll('/', '-')}.pdf`)}>Download</Btn>
            </div>
          )}
          {receipt && (
            <div className="flex items-center gap-3 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700">Govt Receipt · {receipt.ref}</p>
                <p className="text-[10px] text-gray-400">Government fee paid via OLI · {receipt.date} · ₹{receipt.fee} · Paid</p>
              </div>
              <Btn color="blue" data-testid="receipt-view-btn" onClick={() => setViewItem({ item: receipt, kind: 'receipt' })}>View</Btn>
              <Btn color="gray" outline data-testid="receipt-download-btn" onClick={() => receiptDoc(receipt).save(`${receipt.ref}.pdf`)}>Download</Btn>
            </div>
          )}
          {svc.cert && (
            <div className="flex items-center gap-3 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700">Certificate · {svc.cert.no}</p>
                <p className="text-[10px] text-gray-400">Issued on {svc.cert.issuedOn}</p>
              </div>
              <Btn color="green" data-testid="cert-download-btn" onClick={() => certificateDoc(svc).save(`${svc.cert.no}.pdf`)}>Download Certificate</Btn>
            </div>
          )}
          {!invoice && !receipt && !svc.cert && <p className="text-xs text-gray-400 py-3">No payments recorded for this service yet.</p>}
        </div>
      </Card>

      <InstrModal open={!!instrDoc} doc={instrDoc} onClose={() => setInstrDoc(null)} />
      <PreviewModal open={!!previewDoc} doc={previewDoc} onClose={() => setPreviewDoc(null)} />
      <InvoiceViewModal open={!!viewItem} item={viewItem ? viewItem.item : null} kind={viewItem ? viewItem.kind : 'invoice'} onClose={() => setViewItem(null)} />
      {uploadConfirmNode}

      <Modal open={!!delDoc} onClose={() => setDelDoc(null)} testid="delete-doc-modal">
        <p className="text-sm font-medium text-gray-800">Are you sure you want to delete "{delDoc ? delDoc.name : ''}"?</p>
        <div className="flex justify-end gap-2 mt-6">
          <Btn color="gray" size="md" onClick={() => setDelDoc(null)} data-testid="delete-cancel-btn">Cancel</Btn>
          <Btn color="red" size="md" data-testid="delete-confirm-btn" onClick={() => {
            updateSvc(s => { s.docs = s.docs.filter(x => x.id !== delDoc.id); });
            toast.success('Document deleted.');
            setDelDoc(null);
          }}>Delete</Btn>
        </div>
      </Modal>

      <Modal open={completedOpen} onClose={closeCompleted} title="Service Completed 🎉" testid="service-completed-modal">
        <div className="flex flex-col items-center text-center py-2">
          <PartyPopper size={40} className="text-[#EA6D27]" />
          <p className="text-xs text-gray-500 mt-3">Your service has been completed successfully.<br />We have a few services that may be useful for your business.</p>
          <div className="flex gap-2 mt-5">
            <Btn color="gray" size="md" onClick={closeCompleted} data-testid="completed-later-btn">Later</Btn>
            <Btn color="orange" size="md" data-testid="completed-view-reco-btn" onClick={() => { setCompletedOpen(false); navigate('/recommended'); }}>View Recommended Services</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}
