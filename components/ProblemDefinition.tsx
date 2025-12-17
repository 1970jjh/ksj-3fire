import React, { useRef, useEffect } from 'react';
import { SimulationState } from '../types';
import { ArrowRight, UserX, Box, FileQuestion, AlertCircle } from 'lucide-react';

interface ProblemDefinitionProps {
  data: SimulationState['problemDefinition'];
  setData: (data: SimulationState['problemDefinition']) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ProblemDefinition: React.FC<ProblemDefinitionProps> = ({ data, setData, onNext, onBack }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleChange = (field: keyof SimulationState['problemDefinition'], value: string) => {
    setData({ ...data, [field]: value });
  };

  return (
    <>
      <div className="flex flex-col h-full" ref={scrollRef}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">문제 정의</h2>
          <p className="text-sm text-slate-500 mt-1">
             확보한 정보 카드를 바탕으로<br/>
             현재 발생한 피해 규모와 현황을 정리하십시오.
          </p>
        </div>

        <div className="space-y-6 pb-24">
           {/* Section 1: Human Damage */}
           <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                 <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                    <UserX size={18} />
                 </div>
                 <h3 className="font-bold text-slate-800">1. 인적 피해</h3>
              </div>
              <textarea 
                value={data.humanDamage}
                onChange={(e) => handleChange('humanDamage', e.target.value)}
                placeholder="예: 부상자 수, 부상 부위 및 정도, 후송 상황 등"
                className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm resize-none"
              />
           </div>

           {/* Section 2: Material Damage */}
           <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                 <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Box size={18} />
                 </div>
                 <h3 className="font-bold text-slate-800">2. 물적 피해</h3>
              </div>
              <textarea 
                value={data.materialDamage}
                onChange={(e) => handleChange('materialDamage', e.target.value)}
                placeholder="예: 소실된 장비, 가동 중단 라인, 생산 차질 물량 등"
                className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm resize-none"
              />
           </div>

           {/* Section 3: Others */}
           <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                 <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <FileQuestion size={18} />
                 </div>
                 <h3 className="font-bold text-slate-800">3. 기타 특이사항</h3>
              </div>
              <textarea 
                value={data.others}
                onChange={(e) => handleChange('others', e.target.value)}
                placeholder="예: 목격자 진술 내용, 초기 대응 문제점, 현장 분위기 등"
                className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm resize-none"
              />
           </div>

           <div className="bg-slate-100 p-4 rounded-xl flex gap-3 text-xs text-slate-500 leading-relaxed">
             <AlertCircle size={16} className="shrink-0 mt-0.5"/>
             이곳에 정리된 내용은 최종 보고서의 사고 개요에 활용됩니다. 핵심 내용을 빠짐없이 기록하세요.
           </div>
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
            className="flex-[2] bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-slate-300 flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95"
          >
            다음 단계 <ArrowRight size={18}/>
          </button>
        </div>
      </div>
    </>
  );
};
