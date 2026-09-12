import React from 'react';
import { Check, X } from 'lucide-react';

const COLORS = {
  orange: 'bg-[#EA6D27] hover:bg-[#d95f1d] text-white',
  blue: 'bg-[#2E6BEA] hover:bg-[#245cd0] text-white',
  green: 'bg-[#16A34A] hover:bg-[#128a3f] text-white',
  red: 'bg-[#E5484D] hover:bg-[#cd3a3f] text-white',
  gray: 'bg-gray-100 hover:bg-gray-200 text-gray-600',
  navy: 'bg-[#2F346E] hover:bg-[#262a5c] text-white',
};
const OUTLINES = {
  orange: 'border border-[#EA6D27] text-[#EA6D27] hover:bg-orange-50 bg-white',
  blue: 'border border-[#2E6BEA] text-[#2E6BEA] hover:bg-blue-50 bg-white',
  green: 'border border-[#16A34A] text-[#16A34A] hover:bg-green-50 bg-white',
  red: 'border border-[#E5484D] text-[#E5484D] hover:bg-red-50 bg-white',
  gray: 'border border-gray-200 text-gray-500 hover:bg-gray-50 bg-white',
};

export function Btn({ color = 'blue', outline = false, size = 'sm', className = '', ...p }) {
  const sz = size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'md' ? 'px-4 py-2 text-sm' : 'px-5 py-2.5 text-sm';
  return (
    <button
      {...p}
      className={`inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${sz} ${outline ? OUTLINES[color] : COLORS[color]} ${className}`}
    />
  );
}

export function LiveBadge() {
  return (
    <span data-testid="live-badge" className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-red-500">
      <span className="oli-live-dot inline-block w-2 h-2 rounded-full bg-red-500" />LIVE
    </span>
  );
}

export function StageBadge({ svc }) {
  if (svc.completed) return <span className="inline-flex items-center rounded-full bg-green-100 text-green-600 px-2.5 py-0.5 text-[11px] font-medium">Completed</span>;
  if (svc.pendingExpert) return <span className="inline-flex items-center rounded-full bg-orange-50 text-orange-500 border border-orange-200 px-2.5 py-0.5 text-[11px] font-medium">Expert Assignment Pending</span>;
  if (svc.stage === 2) return <span className="inline-flex items-center rounded-full bg-orange-100 text-orange-600 px-2.5 py-0.5 text-[11px] font-medium">Application and Filing</span>;
  return <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-500 px-2.5 py-0.5 text-[11px] font-medium">Documentation</span>;
}

export function WorkDoneBadge() {
  return <span className="inline-flex items-center rounded-full bg-green-100 text-green-600 px-2.5 py-0.5 text-[11px] font-medium">Work Done</span>;
}

export function Progress({ value, green }) {
  return (
    <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
      <div className={`h-full rounded-full ${green ? 'bg-[#16A34A]' : 'bg-[#2E6BEA]'}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function Card({ className = '', ...p }) {
  return <div {...p} className={`bg-white rounded-xl shadow-[0_1px_4px_rgba(30,27,75,0.07)] ${className}`} />;
}

export function Stepper({ stage, completed }) {
  const steps = ['Documentation', 'Application and Filing', 'Completion'];
  return (
    <div data-testid="service-stepper" className="flex items-start">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = completed || n < stage;
        const current = !completed && n === stage;
        return (
          <React.Fragment key={label}>
            {i > 0 && <div className={`flex-1 h-0.5 mt-4 ${done || current ? 'bg-[#16A34A]' : 'bg-gray-200'}`} />}
            <div className="flex flex-col items-center w-24">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${done ? 'bg-[#16A34A] text-white' : current ? 'bg-[#2E6BEA] text-white' : 'border-2 border-gray-300 text-gray-400 bg-white'}`}>
                {done ? <Check size={15} /> : n}
              </div>
              <span className={`mt-1.5 text-[10px] text-center leading-tight ${done ? 'text-[#16A34A] font-medium' : current ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>{label}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function Modal({ open, onClose, title, sub, children, wide, testid }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#1b1840]/45" onClick={onClose}>
      <div
        data-testid={testid || 'modal'}
        className={`bg-white rounded-xl shadow-2xl w-full ${wide ? 'max-w-2xl' : 'max-w-md'} max-h-[88vh] overflow-y-auto oli-scroll p-5 relative`}
        onClick={e => e.stopPropagation()}
      >
        <button data-testid="modal-close-btn" onClick={onClose} className="absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-600"><X size={17} /></button>
        {title && <h3 className="text-[15px] font-semibold text-gray-800 pr-6">{title}</h3>}
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        <div className={title ? 'mt-4' : ''}>{children}</div>
      </div>
    </div>
  );
}

export function ConfirmModal({ open, onClose, onConfirm, message = 'Are you sure?', confirmLabel = 'Yes, Continue', color = 'blue', testid = 'confirm-modal' }) {
  return (
    <Modal open={open} onClose={onClose} testid={testid}>
      <p data-testid="confirm-message" className="text-sm font-medium text-gray-800">{message}</p>
      <div className="flex justify-end gap-2 mt-6">
        <Btn color="gray" size="md" onClick={onClose} data-testid="confirm-cancel-btn">Cancel</Btn>
        <Btn color={color} size="md" onClick={onConfirm} data-testid="confirm-ok-btn">{confirmLabel}</Btn>
      </div>
    </Modal>
  );
}

export function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

export const inputCls = 'w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#EA6D27] focus:border-[#EA6D27] bg-white';
