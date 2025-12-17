import React, { useState, useEffect } from 'react';
import { Step, SimulationState, INITIAL_ANALYSIS, ViewMode, SessionConfig, UserProfile } from './types';
import { Layout } from './components/Layout';
import { Intro } from './components/Intro';
import { Situation } from './components/Situation';
import { ProblemDefinition } from './components/ProblemDefinition';
import { AnalysisWhy } from './components/AnalysisWhy';
import { Solutions } from './components/Solutions';
import { Report } from './components/Report';
import { AdminDashboard } from './components/AdminDashboard';

const SESSION_STORAGE_KEY = 'pbl-session-config';

// LocalStorage에서 세션 불러오기
const loadSessionFromStorage = (): SessionConfig => {
  try {
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load session from storage:', e);
  }
  return {
    groupName: '',
    totalTeams: 6,
    isSessionActive: false
  };
};

// LocalStorage에 세션 저장
const saveSessionToStorage = (config: SessionConfig) => {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save session to storage:', e);
  }
};

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('LEARNER');
  const [showInfoCard, setShowInfoCard] = useState(false);

  // LocalStorage에서 초기값 로드
  const [sessionConfig, setSessionConfig] = useState<SessionConfig>(loadSessionFromStorage);

  // 세션 변경 시 LocalStorage에 저장
  const updateSessionConfig = (newConfig: SessionConfig) => {
    setSessionConfig(newConfig);
    saveSessionToStorage(newConfig);
  };

  // 다른 탭에서 세션이 변경되면 감지
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SESSION_STORAGE_KEY && e.newValue) {
        try {
          const newConfig = JSON.parse(e.newValue);
          setSessionConfig(newConfig);
        } catch (err) {
          console.error('Failed to parse session config:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 주기적으로 LocalStorage 확인 (같은 탭 내 동기화용)
  useEffect(() => {
    const interval = setInterval(() => {
      const stored = loadSessionFromStorage();
      if (JSON.stringify(stored) !== JSON.stringify(sessionConfig)) {
        setSessionConfig(stored);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionConfig]);

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
  };

  const handleUserJoin = (user: UserProfile) => {
    updateState({ user });
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

  // Learner View Navigation (Inside Phone Frame)
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