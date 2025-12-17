import React from 'react';
import { SimulationState } from '../types';
import { Printer, Download, Target, GitMerge } from 'lucide-react';

interface ReportProps {
  state: SimulationState;
  onBack: () => void;
}

export const Report: React.FC<ReportProps> = ({ state, onBack }) => {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4 bg-slate-900 text-white -mx-4 md:-mx-8 px-4 md:px-8 py-6 md:-mt-8 mb-6">
        <div>
          <span className="text-orange-500 font-bold tracking-widest text-xs uppercase">CONFIDENTIAL</span>
          <h1 className="text-3xl font-bold mt-1">사고 조사 및 대책 보고서</h1>
          <p className="text-slate-400 mt-1">제3공장 화재 건 | 작성팀: {state.user?.teamName || 'Unknown Team'}</p>
        </div>
        <div className="flex gap-2">
           <button onClick={onBack} className="px-4 py-2 rounded-lg border border-slate-600 hover:bg-slate-700 text-slate-300 transition-colors">
            수정하기
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors">
            <Printer size={18}/> 인쇄 / PDF 저장
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8 print:space-y-4">
        
        {/* Section 1: Overview */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 print:border-0 print:shadow-none">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-2 mb-4">1. 사고 개요 (문제 정의)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
             <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4 mb-2">
                <div><span className="text-slate-500 font-medium">발생 일시:</span> 8월 4일 10:30</div>
                <div><span className="text-slate-500 font-medium">발생 장소:</span> 제3공장 생산 라인</div>
             </div>
             <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <span className="block text-red-800 font-bold mb-1">인적 피해</span>
                <p className="text-slate-700 whitespace-pre-wrap">{state.problemDefinition.humanDamage || '-'}</p>
             </div>
             <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <span className="block text-orange-800 font-bold mb-1">물적 피해</span>
                <p className="text-slate-700 whitespace-pre-wrap">{state.problemDefinition.materialDamage || '-'}</p>
             </div>
             <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 col-span-1 md:col-span-2">
                <span className="block text-slate-700 font-bold mb-1">기타 특이사항</span>
                <p className="text-slate-600 whitespace-pre-wrap">{state.problemDefinition.others || '-'}</p>
             </div>
          </div>
        </section>

        {/* Section 2: Root Cause Analysis */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 print:border-0 print:shadow-none">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-2 mb-4">2. 원인 분석 결과</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fire Analysis */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
               <div className="bg-slate-100 p-3 font-bold text-slate-800 border-b border-slate-200 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-orange-500"></span> 화재 발생 원인
               </div>
               <div className="p-4 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-1">
                      <Target size={14}/> 근본 원인 (직접 원인)
                    </div>
                    <div className="text-slate-900 font-medium">{state.analysisFire.directCause}</div>
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-1">
                      <GitMerge size={14}/> 영향 요인 (확대 요인)
                    </div>
                    <div className="text-slate-700 text-sm">{state.analysisFire.contributingFactors}</div>
                  </div>
               </div>
            </div>

            {/* Injury Analysis */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
               <div className="bg-slate-100 p-3 font-bold text-slate-800 border-b border-slate-200 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-red-500"></span> 인명 피해 원인
               </div>
               <div className="p-4 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-1">
                      <Target size={14}/> 근본 원인 (직접 원인)
                    </div>
                    <div className="text-slate-900 font-medium">{state.analysisInjury.directCause}</div>
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-1">
                      <GitMerge size={14}/> 영향 요인 (확대 요인)
                    </div>
                    <div className="text-slate-700 text-sm">{state.analysisInjury.contributingFactors}</div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Section 3: Action Plan */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 print:border-0 print:shadow-none">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-2 mb-4">3. 향후 대책 및 해결 방안</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-700 text-sm mb-2 uppercase">생산 정상화 (납기 대응)</h3>
              <div className="bg-slate-50 p-4 rounded border border-slate-100 min-h-[80px] text-slate-800 whitespace-pre-wrap">
                {state.solutions.immediate}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-slate-700 text-sm mb-2 uppercase">시설/설비 개선 (재발 방지)</h3>
              <div className="bg-slate-50 p-4 rounded border border-slate-100 min-h-[80px] text-slate-800 whitespace-pre-wrap">
                {state.solutions.prevention}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-slate-700 text-sm mb-2 uppercase">안전 관리 강화</h3>
              <div className="bg-slate-50 p-4 rounded border border-slate-100 min-h-[80px] text-slate-800 whitespace-pre-wrap">
                {state.solutions.contingency}
              </div>
            </div>
          </div>
        </section>

        <div className="text-center pt-8 print:hidden">
          <p className="text-slate-500 mb-4">수고하셨습니다. 위 내용을 바탕으로 발표를 준비해주세요.</p>
        </div>
      </div>
    </div>
  );
};