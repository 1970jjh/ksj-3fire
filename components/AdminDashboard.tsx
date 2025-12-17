import React, { useState, useEffect } from 'react';
import { Users, LogOut, Smartphone, Settings, Play, Clock, CheckCircle2, Circle } from 'lucide-react';
import { Step, SessionConfig } from '../types';
import { subscribeToLearners, LearnerData } from '../firebase';

interface AdminDashboardProps {
  sessionConfig: SessionConfig;
  setSessionConfig: (config: SessionConfig) => void;
  onExit: () => void;
  onSwitchToLearner: () => void;
}

// 단계별 라벨
const stepLabels: Record<Step, string> = {
  [Step.INTRO]: '대기 중',
  [Step.SITUATION]: '현상 파악',
  [Step.PROBLEM_DEFINITION]: '문제 정의',
  [Step.ANALYSIS_WHY]: '원인 분석',
  [Step.SOLUTION]: '해결 방안',
  [Step.REPORT]: '보고서 작성'
};

// 단계별 진행도
const stepProgress: Record<Step, number> = {
  [Step.INTRO]: 0,
  [Step.SITUATION]: 20,
  [Step.PROBLEM_DEFINITION]: 40,
  [Step.ANALYSIS_WHY]: 60,
  [Step.SOLUTION]: 80,
  [Step.REPORT]: 100
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ sessionConfig, setSessionConfig, onExit, onSwitchToLearner }) => {
  const [setupMode, setSetupMode] = useState(!sessionConfig.isSessionActive);
  const [tempConfig, setTempConfig] = useState<SessionConfig>(sessionConfig);
  const [learners, setLearners] = useState<LearnerData[]>([]);

  // Firebase에서 학습자 목록 실시간 구독
  useEffect(() => {
    if (sessionConfig.isSessionActive) {
      const unsubscribe = subscribeToLearners((data) => {
        setLearners(data);
      });
      return () => unsubscribe();
    }
  }, [sessionConfig.isSessionActive]);

  const handleOpenSession = () => {
    if (!tempConfig.groupName.trim()) {
      alert('그룹명을 입력해주세요.');
      return;
    }
    setSessionConfig({ ...tempConfig, isSessionActive: true });
    setSetupMode(false);
  };

  // 팀별로 학습자 그룹화
  const learnersByTeam = learners.reduce((acc, learner) => {
    if (!acc[learner.teamId]) {
      acc[learner.teamId] = [];
    }
    acc[learner.teamId].push(learner);
    return acc;
  }, {} as Record<number, LearnerData[]>);

  // 통계 계산
  const totalLearners = learners.length;
  const completedLearners = learners.filter(l => l.currentStep === Step.REPORT).length;
  const activeLearners = learners.filter(l => {
    const lastActive = new Date(l.lastActiveAt);
    const now = new Date();
    return (now.getTime() - lastActive.getTime()) < 5 * 60 * 1000; // 5분 이내 활동
  }).length;

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
      <nav className="bg-slate-900 text-white px-4 md:px-8 py-4 flex justify-between items-center shadow-md shrink-0 z-20 relative">
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
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setSetupMode(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300 transition-colors"
          >
             <Settings size={14}/> 설정 변경
          </button>

          <button
            onClick={onSwitchToLearner}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-700 hover:bg-orange-600 rounded-lg text-sm text-white transition-colors"
          >
            <Smartphone size={16} /> <span className="hidden md:inline">학습자 화면</span>
          </button>

          <div className="h-6 w-px bg-slate-700 mx-1 md:mx-2"></div>

          <button onClick={onExit} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm">
            <LogOut size={16} /> <span className="hidden md:inline">나가기</span>
          </button>
        </div>
      </nav>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500 font-medium">총 팀 수</p>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">{sessionConfig.totalTeams}</h3>
              </div>
              <div className="p-2 md:p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Users size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500 font-medium">접속 인원</p>
                <h3 className="text-2xl md:text-3xl font-bold text-green-600 mt-1">{totalLearners}</h3>
              </div>
              <div className="p-2 md:p-3 bg-green-50 text-green-600 rounded-lg">
                <Circle size={20} className="fill-current" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500 font-medium">활동 중</p>
                <h3 className="text-2xl md:text-3xl font-bold text-orange-600 mt-1">{activeLearners}</h3>
              </div>
              <div className="p-2 md:p-3 bg-orange-50 text-orange-600 rounded-lg">
                <Clock size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500 font-medium">완료</p>
                <h3 className="text-2xl md:text-3xl font-bold text-purple-600 mt-1">{completedLearners}</h3>
              </div>
              <div className="p-2 md:p-3 bg-purple-50 text-purple-600 rounded-lg">
                <CheckCircle2 size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Learners Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">실시간 학습자 현황</h2>
            <p className="text-sm text-slate-500 mt-1">접속한 학습자들의 진행 상황을 실시간으로 확인합니다.</p>
          </div>

          {learners.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Users size={48} className="mx-auto mb-4 opacity-30" />
              <p className="font-medium">아직 접속한 학습자가 없습니다.</p>
              <p className="text-sm mt-1">학습자들이 접속하면 이곳에 실시간으로 표시됩니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-sm text-slate-600">
                  <tr>
                    <th className="text-left py-3 px-4 md:px-6 font-semibold">팀</th>
                    <th className="text-left py-3 px-4 md:px-6 font-semibold">이름</th>
                    <th className="text-left py-3 px-4 md:px-6 font-semibold">현재 단계</th>
                    <th className="text-left py-3 px-4 md:px-6 font-semibold hidden md:table-cell">진행도</th>
                    <th className="text-left py-3 px-4 md:px-6 font-semibold hidden md:table-cell">마지막 활동</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {learners.map((learner) => {
                    const progress = stepProgress[learner.currentStep];
                    const lastActive = new Date(learner.lastActiveAt);
                    const minutesAgo = Math.floor((Date.now() - lastActive.getTime()) / 60000);
                    const isActive = minutesAgo < 5;

                    return (
                      <tr key={learner.visitorId} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 md:px-6">
                          <span className="inline-flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                            <span className="font-bold text-slate-900">{learner.teamName}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 md:px-6 text-slate-700">{learner.name}</td>
                        <td className="py-3 px-4 md:px-6">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            learner.currentStep === Step.REPORT
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {stepLabels[learner.currentStep]}
                          </span>
                        </td>
                        <td className="py-3 px-4 md:px-6 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  progress === 100 ? 'bg-green-500' : 'bg-orange-500'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-500">{progress}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 md:px-6 text-sm text-slate-500 hidden md:table-cell">
                          {minutesAgo < 1 ? '방금 전' : `${minutesAgo}분 전`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Team Summary */}
        {learners.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: sessionConfig.totalTeams }, (_, i) => i + 1).map((teamId) => {
              const teamLearners = learnersByTeam[teamId] || [];
              const teamProgress = teamLearners.length > 0
                ? Math.round(teamLearners.reduce((sum, l) => sum + stepProgress[l.currentStep], 0) / teamLearners.length)
                : 0;

              return (
                <div key={teamId} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-900">{teamId}조</span>
                    <span className="text-xs text-slate-500">{teamLearners.length}명</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        teamProgress === 100 ? 'bg-green-500' : teamProgress > 0 ? 'bg-orange-500' : 'bg-slate-300'
                      }`}
                      style={{ width: `${teamProgress}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-500 mt-1 text-right">{teamProgress}%</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
