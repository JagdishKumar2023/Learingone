import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Winner Data (Paginated)
export const useGetPaginatedWinnerData = (page = 1) =>
  useQuery({
    queryKey: ['winnerData', page],
    queryFn: async () => {
      const {data} = await api.get(`/getWinnerData?page=${page}`);
      return data;
    },
    keepPreviousData: true,
  });

// ✅ Color Details
export const useGetColorDetails = () =>
  useQuery({
    queryKey: ['colorDetails'],
    queryFn: async () => {
      const {data} = await api.get('/prediction/getColorDetails');
      console.log('ColorData:', data);
      return data;
    },
  });

// ✅ Number Details
export const useGetNumberDetails = () =>
  useQuery({
    queryKey: ['numberDetails'],
    queryFn: async () => {
      const {data} = await api.get('/prediction/getNumberDetails');
      return data;
    },
  });

// ✅ Button Size Details
export const useGetSizeDetails = () =>
  useQuery({
    queryKey: ['sizeDetails'],
    queryFn: async () => {
      const {data} = await api.get('/prediction/getBtnSizeDetails');
      return data;
    },
  });

// ✅ Get Period Number by Seconds
// export const useGetPeriodNumber = periodTypeInSec =>
//   useQuery({
//     queryKey: ['periodNumber', periodTypeInSec],
//     queryFn: async () => {
//       const {data} = await api.get(
//         `/prediction/getPeriodNumber/${periodTypeInSec}`,
//       );
//       return data;
//     },
//     enabled: !!periodTypeInSec, // ✅ Only runs when periodTypeInSec is available
//   });

export const useGetPeriodNumber = periodTypeInSec => {
  return useQuery({
    queryKey: ['periodNumber', periodTypeInSec],
    queryFn: async () => {
      if (!periodTypeInSec) throw new Error('periodTypeInSec is required');
      const {data} = await api.get(
        `/prediction/getPeriodNumber/${periodTypeInSec}`,
      );
      return data;
    },
    enabled: false, // Manual fetching only
    retry: false, // Optional: prevents automatic retries
  });
};

// ✅ Get Betting Details by ID --{Any problem}--
export const useGetBetDetailsById = betId =>
  useQuery({
    queryKey: ['betDetails', betId],
    queryFn: async () => {
      const {data} = await api.get(
        `/prediction/getBetDetailsById?betId=${betId}`,
      );
      return data;
    },
    enabled: !!betId,
  });

/** 🚀 POST Routes */
// ✅ Add Color Details (Optimistic UI)
export const useAddColorDetails = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async colorData =>
      await api.post('/prediction/addColorDetails', colorData),

    onMutate: async newColor => {
      await queryClient.cancelQueries(['colorDetails']);
      const previousData = queryClient.getQueryData(['colorDetails']);

      queryClient.setQueryData(['colorDetails'], old => [
        ...(old || []),
        newColor,
      ]);

      return {previousData};
    },

    onError: (err, newColor, context) => {
      queryClient.setQueryData(['colorDetails'], context.previousData);
    },

    onSettled: () => {
      queryClient.invalidateQueries(['colorDetails']);
    },
  });
};

// ✅ Add Button Size Details
export const useAddSizeDetails = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async sizeData =>
      await api.post('/prediction/addBtnSizeDetails', sizeData),
    onSuccess: () => queryClient.invalidateQueries(['sizeDetails']),
  });
};

// ✅ Add Number Details
export const useAddNumberDetails = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async numberData =>
      await api.post('/prediction/addNumberDetails', numberData),
    onSuccess: () => queryClient.invalidateQueries(['numberDetails']),
  });
};

// ✅ Add Betting Data
export const useAddBetDataDetails = dispatch => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async betData => {
      dispatch({type: 'IS_PROCESSING'});
      await api.post('/prediction/addBetDataDetails', betData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['betDetails']);
      dispatch({type: 'IS_PROCESSING'});
      dispatch({type: 'IS_SUCCESSFUL'});
    },
    onError: () => {
      dispatch({type: 'IS_PROCESSING'});
    },
  });
};

/** 🚀 POLLING for LIVE DATA */
// ✅ Get Winning Details (Refetch Every 10 Seconds)
export const useGetLiveWinningDetails = () =>
  useQuery({
    queryKey: ['liveWinningDetails'],
    queryFn: async () => {
      const {data} = await api.get('/prediction/getWinningDetails');
      return data;
    },
    refetchInterval: 10000, // ✅ Poll every 10 seconds
  });

/** 🚀 DELETE Routes */
// ✅ Delete Bet by ID

// export const useDeleteBet = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async betId => api.delete(`/deleteBet/${betId}`),
//     onSuccess: () => queryClient.invalidateQueries(['betDetails']),
//   });
// };

// ✅ Register User
export const useRegisterUser = () => {
  return useMutation({
    mutationFn: async userData => {
      const {data} = await api.post('/users/register', userData);
      return data;
    },
    onSuccess: data => {
      console.log('Registration successful', data);
      // Handle success (e.g., navigate to the home screen or login)
    },
    onError: error => {
      console.error('Registration failed', error);
      // Handle error (e.g., show a notification or message)
    },
  });
};

// ✅ Login User
export const useLoginUser = () => {
  return useMutation({
    mutationFn: async loginData => {
      const {data} = await api.post('/users/login', loginData);
      return data;
    },
    onSuccess: async data => {
      console.log('Login successful', data);

      // Store the token in AsyncStorage
      try {
        console.log('LoginData:', data.data[0].token);
        await AsyncStorage.setItem('authToken', data.data[0].token);
        console.log('Token stored successfully');
      } catch (error) {
        console.error('Error storing token in AsyncStorage', error);
      }

      // Handle success (e.g., navigate to the home screen or dashboard)
    },
    onError: error => {
      console.error('Login failed', error);
      // Handle error (e.g., show a notification or message)
    },
  });
};

// ✅ Utility function to get token from AsyncStorage
export const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return token;
  } catch (error) {
    console.error('Error retrieving token from AsyncStorage', error);
    return null;
  }
};

// after it rigth now is confusion

// import {getAuthToken} from './path-to-hooks';

// // Somewhere in your code
// const token = await getAuthToken();
// if (token) {
//   console.log('Token found:', token);
// } else {
//   console.log('No token found');
// }
