import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
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
  useAddSizeDetails,
  useGetBetDetailsById,
  useGetColorDetails,
  useGetLiveWinningDetails,
  useGetNumberDetails,
  useGetSizeDetails,
} from '../apiforgame/useBackendApi';

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
  const {mutate: addSizeDetails} = useAddSizeDetails();
  const {state, dispatch} = useGame();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [modalColor, setModalColor] = useState('white');
  const [selectedColors, setSelectedColors] = useState('');
  const [sortedData, setSortedData] = useState([]);
  const [selectedRing, setSelectedRing] = useState({});
  const [metaData, setMetaData] = useState({});

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
    setModalColor(lastColor);
    setSelectedColors(currentRingColor.stroke3);
    setIsModalVisible(true);
    setSelectedColors(currentRingData);
    const betDetails = {
      betType: 'Color',
      betTypeCode: currentRingData?._id,
    };
    setMetaData(betDetails);
  };

  const handleNumberPress = data => {
    setIsModalVisible(true);
    const betDetails = {
      betType: 'Number',
      betTypeCode: data?._id,
    };
    setMetaData(betDetails);
  };

  const sizesHandlePost = () => {
    const payload = {
      userId: '',
      amount: '',
      betType: 'Size',
      betTypeCode: '',
      periodNumber: '',
      periodTypeInMin: 1,
    };

    addSizeDetails(payload, {
      onSuccess: data => {
        console.log('✅ Bet placed successfully:', data);
      },
      onError: error => {
        console.error('❌ Error placing bet:', error);
      },
    });
  };

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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Timer onFiveSecondsRemaining={handleFiveSecondsRemaining} />
        <View>
          {showOverlay && <TimerOverlay onTimerEnd={handleTimerEnd} />}
          <View style={styles.gameSection}>
            <View style={styles.ringsRow}>
              {sortedData.map((ringsData, index) => (
                <TouchableOpacity
                  onPress={() => handlePress(ringsData)}
                  activeOpacity={0.5}
                  key={index}
                  style={styles.ringItem}>
                  <Rings ringsColors={ringsColors[ringsData.colorName]} />
                </TouchableOpacity>
              ))}
            </View>

            <Number
              isModalVisible={isModalVisible}
              setIsModalVisible={handleNumberPress}
              colors={selectedColors}
            />

            <BigSmallMini
              setIsModalVisible={setIsModalVisible}
              colors={selectedColors}
              sizesHandlePost={sizesHandlePost}
              setMetaData={setMetaData}
            />
          </View>
        </View>

        <View style={styles.buttonRow}>
          <CommonButton
            title={'Game History'}
            width="45%"
            onPress={sizesHandlePost}
          />
          <CommonButton title={'My Orders'} width="45%" />
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
          metaData={metaData}
        />
      )}
    </SafeAreaView>
  );
};

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

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollContainer: {
    gap: 12,
    backgroundColor: 'black',
    paddingBottom: 20,
    paddingHorizontal: 10,
    flexGrow: 1,
  },
  gameSection: {
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
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
    justifyContent: 'space-between',
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  ringsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  ringItem: {
    flex: 1,
    alignItems: 'center',
  },
  walletText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default Game;
