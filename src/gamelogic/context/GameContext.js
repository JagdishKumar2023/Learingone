import React, {createContext, useReducer, useContext} from 'react';

const initialState = {
  wallet: 1000,
  history: [],
  bets: [],
  results: [],
  isProcessing: false,
  isSuccessful: false,
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'PLACE_BET':
      if (state.wallet >= action.payload.amount) {
        return {
          ...state,
          wallet: state.wallet - action.payload.amount,
          bets: [...state.bets, action.payload],
        };
      }
      return state;

    case 'GENERATE_RESULT':
      const result = action.payload;
      return {
        ...state,
        results: [result, ...state.results],
      };

    case 'DISTRIBUTE_WINNINGS':
      let winnings = 0;
      state.bets.forEach(bet => {
        if (bet.type === action.payload.result) {
          winnings += bet.amount * action.payload.multiplier;
        }
      });

    case 'IS_PROCESSING':
      return {
        ...state,
        isProcessing: !state.isProcessing,
      };

    case 'IS_SUCCESSFUL':
      return {
        ...state,
        isSuccessful: !state.isSuccessful,
      };

    case 'ADD_WINNINGS':
      return {
        ...state,
        wallet: state.wallet + winnings,
        history: [
          {
            result: action.payload.result,
            winnings,
            bets: state.bets,
            timestamp: new Date().toLocaleString(),
          },
          ...state.history,
        ],
        bets: [],
      };

    case 'RESET_GAME':
      return initialState;

    default:
      return state;
  }
};

const GameContext = createContext();

export const GameProvider = ({children}) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{state, dispatch}}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
