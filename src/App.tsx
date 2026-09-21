import React, { useEffect } from 'react';
import { useSortingSessionStore } from './application/stores/useSortingSessionStore';
import { WelcomeScreen } from './presentation/screens/WelcomeScreen';
import { ScanningScreen } from './presentation/screens/ScanningScreen';
import { CullingWorkspaceScreen } from './presentation/screens/CullingWorkspaceScreen';
import { ReviewScreen } from './presentation/screens/ReviewScreen';
import { ConfirmationScreen } from './presentation/screens/ConfirmationScreen';
import { ProcessingScreen } from './presentation/screens/ProcessingScreen';
import { CompletionScreen } from './presentation/screens/CompletionScreen';
import { EmptyStateScreen, ErrorStateScreen } from './presentation/screens/EmptyStateScreen';

export const App: React.FC = () => {
  const { viewMode, initialize } = useSortingSessionStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const renderScreen = () => {
    switch (viewMode) {
      case 'WELCOME':
        return <WelcomeScreen />;
      case 'SCANNING':
        return <ScanningScreen />;
      case 'CULLING':
        return <CullingWorkspaceScreen />;
      case 'REVIEW':
        return <ReviewScreen />;
      case 'CONFIRMATION':
        return <ConfirmationScreen />;
      case 'PROCESSING':
        return <ProcessingScreen />;
      case 'COMPLETED':
        return <CompletionScreen />;
      case 'EMPTY':
        return <EmptyStateScreen />;
      case 'ERROR':
        return <ErrorStateScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  return <div className="app-root">{renderScreen()}</div>;
};

export default App;
