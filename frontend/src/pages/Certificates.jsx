import React from 'react';
import { Award, Download, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '../oli/store';
import { Card, Btn } from '../oli/ui';
import { certificateDoc } from '../oli/pdf';

export default function Certificates() {
  const { state } = useStore();
  const certs = state.services.filter(s => s.cert);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto" data-testid="certificates-page">
      <h1 className="text-xl font-bold text-gray-800">My Certificates</h1>
      <p className="text-xs text-gray-400 mt-0.5">{certs.length} certificate(s) issued.</p>

      <div className="space-y-3 mt-5">
        {certs.map(s => (
          <Card key={s.oliId} className="p-4 flex items-center gap-3" data-testid={`cert-row-${s.oliId}`}>
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
              <Award size={18} className="text-[#16A34A]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">{s.name}{s.key === 'tm' && s.meta[1] ? ` (${s.meta[1]})` : ''}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{s.oliId} · Certificate No: {s.cert.no} · Issued on {s.cert.issuedOn}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Btn
                color="green"
                data-testid={`cert-download-${s.oliId}`}
                onClick={() => certificateDoc(s).save(`${s.cert.no}.pdf`)}
              >
                <Download size={13} /> Download Certificate
              </Btn>
              <Btn
                color="green"
                outline
                data-testid={`cert-email-${s.oliId}`}
                onClick={() => toast.success(`Certificate sent to ${state.profile.email} (demo).`)}
              >
                <Mail size={13} /> Email
              </Btn>
            </div>
          </Card>
        ))}
        {certs.length === 0 && (
          <Card className="p-8 text-center text-xs text-gray-400" data-testid="certificates-empty">
            No certificates yet. Certificates appear here when a service is marked as Work Done.
          </Card>
        )}
      </div>
    </div>
  );
}
