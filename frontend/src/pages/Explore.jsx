import React from 'react';
import { FileSignature } from 'lucide-react';
import { EXPLORE_SERVICES } from '../oli/data';
import { useLayout } from '../oli/Layout';
import { Card, Btn } from '../oli/ui';

export default function Explore() {
  const layout = useLayout();
  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto" data-testid="explore-page">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">OLI Other Services</h1>
          <p className="text-xs text-gray-400 mt-0.5">Explore and instantly purchase additional services from Online Legal India.</p>
        </div>
        <span className="text-[11px] text-gray-400 whitespace-nowrap mt-1" data-testid="explore-count">{EXPLORE_SERVICES.length} services available</span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        {EXPLORE_SERVICES.map(s => (
          <Card key={s.name} className="p-5 flex flex-col items-center text-center" data-testid={`explore-card-${s.name.replace(/[^a-z0-9]/gi, '-')}`}>
            <p className="text-sm font-semibold text-gray-800 min-h-[40px] flex items-center">{s.name}</p>
            <p className="text-base font-bold text-gray-900 mt-2">₹ {s.fee} /-</p>
            <Btn color="orange" size="md" className="mt-3" data-testid={`apply-pay-${s.name.replace(/[^a-z0-9]/gi, '-')}`} onClick={() => layout.openCheckout(s)}>
              <FileSignature size={13} /> Apply &amp; Pay
            </Btn>
          </Card>
        ))}
      </div>
    </div>
  );
}
