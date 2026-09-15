import React, { useState } from 'react';
import { FileText, Eye, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useStore, downloadDataUrl } from '../oli/store';
import { Card, Btn, Modal } from '../oli/ui';
import { PreviewModal, useUploadFlow } from '../oli/modals';

export default function MyDocuments() {
  const { state, set } = useStore();
  const [selOli, setSelOli] = useState('');
  const [searched, setSearched] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [delDoc, setDelDoc] = useState(null);
  const { requestUpload, uploadConfirmNode } = useUploadFlow();

  const total = state.services.reduce((n, s) => n + s.docs.length, 0);
  const searchedSvc = searched ? state.services.find(s => s.oliId === searched) : null;
  const visible = searchedSvc ? [searchedSvc] : state.services;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto" data-testid="my-documents-page">
      <h1 className="text-xl font-bold text-gray-800">My Documents</h1>
      <p className="text-xs text-gray-400 mt-0.5">Every file you have uploaded, grouped service-wise.</p>

      <Card className="p-4 mt-4 flex flex-col sm:flex-row gap-3 sm:items-center" data-testid="upload-row">
        <p className="text-xs font-medium text-gray-600 shrink-0">Search a service to view &amp; upload its documents</p>
        <select
          data-testid="upload-service-select"
          className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#EA6D27]"
          value={selOli}
          onChange={e => setSelOli(e.target.value)}
        >
          <option value="" label="Select a service — by name or OLI ID" />
          {state.services.map(s => <option key={s.oliId} value={s.oliId} label={`${s.name} · ${s.oliId}`} />)}
        </select>
        <div className="flex gap-2 shrink-0">
          <Btn color="blue" size="md" data-testid="search-service-btn" onClick={() => {
            if (!selOli) { toast.error('Please select a service to search.'); return; }
            setSearched(selOli);
          }}>Search</Btn>
          {searched && (
            <Btn color="gray" size="md" outline data-testid="clear-search-btn" onClick={() => { setSearched(null); setSelOli(''); }}>Clear Search</Btn>
          )}
        </div>
      </Card>

      {searchedSvc ? (
        <p className="text-xs text-gray-500 mt-4" data-testid="search-result-label">Search Result: <b className="text-gray-800">{searchedSvc.name}</b> · {searchedSvc.oliId}</p>
      ) : (
        <p className="text-[10px] text-gray-300 mt-4" data-testid="all-services-label">All services · {total} files uploaded</p>
      )}
      <div className="space-y-4 mt-2">
        {visible.map(s => (
          <Card key={s.oliId} className="p-5" data-testid={`doc-group-${s.oliId}`}>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-gray-800">{s.name}</p>
              <span className="rounded-full bg-blue-50 text-[#2E6BEA] px-2 py-0.5 text-[10px] font-medium">{s.docs.length} document{s.docs.length !== 1 ? 's' : ''}</span>
              <span className="text-[10px] text-gray-400">{s.oliId}</span>
              {searchedSvc && <Btn color="blue" className="ml-auto" data-testid="upload-document-btn" onClick={() => requestUpload(s.oliId, null, null)}>Upload Document</Btn>}
            </div>
            <div className="mt-3 divide-y divide-gray-50">
              {s.docs.map(d => (
                <div key={d.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 py-3" data-testid={`mydoc-row-${d.id}`}>
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0"><FileText size={15} className="text-[#2E6BEA]" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">{d.name}</p>
                    <p className="text-[10px] text-gray-400">{s.oliId} · {d.typeLabel} · Uploaded {d.date}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 pl-12 sm:pl-0">
                    <Btn color="blue" data-testid={`mydoc-preview-${d.id}`} onClick={() => setPreviewDoc({ ...d, })}><Eye size={12} /> Preview</Btn>
                    <Btn color="blue" outline data-testid={`mydoc-download-${d.id}`} onClick={() => downloadDataUrl(d.dataUrl, d.name)}><Download size={12} /> Download</Btn>
                    <button data-testid={`mydoc-delete-${d.id}`} className="w-8 h-8 rounded-md border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-50" onClick={() => setDelDoc({ svc: s.oliId, doc: d })}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
              {s.docs.length === 0 && <p className="text-xs text-gray-400 py-3">No documents uploaded yet for this service.</p>}
            </div>
          </Card>
        ))}
      </div>

      <PreviewModal open={!!previewDoc} doc={previewDoc} onClose={() => setPreviewDoc(null)} />
      {uploadConfirmNode}
      <Modal open={!!delDoc} onClose={() => setDelDoc(null)} testid="delete-doc-modal">
        <p className="text-sm font-medium text-gray-800">Are you sure you want to delete "{delDoc ? delDoc.doc.name : ''}"?</p>
        <div className="flex justify-end gap-2 mt-6">
          <Btn color="gray" size="md" onClick={() => setDelDoc(null)} data-testid="delete-cancel-btn">Cancel</Btn>
          <Btn color="red" size="md" data-testid="delete-confirm-btn" onClick={() => {
            set(st => {
              const s = st.services.find(x => x.oliId === delDoc.svc);
              if (s) s.docs = s.docs.filter(x => x.id !== delDoc.doc.id);
              return st;
            });
            toast.success('Document deleted.');
            setDelDoc(null);
          }}>Delete</Btn>
        </div>
      </Modal>
    </div>
  );
}
