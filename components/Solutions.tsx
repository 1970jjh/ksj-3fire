import React, { useState } from 'react';
import { SimulationState } from '../types';
import { ArrowRight, CalendarClock, HardHat, ShieldCheck, ChevronDown, CheckCircle2 } from 'lucide-react';

interface SolutionsProps {
  solutions: SimulationState['solutions'];
  setSolutions: (s: SimulationState['solutions']) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Solutions: React.FC<SolutionsProps> = ({ solutions, setSolutions, onNext, onBack }) => {
  // Accordion state: keep track of which section is open
  const [openSection, setOpenSection] = useState<'immediate' | 'prevention' | 'contingency'>('immediate');

  const handleChange = (field: keyof SimulationState['solutions'], value: string) => {
    setSolutions({ ...solutions, [field]: value });
  };

  const SolutionCard = ({ 
    id, 
    title, 
    icon: Icon, 
    colorClass, 
    bgClass, 
    value, 
    field 
  }: { 
    id: 'immediate' | 'prevention' | 'contingency', 
    title: string, 
    icon: any, 
    colorClass: string, 
    bgClass: string,
    value: string, 
    field: keyof SimulationState['solutions'] 
  }) => {
    const isOpen = openSection === id;
    const isFilled = value.length > 10;

    return (
      <div className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-slate-300 shadow-lg ring-1 ring-slate-200' : 'border-slate-100 shadow-sm'}`}>
        <button 
          onClick={() => setOpenSection(isOpen ? id : id)} // Keep at least one open or toggle
          className="w-full flex items-center justify-between p-4 bg-white"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${bgClass} ${colorClass}`}>
              <Icon size={20} />
            </div>
            <div className="text-left">
              <h3 className={`font-bold text-sm ${isOpen ? 'text-slate-900' : 'text-slate-600'}`}>{title}</h3>
              {!isOpen && isFilled && <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-0.5"><CheckCircle2 size={10}/> 작성 완료</p>}
            </div>
          </div>
          <ChevronDown size={20} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="px-4 pb-5 animate-fade-in">
            <textarea
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              className="w-full h-40 p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm leading-relaxed resize-none shadow-inner mt-2"
              placeholder="여기에 대책을 상세히 작성하세요..."
              autoFocus={isOpen}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="pb-24"> {/* Padding for bottom nav */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">해결 방안 수립</h2>
          <p className="text-sm text-slate-500 mt-1">단계별 대책을 수립하여 보고서를 완성하세요.</p>
        </div>

        <div className="space-y-4">
          <SolutionCard 
            id="immediate"
            title="1. 단기 대책 (납기)"
            icon={CalendarClock}
            colorClass="text-red-600"
            bgClass="bg-red-50"
            value={solutions.immediate}
            field="immediate"
          />
          
          <SolutionCard 
            id="prevention"
            title="2. 재발 방지 (설비)"
            icon={HardHat}
            colorClass="text-orange-600"
            bgClass="bg-orange-50"
            value={solutions.prevention}
            field="prevention"
          />

          <SolutionCard 
            id="contingency"
            title="3. 관리 시스템 (운영)"
            icon={ShieldCheck}
            colorClass="text-blue-600"
            bgClass="bg-blue-50"
            value={solutions.contingency}
            field="contingency"
          />
        </div>
      </div>

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 z-40 md:absolute md:rounded-b-none">
        <div className="max-w-md mx-auto flex gap-3">
          <button 
            onClick={onBack}
            className="flex-1 bg-white border border-slate-300 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-colors active:scale-95"
          >
            이전
          </button>
          <button 
            onClick={onNext}
            className="flex-[2] bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95"
          >
             보고서 완성 <ArrowRight size={18}/>
          </button>
        </div>
      </div>
    </>
  );
};