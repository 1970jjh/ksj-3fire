import React from 'react';
import { Step, UserProfile } from '../types';
import { LogOut, FileText, Settings } from 'lucide-react';
import { TeamInfoCard } from './TeamInfoCard';

interface LayoutProps {
  currentStep: Step;
  onNavigate: (step: Step) => void;
  children: React.ReactNode;
  user: UserProfile | null;
  onExit: () => void;
  totalTeams: number;
  isInfoCardOpen: boolean;
  onOpenInfoCard: () => void;
  onCloseInfoCard: () => void;
}

const stepProgress = {
  [Step.INTRO]: 0,
  [Step.SITUATION]: 20,
  [Step.PROBLEM_DEFINITION]: 40,
  [Step.ANALYSIS_WHY]: 60,
  [Step.SOLUTION]: 80,
  [Step.REPORT]: 100,
};

const stepLabels = {
  [Step.INTRO]: '시작',
  [Step.SITUATION]: '현상 파악',
  [Step.PROBLEM_DEFINITION]: '문제 정의',
  [Step.ANALYSIS_WHY]: '원인 분석',
  [Step.SOLUTION]: '해결 방안',
  [Step.REPORT]: '최종 보고',
};

export const Layout: React.FC<LayoutProps> = ({ 
  currentStep, 
  onNavigate, 
  children, 
  user, 
  onExit, 
  totalTeams,
  isInfoCardOpen,
  onOpenInfoCard,
  onCloseInfoCard
}) => {
  const progress = stepProgress[currentStep] || 0;

  // Intro 화면 (Login)에서는 레이아웃 미적용
  if (currentStep === Step.INTRO) {
    return (
      <div className="h-full bg-slate-900 relative text-white overflow-hidden flex flex-col">
        <button 
          onClick={onExit}
          className="absolute top-8 right-5 p-2 text-white/30 hover:text-white z-50 transition-colors"
          title="관리자 설정"
        >
          <Settings size={24} />
        </button>
        {children}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-100 overflow-hidden relative">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 z-30 sticky top-0 pt-3 pb-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-orange-200">
            PBL
          </div>
          <div className="flex flex-col">
             <span className="text-[10px] text-slate-500 font-medium tracking-tight">제3공장 화재사고</span>
             <span className="text-sm font-bold text-slate-900 leading-tight">{stepLabels[currentStep]}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {user && (
            <div className="flex flex-col items-end mr-1">
              <span className="text-[10px] text-slate-400 font-medium">{user.groupName}</span>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                {user.teamName} {user.name}
              </span>
            </div>
          )}
          <button 
            onClick={onExit} 
            className="p-2 text-slate-400 hover:text-red-500 active:scale-95 transition-all"
            title="종료/로그아웃"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-1 z-30">
        <div 
          className="bg-gradient-to-r from-orange-500 to-red-500 h-1 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(249,115,22,0.5)]" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overscroll-contain bg-slate-50 w-full relative">
        <div className="p-5 pb-32 min-h-full"> {/* 하단 고정 버튼 공간 확보를 위한 pb-32 */}
          {children}
        </div>
      </main>
      
      {/* Information Card Trigger (Fixed Bottom) - Hidden on Situation step because it has a specific large button */}
      {user && currentStep !== Step.SITUATION && (
        <div className="absolute bottom-20 left-4 right-4 z-20 flex justify-center pointer-events-none">
           <button
             onClick={onOpenInfoCard}
             className="pointer-events-auto bg-slate-900 text-white pl-4 pr-5 py-3 rounded-full shadow-xl shadow-slate-400/50 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all border border-slate-700"
           >
             <div className="bg-orange-500 p-1.5 rounded-full">
               <FileText size={16} className="text-white"/>
             </div>
             <div className="text-left">
               <div className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-0.5">Team Data</div>
               <div className="text-sm font-bold leading-none">{user.teamName} 정보 카드 확인</div>
             </div>
           </button>
        </div>
      )}

      {/* Info Card Modal */}
      <TeamInfoCard 
        user={user}
        isOpen={isInfoCardOpen}
        onClose={onCloseInfoCard}
        totalTeams={totalTeams}
      />
    </div>
  );
};