import React, {useEffect, useState, useRef} from 'react';
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
  const recentlyCompletedTimers = useRef({});
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

  // Initialize game without showing overlay
  useEffect(() => {
    // Initialize the game with no overlay
    setShowGameOverlay(false);
    setActiveOverlays({});
  }, []);

  useEffect(() => {
    const clearOverlayTimer = setTimeout(() => {
      if (Object.keys(activeOverlays).some(key => activeOverlays[key])) {
        setActiveOverlays({});
        setShowGameOverlay(false);
      }
    }, 1000);
    
    return () => clearTimeout(clearOverlayTimer);
  }, [activeOverlays]);

  // Force clear overlay on first render and after every timer reset
  useEffect(() => {
    const forceResetOverlay = () => {
      setShowGameOverlay(false);
      setActiveOverlays({});
    };
    
    // Clear overlay on component mount
    forceResetOverlay();
    
    // Also set up a timer to check and clear overlay if needed
    const intervalTimer = setInterval(() => {
      // If there's an active overlay but not in last 5 seconds of any timer
      if (showGameOverlay && timerRemaining > 5000) {
        forceResetOverlay();
      }
    }, 500);
    
    return () => clearInterval(intervalTimer);
  }, []);

  const handleTimerEnd = (duration) => {
    dispatch({
      type: 'DISTRIBUTE_WINNINGS',
      payload: {
        result: state.results[0],
        multiplier: 1.8
      }
    });
    
    setTimerRemaining(0);
    
    // IMPORTANT: Immediately force reset ALL overlay states
    setActiveOverlays({});
    setShowGameOverlay(false);
    setOverlayCountdowns({});
    
    // Mark this timer as recently completed
    recentlyCompletedTimers.current[duration] = true;
    
    // IMPORTANT: Reset betting time to true
    setIsBettingTime(true);
    
    // Clear recently completed flag after a delay
    setTimeout(() => {
      recentlyCompletedTimers.current[duration] = false;
    }, 3000);
    
    // Shorter delay before starting next round
    setTimeout(() => {
      if (duration === selectedTimer) {
        setTimerRemaining(selectedTimer);
        // Double-check that betting time is open
        setIsBettingTime(true);
      }
    }, 800);
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
    // Use our new handleTimerSelection function for consistency
    handleTimerSelection(durationMs);
  };

  const handleFiveSecondsRemaining = (duration) => {
    // Handle special signal for clearing overlay (negative duration)
    if (duration < 0) {
      const actualDuration = Math.abs(duration);
      setActiveOverlays(prev => ({
        ...prev,
        [actualDuration]: false
      }));
      // Only clear game overlay if it's the current selected timer
      if (actualDuration === selectedTimer) {
        setShowGameOverlay(false);
      }
      return;
    }
    
    // NEVER show overlay if the timer was recently completed
    if (recentlyCompletedTimers.current[duration]) {
      return;
    }
    
    console.log(`Game: Last 2 seconds for timer: ${duration}s, selected timer: ${selectedTimer}s`);
    
    // Set overlay for ALL timers, but only show for selected timer
    setActiveOverlays(prev => ({
      ...prev,
      [duration]: true
    }));
    
    setOverlayCountdowns(prev => ({
      ...prev,
      [duration]: 2
    }));
    
    // Only show the game overlay if this is the selected timer
    if (duration === selectedTimer) {
      setShowGameOverlay(true);
    }
  };

  // Add function to handle timer selection with proper overlay management
  const handleTimerSelection = (durationMs) => {
    const durationSeconds = durationMs / 1000;
    
    // Hide any overlay from previously selected timer
    if (selectedTimer && activeOverlays[selectedTimer]) {
      setActiveOverlays(prev => ({
        ...prev,
        [selectedTimer]: false
      }));
    }

    // Update selected timer without resetting timers
    setSelectedDuration(durationSeconds);
    setSelectedTimer(durationSeconds);
    
    // Don't reset timers - just update UI state
    // setTimerKey(Date.now()); - Remove this line to prevent timer resets
    
    // Only update overlay state for the selected timer
    setShowGameOverlay(!!activeOverlays[durationSeconds]);
    
    console.log(`Timer selection changed to ${durationSeconds}s`);
  };

  const handleBettingTimeChange = (isBetting, duration) => {
    // Only update betting state if this is for the selected timer
    if (duration === selectedTimer) {
      console.log("Betting time changed to:", isBetting ? "open" : "closed");
      setIsBettingTime(isBetting);
    }
    
    // When betting opens, make sure overlay is hidden
    if (isBetting && duration === selectedTimer) {
      setShowGameOverlay(false);
      setActiveOverlays(prev => ({
        ...prev,
        [duration]: false
      }));
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
              newCountdowns[duration] = 2;
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

  useEffect(() => {
    // Reset overlay states when selected timer changes
    setActiveOverlays({});
    setShowGameOverlay(false);
    setIsBettingTime(true);
    
    // Reset countdown timers
    setOverlayCountdowns({});
  }, [selectedTimer]);

  // Add effect to sync UI when active overlays change
  useEffect(() => {
    // Check if the selected timer has an active overlay
    if (activeOverlays[selectedTimer]) {
      setShowGameOverlay(true);
    } else {
      // Only hide if there's no active overlay for selected timer
      setShowGameOverlay(false);
    }
    
    console.log("Active overlays updated:", activeOverlays);
  }, [activeOverlays, selectedTimer]);

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
        <View style={styles.timerContainer}>
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
        </View>
        <View style={styles.gameContainer}>
          {showGameOverlay && activeOverlays[selectedTimer] && (
            <TimerOverlay 
              key={`overlay-${selectedTimer}`}
              onTimerEnd={() => handleTimerEnd(selectedTimer)} 
              duration={selectedTimer}
              countdown={overlayCountdowns[selectedTimer] || 2}
            />
          )}
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
  gameContainer: {
    position: 'relative',
    marginVertical: 10,
  },
  gameSection: {
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 8,
    padding: 12,
    minHeight: 350,
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
    minHeight: 250,
  },
  bettingClosedText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  timerContainer: {
    marginBottom: 5,
  },
});

export default Game;
