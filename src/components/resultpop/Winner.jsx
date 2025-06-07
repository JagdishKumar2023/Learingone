import React, {useCallback, useMemo, useRef, useState, useEffect} from 'react';
import {View, Text, Dimensions, StyleSheet, Button, SafeAreaView} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import LottieView from 'lottie-react-native';
import winnerImage from './../../../src/assets/winner.json';

const {height} = Dimensions.get('window');

const WinnerBottomSheet = ({isVisible, onClose, period, amount, prediction, result, duration}) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => [(height * 0.8).toFixed(0) + 'px'], []);

  const handleSheetChanges = useCallback(
    index => {
      if (index === -1) onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backgroundStyle={styles.sheetContainer}>
      <View style={styles.container}>
        <LottieView source={winnerImage} autoPlay loop style={styles.lottie} />
        <Text style={styles.period}>Period: {period}</Text>
        <Text style={styles.amount}>Winning Amount: ₹{amount}</Text>
        <Text style={styles.prediction}>Prediction: {prediction}</Text>
        <Text style={styles.result}>Result: {result}</Text>
        <Text style={styles.duration}>Duration: {duration}</Text>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#1E1E1E',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  lottie: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  period: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700', // Gold color for premium look
    marginBottom: 10,
  },
  amount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  prediction: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  result: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  duration: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
});

export default WinnerBottomSheet;

// TEST DEMO BELOW
export const WinnerTestDemo = () => {
  const [visible, setVisible] = useState(false);
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#222' }}>
      <Button title="Show Winner Popup" onPress={() => setVisible(true)} />
      <WinnerBottomSheet
        isVisible={visible}
        onClose={() => setVisible(false)}
        period={"123456"}
        amount={"500"}
        prediction={"Red"}
        result={"Red"}
        duration={"1min"}
      />
    </SafeAreaView>
  );
};
