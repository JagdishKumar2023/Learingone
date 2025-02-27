import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Timer from '../components/timer/Timer';
import BigSmallMini from '../BigSmallMini/BigSmallMini';
import Table from '../components/Table/Table';
import CommonButton from '../components/common/button/CommonButton';
import Rings from '../components/Rings/Rings';
import Number from '../components/Number/Number';
import Modal from '../components/BottomSheet';

const ringsData = [
  {
    stroke1: ['green', 'blue', '#DE3163'],
    stroke2: ['#DE3163', 'aqua', 'aqua'],
    stroke3: ['#DE3163', 'green', '#DE3163'],
  },
  {
    stroke1: ['#69247C', 'blue', '#850F8D'],
    stroke2: ['red', 'aqua', 'aqua'],
    stroke3: ['#69247C', 'blue', '#850F8D'],
  },
  {
    stroke1: ['red', 'blue', '#06D001'],
    stroke2: ['red', 'aqua', 'aqua'],
    stroke3: ['red', 'violet', '#06D001'],
  },
];

const Game = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showTimer, setShowTimer] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [modalColor, setModalColor] = useState('white');
  const [selectedColors, setSelectedColors] = useState(ringsData[0].stroke3);
  const [numberColors, setNumberColors] = useState();

  const handleTimerEnd = () => {
    setShowOverlay(false);
  };

  const handleFiveSecondsRemaining = () => {
    setShowOverlay(true);
  };

  const handlePress = ringsColors => {
    const lastColor = ringsColors.stroke3[ringsColors.stroke3.length - 1];
    setModalColor(lastColor);
    setSelectedColors(ringsColors.stroke3); // Pass stroke3 colors to numbers
    setIsModalVisible(true);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Timer onFiveSecondsRemaining={handleFiveSecondsRemaining} />
        <View>
          {showOverlay && <TimerOverlay onTimerEnd={handleTimerEnd} />}
          <View style={styles.gameSection}>
            <View style={{flexDirection: 'row'}}>
              {ringsData.map((ringsColors, index) => (
                <TouchableOpacity
                  onPress={() => handlePress(ringsColors)}
                  activeOpacity={0.5}
                  key={index}>
                  <Rings key={index} ringsColors={ringsColors} />
                </TouchableOpacity>
              ))}
            </View>
            <Number
              isModalVisible={isModalVisible}
              setIsModalVisible={setIsModalVisible}
              colors={selectedColors}
            />
            <BigSmallMini setIsModalVisible={setIsModalVisible} />
          </View>
        </View>
        <View style={styles.buttonRow}>
          <CommonButton title={'Game History'} width="40%" />
          <CommonButton title={'My Orders'} width="40%" />
        </View>
        <View style={{flex: 1}}>
          <Table />
        </View>
      </ScrollView>
      {isModalVisible && (
        <Modal
          onClose={() => setIsModalVisible(false)}
          modalColor={modalColor}
        />
      )}
    </>
  );
};

export default Game;

const TimerOverlay = ({onTimerEnd}) => {
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (seconds <= 0) {
      onTimerEnd();
      return;
    }
    const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, onTimerEnd]);

  return (
    <View style={styles.overlay}>
      <Text style={styles.timerText}>{seconds}s</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    gap: 12,
    backgroundColor: 'black',
  },
  gameSection: {
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 8,
    padding: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    zIndex: 10,
  },
  timerText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  showModalButton: {
    backgroundColor: 'cyan',
    padding: 10,
    margin: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  showModalButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});
