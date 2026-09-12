import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const TOUR_STEPS = [
  { page: '/dashboard', tour: 'nav-dashboard', title: 'Dashboard', text: 'Your main home screen where you can see your services and important updates.' },
  { page: '/dashboard', tour: 'dash-cards', title: 'One-Click Access', text: 'Quick cards for My Services, My Documents, My Certificates and OLI Other Services.' },
  { page: '/dashboard', tour: 'dash-live', title: 'Live Work', text: 'Only the OLI IDs our agents are currently working on appear here, with a blinking LIVE indicator.' },
  { page: '/dashboard', tour: 'topbar-actions', title: 'Quick Actions', text: 'Request a callback, raise a complaint, share feedback or give a suggestion from anywhere in the panel.' },
  { page: '/dashboard', tour: 'dash-chatbot', title: 'Support Chatbot', text: 'Ask about service status, invoices, receipts, callbacks or connect with an expert. The chatbot lives on the Dashboard only.' },
  { page: '/services', tour: 'nav-services', title: 'My Services', text: 'Shows all services purchased or being processed through Online Legal India, including services currently in Live Work.' },
  { page: '/documents', tour: 'nav-documents', title: 'My Documents', text: 'Every file you have uploaded, grouped service-wise, with preview and download.' },
  { page: '/certificates', tour: 'nav-certificates', title: 'My Certificates', text: 'Certificates issued for your completed services — view, download or email them.' },
  { page: '/invoices', tour: 'nav-invoices', title: 'OLI Invoices', text: 'All invoices for payments made to Online Legal India, with view and download.' },
  { page: '/receipts', tour: 'nav-receipts', title: 'Govt Receipt', text: 'Government fees paid by you through/via Online Legal India, separate from OLI invoices.' },
  { page: '/callbacks', tour: 'nav-callbacks', title: 'All Callback Request', text: 'One active request per service — re-requesting revises the existing callback instead of creating a duplicate.' },
  { page: '/explore', tour: 'nav-explore', title: 'ExploreServices', text: 'Explore and instantly purchase additional services from Online Legal India.' },
  { page: '/recommended', tour: 'nav-recommended', title: 'Recommended Services', text: 'Services recommended for your business journey, grouped by business milestones.' },
  { page: '/profile', tour: 'nav-profile', title: 'Profile', text: 'Update your alternative number, alternative person name, calling priority and contact person details.' },
  { page: '/how-to-use', tour: 'nav-howto', title: 'How to Use', text: 'You can restart this interactive tour anytime from here.' },
];

export function TourOverlay({ tour, setTour, setMobileOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [rect, setRect] = useState(null);
  const step = TOUR_STEPS[tour.idx];

  useEffect(() => {
    if (!tour.on || !step) return;
    if (location.pathname !== step.page) navigate(step.page);
    const isMobile = window.innerWidth < 1024;
    if (setMobileOpen) setMobileOpen(isMobile && step.tour.startsWith('nav-'));
    let tries = 0;
    let timer;
    const measure = () => {
      const el = document.querySelector(`[data-tour="${step.tour}"]`);
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({ x: r.left, y: r.top, w: r.width, h: r.height });
      } else if (tries++ < 12) {
        timer = setTimeout(measure, 140);
      }
    };
    timer = setTimeout(measure, 420);
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => { clearTimeout(timer); window.removeEventListener('resize', onResize); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour.on, tour.idx, location.pathname]);

  if (!tour.on || !step) return null;

  const close = () => { setTour({ on: false, idx: 0 }); if (setMobileOpen) setMobileOpen(false); };
  const next = () => { if (tour.idx < TOUR_STEPS.length - 1) setTour({ on: true, idx: tour.idx + 1 }); else close(); };
  const prev = () => { if (tour.idx > 0) setTour({ on: true, idx: tour.idx - 1 }); };

  const tipW = 280;
  let tipStyle = { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' };
  if (rect) {
    const below = rect.y + rect.h + 14;
    const fitsBelow = below + 190 < window.innerHeight;
    let left = Math.min(Math.max(12, rect.x), window.innerWidth - tipW - 12);
    tipStyle = fitsBelow
      ? { top: below, left }
      : { top: Math.max(12, rect.y - 190), left };
  }

  return (
    <div className="fixed inset-0 z-[80]" data-testid="tour-overlay">
      {rect ? (
        <div
          className="fixed rounded-lg border-2 border-[#EA6D27] pointer-events-none transition-all duration-300"
          style={{ top: rect.y - 5, left: rect.x - 5, width: rect.w + 10, height: rect.h + 10, boxShadow: '0 0 0 9999px rgba(22,18,55,0.55)' }}
        />
      ) : (
        <div className="absolute inset-0 bg-[#161237]/55" />
      )}
      <div
        data-testid="tour-tooltip"
        className="fixed bg-white rounded-xl shadow-2xl p-4"
        style={{ ...tipStyle, width: tipW, maxWidth: 'calc(100vw - 24px)' }}
      >
        <p className="text-[10px] text-gray-400">Step {tour.idx + 1} of {TOUR_STEPS.length}</p>
        <p className="text-sm font-semibold text-gray-800 mt-0.5">{step.title}</p>
        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{step.text}</p>
        <div className="flex items-center justify-between mt-3">
          <button data-testid="tour-skip-btn" onClick={close} className="text-[11px] text-gray-400 hover:text-gray-600">Skip Tour</button>
          <div className="flex gap-1.5">
            {tour.idx > 0 && (
              <button data-testid="tour-prev-btn" onClick={prev} className="rounded-md border border-gray-200 text-gray-500 text-[11px] px-3 py-1.5 hover:bg-gray-50">‹ Previous</button>
            )}
            <button data-testid={tour.idx === TOUR_STEPS.length - 1 ? 'tour-finish-btn' : 'tour-next-btn'} onClick={next} className="rounded-md bg-[#EA6D27] hover:bg-[#d95f1d] text-white text-[11px] font-medium px-3 py-1.5">
              {tour.idx === TOUR_STEPS.length - 1 ? 'Finish' : 'Next ›'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
