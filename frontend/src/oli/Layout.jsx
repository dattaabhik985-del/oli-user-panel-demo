import React, { createContext, useContext, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, FileText, Award, ReceiptText, Landmark, Headset,
  Compass, Sparkles, User, CircleHelp, LogOut, Menu, X, Phone, AlertCircle, Star, Lightbulb,
} from 'lucide-react';
import { useStore } from './store';
import { CallbackModal, ComplaintModal, FeedbackModal, SuggestionModal, CheckoutModal } from './modals';
import Chatbot from './Chatbot';
import { TourOverlay } from './Tour';

const LayoutCtx = createContext(null);
export const useLayout = () => useContext(LayoutCtx);

const NAV_MAIN = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, tour: 'nav-dashboard', testid: 'nav-dashboard' },
  { to: '/services', label: 'My Services', icon: Briefcase, tour: 'nav-services', testid: 'nav-services' },
  { to: '/documents', label: 'My Documents', icon: FileText, tour: 'nav-documents', testid: 'nav-documents' },
  { to: '/certificates', label: 'My Certificates', icon: Award, tour: 'nav-certificates', testid: 'nav-certificates' },
  { to: '/invoices', label: 'OLI Invoices', icon: ReceiptText, tour: 'nav-invoices', testid: 'nav-invoices' },
  { to: '/receipts', label: 'Govt Receipt', icon: Landmark, tour: 'nav-receipts', testid: 'nav-receipts' },
];
const NAV_SERVICES = [
  { to: '/callbacks', label: 'All Callback Request', icon: Headset, tour: 'nav-callbacks', testid: 'nav-callbacks' },
  { to: '/explore', label: 'ExploreServices', icon: Compass, tour: 'nav-explore', testid: 'nav-exploreservices' },
  { to: '/recommended', label: 'Recommended Services', icon: Sparkles, tour: 'nav-recommended', testid: 'nav-recommended' },
];
const NAV_ACCOUNT = [
  { to: '/profile', label: 'Profile', icon: User, tour: 'nav-profile', testid: 'nav-profile' },
];
const NAV_HELP = [
  { to: '/how-to-use', label: 'How to Use', icon: CircleHelp, tour: 'nav-howto', testid: 'nav-how-to-use' },
];

