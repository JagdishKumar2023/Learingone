import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
  useWindowDimensions,
  Platform,
  PixelRatio,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useGetPeriodNumber} from '../../apiforgame/useBackendApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import TimerWithOverlay from './TimerWithOverlay';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

// Screen dimensions for responsive design
const {width} = Dimensions.get('window');

// Modern time option item with animations
const TimeOptionItem = ({item, isSelected, hasWarning, onPress}) => {
  // Animation values
  const scale = useSharedValue(1);
  const backgroundColor = useSharedValue(0);
  
  // Update animations when selection changes
  useEffect(() => {
    scale.value = withSpring(isSelected ? 1.05 : 1, {
      damping: 10,
      stiffness: 100,
    });
    backgroundColor.value = withTiming(isSelected ? 1 : 0, {
      duration: 300,
    });
  }, [isSelected]);
  
  // Create animated styles
  const animatedStyle = useAnimatedStyle(() => {
    const bgColor = interpolateColor(
      backgroundColor.value,
      [0, 1],
      ['rgba(80, 80, 90, 0.3)', isSelected ? '#441785' : 'rgba(80, 80, 90, 0.3)']
    );
    
    return {
      transform: [{scale: scale.value}],
      backgroundColor: hasWarning ? '#ff4500' : bgColor,
    };
  });
  
  return (
    <Animated.View style={[styles.timeOptionAnimated, animatedStyle]}>
      <TouchableOpacity
        style={styles.timeOptionTouchable}
        onPress={onPress}
        activeOpacity={0.7}>
        <Icon 
          name={item.icon} 
          size={hp('3%')} 
          color={isSelected ? '#FFD700' : 'white'} 
        />
        <Text style={[
          styles.optionText,
          isSelected && styles.selectedOptionText
        ]}>
          {item.label}
        </Text>
        <Text style={[
          styles.timerValue, 
          isSelected && styles.selectedTimerValue,
          hasWarning && styles.warningText
        ]}>
          {item.displayTime}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

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
  const { width, height } = useWindowDimensions();
  const isSmallDevice = width < 375;
  const isTinyDevice = width < 320; // Special case for very small devices
  const isLargeDevice = width > 768;
  const isLandscape = width > height;
  
  // Calculate dynamic sizes based on device
  const getResponsiveSize = (small, medium, large) => {
    if (isTinyDevice) return small * 0.8; // Even smaller for tiny devices
    if (isSmallDevice) return small;
    if (isLargeDevice) return large;
    return medium;
  };
  
  // Calculate responsive font size
  const getResponsiveFontSize = (size) => {
    const scaleFactor = isSmallDevice ? 0.85 : isLargeDevice ? 1.2 : 1;
    return wp(`${size * scaleFactor}%`);
  };
  
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
  const [selectedTimer, setSelectedTimer] = useState(initialDuration / 1000);

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

  // Update timeOptions with 2 second thresholds instead of 5
  const timeOptions = [
    {label: '30s', value: 30, bettingThreshold: 2, icon: 'clock-fast'},
    {label: '1min', value: 60, bettingThreshold: 2, icon: 'clock-outline'},
    {label: '3min', value: 180, bettingThreshold: 2, icon: 'clock'},
    {label: '5min', value: 300, bettingThreshold: 2, icon: 'clock-time-five'},
  ];

  const {data, refetch} = useGetPeriodNumber(periodTypeInSec);

  // Add a ref to track first render
  const initialRenderRef = useRef(true);
  
  // Add a ref to track recently restarted timers
  const recentlyRestartedTimers = useRef({
    30: false,
    60: false,
    180: false,
    300: false
  });
  
  // Track if each timer has just completed a cycle
  const justCompletedCycle = useRef({
    30: false,
    60: false,
    180: false,
    300: false
  });
  
  // In useEffect for initialization
  useEffect(() => {
    // On mount, set the flag
    initialRenderRef.current = true;
    
    // IMPORTANT: Initialize all overlay-related states properly
    // Reset these BEFORE any timer starts
    lastFiveSecondsRefs.current = {
      30: false,
      60: false,
      180: false,
      300: false
    };
    
    // Reset state immediately
    setLastFiveSeconds(false);
    
    // Update all betting time refs too
    bettingTimeRefs.current = {
      30: true,
      60: true,
      180: true,
      300: true
    };
    
    // Clear the flag after a delay to prevent initial overlay
    const timer = setTimeout(() => {
      initialRenderRef.current = false;
    }, 500); // Reduced delay to avoid timing issues
    
    return () => clearTimeout(timer);
  }, []);
  
  // Add a cleanup effect when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup all timers when component unmounts
      Object.keys(timerRefs.current).forEach(key => {
        if (timerRefs.current[key]) {
          clearInterval(timerRefs.current[key]);
          timerRefs.current[key] = null;
        }
      });
    };
  }, []);
  
  // Add explicit initialization for timer selection
  useEffect(() => {
    // Reset overlay state when timer selection changes
    setLastFiveSeconds(false);
    if (selectedTime) {
      lastFiveSecondsRefs.current[selectedTime] = false;
    }
  }, [selectedTime]);

  // Initialize betting time as true for all timers
  useEffect(() => {
    // Reset betting time to true for all timers
    bettingTimeRefs.current = {
      30: true,
      60: true,
      180: true,
      300: true
    };
    
    // Notify parent that betting time is open
    if (onBettingTimeChange) {
      onBettingTimeChange(true, selectedTime);
    }
  }, [selectedTime]);

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

  // Update the last seconds handling to ensure it fires for all durations
  const handleLastFiveSeconds = (duration, remaining) => {
    // NEVER show overlay during initialization, restart, or the first seconds of any timer
    const elapsed = duration * 1000 - remaining;
    const isJustStarted = elapsed < 2000; // First 2 seconds of the timer
    const wasRecentlyRestarted = recentlyRestartedTimers.current[duration];
    const hasJustCompletedCycle = justCompletedCycle.current[duration];
    
    // Force disable overlay in several circumstances
    if (initialRenderRef.current || 
        isJustStarted || 
        wasRecentlyRestarted || 
        hasJustCompletedCycle || 
        remaining === undefined ||
        remaining >= (duration * 1000 - 2000) // First seconds based on remaining time check
       ) {
      // Force ensure no overlay during initialization or start
      if (lastFiveSecondsRefs.current[duration]) {
        lastFiveSecondsRefs.current[duration] = false;
        if (duration === selectedTime) {
          setLastFiveSeconds(false);
        }
        
        // Always notify parent component to hide overlay
        if (onFiveSecondsRemaining) {
          // We send a special signal with negative duration to indicate clearing overlay
          onFiveSecondsRemaining(-duration);
        }
      }
      return;
    }
    
    // Only trigger last seconds logic if within last 2 seconds range AND not in early timer phase
    if (remaining <= 2000 && remaining > 0 && elapsed > 2000) {
      if (!lastFiveSecondsRefs.current[duration]) {
        // First time entering last seconds for this timer
        lastFiveSecondsRefs.current[duration] = true;
        
        // Update visible last sec state only for selected timer
        if (duration === selectedTime) {
          setLastFiveSeconds(true);
        }
        
        // IMPORTANT: Always call onFiveSecondsRemaining for all timers
        // This ensures overlay shows for all timer durations
        if (onFiveSecondsRemaining && typeof onFiveSecondsRemaining === 'function') {
          console.log(`Last 2 seconds for timer: ${duration}s`);
          onFiveSecondsRemaining(duration);
        }
      }
    } else if (remaining > 2000) {
      // Reset last seconds state when not in last seconds
      if (lastFiveSecondsRefs.current[duration]) {
        lastFiveSecondsRefs.current[duration] = false;
        
        if (duration === selectedTime) {
          setLastFiveSeconds(false);
        }
      }
    }
  };

  const startTimer = (duration) => {
    if (timerRefs.current[duration]) return;
    
    // Reset overlay state when starting timer
    lastFiveSecondsRefs.current[duration] = false;
    if (duration === selectedTime) {
      setLastFiveSeconds(false);
    }
    
    // Set "recently restarted" for a guaranteed time period to prevent overlay
    recentlyRestartedTimers.current[duration] = true;
    
    // Clear the "recently restarted" flag after sufficient time
    setTimeout(() => {
      recentlyRestartedTimers.current[duration] = false;
    }, 10000); // 10 seconds should be enough to cover the full timer init phase
    
    startTimeRefs.current[duration] = Date.now();
    remainingTimeRefs.current[duration] = duration * 1000;
    
    // IMPORTANT: Reset betting time to true when timer starts
    bettingTimeRefs.current[duration] = true;
    
    // Notify parent that betting is allowed if this is selected timer
    if (duration === selectedTime && onBettingTimeChange) {
      onBettingTimeChange(true, duration);
    }
    
    timerRefs.current[duration] = setInterval(() => {
      const elapsed = Date.now() - startTimeRefs.current[duration];
      const remaining = remainingTimeRefs.current[duration] - elapsed;
      
      if (remaining <= 0) {
        clearInterval(timerRefs.current[duration]);
        timerRefs.current[duration] = null;
        lastFiveSecondsRefs.current[duration] = false;
        bettingTimeRefs.current[duration] = true;
        
        // Mark this timer as recently restarted to prevent overlay
        recentlyRestartedTimers.current[duration] = true;
        justCompletedCycle.current[duration] = true;
        
        // Clear the "recently completed" flag after a delay
        setTimeout(() => {
          justCompletedCycle.current[duration] = false;
        }, 5000);
        
        // Clear the "recently restarted" flag after 10 seconds
        setTimeout(() => {
          recentlyRestartedTimers.current[duration] = false;
        }, 10000);
        
        if (duration === selectedTime) {
          setLastFiveSeconds(false);
        }
        
        if (onTimerComplete) {
          onTimerComplete(duration);
        }
        
        // Reset this timer
        remainingTimeRefs.current[duration] = duration * 1000;
        startTimeRefs.current[duration] = Date.now();
        
        // Start this timer again after a delay
        setTimeout(() => {
          startTimer(duration);
        }, 800);
        
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

        // Handle betting time based on 2 seconds threshold (instead of 5)
        if (remaining <= 2000 && bettingTimeRefs.current[duration]) {
          bettingTimeRefs.current[duration] = false;
          if (onBettingTimeChange) {
            onBettingTimeChange(false, duration);
          }
        } else if (remaining > 2000 && !bettingTimeRefs.current[duration]) {
          // Re-enable betting if timer moved away from last 2 seconds
          bettingTimeRefs.current[duration] = true;
          if (onBettingTimeChange) {
            onBettingTimeChange(true, duration);
          }
        }
        
        // Replace the existing last 5 seconds check with our new function
        handleLastFiveSeconds(duration, remaining);
        
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

  // Add function to explicitly reset all overlay states
  const resetAllOverlayStates = () => {
    lastFiveSecondsRefs.current = {
      30: false,
      60: false,
      180: false,
      300: false
    };
    
    recentlyRestartedTimers.current = {
      30: true,
      60: true,
      180: true,
      300: true
    };
    
    // Set timeout to clear recently restarted flags
    setTimeout(() => {
      recentlyRestartedTimers.current = {
        30: false,
        60: false,
        180: false,
        300: false
      };
    }, 5000);
    
    setLastFiveSeconds(false);
  };
  
  // Call reset function in the useEffect that handles isRunning changes
  useEffect(() => {
    // Reset all overlay states whenever timer running state changes
    resetAllOverlayStates();
    
    if (isRunning) {
      // Start all timers independently without affecting others
      timeOptions.forEach(option => {
        // Only start if not already running
        if (!timerRefs.current[option.value]) {
          startTimer(option.value);
        }
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
    
    // Don't reset states for other timers - just change the selected timer
    setSelectedTime(value);
    getPeriodNumber(value);
    
    if (onDurationChange) {
      onDurationChange(value * 1000);
    }
    
    // Set selected timer without affecting other timers
    setSelectedTimer(value);
    
    // Don't reset the timers - just change which one is displayed
    // We've removed the timerKey reset that was causing timer restarts
  };

  // Format the time for display
  const getFormattedTime = (minutes, seconds) => {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Enhanced time options with formatted display time
  const enhancedTimeOptions = timeOptions.map(option => ({
    ...option,
    displayTime: getFormattedTime(
      timerStates[option.value].minutes,
      timerStates[option.value].seconds
    )
  }));

  return (
    <LinearGradient
      colors={['#441752', '#351140']}
      style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContainer}
        bounces={false}
        alwaysBounceVertical={false}>
        <Text style={styles.label}>Investment Timer</Text>

        <View style={[
          styles.timeSelector, 
          isLandscape && styles.timeSelectorLandscape
        ]}>
          {timeOptions.map(item => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.timeOption,
                selectedTime === item.value && styles.selectedOption,
                lastFiveSeconds && selectedTime === item.value && styles.warningBackground,
                isSmallDevice && styles.timeOptionSmall,
                isTinyDevice && styles.timeOptionTiny,
                isLargeDevice && styles.timeOptionLarge,
                isLandscape && styles.timeOptionLandscape,
              ]}
              onPress={() => handleTimeSelection(item.value)}>
              <Icon 
                name={item.icon} 
                size={getResponsiveSize(hp('2%'), hp('2.5%'), hp('3%'))} 
                color={selectedTime === item.value ? '#FFD700' : 'white'} 
              />
              <Text style={[
                styles.optionText,
                {fontSize: getResponsiveFontSize(isTinyDevice ? 2 : isSmallDevice ? 2.2 : 3)},
                isSmallDevice && {marginVertical: 1},
                isTinyDevice && {letterSpacing: 0},
              ]}>
                {item.label}
              </Text>
              <Text style={[
                styles.timerValue, 
                selectedTime === item.value && styles.selectedValue,
                lastFiveSeconds && styles.warningText,
                {fontSize: getResponsiveFontSize(isTinyDevice ? 2.2 : 2.5)},
              ]}>
                {getFormattedTime(
                  timerStates[item.value].minutes,
                  timerStates[item.value].seconds
                )}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={[
          styles.timerDisplay,
          isLandscape && styles.timerDisplayLandscape
        ]}>
          <View style={[
            styles.pnContainer,
            isSmallDevice && styles.pnContainerSmall,
            isLargeDevice && styles.pnContainerLarge,
          ]}>
            <Text style={[
              styles.pnLabel,
              {fontSize: getResponsiveFontSize(2.5)}
            ]}>Period Number</Text>
            <Text style={[
              styles.pnText,
              {fontSize: getResponsiveFontSize(isSmallDevice ? 2.8 : 3)}
            ]}>{currentPeriodNumber || '-----'}</Text>
          </View>
          
          <View style={styles.timeRemainingContainer}>
            <Text style={[
              styles.timeRemainingText,
              {fontSize: getResponsiveFontSize(2.7)}
            ]}>Time Remaining</Text>
            <LinearGradient
              colors={lastFiveSeconds ? ['#FF4500', '#FF6347'] : ['#1E1E2A', '#312B45']}
              style={[styles.timerContainer]}
            >
              <View style={[
                styles.timerBox,
                isSmallDevice && styles.timerBoxSmall,
                isLargeDevice && styles.timerBoxLarge,
              ]}>
                <Text style={[
                  styles.timerText, 
                  lastFiveSeconds && styles.warningText,
                  {fontSize: getResponsiveFontSize(isSmallDevice ? 4.2 : 5)}
                ]}>
                  {String(timerStates[selectedTime].minutes).padStart(2, '0')}
                </Text>
              </View>
              <Text style={[
                styles.separator, 
                lastFiveSeconds && styles.warningText,
                {fontSize: getResponsiveFontSize(isSmallDevice ? 4.5 : 5.5)}
              ]}>:</Text>
              <View style={[
                styles.timerBox,
                isSmallDevice && styles.timerBoxSmall,
                isLargeDevice && styles.timerBoxLarge,
              ]}>
                <Text style={[
                  styles.timerText, 
                  lastFiveSeconds && styles.warningText,
                  {fontSize: getResponsiveFontSize(isSmallDevice ? 4.2 : 5)}
                ]}>
                  {String(timerStates[selectedTime].seconds).padStart(2, '0')}
                </Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        <View>
          <TimerWithOverlay
            key={selectedTimer}
            duration={selectedTimer}
            isActive={isRunning}
            remainingSeconds={Math.floor(timerStates[selectedTimer].minutes * 60 + timerStates[selectedTimer].seconds)}
            showLastFiveSecondsOverlay={lastFiveSecondsRefs.current[selectedTimer]}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// Enhanced modern styles
const styles = StyleSheet.create({
  container: {
    borderRadius: wp('2%'),
    marginHorizontal: wp('1.5%'),
    marginTop: hp('0.8%'),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    flex: 1,
  },
  warningBackground: {
    backgroundColor: 'rgba(255, 69, 0, 0.7)',
  },
  label: {
    fontSize: wp('3.8%'),
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: hp('1%'),
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  timeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: hp('0.8%'),
  },
  timeSelectorLandscape: {
    paddingHorizontal: wp('5%'),
    justifyContent: 'space-around',
  },
  timeOptionAnimated: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('2%'),
    marginHorizontal: wp('1%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: '#444',
  },
  timeOptionTouchable: {
    width: '100%',
    alignItems: 'center',
  },
  timeOption: {
    backgroundColor: 'rgba(40, 40, 50, 0.9)',
    alignItems: 'center',
    paddingVertical: hp('0.6%'),
    paddingHorizontal: wp('0.5%'),
    marginHorizontal: wp('0.3%'),
    borderRadius: wp('1.5%'),
    borderWidth: 1,
    borderColor: '#555',
    flex: 1,
    maxWidth: '24%', // Ensure 4 items fit in a row with minimal gap
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  selectedOption: {
    backgroundColor: 'rgba(80, 30, 100, 0.9)',
    borderColor: '#FFD700',
    borderWidth: 1.5,
  },
  optionText: {
    fontSize: wp('2.5%'),
    fontWeight: '700',
    color: 'white',
    marginTop: hp('0.2%'),
    marginBottom: hp('0.2%'),
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  selectedOptionText: {
    color: '#FFD700',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  selectedValue: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  selectedTimerValue: {
    color: '#FFD700',
  },
  timerDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  pnContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: wp('1.5%'),
    borderRadius: wp('1.5%'),
    alignItems: 'center',
    minWidth: wp('25%'),
  },
  pnLabel: {
    color: '#CCC',
    fontSize: wp('2.5%'),
    marginBottom: 1,
  },
  pnText: {
    fontSize: wp('3%'),
    fontWeight: 'bold',
    color: '#FFD700',
  },
  timeRemainingContainer: {
    alignItems: 'center',
  },
  timeRemainingText: {
    color: 'white',
    fontWeight: '600',
    fontSize: wp('2.7%'),
    marginBottom: hp('0.3%'),
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp('1.5%'),
    borderRadius: wp('1.5%'),
    overflow: 'hidden',
  },
  timerBox: {
    width: wp('12%'),
    height: wp('12%'),
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('1.2%'),
    margin: wp('0.8%'),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  timerText: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'monospace',
  },
  warningText: {
    color: '#FFD700',
  },
  separator: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: 'white',
  },
  timerValue: {
    color: '#CCC',
    fontSize: wp('2.5%'),
    fontFamily: 'monospace',
    marginTop: 2,
  },
  scrollContainer: {
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('2%'),
  },
  timeOptionSmall: {
    paddingVertical: hp('0.4%'),
    paddingHorizontal: wp('0.2%'),
    marginHorizontal: wp('0.2%'),
    borderWidth: 0.5,
  },
  timeOptionTiny: {
    paddingVertical: hp('0.2%'),
    paddingHorizontal: wp('0.1%'),
    marginHorizontal: wp('0.1%'),
    borderWidth: 0.25,
  },
  timeOptionLarge: {
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('1%'),
    marginHorizontal: wp('0.5%'),
    borderRadius: wp('2%'),
  },
  timeOptionLandscape: {
    maxWidth: '23%',
    paddingHorizontal: wp('0.8%'),
  },
  timerDisplayLandscape: {
    paddingHorizontal: wp('5%'),
    justifyContent: 'space-around',
  },
  pnContainerSmall: {
    padding: wp('1%'),
    minWidth: wp('22%'),
  },
  pnContainerLarge: {
    padding: wp('2%'),
    minWidth: wp('28%'),
    borderRadius: wp('2%'),
  },
  timerBoxSmall: {
    width: wp('10%'),
    height: wp('10%'),
    margin: wp('0.5%'),
    borderRadius: wp('1%'),
  },
  timerBoxLarge: {
    width: wp('15%'),
    height: wp('15%'),
    margin: wp('1%'),
    borderRadius: wp('1.5%'),
  },
});
