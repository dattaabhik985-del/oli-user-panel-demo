import React, { useState } from 'react';
import { Phone, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../oli/store';
import { useLayout } from '../oli/Layout';
import { Card, Btn } from '../oli/ui';

export default function Callbacks() {
  const { state } = useStore();
  const layout = useLayout();
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto" data-testid="callbacks-page">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">All Callback Request</h1>
          <p className="text-xs text-gray-400 mt-0.5">One active request per service — re-requesting revises the existing callback.</p>
        </div>
        <Btn color="orange" size="md" data-testid="request-callback-btn" onClick={() => layout.openCallback()}><Phone size={13} /> Request Callback</Btn>
      </div>

      <Card className="mt-5 overflow-x-auto oli-scroll" data-testid="callbacks-table-wrap">
        <table className="w-full min-w-[820px]" data-testid="callbacks-table">
          <thead className="border-b border-gray-100">
            <tr>
              {['OLI ID', 'SERVICE', 'ASSIGNED EXPERT', 'REQUESTED', 'REVISED', 'PREFERRED', 'STATUS', 'REMARK', ''].map(h => (
                <th key={h} className="text-left text-[10px] font-semibold tracking-wider text-gray-400 px-4 py-3 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {state.callbacks.map(c => (
              <React.Fragment key={c.id}>
                <tr data-testid={`callback-row-${c.id}`} className="cursor-pointer hover:bg-gray-50/60" onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                  <td className="px-4 py-3 text-xs font-medium text-gray-700 whitespace-nowrap">{c.oliId}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{c.service}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{c.expert}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{c.requestedAt}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{c.revisedAt}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{c.preferred}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {c.status === 'Pending'
                      ? <span className="rounded-full bg-orange-100 text-orange-600 px-2 py-0.5 text-[10px] font-medium" data-testid={`callback-status-${c.id}`}>Pending</span>
                      : <span className="rounded-full bg-green-100 text-green-600 px-2 py-0.5 text-[10px] font-medium" data-testid={`callback-status-${c.id}`}>Completed</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-[160px] truncate">{c.remark}</td>
                  <td className="px-2 py-3 text-gray-300">{expanded === c.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</td>
                </tr>
                {expanded === c.id && (
                  <tr data-testid={`callback-history-${c.id}`}>
                    <td colSpan={9} className="px-4 py-3 bg-gray-50/70">
                      <p className="text-[10px] font-semibold tracking-widest text-gray-400 mb-1.5">REVISION HISTORY</p>
                      <div className="space-y-1">
                        {c.history.map((h, i) => (
                          <p key={i} className="text-[11px] text-gray-500">
                            <span className={`font-medium ${h.action === 'Revised' ? 'text-orange-500' : 'text-[#2E6BEA]'}`}>{h.action}</span> · {h.at} — {h.detail}
                          </p>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {state.callbacks.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-10 text-center text-xs text-gray-400" data-testid="callbacks-empty">No callback requests yet. Use "Request Callback" to schedule one.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
