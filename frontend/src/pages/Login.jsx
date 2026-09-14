import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, UserRound, Hash } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '../oli/store';
import { OtpModal } from '../oli/modals';
import { Modal, Btn, Field, inputCls } from '../oli/ui';

const GoogleIcon = () => (
  <svg width="15" height="15" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 18.9 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C41 35.4 44 30.2 44 24c0-1.3-.1-2.7-.4-3.9z"/></svg>
);

export default function Login() {
  const { state, set } = useStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState('email');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [oliId, setOliId] = useState('');
  const [err, setErr] = useState('');
  const [otpOpen, setOtpOpen] = useState(false);
  const [fp, setFp] = useState(null);
  const [fpEmail, setFpEmail] = useState('');
  const [fpOtp, setFpOtp] = useState('');
  const [fpErr, setFpErr] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confPwd, setConfPwd] = useState('');

  const doLogin = (via) => {
    set(st => { st.session = { loggedIn: true, via }; return st; });
    sessionStorage.removeItem('oli_wb_shown');
    navigate('/dashboard');
  };

  const emailLogin = () => {
    setErr('');
    const storedPwd = (state.auth && state.auth.password) || 'Demo123@';
    if (email.trim().toLowerCase() !== 'demo@email.com' || pwd !== storedPwd) {
      setErr('Invalid email or password.');
      return;
    }
    setOtpOpen(true);
  };

  const oliLogin = () => {
    setErr('');
    const id = oliId.trim().toUpperCase();
    if (!id) { setErr('Please enter your OLI ID.'); return; }
    const found = state.services.find(s => s.oliId.toUpperCase() === id);
    if (!found) { setErr('This OLI ID was not found in our records.'); return; }
    toast.success(`Logged in with ${found.name} (${found.oliId})`);
    doLogin('oli');
  };

  const tabBtn = (active) =>
    `flex-1 flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition-colors ${active ? 'text-[#EA6D27] bg-white' : 'text-gray-400 bg-gray-100'}`;

  return (
    <div className="min-h-screen bg-[#FEF7E7] flex items-center justify-center p-4" data-testid="login-page">
      <div className="bg-white rounded-2xl shadow-[0_10px_50px_rgba(234,109,39,0.10)] w-full max-w-4xl grid md:grid-cols-2 overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col">
          <img src="/assets/logo.png" alt="Online Legal India" className="h-10 w-auto self-start" />
          <p className="text-center text-lg font-bold text-gray-800 mt-5">Simplifying</p>
          <div className="flex-1 flex items-end justify-center mt-2">
            <img src="/assets/login-photo.png" alt="Online Legal India" className="max-h-[340px] w-auto object-contain" data-testid="login-hero-image" />
          </div>
        </div>
        <div className="p-6 sm:p-10 flex flex-col justify-center">
          <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center mx-auto">
            <UserRound size={17} className="text-[#EA6D27]" />
          </div>
          <h1 className="text-center text-xl font-bold text-gray-800 mt-2">Welcome Back</h1>
          <p className="text-center text-[11px] text-gray-400">login to your account</p>

          <div className="flex gap-2 mt-6" data-testid="login-tabs">
            <button data-testid="tab-email" className={tabBtn(tab === 'email')} onClick={() => { setTab('email'); setErr(''); }}>
              <Mail size={13} /> Email / Phone
            </button>
            <button data-testid="tab-oli" className={tabBtn(tab === 'oli')} onClick={() => { setTab('oli'); setErr(''); }}>
              <Hash size={13} /> OLI ID
            </button>
          </div>

          {tab === 'email' ? (
            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Email or phone number</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    data-testid="login-email-input"
                    className="w-full rounded-md border border-gray-200 pl-9 pr-3 py-2.5 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#EA6D27] focus:border-[#EA6D27]"
                    placeholder="enter your email id"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    data-testid="login-password-input"
                    type={showPwd ? 'text' : 'password'}
                    className="w-full rounded-md border border-gray-200 pl-9 pr-9 py-2.5 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#EA6D27] focus:border-[#EA6D27]"
                    placeholder="enter your password"
                    value={pwd}
                    onChange={e => setPwd(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') emailLogin(); }}
                  />
                  <button data-testid="toggle-password-btn" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500" onClick={() => setShowPwd(s => !s)}>
                    {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <div className="text-right mt-1">
                  <button data-testid="forgot-password-link" className="text-[10px] text-[#EA6D27] hover:underline" onClick={() => { setFp('account'); setFpEmail(''); setFpOtp(''); setFpErr(''); setNewPwd(''); setConfPwd(''); }}>Forgot password?</button>
                </div>
              </div>
              {err && <p data-testid="login-error" className="text-xs text-red-500">{err}</p>}
              <button data-testid="login-submit-btn" onClick={emailLogin} className="w-full rounded-md bg-[#EA6D27] hover:bg-[#d95f1d] text-white text-sm font-semibold py-2.5 transition-colors">Login</button>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Enter Your OLI ID</label>
                <div className="relative">
                  <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    data-testid="login-oliid-input"
                    className="w-full rounded-md border border-gray-200 pl-9 pr-3 py-2.5 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#EA6D27] focus:border-[#EA6D27]"
                    placeholder="Enter your OLI ID (e.g. OLI12345678914785)"
                    value={oliId}
                    onChange={e => setOliId(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') oliLogin(); }}
                  />
                </div>
              </div>
              {err && <p data-testid="login-error" className="text-xs text-red-500">{err}</p>}
              <button data-testid="login-oli-submit-btn" onClick={oliLogin} className="w-full rounded-md bg-[#EA6D27] hover:bg-[#d95f1d] text-white text-sm font-semibold py-2.5 transition-colors">Login</button>
            </div>
          )}

          <div className="flex items-center gap-3 my-5">
            <span className="flex-1 h-px bg-gray-100" />
            <span className="text-[9px] tracking-widest text-gray-300">OR CONTINUE WITH</span>
            <span className="flex-1 h-px bg-gray-100" />
          </div>
          <button
            data-testid="google-login-btn"
            onClick={() => { toast.success('Logged in with Google (demo)'); doLogin('google'); }}
            className="w-full rounded-md border border-gray-200 hover:bg-gray-50 text-sm text-gray-600 py-2.5 flex items-center justify-center gap-2 transition-colors"
          >
            <GoogleIcon /> Google Login
          </button>
        </div>
      </div>
      <OtpModal
        open={otpOpen}
        onClose={() => setOtpOpen(false)}
        onVerified={() => { setOtpOpen(false); toast.success('Login successful'); doLogin('email'); }}
        verifyLabel="Verify & Login"
      />

      <Modal
        open={!!fp}
        onClose={() => setFp(null)}
        testid="forgot-password-modal"
        title={fp === 'account' ? 'Forgot Password' : fp === 'otp' ? 'OTP Verification' : fp === 'reset' ? 'Change Password' : 'Password Changed'}
        sub={fp === 'account' ? 'Enter your registered email address to receive an OTP.' : fp === 'otp' ? 'OTP sent to your registered email and mobile number.' : fp === 'reset' ? 'Set a new password for your account.' : undefined}
      >
        {fp === 'account' && (
          <>
            <Field label="Registered Email">
              <input data-testid="fp-email-input" className={inputCls} placeholder="enter your registered email id" value={fpEmail} onChange={e => { setFpEmail(e.target.value); setFpErr(''); }} />
            </Field>
            {fpErr && <p data-testid="fp-error" className="text-xs text-red-500 mt-1.5">{fpErr}</p>}
            <div className="flex justify-end gap-2 mt-5">
              <Btn color="gray" onClick={() => setFp(null)} data-testid="fp-cancel-btn">Cancel</Btn>
              <Btn color="orange" data-testid="fp-continue-btn" onClick={() => {
                if (fpEmail.trim().toLowerCase() !== 'demo@email.com') { setFpErr('This email is not registered with us.'); return; }
                setFpErr(''); setFp('otp');
              }}>Continue</Btn>
            </div>
          </>
        )}
        {fp === 'otp' && (
          <>
            <Field label="Enter 6-digit OTP">
              <input data-testid="fp-otp-input" className={`${inputCls} tracking-[0.6em] text-center font-semibold`} placeholder="• • • • • •" maxLength={6} value={fpOtp} onChange={e => { setFpOtp(e.target.value.replace(/\D/g, '')); setFpErr(''); }} />
            </Field>
            {fpErr && <p data-testid="fp-error" className="text-xs text-red-500 mt-1.5">{fpErr}</p>}
            <div className="flex items-center justify-between mt-5">
              <button data-testid="fp-resend-btn" className="text-xs text-[#2E6BEA] hover:underline" onClick={() => toast.info('OTP resent (demo OTP: 123789)')}>Resend OTP</button>
              <div className="flex gap-2">
                <Btn color="gray" onClick={() => setFp(null)} data-testid="fp-cancel-btn">Cancel</Btn>
                <Btn color="blue" data-testid="fp-verify-btn" onClick={() => {
                  if (fpOtp === '123789') { setFpErr(''); setFp('reset'); }
                  else setFpErr('Incorrect OTP. Please try again.');
                }}>Verify OTP</Btn>
              </div>
            </div>
          </>
        )}
        {fp === 'reset' && (
          <>
            <Field label="Enter New Password">
              <input data-testid="fp-new-password-input" type="password" className={inputCls} placeholder="enter new password" value={newPwd} onChange={e => { setNewPwd(e.target.value); setFpErr(''); }} />
            </Field>
            <div className="mt-3">
              <Field label="Confirm New Password">
                <input data-testid="fp-confirm-password-input" type="password" className={inputCls} placeholder="re-enter new password" value={confPwd} onChange={e => { setConfPwd(e.target.value); setFpErr(''); }} />
              </Field>
            </div>
            {fpErr && <p data-testid="fp-error" className="text-xs text-red-500 mt-1.5">{fpErr}</p>}
            <div className="flex justify-end gap-2 mt-5">
              <Btn color="gray" onClick={() => setFp(null)} data-testid="fp-cancel-btn">Cancel</Btn>
              <Btn color="orange" data-testid="fp-save-btn" onClick={() => {
                if (newPwd.length < 6) { setFpErr('Password must be at least 6 characters.'); return; }
                if (newPwd !== confPwd) { setFpErr('Passwords do not match.'); return; }
                set(st => { st.auth = { password: newPwd }; return st; });
                setFpErr(''); setFp('done');
              }}>Save Password</Btn>
            </div>
          </>
        )}
        {fp === 'done' && (
          <div className="flex flex-col items-center text-center py-2">
            <p data-testid="fp-success-msg" className="text-sm font-medium text-green-600">Password changed successfully.</p>
            <p className="text-xs text-gray-400 mt-1">Use your new password the next time you log in.</p>
            <Btn color="blue" className="mt-4" data-testid="fp-back-login-btn" onClick={() => setFp(null)}>Back to Login</Btn>
          </div>
        )}
      </Modal>
    </div>
  );
}