function NavItem({ to, label, icon: Icon, tour, testid, onNavigate }) {
  return (
    <NavLink
      to={to}
      data-tour={tour}
      data-testid={testid}
      onClick={onNavigate}
      className={({ isActive }) =>
        `relative flex items-center gap-3 px-4 py-2.5 mx-2 rounded-md text-[13px] transition-colors ${
          isActive ? 'bg-white/10 text-white font-medium' : 'text-indigo-100/60 hover:bg-white/5 hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && <span className="absolute left-[-8px] top-1.5 bottom-1.5 w-1 rounded-r bg-[#EA6D27]" />}
          <Icon size={16} className="shrink-0" />
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  );
}

function SidebarContent({ onNavigate, onLogout }) {
  const Section = ({ label }) => <p className="px-6 pt-5 pb-1.5 text-[10px] font-semibold tracking-widest text-indigo-200/40">{label}</p>;
  return (
    <>
      <nav className="flex-1 overflow-y-auto oli-scroll py-3">
        {NAV_MAIN.map(n => <NavItem key={n.to} {...n} onNavigate={onNavigate} />)}
        <Section label="SERVICES" />
        {NAV_SERVICES.map(n => <NavItem key={n.to} {...n} onNavigate={onNavigate} />)}
        <Section label="ACCOUNT" />
        {NAV_ACCOUNT.map(n => <NavItem key={n.to} {...n} onNavigate={onNavigate} />)}
        <Section label="HELP" />
        {NAV_HELP.map(n => <NavItem key={n.to} {...n} onNavigate={onNavigate} />)}
      </nav>
      <button
        data-testid="logout-btn"
        onClick={onLogout}
        className="flex items-center gap-3 px-6 py-3.5 text-[13px] text-indigo-100/60 hover:text-white transition-colors"
      >
        <LogOut size={16} /> Logout
      </button>
    </>
  );
}

export default function Layout() {
  const { set } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cb, setCb] = useState({ open: false, oliId: null });
  const [cmp, setCmp] = useState({ open: false, oliId: null });
  const [fb, setFb] = useState({ open: false, oliId: null });
  const [sug, setSug] = useState(false);
  const [ck, setCk] = useState({ open: false, item: null });
  const [tour, setTour] = useState({ on: false, idx: 0 });

  const logout = () => {
    set(st => { st.session = { loggedIn: false, via: null }; return st; });
    sessionStorage.removeItem('oli_wb_shown');
    navigate('/login');
  };

  const ctx = {
    openCallback: (oliId) => setCb({ open: true, oliId: oliId || null }),
    openComplaint: (oliId) => setCmp({ open: true, oliId: oliId || null }),
    openFeedback: (oliId) => setFb({ open: true, oliId: oliId || null }),
    openSuggestion: () => setSug(true),
    openCheckout: (item) => setCk({ open: true, item }),
    startTour: () => setTour({ on: true, idx: 0 }),
    setMobileOpen,
  };

  const topBtn = 'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-white whitespace-nowrap transition-colors';

  return (
    <LayoutCtx.Provider value={ctx}>
      <div className="h-screen flex flex-col overflow-hidden bg-[#F2F5FC]">
        <header className="h-14 bg-white border-b border-gray-100 flex items-center gap-3 px-3 sm:px-5 shrink-0 z-30">
          <button data-testid="mobile-menu-btn" className="lg:hidden text-gray-500" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
          <img src="/assets/logo.png" alt="Online Legal India" className="h-8 sm:h-9 w-auto" data-testid="header-logo" />
          <div className="flex items-center gap-2 overflow-x-auto oli-scroll ml-2 sm:ml-6" data-tour="topbar-actions">
            <button data-testid="topbar-callback-btn" className={`${topBtn} bg-[#EA6D27] hover:bg-[#d95f1d]`} onClick={() => ctx.openCallback()}><Phone size={13} /> Call Back Request</button>
            <button data-testid="topbar-complaint-btn" className={`${topBtn} bg-[#E5484D] hover:bg-[#cd3a3f]`} onClick={() => ctx.openComplaint()}><AlertCircle size={13} /> Complaint</button>
            <button data-testid="topbar-feedback-btn" className={`${topBtn} bg-[#16A34A] hover:bg-[#128a3f]`} onClick={() => ctx.openFeedback()}><Star size={13} /> Feedback</button>
            <button data-testid="topbar-suggestion-btn" className={`${topBtn} bg-[#16A34A] hover:bg-[#128a3f]`} onClick={() => ctx.openSuggestion()}><Lightbulb size={13} /> Suggestion</button>
          </div>
        </header>
        <div className="flex flex-1 min-h-0">
          <aside className="hidden lg:flex w-56 bg-[#2F346E] flex-col shrink-0" data-testid="sidebar">
            <SidebarContent onNavigate={() => {}} onLogout={logout} />
          </aside>
          {mobileOpen && (
            <div className="fixed inset-0 z-50 lg:hidden" data-testid="mobile-drawer">
              <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
              <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#2F346E] flex flex-col">
                <div className="flex items-center justify-between px-4 h-14">
                  <img src="/assets/logo.png" alt="Online Legal India" className="h-8 bg-white rounded px-1" />
                  <button className="text-white/70" onClick={() => setMobileOpen(false)}><X size={18} /></button>
                </div>
                <SidebarContent onNavigate={() => setMobileOpen(false)} onLogout={logout} />
              </aside>
            </div>
          )}
          <main className="flex-1 overflow-y-auto oli-scroll" data-testid="main-content">
            <Outlet />
          </main>
        </div>

        <CallbackModal open={cb.open} preselect={cb.oliId} onClose={() => setCb({ open: false, oliId: null })} />
        <ComplaintModal open={cmp.open} preselect={cmp.oliId} onClose={() => setCmp({ open: false, oliId: null })} />
        <FeedbackModal open={fb.open} preselect={fb.oliId} onClose={() => setFb({ open: false, oliId: null })} />
        <SuggestionModal open={sug} onClose={() => setSug(false)} />
        <CheckoutModal open={ck.open} item={ck.item} onClose={() => setCk({ open: false, item: null })} />
        {location.pathname === '/dashboard' && <Chatbot />}
        <TourOverlay tour={tour} setTour={setTour} setMobileOpen={setMobileOpen} />
      </div>
    </LayoutCtx.Provider>
  );
}
