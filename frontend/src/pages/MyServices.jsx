import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useStore } from '../oli/store';
import { Card, LiveBadge, StageBadge, WorkDoneBadge, Progress, Btn } from '../oli/ui';

export default function MyServices() {
  const { state } = useStore();
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const list = state.services.filter(s =>
    !q.trim() ||
    s.name.toLowerCase().includes(q.toLowerCase()) ||
    s.oliId.toLowerCase().includes(q.toLowerCase()) ||
    (s.sub || '').toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto" data-testid="my-services-page">
      <h1 className="text-xl font-bold text-gray-800">My Services</h1>
      <p className="text-xs text-gray-400 mt-0.5">{state.services.length} services in your account</p>

      <div className="relative mt-4">
        <input
          data-testid="services-search-input"
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#EA6D27]"
          placeholder="Search by OLI ID or service name"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
      </div>

      <div className="space-y-2.5 mt-4">
        {list.map(s => (
          <Card key={s.oliId} className="p-4" data-testid={`service-row-${s.oliId}`}>
            <p className="text-[10px] text-gray-300">{s.oliId}</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-1">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">{s.name}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {s.key === 'tm' ? s.meta.join(' · ') : s.key === 'iso' ? `${s.meta[0]} · ${s.meta[1]}` : s.sub}
                </p>
                <div className="flex items-center gap-2 mt-2 max-w-md">
                  <div className="flex-1"><Progress value={s.progress} green={s.completed} /></div>
                  <span className="text-[10px] font-semibold text-[#2E6BEA]">{s.progress}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {s.live && <LiveBadge />}
                {s.completed ? <WorkDoneBadge /> : <StageBadge svc={s} />}
                <Btn color="blue" data-testid={`service-open-${s.oliId}`} onClick={() => navigate(`/service/${s.oliId}`)}>Open</Btn>
              </div>
            </div>
          </Card>
        ))}
        {list.length === 0 && <Card className="p-8 text-center text-xs text-gray-400" data-testid="services-empty">No services match your search.</Card>}
      </div>
    </div>
  );
}
