
import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Layout from './components/Layout';
import HomeTab from './tabs/HomeTab';
import ShelfTab from './tabs/ShelfTab';
import ShopTab from './tabs/ShopTab';
import AlbumTab from './tabs/AlbumTab';
import Onboarding from './components/Onboarding';

const TabSwitcher: React.FC = () => {
  const { activeTab, gameState } = useGame();

  // Fullscreen onboarding only for early steps
  if (!gameState.hasCompletedOnboarding && gameState.onboardingStep <= 3) {
    return <Onboarding />;
  }

  switch (activeTab) {
    case 'home': return <HomeTab />;
    case 'jar': return <ShelfTab />;
    case 'shop': return <ShopTab />;
    case 'album': return <AlbumTab />;
    default: return null;
  }
};

const App: React.FC = () => {
  return (
    <GameProvider>
      <Layout>
        <TabSwitcher />
      </Layout>
    </GameProvider>
  );
};

export default App;
