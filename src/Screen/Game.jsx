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
import {useGame} from './../gamelogic/context/GameContext';
import {
  useAddColorDetails,
  useGetBetDetailsById,
  useGetColorDetails,
  useGetLiveWinningDetails,
  useGetNumberDetails,
  useGetSizeDetails,
} from '../apiforgame/useBackendApi';

// const ringsData = [
//   {
//     stroke1: ['green', 'blue', '#DE3163'],
//     stroke2: ['#DE3163', 'aqua', 'aqua'],
//     stroke3: ['#DE3163', 'green', '#DE3163'],
//   },
//   {
//     stroke1: ['#69247C', 'blue', '#850F8D'],
//     stroke2: ['red', 'aqua', 'aqua'],
//     stroke3: ['#69247C', 'blue', '#850F8D'],
//   },
//   {
//     stroke1: ['red', 'blue', '#06D001'],
//     stroke2: ['red', 'aqua', 'aqua'],
//     stroke3: ['red', 'violet', '#06D001'],
//   },
// ];

const ringsColors = {
  red: {
    stroke1: ['green', 'blue', '#DE3163'],
    stroke2: ['#DE3163', 'aqua', 'aqua'],
    stroke3: ['#DE3163', 'green', '#DE3163'],
  },
  violet: {
    stroke1: ['#69247C', 'blue', '#850F8D'],
    stroke2: ['red', 'aqua', 'aqua'],
    stroke3: ['#69247C', 'blue', '#850F8D'],
  },
  green: {
    stroke1: ['red', 'blue', '#06D001'],
    stroke2: ['red', 'aqua', 'aqua'],
    stroke3: ['red', 'violet', '#06D001'],
  },
};

const Game = () => {
  const {data: res, isError} = useGetColorDetails();

  const {state, dispatch} = useGame();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [modalColor, setModalColor] = useState('white');
  const [selectedColors, setSelectedColors] = useState('');
  const [sortedData, setSortedData] = useState([]);
  const [selectedRing, setSelectedRing] = useState({});

  const handleTimerEnd = () => {
    setShowOverlay(false);
    dispatch({
      type: 'GENERATE_RESULT',
      payload: Math.random() < 0.5 ? 'red' : 'green',
    });
    dispatch({
      type: 'DISTRIBUTE_WINNINGS',
      payload: {result: state.results[0], multiplier: 1.8},
    });
  };

  const handleFiveSecondsRemaining = () => {
    setShowOverlay(true);
  };

  const handlePress = currentRingData => {
    const currentRingColor = ringsColors[currentRingData.colorName];
    const lastColor =
      currentRingColor.stroke3[currentRingColor.stroke3.length - 1];
    console.log('lastColor:', lastColor);
    setModalColor(lastColor);
    setSelectedColors(currentRingColor.stroke3);
    setIsModalVisible(true);
    setSelectedColors(currentRingData);
  };

  // const {data: number, error: isNumberError} = useGetNumberDetails();

  // const {data: size, error: isSizeError} = useGetSizeDetails();

  // const {data: winner, error: isWinner} = useGetLiveWinningDetails();

  // const {data: betDetails, error: isBetDetails} = useGetBetDetailsById();

  // const {data: addColor, error: isAddColor} = useAddColorDetails();

  // console.log('addColor', addColor); // addColor is problem

  // const {data: winnerLive, error: isWinnerLive} = useGetLiveWinningDetails();

  // console.log('winnerLive', winnerLive);

  // console.log(winner, 'winner');

  useEffect(() => {
    if (res?.data.length) {
      let tempData = res.data;

      [tempData[0], tempData[1], tempData[2]] = [
        tempData[0],
        tempData[2],
        tempData[1],
      ];

      setSortedData(tempData);
    }
  }, [res]);

  console.log('colorDetails', res);
  // console.log('Numbers', number);
  // console.log('size', size);

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Timer onFiveSecondsRemaining={handleFiveSecondsRemaining} />
        <View>
          {showOverlay && <TimerOverlay onTimerEnd={handleTimerEnd} />}
          <View style={styles.gameSection}>
            <View style={{flexDirection: 'row'}}>
              {sortedData.map((ringsData, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => handlePress(ringsData)}
                    activeOpacity={0.5}
                    key={index}>
                    <Rings
                      key={index}
                      ringsColors={ringsColors[ringsData.colorName]}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
            <Number
              isModalVisible={isModalVisible}
              setIsModalVisible={setIsModalVisible}
              colors={selectedColors}
            />
            <BigSmallMini
              setIsModalVisible={setIsModalVisible}
              colors={selectedColors}
            />
          </View>
        </View>
        <View style={styles.buttonRow}>
          <CommonButton
            title={'Game History'}
            width="40%"
            onPress={() => console.log(state.history)}
          />
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
          colors={selectedColors}
          selectedRing={selectedRing}
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
  walletText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
});
