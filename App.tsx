import React, { useState } from 'react';
import { Step, SimulationState, INITIAL_ANALYSIS, ViewMode, SessionConfig, UserProfile } from './types';
import { Layout } from './components/Layout';
import { Intro } from './components/Intro';
import { Situation } from './components/Situation';
import { ProblemDefinition } from './components/ProblemDefinition';
import { AnalysisWhy } from './components/AnalysisWhy';
import { Solutions } from './components/Solutions';
import { Report } from './components/Report';
import { AdminDashboard } from './components/AdminDashboard';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('LEARNER'); // Default to Learner Mode
  const [showInfoCard, setShowInfoCard] = useState(false);
  
  // Global Session Configuration (Shared state simulation)
  const [sessionConfig, setSessionConfig] = useState<SessionConfig>({
    groupName: '',
    totalTeams: 6, // Default value
    isSessionActive: false
  });

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
        setSessionConfig={setSessionConfig}
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