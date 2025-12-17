import React, { useRef, useEffect } from 'react';
import { CauseAnalysis } from '../types';
import { ArrowRight, Flame, Activity, Target, GitMerge } from 'lucide-react';

interface AnalysisWhyProps {
  analysisFire: CauseAnalysis;
  setAnalysisFire: (data: CauseAnalysis) => void;
  analysisInjury: CauseAnalysis;
  setAnalysisInjury: (data: CauseAnalysis) => void;
  onNext: () => void;
  onBack: () => void;
}

export const AnalysisWhy: React.FC<AnalysisWhyProps> = ({ 
  analysisFire, setAnalysisFire, 
  analysisInjury, setAnalysisInjury, 
  onNext, onBack 
}) => {
  const [activeTab, setActiveTab] = React.useState<'fire' | 'injury'>('fire');
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentData = activeTab === 'fire' ? analysisFire : analysisInjury;
  const setFunc = activeTab === 'fire' ? setAnalysisFire : setAnalysisInjury;

  const updateField = (field: keyof CauseAnalysis, value: string) => {
    setFunc({ ...currentData, [field]: value });
  };
  
  useEffect(() => {
    // Note: Since scrolling is handled by Layout, this ref might not scroll the main container.
    // Kept for structure, but focusing on spacing for visibility.
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <>
      <div className="flex flex-col relative" ref={scrollRef}>
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none h-full">
          <img 
            src={activeTab === 'fire' 
              ? "https://images.unsplash.com/photo-1599818466699-e6865eb270a4?q=80&w=1000&auto=format&fit=crop" 
              : "https://images.unsplash.com/photo-1505148230895-d9a785a5a884?q=80&w=1000&auto=format&fit=crop"
            } 
            alt="Analysis Background" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Layer */}
        <div className="relative z-10 pb-32">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">원인 분석</h2>
            <p className="text-sm text-slate-500 mt-1">현상에 대한 직접적인 근본 원인과<br/>이를 확대시킨 영향 요인을 분석하세요.</p>
          </div>

          {/* Custom Segmented Control */}
          <div className="flex p-1 bg-slate-200 rounded-xl mb-6 relative">
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-spring ${activeTab === 'fire' ? 'left-1' : 'left-[calc(50%+4px)]'}`}
            ></div>
            <button 
              onClick={() => setActiveTab('fire')}
              className={`flex-1 relative z-10 py-2.5 text-sm font-bold transition-colors flex items-center justify-center gap-2 ${activeTab === 'fire' ? 'text-slate-900' : 'text-slate-500'}`}
            >
              <Flame size={16} className={activeTab === 'fire' ? 'text-orange-500' : ''}/> 화재 원인
            </button>
            <button 
              onClick={() => setActiveTab('injury')}
              className={`flex-1 relative z-10 py-2.5 text-sm font-bold transition-colors flex items-center justify-center gap-2 ${activeTab === 'injury' ? 'text-slate-900' : 'text-slate-500'}`}
            >
              <Activity size={16} className={activeTab === 'injury' ? 'text-red-500' : ''}/> 부상 원인
            </button>
          </div>

          <div className="space-y-6">
            
            {/* Direct Cause Section */}
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 p-5 rounded-2xl shadow-lg shadow-slate-200/50">
               <div className="flex items-center gap-2 mb-3">
                 <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-400/50">
                    <Target size={20} />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-800 text-base leading-tight">근본 원인 (직접 원인)</h3>
                 </div>
               </div>
               <textarea 
                  value={currentData.directCause}
                  onChange={(e) => updateField('directCause', e.target.value)}
                  className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none text-sm resize-none leading-relaxed placeholder:text-slate-400"
                  placeholder="사고를 유발한 결정적인 요소는 무엇입니까?"
               />
            </div>

            {/* Contributing Factors Section */}
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 p-5 rounded-2xl shadow-lg shadow-slate-200/50">
               <div className="flex items-center gap-2 mb-3">
                 <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center border border-orange-200">
                    <GitMerge size={20} />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-800 text-base leading-tight">영향 요인 (확대 요인)</h3>
                 </div>
               </div>
               <textarea 
                  value={currentData.contributingFactors}
                  onChange={(e) => updateField('contributingFactors', e.target.value)}
                  className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm resize-none leading-relaxed placeholder:text-slate-400"
                  placeholder="피해를 키우거나 원인을 제공한 배경은 무엇입니까?"
               />
            </div>

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