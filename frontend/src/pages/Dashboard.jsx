import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, FileText, Award, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../oli/store';
import { Card, LiveBadge, StageBadge, Progress } from '../oli/ui';
import { WelcomeBackModal } from '../oli/modals';

export default function Dashboard() {
  const { state } = useStore();
  const navigate = useNavigate();
  const [welcomeOpen, setWelcomeOpen] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem('oli_wb_shown')) {
      const t = setTimeout(() => setWelcomeOpen(true), 700);
      return () => clearTimeout(t);
    }
  }, []);

  const closeWelcome = () => {
    setWelcomeOpen(false);
    sessionStorage.setItem('oli_wb_shown', '1');
  };

  const docCount = state.services.reduce((n, s) => n + s.docs.length, 0);
  const certCount = state.services.filter(s => s.cert).length;
  const liveServices = state.services.filter(s => s.live);

  const cards = [
    { label: 'My Services', sub: `${state.services.length} active`, icon: Briefcase, cls: 'bg-[#46B96B]', to: '/services', testid: 'card-my-services' },
    { label: 'My Documents', sub: `${docCount} uploads`, icon: FileText, cls: 'bg-[#F2C14E]', to: '/documents', testid: 'card-my-documents' },
    { label: 'My Certificates', sub: `${certCount} issued`, icon: Award, cls: 'bg-[#DDF4E7] !text-gray-700', to: '/certificates', testid: 'card-my-certificates' },
    { label: 'OLI Other Services', sub: 'Buy more services', icon: ShoppingBag, cls: 'bg-[#F47B4A]', to: '/explore', testid: 'card-oli-other-services' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto" data-testid="dashboard-page">
      <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-xs text-gray-400 mt-0.5">Welcome back, {state.profile.name}! Here is an overview of your account.</p>

      <div className="mt-3 rounded-lg border border-[#F5C99B] bg-[#FDF1E3] px-4 py-2.5 shadow-sm" data-testid="dashboard-reco-banner">
        <p className="text-xs text-gray-600">
          See what your Business Analysis identifies that may be missing. Visit{' '}
          <button
            data-testid="dashboard-reco-link"
            onClick={() => navigate('/recommended')}
            className="font-semibold text-[#EA6D27] underline decoration-[#EA6D27]/40 underline-offset-2 hover:decoration-[#EA6D27] transition-colors"
          >Recommended Services</button>
          {' '}to explore
        </p>
      </div>

      <p className="text-[10px] font-semibold tracking-widest text-gray-400 mt-5 mb-2">ONE-CLICK ACCESS</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" data-tour="dash-cards">
        {cards.map(c => (
          <button key={c.label} data-testid={c.testid} onClick={() => navigate(c.to)} className={`${c.cls} rounded-xl p-4 text-left text-white shadow-sm hover:opacity-95 transition-opacity`}>
            <c.icon size={22} className="opacity-90" />
            <p className="text-sm font-semibold mt-3">{c.label}</p>
            <p className="text-[11px] opacity-80">{c.sub}</p>
          </button>
        ))}
      </div>

      <p className="text-[10px] font-semibold tracking-widest text-gray-400 mt-6 mb-2">MY LIVE SERVICES</p>
      <div className="space-y-2.5" data-tour="dash-live" data-testid="dashboard-live-list">
        {liveServices.length === 0 && (
          <Card className="p-6 text-center text-xs text-gray-400" data-testid="live-empty">No live work at the moment. When an agent starts working on one of your OLI IDs, it will appear here.</Card>
        )}
        {liveServices.map(s => (
          <Card key={s.oliId} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3" data-testid={`live-row-${s.oliId}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-gray-800">{s.name}</p>
                <LiveBadge />
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">{s.oliId} · Expert: {s.expert != null ? s.lastCall ? s.lastCall.agent : '' : 'To be assigned'} · Last updated: {s.lastUpdated}</p>
              <p className="text-[10px] text-gray-400">Next action: {s.nextAction}</p>
            </div>
            <div className="sm:w-44 shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex-1"><Progress value={s.progress} /></div>
                <span className="text-[10px] font-semibold text-[#2E6BEA]">{s.progress}%</span>
              </div>
              <p className="text-[9px] text-gray-400 mt-1">Milestone: {s.stage === 2 ? 'Application and Filing' : s.stage === 3 ? 'Completion' : 'Documentation'}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <StageBadge svc={s} />
              <button
                data-testid={`live-view-details-${s.oliId}`}
                onClick={() => navigate(`/service/${s.oliId}`)}
                className="inline-flex items-center gap-1 rounded-md border border-[#2E6BEA] text-[#2E6BEA] hover:bg-blue-50 text-xs font-medium px-3 py-1.5"
              >
                View Details <ArrowRight size={13} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <WelcomeBackModal open={welcomeOpen} onClose={closeWelcome} />
    </div>
  );
}
