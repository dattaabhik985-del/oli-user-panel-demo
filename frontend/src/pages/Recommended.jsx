import React from 'react';
import { Rocket, Fingerprint, Settings, TrendingUp, CalendarCheck, Check } from 'lucide-react';
import { RECOMMENDED, CUSTOMER } from '../oli/data';
import { useLayout } from '../oli/Layout';
import { Card, Btn } from '../oli/ui';

const ICONS = { rocket: Rocket, fingerprint: Fingerprint, settings: Settings, trending: TrendingUp, calendar: CalendarCheck };
const CHIPS = [['State', 'Delhi'], ['Turnover', '₹1-2 Crore'], ['Employees', '15'], ['Marketplace', 'Yes'], ['Business', 'Food & Beverage']];

export default function Recommended() {
  const layout = useLayout();
  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto" data-testid="recommended-page">
      <h1 className="text-xl font-bold text-gray-800">Recommended Services</h1>
      <p className="text-xs text-gray-400 mt-0.5">Services recommended for your business journey, based on your profile and existing services.</p>

      <Card className="p-5 mt-5" data-testid="reco-profile-card">
        <p className="text-sm font-bold text-gray-800">{CUSTOMER.name}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">{CUSTOMER.company} · {CUSTOMER.mainOli}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {CHIPS.map(([k, v]) => (
            <span key={k} className="rounded-md bg-gray-50 border border-gray-100 px-2.5 py-1 text-[10px] text-gray-400">{k}: <b className="text-gray-600">{v}</b></span>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-[10px] text-gray-400">Demo: preview recommendations as</span>
          <select data-testid="reco-demo-select" className="rounded-md border border-gray-200 px-2.5 py-1.5 text-xs text-gray-600 focus:outline-none">
            <option>Client A — Vamsee Krishna (you)</option>
          </select>
        </div>
      </Card>

      <div className="mt-4 rounded-lg bg-blue-50/70 border border-blue-100 px-4 py-3">
        <p className="text-[11px] text-[#2E6BEA] leading-relaxed">
          Service recommendation — services are grouped according to the five business milestones. Items you already have are marked <b>Already Taken</b>. ✦ Recommended for you items are prioritised for your business type.
        </p>
      </div>

      <div className="space-y-6 mt-6">
        {RECOMMENDED.map(sec => {
          const Icon = ICONS[sec.icon] || Rocket;
          return (
            <div key={sec.section} data-testid={`reco-section-${sec.section.replace(/[^a-z0-9]/gi, '-')}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className="text-[#EA6D27]" />
                <p className="text-sm font-semibold text-gray-700">{sec.section}</p>
              </div>
              <div className="space-y-2">
                {sec.items.map(item => (
                  <Card key={sec.section + item.name} className="p-4 flex items-center gap-3" data-testid={`reco-item-${item.name.replace(/[^a-z0-9]/gi, '-')}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                        {item.reco && <span className="text-[9px] font-semibold text-[#EA6D27]">✦ Recommended for you</span>}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                    {item.taken ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-600 px-2.5 py-1 text-[10px] font-medium shrink-0" data-testid="reco-taken-badge"><Check size={11} /> Already Taken</span>
                    ) : (
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-bold text-gray-700">₹ {item.fee} /-</span>
                        <Btn color="orange" data-testid={`reco-buy-${item.name.replace(/[^a-z0-9]/gi, '-')}`} onClick={() => layout.openCheckout({ name: item.name, fee: item.fee, timeline: '7-15 working days' })}>Buy / Apply Now</Btn>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
