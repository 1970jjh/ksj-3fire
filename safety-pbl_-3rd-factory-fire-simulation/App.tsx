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
import { LayoutDashboard, Smartphone } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4 md:p-8 font-sans">
      {/* Phone Frame Container */}
      <div className="relative mx-auto border-gray-900 bg-gray-900 border-[14px] rounded-[2.5rem] h-[800px] w-[375px] shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10">
        
        {/* Notch / Status Bar Area */}
        <div className="h-6 bg-slate-900 w-full absolute top-0 left-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="h-4 w-32 bg-black rounded-b-xl"></div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 bg-white rounded-[2rem] overflow-hidden h-full w-full">
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

        {/* Home Indicator (Optional visual) */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full z-50 pointer-events-none"></div>
      </div>

      {/* Helper text for desktop users */}
      <div className="fixed bottom-4 text-slate-500 text-xs hidden md:block text-center">
        Mobile Simulation Mode<br/>
        {sessionConfig.isSessionActive ? `Current Session: ${sessionConfig.groupName}` : 'No Active Session'}
      </div>
    </div>
  );
}

export default App;