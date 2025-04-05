import React, {useCallback, useMemo, useRef} from 'react';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import LottieView from 'lottie-react-native';
import winnerImage from './../../../src/assets/winner.json';

const {height} = Dimensions.get('window');

const WinnerBottomSheet = ({isVisible, onClose, period, amount}) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => [(height * 0.8).toFixed(0) + 'px'], []);

  const handleSheetChanges = useCallback(
    index => {
      if (index === -1) onClose();
    },
    [onClose],
  );

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
});

export default WinnerBottomSheet;
