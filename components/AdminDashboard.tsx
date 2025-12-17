import React, { useState } from 'react';
import { BarChart3, Users, AlertCircle, CheckCircle2, LogOut, Search, Smartphone, X, ChevronRight, FileText, GitBranch, Target, Settings, Play } from 'lucide-react';
import { Step, CauseAnalysis, SessionConfig } from '../types';

interface AdminDashboardProps {
  sessionConfig: SessionConfig;
  setSessionConfig: (config: SessionConfig) => void;
  onExit: () => void;
  onSwitchToLearner: () => void;
}

// ... (Existing Mock Data remains same)
interface TeamData {
  id: string;
  name: string;
  step: Step;
  status: 'Active' | 'Idle' | 'Completed';
  score: number;
  issue: string;
  answers: {
    analysisFire: CauseAnalysis;
    logicTreeConclusion: string;
    solutions: {
      immediate: string;
      prevention: string;
      contingency: string;
    };
  };
}

const teamsMock: TeamData[] = [
  { 
    id: '1', 
    name: '1조 (안전제일)', 
    step: Step.SOLUTION, 
    status: 'Active', 
    score: 85, 
    issue: 'None',
    answers: {
      analysisFire: {
        directCause: '전력 과부하로 인한 스파크 발생 (장비 허용량 16kW 초과)',
        contributingFactors: '무리한 생산 일정 압박, 안전 수칙 무시, 본사 영업팀의 단축 요구'
      },
      logicTreeConclusion: '생산 일정으로 인한 전력 과부하 (정답)',
      solutions: {
        immediate: '1공장, 4공장 분산 생산 및 잔업 특근 실시',
        prevention: '전력 모니터링 시스템 도입 및 차단기 용량 증설',
        contingency: ''
      }
    }
  },
  // ... other mock data
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ sessionConfig, setSessionConfig, onExit, onSwitchToLearner }) => {
  const [setupMode, setSetupMode] = useState(!sessionConfig.isSessionActive);
  const [tempConfig, setTempConfig] = useState<SessionConfig>(sessionConfig);
  const [selectedTeam, setSelectedTeam] = useState<TeamData | null>(null);

  const handleOpenSession = () => {
    if (!tempConfig.groupName.trim()) {
      alert('그룹명을 입력해주세요.');
      return;
    }
    setSessionConfig({ ...tempConfig, isSessionActive: true });
    setSetupMode(false);
  };

  if (setupMode) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl space-y-8">
          <div>
             <h1 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
               <Settings className="text-orange-600"/> 세션 설정 (Admin)
             </h1>
             <p className="text-slate-500">교육생들이 접속할 그룹 정보를 설정하고 앱을 오픈하세요.</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">교육 그룹명 (Group Name)</label>
              <input 
                type="text"
                value={tempConfig.groupName}
                onChange={(e) => setTempConfig({...tempConfig, groupName: e.target.value})}
                placeholder="예: 현대자동차 신입사원 3차수"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none font-medium"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-700">팀(조) 개수 설정</label>
                <span className="text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded">{tempConfig.totalTeams}개 조</span>
              </div>
              <input 
                type="range"
                min="1"
                max="12"
                value={tempConfig.totalTeams}
                onChange={(e) => setTempConfig({...tempConfig, totalTeams: parseInt(e.target.value)})}
                className="w-full accent-orange-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                <span>1조</span>
                <span>6조</span>
                <span>12조</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleOpenSession}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg"
          >
            <Play size={20} className="fill-current"/> 세션 오픈 (App Open)
          </button>
          
          <button 
            onClick={onExit}
            className="w-full text-slate-500 font-medium py-2 hover:text-slate-800 transition-colors"
          >
            취소하고 나가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center shadow-md shrink-0 z-20 relative">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center font-bold text-lg">M</div>
          <div>
            <h1 className="text-xl font-bold">PBL Manager</h1>
            <div className="flex items-center gap-2 text-xs text-slate-400">
               <span className="w-2 h-2 rounded-full bg-green-500"></span>
               {sessionConfig.groupName} ({sessionConfig.totalTeams}개 조)
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSetupMode(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300 transition-colors"
          >
             <Settings size={14}/> 설정 변경
          </button>
          
          <button 
            onClick={onSwitchToLearner}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-orange-600 rounded-lg text-sm text-white transition-colors"
          >
            <Smartphone size={16} /> 학습자 화면 (Learner)
          </button>

          <div className="h-6 w-px bg-slate-700 mx-2"></div>

          <button onClick={onExit} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm">
            <LogOut size={16} /> 나가기
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
           {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Total Teams</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-2">{sessionConfig.totalTeams}</h3>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <Users size={24} />
                </div>
              </div>
            </div>
            {/* ... Other stats (same as before) ... */}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             {/* ... Table (same as before) ... */}
             <div className="p-12 text-center text-slate-400">
                (대시보드 데이터는 현재 Mock Data입니다. 실제 세션 데이터가 연동되면 이곳에 표시됩니다.)
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};