import React, {useEffect, useState, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useGetPeriodNumber} from '../../apiforgame/useBackendApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function Timer({
  onDurationChange,
  onTimerTick,
  onTimerStateChange,
  onTimerComplete,
  initialDuration = 30000,
  isRunning = false,
  onFiveSecondsRemaining,
  onBettingTimeChange,
}) {
  const [selectedTime, setSelectedTime] = useState(initialDuration / 1000);
  const [timerStates, setTimerStates] = useState({
    30: { minutes: 0, seconds: 30 },
    60: { minutes: 1, seconds: 0 },
    180: { minutes: 3, seconds: 0 },
    300: { minutes: 5, seconds: 0 }
  });
  const [currentPeriodNumber, setCurrentPeriodNumber] = useState();
  const [periodTypeInSec, setPeriodTypeInSec] = useState(selectedTime);
  const [lastFiveSeconds, setLastFiveSeconds] = useState(false);
  const [bettingTime, setBettingTime] = useState(true);

  // Refs for each timer
  const timerRefs = useRef({
    30: null,
    60: null,
    180: null,
    300: null
  });

  const startTimeRefs = useRef({
    30: Date.now(),
    60: Date.now(),
    180: Date.now(),
    300: Date.now()
  });

  const remainingTimeRefs = useRef({
    30: 30000,
    60: 60000,
    180: 180000,
    300: 300000
  });

  const lastFiveSecondsRefs = useRef({
    30: false,
    60: false,
    180: false,
    300: false
  });

  const bettingTimeRefs = useRef({
    30: true,
    60: true,
    180: true,
    300: true
  });

  const overlayTimerRef = useRef(null);

  const timeOptions = [
    {label: '30 sec', value: 30, bettingThreshold: 25, icon: 'clock-fast'},
    {label: '1 min', value: 60, bettingThreshold: 55, icon: 'clock-outline'},
    {label: '3 min', value: 180, bettingThreshold: 175, icon: 'clock'},
    {label: '5 min', value: 300, bettingThreshold: 295, icon: 'clock-time-five'},
  ];

  const {data, refetch} = useGetPeriodNumber(periodTypeInSec);

  const getPeriodNumber = async timeInSec => {
    setPeriodTypeInSec(timeInSec);
    const result = await refetch();
    if (result.data) {
      const pn = result.data.data[0]?.periodNumber;
      setCurrentPeriodNumber(pn);
      await AsyncStorage.setItem(
        'periodMetaData',
        JSON.stringify({
          currentPeriodNumber: pn,
          periodTypeInSec: timeInSec,
          lastUpdated: Date.now()
        }),
      );
    }
  };

  const startTimer = (duration) => {
    if (timerRefs.current[duration]) return;
    
    startTimeRefs.current[duration] = Date.now();
    remainingTimeRefs.current[duration] = duration * 1000;
    
    timerRefs.current[duration] = setInterval(() => {
      const elapsed = Date.now() - startTimeRefs.current[duration];
      const remaining = remainingTimeRefs.current[duration] - elapsed;
      
      if (remaining <= 0) {
        clearInterval(timerRefs.current[duration]);
        timerRefs.current[duration] = null;
        lastFiveSecondsRefs.current[duration] = false;
        bettingTimeRefs.current[duration] = true;
        
        if (onTimerComplete) {
          onTimerComplete(duration);
        }
        
        // Reset this timer
        remainingTimeRefs.current[duration] = duration * 1000;
        startTimeRefs.current[duration] = Date.now();
        
        // Start this timer again after a short delay
        setTimeout(() => {
          startTimer(duration);
        }, 1000);
        
        setTimerStates(prev => ({
          ...prev,
          [duration]: {
            minutes: Math.floor(duration / 60),
            seconds: duration % 60
          }
        }));
      } else {
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        const totalSeconds = minutes * 60 + seconds;
        
        setTimerStates(prev => ({
          ...prev,
          [duration]: { minutes, seconds }
        }));

        // Handle betting time based on specific thresholds
        const option = timeOptions.find(opt => opt.value === duration);
        if (option && totalSeconds <= option.bettingThreshold && bettingTimeRefs.current[duration]) {
          bettingTimeRefs.current[duration] = false;
          if (onBettingTimeChange) {
            onBettingTimeChange(false, duration);
          }
        }
        
        // Check for last 5 seconds for each timer independently
        if (remaining <= 5000 && remaining > 0) {
          if (!lastFiveSecondsRefs.current[duration]) {
            lastFiveSecondsRefs.current[duration] = true;
            if (onFiveSecondsRemaining) {
              onFiveSecondsRemaining(duration);
            }
          }
        } else if (remaining > 5000) {
          lastFiveSecondsRefs.current[duration] = false;
        }
        
        // Always send timer tick updates
        if (onTimerTick) {
          onTimerTick(remaining, duration);
        }
      }
    }, 100); // Update every 100ms for smoother countdown
  };

  const stopTimer = (duration) => {
    if (timerRefs.current[duration]) {
      clearInterval(timerRefs.current[duration]);
      timerRefs.current[duration] = null;
    }
    lastFiveSecondsRefs.current[duration] = false;
    bettingTimeRefs.current[duration] = true;
    setTimerStates(prev => ({
      ...prev,
      [duration]: {
        minutes: Math.floor(duration / 60),
        seconds: duration % 60
      }
    }));
  };

  useEffect(() => {
    if (isRunning) {
      // Start all timers
      timeOptions.forEach(option => {
        startTimer(option.value);
      });
    } else {
      // Stop all timers
      timeOptions.forEach(option => {
        stopTimer(option.value);
      });
    }
    
    if (onTimerStateChange) {
      onTimerStateChange(isRunning);
    }
    
    return () => {
      timeOptions.forEach(option => {
        stopTimer(option.value);
      });
    };
  }, [isRunning]);

  const handleTimeSelection = value => {
    const validOption = timeOptions.find(option => option.value === value);
    if (!validOption) return;
    
    setSelectedTime(value);
    getPeriodNumber(value);
    
    if (onDurationChange) {
      onDurationChange(value * 1000);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Set Timer</Text>

      <FlatList
        data={timeOptions}
        horizontal
        keyExtractor={item => item.value.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.timeSelector}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.timeOption,
              selectedTime === item.value && styles.selectedOption,
              lastFiveSeconds && styles.warningBackground,
            ]}
            onPress={() => handleTimeSelection(item.value)}>
            <Icon name={item.icon} size={hp('3%')} color="white" />
            <Text style={styles.optionText}>{item.label}</Text>
            <Text style={[styles.timerValue, lastFiveSeconds && styles.warningText]}>
              {String(timerStates[item.value].minutes).padStart(2, '0')}:
              {String(timerStates[item.value].seconds).padStart(2, '0')}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.timerDisplay}>
        <Text style={styles.pnText}>PN: {currentPeriodNumber}</Text>
        <View style={styles.timeRemainingContainer}>
          <Text style={styles.timeRemainingText}>Time Remaining</Text>
          <View style={[styles.timerContainer, lastFiveSeconds && styles.warningBackground]}>
            <View style={styles.timerBox}>
              <Text style={[styles.timerText, lastFiveSeconds && styles.warningText]}>
                {String(timerStates[selectedTime].minutes).padStart(2, '0')}
              </Text>
            </View>
            <Text style={[styles.separator, lastFiveSeconds && styles.warningText]}>:</Text>
            <View style={styles.timerBox}>
              <Text style={[styles.timerText, lastFiveSeconds && styles.warningText]}>
                {String(timerStates[selectedTime].seconds).padStart(2, '0')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: wp('3%'),
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: wp('1.5%'),
    backgroundColor: '#441752',
    marginHorizontal: wp('2%'),
    marginTop: hp('1%'),
  },
  warningBackground: {
    backgroundColor: '#ff4500',
  },
  label: {
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  timeSelector: {
    flexDirection: 'row',
    paddingVertical: hp('1%'),
    justifyContent: 'center',
  },
  timeOption: {
    backgroundColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('0.8%'),
    paddingHorizontal: wp('2.5%'),
    marginHorizontal: wp('1%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: '#666',
    minWidth: wp('22%'),
  },
  selectedOption: {
    backgroundColor: '#f39c12',
    borderColor: '#ffd700',
  },
  optionText: {
    fontSize: wp('3%'),
    fontWeight: 'bold',
    color: 'white',
    marginLeft: wp('1%'),
  },
  timerDisplay: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: hp('1.5%'),
    paddingHorizontal: wp('2%'),
  },
  pnText: {
    fontSize: wp('3.5%'),
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#333',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('1%'),
    minWidth: wp('18%'),
    textAlign: 'center',
    marginRight: wp('2%'),
  },
  timeRemainingContainer: {
    alignItems: 'flex-end',
    flex: 1,
  },
  timeRemainingText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: wp('3%'),
    marginBottom: hp('0.5%'),
    textAlign: 'right',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    padding: wp('1.5%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: '#666',
    minWidth: wp('35%'),
  },
  timerBox: {
    width: wp('12%'),
    height: wp('12%'),
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('2%'),
    marginHorizontal: wp('1%'),
    borderWidth: 1,
    borderColor: '#444',
  },
  timerText: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'monospace',
  },
  warningText: {
    color: '#ffd700',
  },
  separator: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: wp('1%'),
  },
  timerValue: {
    color: 'white',
    fontSize: wp('2.8%'),
    marginLeft: wp('1.5%'),
    fontFamily: 'monospace',
    minWidth: wp('7%'),
    textAlign: 'center',
  },
});
