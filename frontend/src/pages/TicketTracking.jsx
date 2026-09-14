import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { useStore } from '../oli/store';
import { Card } from '../oli/ui';

const STAGES = ['Ticket Raised', 'Assigned to Escalation Department', 'Under Review', 'Action in Progress', 'Resolved'];

export default function TicketTracking() {
  const { ticketId } = useParams();
  const { state } = useStore();
  const navigate = useNavigate();
  const t = state.complaints.find(c => c.id === ticketId);

  if (!t) {
    return (
      <div className="p-4 sm:p-6 max-w-3xl mx-auto">
        <button className="text-xs text-gray-400 hover:text-gray-600 inline-flex items-center gap-1" onClick={() => navigate('/dashboard')}><ArrowLeft size={13} /> Back to Dashboard</button>
        <Card className="p-8 mt-4 text-center text-sm text-gray-400" data-testid="ticket-not-found">Ticket not found. Raise a complaint from the top bar to get a Ticket ID.</Card>
      </div>
    );
  }

  const si = t.statusIndex != null ? t.statusIndex : 1;
  const svc = state.services.find(s => s.oliId === t.service);
  const workDone = t.workCompleted || STAGES.slice(0, si + 1);
  const pending = t.pendingWork || STAGES.slice(si + 1);

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto" data-testid="ticket-tracking-page">
      <button data-testid="ticket-back-btn" className="text-xs text-gray-400 hover:text-gray-600 inline-flex items-center gap-1" onClick={() => navigate('/dashboard')}><ArrowLeft size={13} /> Back to Dashboard</button>
      <h1 className="text-xl font-bold text-gray-800 mt-2">Track Ticket</h1>
      <p className="text-xs text-gray-400 mt-0.5">Escalation Department progress for your complaint.</p>

      <Card className="p-5 mt-4" data-testid="ticket-summary-card">
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
          <p className="text-gray-400">Ticket ID: <b className="text-gray-800" data-testid="ticket-id">{t.id}</b></p>
          <p className="text-gray-400">Created: <b className="text-gray-800" data-testid="ticket-created">{t.at}</b></p>
          <p className="text-gray-400">Complaint: <b className="text-gray-800">{t.subject}</b></p>
          <p className="text-gray-400">Related Service: <b className="text-gray-800">{svc ? `${svc.name} · ${svc.oliId}` : t.service}</b></p>
          <p className="text-gray-400 sm:col-span-2">Current Status: <span className="rounded-full bg-orange-100 text-orange-600 px-2 py-0.5 text-[10px] font-medium" data-testid="ticket-status">{t.status || STAGES[si]}</span></p>
        </div>
      </Card>

      <Card className="p-5 mt-4" data-testid="ticket-progress-card">
        <p className="text-sm font-semibold text-gray-800">Escalation Progress</p>
        <div className="mt-4 flex items-start overflow-x-auto oli-scroll" data-testid="ticket-stepper">
          {STAGES.map((label, i) => {
            const done = i < si;
            const current = i === si;
            return (
              <React.Fragment key={label}>
                {i > 0 && <div className={`flex-1 h-0.5 mt-4 min-w-[16px] ${done || current ? 'bg-[#16A34A]' : 'bg-gray-200'}`} />}
                <div className="flex flex-col items-center w-24 shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${done ? 'bg-[#16A34A] text-white' : current ? 'bg-[#2E6BEA] text-white' : 'border-2 border-gray-300 text-gray-400 bg-white'}`}>
                    {done ? <Check size={15} /> : i + 1}
                  </div>
                  <span className={`mt-1.5 text-[10px] text-center leading-tight ${done ? 'text-[#16A34A] font-medium' : current ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>{label}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <Card className="p-5" data-testid="ticket-work-done-card">
          <p className="text-sm font-semibold text-gray-800">Work Completed</p>
          <ul className="mt-3 space-y-2">
            {workDone.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-600"><Check size={13} className="text-[#16A34A] mt-0.5 shrink-0" />{w}</li>
            ))}
          </ul>
        </Card>
        <Card className="p-5" data-testid="ticket-pending-card">
          <p className="text-sm font-semibold text-gray-800">Pending Work</p>
          <ul className="mt-3 space-y-2">
            {pending.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-500"><span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0" />{w}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-5 mt-4 mb-6" data-testid="ticket-update-card">
        <p className="text-sm font-semibold text-gray-800">Latest Update</p>
        <p className="text-xs text-gray-500 mt-2" data-testid="ticket-latest-update">{t.latestUpdate || `${t.at} — Ticket raised.`}</p>
        <div className="mt-4 rounded-md bg-slate-50 border-l-4 border-[#2E6BEA] px-3 py-2.5">
          <p className="text-xs text-gray-600" data-testid="ticket-team-remark"><b>Escalation Team Remark:</b> {t.teamRemark || 'Your complaint is being handled by our escalation team.'}</p>
        </div>
      </Card>
    </div>
  );
}
