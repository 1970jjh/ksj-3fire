import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, ChevronRight, AlertCircle } from 'lucide-react';

interface AnalysisTreeProps {
  onNext: () => void;
  onBack: () => void;
}

export const AnalysisTree: React.FC<AnalysisTreeProps> = ({ onNext, onBack }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('root');

  const toggle = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="flex flex-col h-full pb-20">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900">3단계: Logic Tree</h2>
        <p className="text-sm text-slate-500">원인을 구조적으로 분해하여 검증하세요.</p>
      </div>

      <div className="space-y-3">
        {/* Level 1: The Problem */}
        <div className="bg-red-600 text-white p-4 rounded-xl shadow-md flex items-center justify-between">
          <span className="font-bold">제3공장 화재 발생</span>
          <ChevronDown size={20}/>
        </div>

        {/* Level 2: Categories */}
        <div className="pl-4 border-l-2 border-slate-200 space-y-3">
          
          {/* Branch 1 */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <button onClick={() => toggle('branch1')} className="w-full p-4 flex items-center justify-between text-left">
              <span className="text-slate-600 font-medium">1. 장비 자체 결함?</span>
              {expandedSection === 'branch1' ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
            </button>
            {expandedSection === 'branch1' && (
              <div className="bg-slate-50 p-4 text-xs text-slate-500 border-t">
                최근 점검 기록상 장비 노후화나 기계적 결함은 발견되지 않음. (가능성 낮음)
              </div>
            )}
          </div>

          {/* Branch 2 (Correct) */}
          <div className="bg-orange-50 border-2 border-orange-400 rounded-lg overflow-hidden relative shadow-sm">
            <div className="absolute top-0 right-0 p-1 bg-green-500 rounded-bl-lg">
               <CheckCircle2 size={12} className="text-white"/>
            </div>
            <button onClick={() => toggle('branch2')} className="w-full p-4 flex items-center justify-between text-left">
              <span className="text-orange-900 font-bold">2. 공정 조건 문제?</span>
              {expandedSection === 'branch2' ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
            </button>
            
            {expandedSection === 'branch2' && (
              <div className="bg-white p-3 m-2 rounded border border-orange-200 space-y-2 animate-fade-in">
                 <div className="p-2 border border-slate-200 rounded text-sm text-slate-400">
                    2-1. 온도가 설정 범위 초과?
                 </div>
                 <div className="p-3 border-2 border-orange-300 bg-orange-50 rounded text-sm font-bold text-orange-800 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-600"/>
                    2-2. 전력 사용량 초과 (과부하)
                 </div>
                 <div className="p-2 border-l-4 border-slate-300 pl-3 text-xs text-slate-500 mt-2">
                    <strong>Fact Check:</strong><br/>
                    Limit 16kW vs Used 16.5kW<br/>
                    (생산량 증대를 위해 장비 풀가동)
                 </div>
              </div>
            )}
          </div>

          {/* Branch 3 */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <button onClick={() => toggle('branch3')} className="w-full p-4 flex items-center justify-between text-left">
              <span className="text-slate-600 font-medium">3. 환경적 요인?</span>
              {expandedSection === 'branch3' ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
            </button>
             {expandedSection === 'branch3' && (
              <div className="bg-slate-50 p-4 text-xs text-slate-500 border-t">
                습도 및 외부 온도는 정상 범위. 특이사항 없음.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-slate-100 p-4 rounded-xl flex items-start gap-3">
         <AlertCircle className="text-blue-600 shrink-0 mt-1" size={20}/>
         <div className="text-sm text-slate-700">
           <strong>분석 결론:</strong><br/>
           화재의 직접적 원인은 <u>무리한 생산 일정</u>으로 인한 <u>전력 과부하</u>입니다.
         </div>
      </div>

       {/* Sticky Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-slate-200 z-20 md:absolute md:rounded-b-xl flex gap-3">
        <button 
          onClick={onBack}
          className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-xl"
        >
          이전
        </button>
        <button 
          onClick={onNext}
          className="flex-[2] bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
        >
          다음 <ArrowRight size={20}/>
        </button>
      </div>
    </div>
  );
};