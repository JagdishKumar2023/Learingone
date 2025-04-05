import React from 'react';
import RootStack from './src/Navigation/Navigation';
import {GameProvider} from './src/gamelogic/context/GameContext';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

// ✅ Create a Query Client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        <RootStack />
      </GameProvider>
    </QueryClientProvider>
  );
};

export default App;
