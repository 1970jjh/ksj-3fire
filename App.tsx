import React, { useState, useEffect, useRef } from 'react';
import { Step, SimulationState, INITIAL_ANALYSIS, ViewMode, SessionConfig, UserProfile } from './types';
import { Layout } from './components/Layout';
import { Intro } from './components/Intro';
import { Situation } from './components/Situation';
import { ProblemDefinition } from './components/ProblemDefinition';
import { AnalysisWhy } from './components/AnalysisWhy';
import { Solutions } from './components/Solutions';
import { Report } from './components/Report';
import { AdminDashboard } from './components/AdminDashboard';
import { saveSession, subscribeToSession, DEFAULT_SESSION, registerLearner, updateLearnerStep } from './firebase';

// 고유 방문자 ID 생성 (브라우저별 고유 ID)
const getVisitorId = (): string => {
  let visitorId = localStorage.getItem('pbl-visitor-id');
  if (!visitorId) {
    visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('pbl-visitor-id', visitorId);
  }
  return visitorId;
};

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('LEARNER');
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const visitorId = useRef(getVisitorId());

  // Firebase에서 세션 상태 관리
  const [sessionConfig, setSessionConfig] = useState<SessionConfig>(DEFAULT_SESSION);

  // Firebase 실시간 구독
  useEffect(() => {
    const unsubscribe = subscribeToSession((config) => {
      setSessionConfig(config);
      setIsLoading(false);
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, []);

  // 세션 변경 시 Firebase에 저장
  const updateSessionConfig = async (newConfig: SessionConfig) => {
    try {
      await saveSession(newConfig);
      // Firebase onSnapshot이 자동으로 상태를 업데이트함
    } catch (error) {
      console.error('세션 저장 실패:', error);
      // 에러 시 로컬 상태만 업데이트
      setSessionConfig(newConfig);
    }
  };

  const [gameState, setGameState] = useState<SimulationState>({
    currentStep: Step.INTRO,
    user: null,
    problemDefinition: {
      humanDamage: '',
      materialDamage: '',
      others: ''
    },
    analysisFire: { ...INITIAL_ANALYSIS },
    analysisInjury: { ...INITIAL_ANALYSIS },
    solutions: {
      immediate: '',
      prevention: '',
      contingency: ''
    }
  });

  const updateState = (updates: Partial<SimulationState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const navigateTo = (step: Step) => {
    updateState({ currentStep: step });
    // Firebase에 진행 상태 업데이트
    if (gameState.user) {
      updateLearnerStep(visitorId.current, step);
    }
  };

  const handleUserJoin = async (user: UserProfile) => {
    updateState({ user });
    // Firebase에 학습자 등록
    await registerLearner(
      visitorId.current,
      user.name,
      user.teamId,
      user.teamName,
      Step.SITUATION
    );
    navigateTo(Step.SITUATION);
  };

  // Unified exit handler: Admin Access from Intro, Logout from other steps
  const handleExit = () => {
    if (gameState.currentStep === Step.INTRO) {
      setViewMode('ADMIN');
    } else {
      // Logout logic
      updateState({ currentStep: Step.INTRO, user: null });
    }
  };

  // 로딩 중 표시
  if (isLoading) {
    return (
      <div className="min-h-screen h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Firebase 연결 중...</p>
        </div>
      </div>
    );
  }

  // Admin View
  if (viewMode === 'ADMIN') {
    return (
      <AdminDashboard
        sessionConfig={sessionConfig}
        setSessionConfig={updateSessionConfig}
        onExit={() => setViewMode('LEARNER')}
        onSwitchToLearner={() => setViewMode('LEARNER')}
      />
    );
  }

  // Learner View Navigation
  const renderStep = () => {
    switch (gameState.currentStep) {
      case Step.INTRO:
        return (
          <Intro
            sessionConfig={sessionConfig}
            onJoin={handleUserJoin}
            onAdminAccess={() => setViewMode('ADMIN')}
          />
        );
      case Step.SITUATION:
        return (
          <Situation
            onNext={() => navigateTo(Step.PROBLEM_DEFINITION)}
            onOpenInfoCard={() => setShowInfoCard(true)}
          />
        );
      case Step.PROBLEM_DEFINITION:
        return (
          <ProblemDefinition
            data={gameState.problemDefinition}
            setData={(data) => updateState({ problemDefinition: data })}
            onNext={() => navigateTo(Step.ANALYSIS_WHY)}
            onBack={() => navigateTo(Step.SITUATION)}
          />
        );
      case Step.ANALYSIS_WHY:
        return (
          <AnalysisWhy
            analysisFire={gameState.analysisFire}
            setAnalysisFire={(data) => updateState({ analysisFire: data })}
            analysisInjury={gameState.analysisInjury}
            setAnalysisInjury={(data) => updateState({ analysisInjury: data })}
            onNext={() => navigateTo(Step.SOLUTION)}
            onBack={() => navigateTo(Step.PROBLEM_DEFINITION)}
          />
        );
      case Step.SOLUTION:
        return (
          <Solutions
            solutions={gameState.solutions}
            setSolutions={(s) => updateState({ solutions: s })}
            onNext={() => navigateTo(Step.REPORT)}
            onBack={() => navigateTo(Step.ANALYSIS_WHY)}
          />
        );
      case Step.REPORT:
        return (
          <Report
            state={gameState}
            onBack={() => navigateTo(Step.SOLUTION)}
          />
        );
      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <div className="min-h-screen h-screen bg-slate-100 font-sans overflow-hidden">
      <Layout
        currentStep={gameState.currentStep}
        onNavigate={navigateTo}
        user={gameState.user}
        onExit={handleExit}
        totalTeams={sessionConfig.totalTeams}
        isInfoCardOpen={showInfoCard}
        onOpenInfoCard={() => setShowInfoCard(true)}
        onCloseInfoCard={() => setShowInfoCard(false)}
      >
        {renderStep()}
      </Layout>
    </div>
  );
}

export default App;
