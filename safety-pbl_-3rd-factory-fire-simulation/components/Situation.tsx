import React from 'react';
import { Newspaper, ArrowRight, AlertTriangle, Images, Search } from 'lucide-react';

interface SituationProps {
  onNext: () => void;
  onOpenInfoCard: () => void;
}

export const Situation: React.FC<SituationProps> = ({ onNext, onOpenInfoCard }) => {
  return (
    <div className="flex flex-col h-full font-['Noto_Sans_KR']">
      
      {/* Main Content Area - Centered */}
      <div className="flex-1 flex flex-col justify-center items-center p-2 mb-36 animate-fade-in">
        
        {/* Large Headline */}
        <div className="text-center mb-10 w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 mb-6 border border-red-100 shadow-sm animate-pulse-slow">
            <AlertTriangle size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl leading-tight font-black text-slate-900 tracking-tight mb-2 break-keep">
            제3공장에서<br/>
            <span className="text-red-600">화재 사건 발생!</span>
          </h1>
          <p className="text-slate-500 font-medium mt-4 text-lg">
            긴급 대응팀이 소집되었습니다.
          </p>
        </div>

        {/* Incident Summary Card */}
        <div className="w-full bg-white p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50">
           <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-5 text-lg border-b border-slate-100 pb-3">
             <Newspaper size={20} className="text-slate-500"/> 사건 개요
           </h3>
           <div className="space-y-4 text-lg">
             <div className="flex justify-between items-center">
               <span className="text-slate-500 font-medium text-base">발생 일시</span>
               <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">8/4(목) 10:30</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-slate-500 font-medium text-base">발생 장소</span>
               <span className="font-bold text-slate-900">제3공장 생산 라인</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-slate-500 font-medium text-base">피해 상황</span>
               <span className="font-bold text-red-600">인명피해 및 설비 소실</span>
             </div>
           </div>
        </div>
        
        <p className="text-center text-slate-400 text-sm mt-8 leading-relaxed">
           사고의 숨겨진 원인을 찾기 위해<br/>현장 단서를 확인하십시오.
        </p>

      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 pt-2 border-t border-slate-200 z-20 md:absolute md:rounded-b-3xl space-y-3">
        
        {/* Info Card Trigger Button (Large & Visual) */}
        <button 
          onClick={onOpenInfoCard}
          className="w-full bg-slate-100 hover:bg-slate-200 border-2 border-slate-200 text-slate-700 rounded-2xl p-4 flex items-center justify-between group transition-all"
        >
           <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
                <Images size={28} className="text-slate-400 z-10"/>
                {/* Visual hint of stacked photos */}
                <div className="absolute right-0 top-0 w-8 h-8 bg-slate-100 -mr-4 -mt-4 rotate-45"></div>
             </div>
             <div className="text-left">
               <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-0.5">Team Data</div>
               <div className="text-lg font-bold text-slate-900 leading-tight">현장 단서 이미지 확인</div>
             </div>
           </div>
           <div className="bg-white p-2 rounded-full shadow-sm text-slate-400 group-hover:text-orange-500 transition-colors">
             <Search size={20} />
           </div>
        </button>

        {/* Next Step Button */}
        <button 
          onClick={onNext}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 text-lg"
        >
          다음 단계 (문제 정의) <ArrowRight size={24}/>
        </button>
      </div>
    </div>
  );
};