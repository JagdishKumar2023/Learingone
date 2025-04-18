import React, {useEffect, useState} from 'react';
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

export default function Timer() {
  const [selectedTime, setSelectedTime] = useState(30);
  const [time, setTime] = useState({minutes: 0, seconds: 30});
  const [isRunning, setIsRunning] = useState(false);
  const scaleAnim = useSharedValue(1);
  const blinkAnim = useSharedValue(1);
  const [currentPeriodNumber, setCurrentPeriodNumber] = useState();
  const [periodTypeInSec, setPeriodTypeInSec] = useState(30);

  const timeOptions = [
    {label: '30 sec', value: 30, warningThreshold: 15, icon: 'clock-fast'},
    {label: '1 min', value: 60, warningThreshold: 25, icon: 'clock-outline'},
    {label: '3 min', value: 180, warningThreshold: 40, icon: 'clock'},
    {label: '5 min', value: 300, warningThreshold: 60, icon: 'clock-time-five'},
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
        JSON.stringify({currentPeriodNumber: pn, periodTypeInSec: timeInSec}),
      );
    }
  };

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime(prev => {
          const total = prev.minutes * 60 + prev.seconds;
          if (total === 0) {
            clearInterval(timer);
            setIsRunning(false);
            return {minutes: 0, seconds: 0};
          }
          const next = total - 1;
          return {minutes: Math.floor(next / 60), seconds: next % 60};
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    const totalSeconds = time.minutes * 60 + time.seconds;
    const warning =
      timeOptions.find(o => o.value === selectedTime)?.warningThreshold || 0;

    if (totalSeconds <= warning && totalSeconds > 5) {
      scaleAnim.value = withRepeat(
        withTiming(1.2, {duration: 500, easing: Easing.linear}),
        -1,
        true,
      );
      blinkAnim.value = withRepeat(withTiming(0, {duration: 500}), -1, true);
    } else {
      scaleAnim.value = withTiming(1);
      blinkAnim.value = withTiming(1);
    }
  }, [time, selectedTime]);

  const formatNumber = num => String(num).padStart(2, '0');
  const handleTimeSelection = value => {
    getPeriodNumber(value);
    setSelectedTime(value);
    setTime({minutes: Math.floor(value / 60), seconds: value % 60});
    setIsRunning(true);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scaleAnim.value}],
  }));
  const blinkStyle = useAnimatedStyle(() => ({opacity: blinkAnim.value}));

  const totalSeconds = time.minutes * 60 + time.seconds;
  const warningThreshold =
    timeOptions.find(o => o.value === selectedTime)?.warningThreshold || 0;

  return (
    <View
      style={[
        styles.container,
        totalSeconds <= warningThreshold && styles.warningBackground,
      ]}>
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
            ]}
            onPress={() => handleTimeSelection(item.value)}>
            <Icon name={item.icon} size={hp('3%')} color="white" />
            <Text style={styles.optionText}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.timerDisplay}>
        <Text style={styles.pnText}>PN: {currentPeriodNumber}</Text>
        <View style={styles.timeRemainingContainer}>
          <Text style={styles.timeRemainingText}>Time Remaining</Text>
          <View style={styles.timerContainer}>
            <Animated.View style={[styles.timerBox, animatedStyle]}>
              <Text
                style={[
                  styles.timerText,
                  totalSeconds <= warningThreshold && styles.warningText,
                ]}>
                {formatNumber(time.minutes)}
              </Text>
            </Animated.View>
            <Text style={styles.separator}>:</Text>
            <Animated.View style={[styles.timerBox, animatedStyle]}>
              <Text
                style={[
                  styles.timerText,
                  totalSeconds <= warningThreshold && styles.warningText,
                ]}>
                {formatNumber(time.seconds)}
              </Text>
            </Animated.View>
          </View>
        </View>
      </View>

      {totalSeconds <= warningThreshold && totalSeconds > 5 && (
        <Animated.View style={[styles.blinkContainer, blinkStyle]}>
          <Text style={styles.blinkText}>ORDER FAST ✨</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: wp('3%'), // was 4%
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: wp('1.5%'), // was 2%
    backgroundColor: '#441752',
  },
  warningBackground: {
    backgroundColor: '#ff4500',
  },
  label: {
    fontSize: wp('3.5%'), // was 4.5%
    fontWeight: 'bold',
    color: 'white',
    marginBottom: hp('0.8%'), // was 1%
  },
  timeSelector: {
    flexDirection: 'row',
    paddingVertical: hp('1%'), // was 1.5%
  },
  timeOption: {
    backgroundColor: '#444',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('0.8%'), // was 1%
    paddingHorizontal: wp('2%'), // was 3%
    marginHorizontal: wp('1.5%'), // was 2%
    borderRadius: wp('1.5%'), // was 2%
  },
  selectedOption: {
    backgroundColor: '#f39c12',
  },
  optionText: {
    fontSize: wp('3%'), // was 3.5%
    fontWeight: 'bold',
    color: 'white',
    marginLeft: wp('0.8%'), // was 1%
  },
  timerDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: hp('1%'),
  },
  pnText: {
    fontSize: wp('3.5%'), // was 4%
    color: 'white',
    fontWeight: 'bold',
  },
  timeRemainingContainer: {
    marginBottom: hp('0.8%'), // was 1%
  },
  timeRemainingText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: wp('4%'), // was 4.5%
    marginBottom: hp('0.5%'),
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  timerBox: {
    width: wp('12%'), // was 16%
    height: wp('12%'), // was 16%
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('1.5%'), // was 2%
  },
  timerText: {
    fontSize: wp('5%'), // was 6%
    fontWeight: 'bold',
    color: 'white',
  },
  warningText: {
    color: 'yellow',
  },
  separator: {
    fontSize: wp('5%'), // was 6%
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: wp('0.8%'),
  },
  blinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: wp('4%'), // was 5%
    top: hp('1.5%'), // was 2%
  },
  blinkText: {
    fontSize: wp('4%'), // was 5%
    fontWeight: 'bold',
    color: 'yellow',
    marginLeft: wp('0.8%'),
  },
});
