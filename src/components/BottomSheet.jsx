import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import Slider from '@react-native-community/slider';
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const BetModal = ({onClose, modalColor = '#fff'}) => {
  const bottomSheetRef = useRef(null);
  const [betAmount, setBetAmount] = useState(200);
  const [quantity, setQuantity] = useState(1);
  const [customAmount, setCustomAmount] = useState('');
  const buttonTranslateX = useSharedValue(0);
  const progress = useSharedValue(0);

  const handleSheetChanges = useCallback(
    index => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

  const placeBet = () => {
    const finalAmount = customAmount
      ? parseInt(customAmount, 10)
      : betAmount * quantity;
    console.log(`Placing bet: Amount: ₹${finalAmount}, Quantity: ${quantity}`);

    progress.value = withTiming(1, {duration: 700});
    buttonTranslateX.value = withSpring(50);

    setTimeout(() => {
      // Simulate API response
      const isSuccessful = Math.random() > 0.3;

      if (isSuccessful) {
        Alert.alert('Success', `Your bet of ₹${finalAmount} was placed!`);
        bottomSheetRef.current.close();
      } else {
        Alert.alert('Failed', 'Bet placement was rejected. Try again.');
      }

      buttonTranslateX.value = withSpring(0);
      progress.value = withTiming(0, {duration: 500});
    }, 1200);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={['60%']}
        onChange={handleSheetChanges}
        enablePanDownToClose>
        <BottomSheetView
          style={[styles.contentContainer, {backgroundColor: modalColor}]}>
          <Text style={styles.title}>Advanced Bet Placement</Text>

          <Text style={styles.subtitle}>Enter Custom Amount:</Text>
          <TextInput
            style={styles.input}
            placeholder="₹ Enter Amount"
            keyboardType="numeric"
            value={customAmount}
            onChangeText={setCustomAmount}
          />

          <Text style={styles.subtitle}>Or Select Amount:</Text>
          <Slider
            style={styles.slider}
            minimumValue={100}
            maximumValue={5000}
            step={100}
            value={betAmount}
            onValueChange={setBetAmount}
            minimumTrackTintColor="#00f"
            maximumTrackTintColor="#ccc"
          />
          <Text style={styles.sliderValue}>₹{betAmount * quantity}</Text>

          <Text style={styles.subtitle}>Select Quantity:</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={20}
            step={1}
            value={quantity}
            onValueChange={setQuantity}
            minimumTrackTintColor="#f39c12"
            maximumTrackTintColor="#ccc"
          />
          <Text style={styles.sliderValue}>x{quantity}</Text>

          <Animated.View
            style={[
              styles.animatedButton,
              {transform: [{translateX: buttonTranslateX}]},
            ]}>
            <TouchableOpacity
              style={styles.placeBetButton}
              activeOpacity={0.7}
              onPress={placeBet}>
              <Text style={styles.placeBetButtonText}>Slide to Place Bet</Text>
            </TouchableOpacity>
          </Animated.View>
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
  input: {
    width: '90%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 10,
  },
  slider: {
    width: '90%',
    height: 40,
  },
  sliderValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  animatedButton: {
    marginTop: 20,
    overflow: 'hidden',
  },
  placeBetButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    width: 200,
    alignItems: 'center',
  },
  placeBetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BetModal;
