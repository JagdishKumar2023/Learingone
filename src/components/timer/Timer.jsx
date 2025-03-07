import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';

export default function Timer({onFiveSecondsRemaining}) {
  const [selectedTime, setSelectedTime] = useState(30); // Default 30 sec
  const [time, setTime] = useState({minutes: 0, seconds: 30});
  const [isRunning, setIsRunning] = useState(false);
  const [showBlink, setShowBlink] = useState(false);

  const timeOptions = [
    {label: '30 sec', value: 30, warningThreshold: 15},
    {label: '1 min', value: 60, warningThreshold: 25},
    {label: '3 min', value: 180, warningThreshold: 40},
    {label: '5 min', value: 300, warningThreshold: 60},
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

          if (seconds === 0) {
            minutes--;
            seconds = 59;
          } else {
            seconds--;
          }

          return {minutes, seconds};
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

    let blinkInterval;

    if (totalSeconds <= warningThreshold && totalSeconds > 5) {
      blinkInterval = setInterval(() => setShowBlink(prev => !prev), 300);
    } else {
      setShowBlink(false); // Remove "Order Fast" in last 5 seconds or when timer ends
    }

    return () => clearInterval(blinkInterval);
  }, [time, selectedTime]);

  const formatNumber = num => String(num).padStart(2, '0');

  const handleTimeSelection = value => {
    setSelectedTime(value);
    setTime({minutes: Math.floor(value / 60), seconds: value % 60});
    setIsRunning(true); // Start timer immediately
  };

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
      <Text style={styles.label}>Set Timer:</Text>
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
            <Text style={styles.optionText}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.timerDisplay}>
        <Text style={styles.pnText}>PN: 1234567890FGH4789</Text>
        <View style={styles.timeRemainingContainer}>
          <Text style={styles.timeRemainingText}>Time Remaining:</Text>
          <View style={styles.timerContainer}>
            <View style={styles.timerBox}>
              <Text
                style={[
                  styles.timerText,
                  totalSeconds <= warningThreshold && styles.warningText,
                ]}>
                {formatNumber(time.minutes)}
              </Text>
            </View>
            <Text style={styles.separator}>:</Text>
            <View style={styles.timerBox}>
              <Text
                style={[
                  styles.timerText,
                  totalSeconds <= warningThreshold && styles.warningText,
                ]}>
                {formatNumber(time.seconds)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      {showBlink && <Text style={styles.blinkText}>Order Fast</Text>}
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
  warningBackground: {
    backgroundColor: 'red',
  },
  label: {
    fontSize: 18,
    color: 'white',
    marginBottom: 5,
  },
  timeSelector: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  timeOption: {
    backgroundColor: '#444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  selectedOption: {
    backgroundColor: '#f39c12',
  },
  optionText: {
    fontSize: 16,
    color: 'white',
  },
  timerDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  pnText: {
    color: 'white',
  },
  timeRemainingContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  timeRemainingText: {
    color: 'white',
    textAlign: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  timerBox: {
    width: 50,
    height: 60,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  timerText: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
  separator: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  warningText: {
    color: 'red',
  },
  blinkText: {
    fontSize: 20,
    color: 'yellow',
    fontWeight: 'bold',
    position: 'absolute',
    right: 20,
    top: 20,
  },
});
