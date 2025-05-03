import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import RootStack from './src/Navigation/Navigation';
import {GameProvider} from './src/gamelogic/context/GameContext';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

// ✅ Create a Query Client
const queryClient = new QueryClient();

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <QueryClientProvider client={queryClient}>
        <GameProvider>
          <RootStack />
        </GameProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default App;
