import React, { useState } from 'react';
import {
  LayoutDashboard, Briefcase, FileText, Award, ReceiptText, Headset, Compass,
  Sparkles, User, AlertCircle, MessageCircle, UploadCloud, CircleHelp,
} from 'lucide-react';
import { TOUR_SLIDES } from '../oli/data';
import { useLayout } from '../oli/Layout';
import { Card, Btn } from '../oli/ui';

const ICONS = {
  dashboard: LayoutDashboard, services: Briefcase, detail: FileText, upload: UploadCloud,
  cert: Award, invoice: ReceiptText, callback: Headset, explore: Compass, reco: Sparkles,
  profile: User, complaint: AlertCircle, chat: MessageCircle,
};

export default function HowToUse() {
  const layout = useLayout();
  const [idx, setIdx] = useState(0);
  const slide = TOUR_SLIDES[idx];
  const Icon = ICONS[slide.icon] || LayoutDashboard;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto" data-testid="how-to-use-page">
      <h1 className="text-xl font-bold text-gray-800">How to Use</h1>
      <p className="text-xs text-gray-400 mt-0.5">Learn your Online Legal India customer panel — watch the demo or take the live interactive tour.</p>

      <div className="grid md:grid-cols-2 gap-4 mt-5">
        <Card className="p-5" data-testid="panel-demo-card">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">Panel Demo</p>
            <span className="text-[10px] text-gray-400" data-testid="demo-slide-count">{idx + 1} / {TOUR_SLIDES.length}</span>
          </div>
          <div className="flex flex-col items-center text-center mt-6 min-h-[170px]">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Icon size={22} className="text-[#2E6BEA]" />
            </div>
            <p className="text-sm font-semibold text-gray-800 mt-3" data-testid="demo-slide-title">{slide.title}</p>
            <p className="text-[11px] text-gray-400 mt-1.5 max-w-[300px] leading-relaxed" data-testid="demo-slide-text">{slide.text}</p>
          </div>
          <div className="flex justify-center gap-1 mt-2">
            {TOUR_SLIDES.map((_, i) => (
              <span key={i} className={`h-1 rounded-full transition-all ${i === idx ? 'w-4 bg-[#EA6D27]' : 'w-1.5 bg-gray-200'}`} />
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-4">
            <Btn color="gray" size="md" data-testid="demo-prev-btn" disabled={idx === 0} onClick={() => setIdx(i => Math.max(0, i - 1))}>‹ Previous</Btn>
            <Btn color="orange" size="md" data-testid="demo-next-btn" onClick={() => setIdx(i => Math.min(TOUR_SLIDES.length - 1, i + 1))}>Next ›</Btn>
          </div>
        </Card>

        <Card className="p-5 flex flex-col items-center justify-center text-center" data-testid="start-tour-card">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <CircleHelp size={22} className="text-[#2E6BEA]" />
          </div>
          <p className="text-sm font-semibold text-gray-800 mt-3">Welcome to your Online Legal India Customer Panel</p>
          <p className="text-[11px] text-gray-400 mt-1.5 max-w-[280px] leading-relaxed">
            Let's take a quick interactive tour to help you understand your dashboard and all the features available to you.
          </p>
          <Btn color="orange" size="md" className="mt-4" data-testid="start-tour-btn" onClick={() => layout.startTour()}>Start Tour</Btn>
        </Card>
      </div>
    </div>
  );
}
