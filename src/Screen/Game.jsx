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
    stroke1: ['#ff0000'],
    stroke2: ['aqua'],
    stroke3: ['#ff0000']
  },
    violet: {
    stroke1: ['#8A2BE2'],
    stroke2: ['aqua'],
    stroke3: ['#8A2BE2']
  },
  green: {
    stroke1: ['#00ff00'],
    stroke2: ['aqua'],
    stroke3: ['#00ff00']
  },
};

const Game = () => {
  const {data: res, isError} = useGetColorDetails();
  const {mutate: addSizeDetails} = useAddSizeDetails();
  const {state, dispatch} = useGame();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [activeTimerDuration, setActiveTimerDuration] = useState(null);
  const [modalColor, setModalColor] = useState('white');
  const [selectedColors, setSelectedColors] = useState('');
  const [sortedData, setSortedData] = useState([]);
  const [selectedRing, setSelectedRing] = useState({});
  const [metaData, setMetaData] = useState({});

  const [selectedDuration, setSelectedDuration] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [activeOverlays, setActiveOverlays] = useState({});
  const [overlayCountdowns, setOverlayCountdowns] = useState({});
  const [selectedTimer, setSelectedTimer] = useState(30);
  const [isBettingTime, setIsBettingTime] = useState(true);
  const [showGameOverlay, setShowGameOverlay] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState(0);

  const handleTimerEnd = (duration) => {
    dispatch({
      type: 'DISTRIBUTE_WINNINGS',
      payload: {
        result: state.results[0],
        multiplier: 1.8
      }
    });
    
    setTimerRemaining(0);
    setActiveOverlays(prev => ({
      ...prev,
      [duration]: false
    }));
    setOverlayCountdowns(prev => ({
      ...prev,
      [duration]: 0
    }));
    setShowGameOverlay(false);
    setIsBettingTime(true);
    
    setTimeout(() => {
      if (duration === selectedTimer) {
        setTimerRemaining(selectedTimer);
        setIsBettingTime(true);
      }
    }, 1000);
  };

  const handleTimerTick = (remaining, duration) => {
    if (duration === selectedTimer) {
      setTimerRemaining(remaining);
    }
    if (remaining <= 5000 && remaining > 0) {
      setOverlayCountdowns(prev => ({
        ...prev,
        [duration]: Math.ceil(remaining / 1000)
      }));
    }
  };

  const handleDurationChange = (durationMs) => {
    const durationSeconds = durationMs / 1000;
    setSelectedDuration(durationSeconds);
    setSelectedTimer(durationSeconds);
    setIsTimerRunning(true);
    setIsBettingTime(true);
    setShowGameOverlay(false);
    setActiveOverlays({});
  };

  const handleFiveSecondsRemaining = (duration) => {
    setActiveOverlays(prev => ({
      ...prev,
      [duration]: true
    }));
    setShowGameOverlay(true);
    setOverlayCountdowns(prev => ({
      ...prev,
      [duration]: 5
    }));
  };

  const handleBettingTimeChange = (isBetting, duration) => {
    if (duration === selectedTimer) {
      setIsBettingTime(isBetting);
    }
    if (!isBetting) {
      setActiveOverlays(prev => ({
        ...prev,
        [duration]: true
      }));
      setShowGameOverlay(true);
    }
  };

  useEffect(() => {
    const timers = Object.keys(activeOverlays).filter(duration => activeOverlays[duration]);
    if (timers.length > 0) {
      const timer = setInterval(() => {
        setOverlayCountdowns(prev => {
          const newCountdowns = {...prev};
          timers.forEach(duration => {
            if (newCountdowns[duration] <= 1) {
              setActiveOverlays(prev => ({
                ...prev,
                [duration]: false
              }));
              newCountdowns[duration] = 5;
              handleTimerEnd(parseInt(duration));
            } else {
              newCountdowns[duration] -= 1;
            }
          });
          return newCountdowns;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeOverlays]);

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
        <Timer 
          initialDuration={selectedDuration * 1000}
          remainingTime={selectedDuration * 1000}
          isRunning={isTimerRunning}
          onTimerComplete={handleTimerEnd}
          onFiveSecondsRemaining={handleFiveSecondsRemaining}
          onDurationChange={handleDurationChange}
          onBettingTimeChange={handleBettingTimeChange}
          onTimerTick={handleTimerTick}
        />
        <View>
          {Object.entries(activeOverlays).map(([duration, isActive]) => 
            isActive && (
              <TimerOverlay 
                key={duration}
                onTimerEnd={() => handleTimerEnd(parseInt(duration))} 
                duration={parseInt(duration)}
                countdown={overlayCountdowns[duration] || 5}
              />
            )
          )}
          <View style={styles.gameSection}>
            {isBettingTime ? (
              <>
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
              </>
            ) : !showGameOverlay && (
              <View style={styles.bettingClosed}>
                <Text style={styles.bettingClosedText}>Betting Closed</Text>
              </View>
            )}
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

const TimerOverlay = ({onTimerEnd, duration, countdown}) => {
  const getTimerLabel = () => {
    switch(duration) {
      case 30:
        return '30 seconds';
      case 60:
        return '1 minute';
      case 180:
        return '3 minutes';
      case 300:
        return '5 minutes';
      default:
        return '';
    }
  };

  return (
    <View style={styles.overlay}>
      <Text style={styles.timerLabel}>{getTimerLabel()} Timer</Text>
      <Text style={styles.timerText}>{countdown}s</Text>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  timerLabel: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timerText: {
    color: 'white',
    fontSize: 48,
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
  bettingClosed: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bettingClosedText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Game;
