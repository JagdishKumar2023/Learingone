import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';

const BetModal = ({onClose, modalColor = '#fff'}) => {
  const bottomSheetRef = useRef(null);
  const [betAmount, setBetAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [multiplier, setMultiplier] = useState(1);

  const handleSheetChanges = useCallback(
    index => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

  const predefinedAmounts = [200, 500, 2000, 5000];
  const multipliers = [1, 2, 5, 10];

  const placeBet = () => {
    const amount =
      betAmount === 'custom' ? parseFloat(customAmount) : betAmount;
    if (amount && multiplier) {
      // Process the bet with the selected amount and multiplier
      console.log(`Placing bet of ${amount} with multiplier x${multiplier}`);
      bottomSheetRef.current.close();
    } else {
      alert('Please enter a valid amount and select a multiplier.');
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={['50%']}
        onChange={handleSheetChanges}
        enablePanDownToClose>
        <BottomSheetView
          style={[styles.contentContainer, {backgroundColor: modalColor}]}>
          <Text style={styles.title}>Place Your Bet</Text>

          <Text style={styles.subtitle}>Select Amount:</Text>
          <View style={styles.buttonContainer}>
            {predefinedAmounts.map(amount => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.amountButton,
                  betAmount === amount && styles.selectedButton,
                ]}
                onPress={() => setBetAmount(amount)}>
                <Text style={styles.buttonText}>{amount}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[
                styles.amountButton,
                betAmount === 'custom' && styles.selectedButton,
              ]}
              onPress={() => setBetAmount('custom')}>
              <Text style={styles.buttonText}>Custom</Text>
            </TouchableOpacity>
          </View>

          {betAmount === 'custom' && (
            <TextInput
              style={styles.input}
              placeholder="Enter custom amount"
              keyboardType="numeric"
              value={customAmount}
              onChangeText={setCustomAmount}
            />
          )}

          <Text style={styles.subtitle}>Select Multiplier:</Text>
          <View style={styles.buttonContainer}>
            {multipliers.map(mult => (
              <TouchableOpacity
                key={mult}
                style={[
                  styles.multiplierButton,
                  multiplier === mult && styles.selectedButton,
                ]}
                onPress={() => setMultiplier(mult)}>
                <Text style={styles.buttonText}>x{mult}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.placeBetButton} onPress={placeBet}>
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
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  amountButton: {
    backgroundColor: '#ddd',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  multiplierButton: {
    backgroundColor: '#ddd',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: '#00f',
  },
  buttonText: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '80%',
    marginBottom: 20,
    borderRadius: 5,
  },
  placeBetButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
  },
  placeBetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BetModal;
