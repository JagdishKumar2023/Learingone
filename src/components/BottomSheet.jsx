import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  View,
  ToastAndroid,
  Platform,
  Vibration,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {useGame} from '../gamelogic/context/GameContext';
import {useAddBetDataDetails} from '../apiforgame/useBackendApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('window');
const PRESET_AMOUNTS = [200, 500, 1000, 5000, 10000];

const BetModal = ({onClose, modalColor = '#fff', selectedRing, metaData}) => {
  const bottomSheetRef = useRef(null);
  const [betAmount, setBetAmount] = useState(200);
  const progress = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const {dispatch, state: currentState} = useGame();
  const {mutate, isLoading, isError, isSuccess} =
    useAddBetDataDetails(dispatch);

  const {isProcessing, isSuccessful} = currentState;

  const handleSheetChanges = useCallback(
    index => {
      if (index === -1) {
        progress.value = 0;
        progressWidth.value = 0;
        onClose();
      }
    },
    [onClose, progress, progressWidth],
  );

  // Cleanup effect for bottom sheet and animations
  const animationTimeout = useRef();

  useEffect(() => {
    let isMounted = true;
    return () => {
      isMounted = false;

      // Reset animation values
      progress.value = 0;
      progressWidth.value = 0;

      // Properly detach bottom sheet
      if (bottomSheetRef.current) {
        bottomSheetRef.current.close();
        bottomSheetRef.current = null;
      }
      clearTimeout(animationTimeout.current);

      // Reset component state
      if (isMounted) {
        setBetAmount(200);
      }
    };
  }, [progress, progressWidth]);

  const showToast = (message, success) => {
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravityAndOffset(
        message,
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
        0,
        50,
      );
    }
  };

  const placeBet = async () => {
    if (isLoading) return;

    const finalAmount = parseInt(betAmount);

    if (isNaN(finalAmount) || finalAmount <= 0) {
      showToast('❌ Please enter a valid amount!', false);
      return;
    }

    console.log(`Placing bet: Amount: ₹${finalAmount}`);
    progress.value = withTiming(1, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
    progressWidth.value = withTiming(width * 0.8, {
      duration: 500,
      easing: Easing.linear,
    });

    // mutate(finalAmount); // Pass entire betData instead of only finalAmount
    dispatch({
      type: 'PLACE_BET',
      payload: {amount: finalAmount},
    });

    setTimeout(() => {
      const isSuccessful = Math.random() > 0.3;

      if (!isMounted) return;

      showToast(
        isSuccessful
          ? `✅ Order ₹${finalAmount} placed successfully`
          : `❌ Order ₹${finalAmount} failed`,
        isSuccessful,
      );

      progress.value = withTiming(0, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      });
      progressWidth.value = withTiming(0, {
        duration: 500,
        easing: Easing.linear,
      });

      if (isSuccessful && isMounted) {
        bottomSheetRef.current?.close();
      }
    }, 800);

    const rawData = await AsyncStorage.getItem('periodMetaData');
    const periodMetaData = rawData ? JSON.parse(rawData) : null;
    console.log('periodMetaData', periodMetaData);
    const userDetails = await AsyncStorage.getItem('userData');
    const userData = userDetails ? JSON.parse(userDetails) : null;
    console.log('userData', userData);
    const payload = {
      userId: userData?._id,
      amount: betAmount,
      betType: metaData?.betType,
      betTypeCode: metaData?.betTypeCode,
      periodNumber: periodMetaData?.currentPeriodNumber,
      periodTypeInMin: currentPeriodNumber?.periodTpeInSec,
    };
    console.log('metaData', metaData, payload);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={[height * 0.6]}
        onChange={handleSheetChanges}
        enablePanDownToClose>
        <BottomSheetView
          style={[styles.contentContainer, {backgroundColor: modalColor}]}>
          <Text style={styles.title}>Invest Now</Text>
          <Text style={styles.subtitle}>Enter Custom Amount:</Text>
          <TextInput
            style={styles.input}
            placeholder="₹ Enter Amount"
            keyboardType="numeric"
            value={betAmount}
            onChangeText={text => {
              setBetAmount(text);
            }}
          />
          <Text style={styles.subtitle}>Select Amount:</Text>
          <View style={styles.presetContainer}>
            {PRESET_AMOUNTS.map(amount => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.presetButton,
                  betAmount === amount && styles.presetButtonSelected,
                ]}
                onPress={() => {
                  setBetAmount(amount);
                }}>
                <Text style={styles.presetButtonText}>₹{amount}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[styles.progressBar, {width: progressWidth}]}
            />
          </View>
          <TouchableOpacity
            style={[styles.placeBetButton, isLoading && {opacity: 0.5}]}
            activeOpacity={0.7}
            onPress={placeBet}
            disabled={isLoading}>
            <Text style={styles.placeBetButtonText}>Place Bet</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: width * 0.05,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: width * 0.065,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
  },
  subtitle: {
    fontSize: width * 0.048,
    marginVertical: height * 0.015,
  },
  input: {
    width: '90%',
    height: height * 0.06,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingLeft: 12,
    fontSize: 18,
    marginBottom: height * 0.015,
  },
  presetContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: height * 0.02,
  },
  presetButton: {
    backgroundColor: '#ddd',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    margin: 5,
  },
  presetButtonSelected: {
    backgroundColor: '#007bff',
  },
  presetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    width: width * 0.8,
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007bff',
  },
  placeBetButton: {
    backgroundColor: '#28a745',
    padding: height * 0.02,
    borderRadius: 10,
    width: width * 0.5,
    alignItems: 'center',
    marginTop: 10,
  },
  placeBetButtonText: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
});

export default BetModal;
