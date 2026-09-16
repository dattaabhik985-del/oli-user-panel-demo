import React, { useState } from 'react';
import { toast } from 'sonner';
import { useStore } from '../oli/store';
import { Card, Btn, Field, ConfirmModal, inputCls } from '../oli/ui';
import { OtpModal } from '../oli/modals';

export default function Profile() {
  const { state, set, reset } = useStore();
  const p = state.profile;
  const [form, setForm] = useState({ ...p });
  const [confirm, setConfirm] = useState(false);
  const [altUpdate, setAltUpdate] = useState(false);
  const [errs, setErrs] = useState({});
  const [otp, setOtp] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const onSave = () => {
    if (altUpdate) {
      const e = {};
      if (form.altNumber.replace(/\D/g, '').length !== 10) e.altNumber = 'Enter a valid 10-digit mobile number.';
      if (!form.altPerson.trim()) e.altPerson = 'Alternative person name is required.';
      setErrs(e);
      if (Object.keys(e).length) return;
    }
    setConfirm(true);
  };

  const doSave = () => {
    set(st => {
      st.profile = altUpdate
        ? { ...form }
        : { ...form, altNumber: st.profile.altNumber, altPerson: st.profile.altPerson, priorityAlt: st.profile.priorityAlt };
      return st;
    });
    setOtp(false);
    if (altUpdate) {
      toast.success('Alternative contact details updated successfully.');
      if (form.priorityAlt) toast.success('Alternative number is set as the priority number.');
    } else {
      toast.success('Profile updated successfully.');
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto" data-testid="profile-page">
      <h1 className="text-xl font-bold text-gray-800">My Profile</h1>
      <p className="text-xs text-gray-400 mt-0.5">Your registered details and alternative contact preferences.</p>

      <Card className="p-5 mt-5 max-w-xl" data-testid="profile-card">
        <div className="space-y-3.5">
          <Field label="Full Name"><input data-testid="profile-name-input" className={inputCls} value={form.name} onChange={e => upd('name', e.target.value)} /></Field>
          <Field label="Email"><input data-testid="profile-email-input" className={`${inputCls} bg-gray-50`} value={form.email} disabled /></Field>
          <Field label="Registered Mobile Number"><input data-testid="profile-mobile-input" className={`${inputCls} bg-gray-50`} value={form.mobile} disabled /></Field>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-3.5 py-2.5">
            <div>
              <p className="text-xs font-semibold text-gray-700">Alternative Number Update</p>
              <p className="text-[10px] text-gray-400">(enable to update your alternative contact details)</p>
            </div>
            <button
              data-testid="alt-number-update-toggle"
              onClick={() => { setAltUpdate(v => !v); setErrs({}); }}
              className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${altUpdate ? 'bg-[#16A34A]' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${altUpdate ? 'left-[18px]' : 'left-0.5'}`} />
            </button>
          </div>

          <Field label="Alternative Number">
            <div className="relative">
              <input
                data-testid="profile-alt-number-input"
                className={altUpdate ? inputCls : `${inputCls} bg-gray-50`}
                value={form.altNumber}
                disabled={!altUpdate}
                onChange={e => { upd('altNumber', e.target.value); setErrs(x => ({ ...x, altNumber: undefined })); }}
              />
              {!altUpdate && p.priorityAlt && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-green-100 text-green-600 px-2 py-0.5 text-[9px] font-medium" data-testid="priority-number-badge">Priority Number</span>
              )}
            </div>
            {altUpdate && errs.altNumber && <p data-testid="alt-number-error" className="text-[10px] text-red-500 mt-1">{errs.altNumber}</p>}
          </Field>
          <Field label="Alternative Person Name">
            <input
              data-testid="profile-alt-person-input"
              className={altUpdate ? inputCls : `${inputCls} bg-gray-50`}
              value={form.altPerson}
              disabled={!altUpdate}
              onChange={e => { upd('altPerson', e.target.value); setErrs(x => ({ ...x, altPerson: undefined })); }}
            />
            {altUpdate && errs.altPerson && <p data-testid="alt-person-error" className="text-[10px] text-red-500 mt-1">{errs.altPerson}</p>}
          </Field>

          {altUpdate && (
            <label className="flex items-start gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                data-testid="profile-priority-checkbox"
                className="mt-0.5 accent-[#2E6BEA]"
                checked={form.priorityAlt}
                onChange={e => upd('priorityAlt', e.target.checked)}
              />
              <span className="text-[11px] text-gray-500">Set alternative number as priority number <span className="text-gray-400">(our team will call this number first)</span></span>
            </label>
          )}

          <div className="rounded-lg border border-gray-100 p-3.5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-gray-700">Contact Person Details</p>
                <p className="text-[10px] text-gray-400">(if contact person is different)</p>
              </div>
              <button
                data-testid="contact-person-button"
                onClick={() => upd('cpEnabled', !form.cpEnabled)}
                className={`w-10 h-5.5 h-6 rounded-full transition-colors relative ${form.cpEnabled ? 'bg-[#16A34A]' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${form.cpEnabled ? 'left-[18px]' : 'left-0.5'}`} />
              </button>
            </div>
            {form.cpEnabled && (
              <div className="space-y-3 mt-4" data-testid="contact-person-fields">
                <Field label="Name of Contact Person"><input data-testid="cp-name-input" className={inputCls} placeholder="e.g. Rahul Sharma" value={form.cpName} onChange={e => upd('cpName', e.target.value)} /></Field>
                <Field label="Designation of Contact Person"><input data-testid="cp-desig-input" className={inputCls} placeholder="e.g. Manager" value={form.cpDesig} onChange={e => upd('cpDesig', e.target.value)} /></Field>
                <Field label="Phone Number of Contact Person"><input data-testid="cp-phone-input" className={inputCls} placeholder="e.g. 9876543210" value={form.cpPhone} onChange={e => upd('cpPhone', e.target.value)} /></Field>
                <Field label="Email of Contact Person"><input data-testid="cp-email-input" className={inputCls} placeholder="e.g. rahul@example.com" value={form.cpEmail} onChange={e => upd('cpEmail', e.target.value)} /></Field>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <Btn color="blue" size="md" data-testid="profile-save-btn" onClick={onSave}>Save Changes</Btn>
            <Btn color="gray" size="md" data-testid="reset-demo-btn" onClick={() => setResetConfirm(true)}>Reset Demo Data</Btn>
          </div>
        </div>
      </Card>

      <ConfirmModal
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => { setConfirm(false); setOtp(true); }}
        message="Are you sure you want to save these profile changes?"
        confirmLabel="Yes, Save"
        color="blue"
        testid="profile-confirm-modal"
      />
      <OtpModal open={otp} onClose={() => setOtp(false)} onVerified={doSave} sub="OTP has been sent to your registered email and mobile number." />
      <ConfirmModal
        open={resetConfirm}
        onClose={() => setResetConfirm(false)}
        onConfirm={reset}
        message="Are you sure you want to reset all demo data? This will restore the original demo state."
        confirmLabel="Reset Demo Data"
        color="red"
        testid="reset-confirm-modal"
      />
    </div>
  );
}
