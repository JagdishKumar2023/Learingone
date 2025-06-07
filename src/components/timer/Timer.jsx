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
          if (typeof timerRefs.current[key] === 'number') {
            clearTimeout(timerRefs.current[key]);
          } else {
            clearInterval(timerRefs.current[key]);
          }
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

  // Simplified last seconds handling with no delay
  const handleLastFiveSeconds = (duration, remaining) => {
    // Quick check if we're in the last 2 seconds range
    const isInLastTwoSeconds = (remaining <= 2000 && remaining > 0);
    const isCurrentlyShowing = lastFiveSecondsRefs.current[duration];
    
    // Immediately show/hide overlay based on time remaining
    if (isInLastTwoSeconds && !isCurrentlyShowing && !justCompletedCycle.current[duration]) {
      // Show overlay immediately
      lastFiveSecondsRefs.current[duration] = true;
      
      // Only update state if this is the selected timer
      if (duration === selectedTime) {
        setLastFiveSeconds(true);
      }
      
      // Notify parent component
      if (onFiveSecondsRemaining) {
        onFiveSecondsRemaining(duration);
      }
    } 
    else if (!isInLastTwoSeconds && isCurrentlyShowing) {
      // Hide overlay immediately
      lastFiveSecondsRefs.current[duration] = false;
      
      if (duration === selectedTime) {
        setLastFiveSeconds(false);
      }
      
      // Notify parent
      if (onFiveSecondsRemaining) {
        onFiveSecondsRemaining(-duration);
      }
    }
  };

  const startTimer = (duration) => {
    // Clear any existing timers first
    if (timerRefs.current[duration]) {
      clearTimeout(timerRefs.current[duration]);
      timerRefs.current[duration] = null;
    }
    
    // Reset overlay state when starting timer
    lastFiveSecondsRefs.current[duration] = false;
    if (duration === selectedTime) {
      setLastFiveSeconds(false);
    }
    
    // Very short protection against showing overlay immediately after restart
    recentlyRestartedTimers.current[duration] = true;
    setTimeout(() => {
      recentlyRestartedTimers.current[duration] = false;
    }, 1000); // Reduced from 3000ms to 1000ms
    
    // Calculate the absolute end time when this timer should complete
    const startTime = Date.now();
    const endTime = startTime + (duration * 1000);
    startTimeRefs.current[duration] = startTime;
    
    // IMPORTANT: Reset betting time to true when timer starts
    bettingTimeRefs.current[duration] = true;
    
    // Notify parent that betting is allowed if this is selected timer
    if (duration === selectedTime && onBettingTimeChange) {
      onBettingTimeChange(true, duration);
    }
    
    // Create a recursive self-adjusting timer function for accurate timing
    const runTimer = () => {
      // Calculate current remaining time
      const now = Date.now();
      const elapsedTime = now - startTime;
      const remaining = (duration * 1000) - elapsedTime;
      
      // Handle timer completion
      if (remaining <= 0) {
        // Reset states
        lastFiveSecondsRefs.current[duration] = false;
        bettingTimeRefs.current[duration] = true;
        
        // Mark this timer as recently restarted
        recentlyRestartedTimers.current[duration] = true;
        justCompletedCycle.current[duration] = true;
        
        setTimeout(() => {
          justCompletedCycle.current[duration] = false;
        }, 500); // Reduced from 1000ms to 500ms
        
        setTimeout(() => {
          recentlyRestartedTimers.current[duration] = false;
        }, 1000); // Reduced from 3000ms to 1000ms
        
        if (duration === selectedTime) {
          setLastFiveSeconds(false);
        }
        
        if (onTimerComplete) {
          onTimerComplete(duration);
        }
        
        // Update UI to show reset values
        setTimerStates(prev => ({
          ...prev,
          [duration]: {
            minutes: Math.floor(duration / 60),
            seconds: duration % 60
          }
        }));
        
        // Restart timer after a short delay
        setTimeout(() => {
          startTimer(duration);
        }, 250); // Reduced from 500ms to 250ms
        
        return;
      }
      
      // Calculate minutes and seconds from remaining time
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      
      // Update UI only when seconds or minutes change
      setTimerStates(prev => {
        if (prev[duration]?.minutes === minutes && 
            prev[duration]?.seconds === seconds) {
          return prev; // Skip update if values haven't changed
        }
        
        return {
          ...prev,
          [duration]: { minutes, seconds }
        };
      });
      
      // Handle betting time based on 2 seconds threshold
      if (remaining <= 2000 && bettingTimeRefs.current[duration]) {
        bettingTimeRefs.current[duration] = false;
        if (onBettingTimeChange) {
          onBettingTimeChange(false, duration);
        }
      } else if (remaining > 2000 && !bettingTimeRefs.current[duration]) {
        bettingTimeRefs.current[duration] = true;
        if (onBettingTimeChange) {
          onBettingTimeChange(true, duration);
        }
      }
      
      // Handle last seconds overlay - call BEFORE calculating next update
      handleLastFiveSeconds(duration, remaining);
      
      // Send timer tick updates
      if (onTimerTick) {
        onTimerTick(remaining, duration);
      }
      
      // Calculate next update time - use faster updates for more responsive feel
      let nextUpdateDelay = 250; // 4 updates per second by default
      
      if (remaining <= 5000) {
        // Update 20 times per second during the last 5 seconds for smoother animation
        nextUpdateDelay = 50;
      } else if (seconds === 0 || remaining <= 10000) {
        // Update 10 times per second on minute boundaries and last 10 seconds
        nextUpdateDelay = 100;
      } 
      
      // Schedule next update
      timerRefs.current[duration] = setTimeout(runTimer, nextUpdateDelay);
    };
    
    // Start timer immediately without delay
    runTimer();
  };

  const stopTimer = (duration) => {
    if (timerRefs.current[duration]) {
      clearTimeout(timerRefs.current[duration]);
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
