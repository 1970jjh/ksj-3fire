import React, { useState, useEffect } from 'react';
import { AlertTriangle, ChevronRight, User, Users, Building2, CheckCircle2, Loader2, Settings } from 'lucide-react';
import { SessionConfig, UserProfile } from '../types';

interface IntroProps {
  sessionConfig: SessionConfig;
  onJoin: (user: UserProfile) => void;
  onAdminAccess: () => void;
}

export const Intro: React.FC<IntroProps> = ({ sessionConfig, onJoin, onAdminAccess }) => {
  const [step, setStep] = useState<'WAITING' | 'TEAM' | 'NAME'>('WAITING');
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [userName, setUserName] = useState('');

  // Auto-redirect logic based on session status
  useEffect(() => {
    if (sessionConfig.isSessionActive) {
      setStep('TEAM');
    } else {
      setStep('WAITING');
    }
  }, [sessionConfig.isSessionActive]);

  // Helper to handle team selection
  const handleTeamSelect = (id: number) => {
    setSelectedTeamId(id);
  };

  // Helper to submit login
  const handleLogin = () => {
    if (selectedTeamId && userName.trim()) {
      onJoin({
        name: userName,
        teamId: selectedTeamId,
        teamName: `${selectedTeamId}조`,
        groupName: sessionConfig.groupName
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white relative overflow-hidden">
      
      {/* Background Image & Effects */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1497911270199-1c552ee64aa4?q=80&w=1000&auto=format&fit=crop" 
          alt="Fire Background" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/90 to-slate-900"></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col h-full p-6 animate-fade-in">
        
        {/* Header - Only show if not waiting, or keep consistently */}
        <div className="mt-8 mb-8 shrink-0 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-orange-600 shadow-[0_0_20px_rgba(220,38,38,0.5)] border border-red-400/50 mb-4">
            <AlertTriangle size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-black leading-tight tracking-tight text-white drop-shadow-lg">
            제3공장 화재사고<br/>
            <span className="text-red-500">문제해결 시뮬레이션</span>
          </h1>
        </div>

        {/* Login Flow Steps */}
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          
          {/* Step 0: Waiting for Session */}
          {step === 'WAITING' && (
             <div className="text-center animate-pulse">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 flex flex-col items-center gap-4">
                   <Loader2 size={48} className="text-orange-500 animate-spin" />
                   <div>
                     <h2 className="text-xl font-bold text-white mb-2">세션을 여는 중입니다</h2>
                     <p className="text-slate-400 text-sm">강사(관리자)가 세션을 시작할 때까지<br/>잠시만 기다려주세요.</p>
                   </div>
                </div>
             </div>
          )}

          {/* Step 1: Team Selection (Replaced Group Check) */}
          {step === 'TEAM' && (
             <div className="flex flex-col h-full animate-fade-in">
                <div className="text-center mb-6">
                   <div className="inline-block px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-400 mb-2">
                     {sessionConfig.groupName}
                   </div>
                   <h2 className="text-xl font-bold">소속 조를 선택하세요</h2>
                </div>
                
                <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-3 pr-1 pb-4 scrollbar-hide content-start">
                   {Array.from({ length: sessionConfig.totalTeams }, (_, i) => i + 1).map((id) => (
                      <button
                        key={id}
                        onClick={() => handleTeamSelect(id)}
                        className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all
                           ${selectedTeamId === id 
                             ? 'bg-orange-600 border-orange-400 text-white shadow-[0_0_15px_rgba(234,88,12,0.5)]' 
                             : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700 hover:border-slate-500'
                           }
                        `}
                      >
                         <span className="text-2xl font-black">{id}</span>
                         <span className="text-[10px] font-bold uppercase">TEAM</span>
                         {selectedTeamId === id && <CheckCircle2 size={14} className="mt-1"/>}
                      </button>
                   ))}
                </div>

                <div className="mt-4">
                   <button 
                    onClick={() => setStep('NAME')}
                    disabled={!selectedTeamId}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
                  >
                    다음 (이름 입력) <ChevronRight size={18}/>
                  </button>
                </div>
             </div>
          )}

           {/* Step 2: Name Input */}
           {step === 'NAME' && (
             <div className="animate-fade-in">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                   <div className="mb-6 text-center">
                      <div className="inline-block px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30 mb-2">
                         {sessionConfig.groupName} | {selectedTeamId}조
                      </div>
                      <h2 className="text-xl font-bold text-white">참가자 이름을 입력하세요</h2>
                   </div>

                   <div className="space-y-4">
                      <div>
                         <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Name</label>
                         <input
                           type="text"
                           value={userName}
                           onChange={(e) => setUserName(e.target.value)}
                           placeholder="실명을 입력하세요"
                           className="w-full bg-slate-900/80 border border-slate-600 text-white px-5 py-4 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-lg placeholder-slate-600"
                           autoFocus
                         />
                      </div>
                      
                      <button 
                        onClick={handleLogin}
                        disabled={!userName.trim()}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 disabled:opacity-50 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:from-green-500 hover:to-emerald-500 transition-all"
                      >
                        시뮬레이션 입장 <ChevronRight size={20}/>
                      </button>
                      
                      <button onClick={() => setStep('TEAM')} className="w-full py-3 text-slate-500 text-sm hover:text-slate-300">
                        이전 단계로
                      </button>
                   </div>
                </div>
             </div>
           )}

        </div>

        {/* Footer with Admin Access */}
        <div className="mt-4 text-center shrink-0">
           {step === 'WAITING' && (
             <button 
               onClick={onAdminAccess}
               className="text-[10px] text-slate-700 hover:text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1 mx-auto mt-4 px-3 py-2 rounded hover:bg-white/5 transition-colors"
             >
                <Settings size={10} /> Admin Login
             </button>
           )}
        </div>
      </div>
    </div>
  );
};