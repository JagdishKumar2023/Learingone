import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Timer() {
  const [selectedTime, setSelectedTime] = useState(30);
  const [time, setTime] = useState({minutes: 0, seconds: 30});
  const [isRunning, setIsRunning] = useState(false);
  const scaleAnim = useSharedValue(1);
  const blinkAnim = useSharedValue(1);

  const timeOptions = [
    {label: '30 sec', value: 30, warningThreshold: 15, icon: 'clock-fast'},
    {label: '1 min', value: 60, warningThreshold: 25, icon: 'clock-outline'},
    {label: '3 min', value: 180, warningThreshold: 40, icon: 'clock'},
    {label: '5 min', value: 300, warningThreshold: 60, icon: 'clock-time-five'},
  ];

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime(prevTime => {
          let {minutes, seconds} = prevTime;
          if (minutes === 0 && seconds === 0) {
            clearInterval(timer);
            setIsRunning(false);
            return {minutes: 0, seconds: 0};
          }
          return seconds === 0
            ? {minutes: minutes - 1, seconds: 59}
            : {minutes, seconds: seconds - 1};
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    const totalSeconds = time.minutes * 60 + time.seconds;
    const selectedOption = timeOptions.find(
      option => option.value === selectedTime,
    );
    const warningThreshold = selectedOption
      ? selectedOption.warningThreshold
      : 0;

    if (totalSeconds <= warningThreshold && totalSeconds > 5) {
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
    setSelectedTime(value);
    setTime({minutes: Math.floor(value / 60), seconds: value % 60});
    setIsRunning(true);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scaleAnim.value}],
  }));
  const blinkStyle = useAnimatedStyle(() => ({opacity: blinkAnim.value}));

  const totalSeconds = time.minutes * 60 + time.seconds;
  const selectedOption = timeOptions.find(
    option => option.value === selectedTime,
  );
  const warningThreshold = selectedOption ? selectedOption.warningThreshold : 0;

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
            <Icon
              name={item.icon}
              size={24}
              color="white"
              style={styles.icon}
            />
            <Text style={styles.optionText}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.timerDisplay}>
        <Text style={styles.pnText}>PN: 1234567890FGH4789</Text>
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
          <Icon name="alert" size={24} color="yellow" />
          <Text style={styles.blinkText}>ORDER FAST ✨</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 12,
    backgroundColor: '#441752',
  },
  warningBackground: {backgroundColor: '#ff4500'},
  label: {fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 5},
  timeSelector: {flexDirection: 'row', paddingVertical: 10},
  timeOption: {
    backgroundColor: '#444',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  selectedOption: {backgroundColor: '#f39c12'},
  optionText: {fontSize: 12, fontWeight: 'bold', color: 'white'},
  timerDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  pnText: {color: 'white', fontWeight: 'bold'},
  timeRemainingContainer: {gap: 8},
  timeRemainingText: {color: 'white', fontWeight: 'bold', textAlign: 'center'},
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  timerBox: {
    width: 60,
    height: 60,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  timerText: {fontSize: 32, fontWeight: 'bold', color: 'white'},
  warningText: {color: 'yellow'},
  blinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    top: 20,
  },
  blinkText: {fontSize: 24, fontWeight: 'bold', color: 'yellow', marginLeft: 5},
});
