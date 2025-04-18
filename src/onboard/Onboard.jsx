import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import HeaderImage from '../assets/headerImage.svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'; // Import the library

const slides = [
  {
    id: '1',
    title:
      "India's First Prime Rings Trading Platform for Professional Traders",
    description: 'Welcome to Prime Rings Trading',
    tagline: 'Your journey to success starts here',
    svg: HeaderImage,
  },
  {
    id: '2',
    title: 'Your Path to Financial Freedom',
    description: 'Let’s connect with Infinity Prime',
    tagline: 'Invest smart, grow fast',
    showInput: true,
    animation: require('../assets/logo.json'),
  },
];

const Onboard = ({navigation}) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const flatListRef = useRef(null);
  const rotation = useSharedValue(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (currentIndex === 0) {
      rotation.value = withRepeat(
        withTiming(360, {duration: 3000, easing: Easing.linear}),
        -1,
        false,
      );
    } else {
      rotation.value = withTiming(0);
    }
  }, [currentIndex, rotation]);

  const animatedSvgStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation.value}deg`}],
  }));

  const handleNumberInput = text => {
    setMobileNumber(text.replace(/[^0-9]/g, ''));
  };

  const completeOnboarding = async () => {
    if (mobileNumber.length !== 10) {
      return Alert.alert(
        'Invalid Number',
        'Please enter a valid 10-digit mobile number.',
      );
    }
    await AsyncStorage.setItem('userMobileNumber', mobileNumber);
    await AsyncStorage.setItem('isFirstTime', 'false');
    navigation.replace('TabNavigator');
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({index: currentIndex + 1});
      setCurrentIndex(i => i + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSlideChange = e => {
    const pageWidth = e.nativeEvent.layoutMeasurement.width;
    const idx = Math.round(e.nativeEvent.contentOffset.x / pageWidth);
    setCurrentIndex(idx);
    if (slides[idx].showInput && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.slideContainer}>
      {item.svg && (
        <Animated.View style={[styles.svgContainer, animatedSvgStyle]}>
          <item.svg width={wp('40%')} height={hp('20%')} />
        </Animated.View>
      )}
      {item.animation && (
        <LottieView
          source={item.animation}
          autoPlay
          loop
          style={styles.lottie}
        />
      )}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.description}</Text>
      <Text style={styles.tagline}>{item.tagline}</Text>
      {item.showInput && (
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Enter your mobile number"
          placeholderTextColor="#fff"
          keyboardType="phone-pad"
          returnKeyType="done"
          maxLength={10}
          value={mobileNumber}
          onChangeText={handleNumberInput}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />
      )}
    </View>
  );

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      resetScrollToCoords={{x: 0, y: 0}} // Ensure the scroll position resets when keyboard appears
      scrollEnabled={!isInputFocused} // Disable scroll when input is focused
      keyboardShouldPersistTaps="handled">
      <LinearGradient
        colors={['#1A1A1D', '#FF8C00']}
        style={styles.gradientBackground}>
        <FlatList
          ref={flatListRef}
          data={slides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          onMomentumScrollEnd={handleSlideChange}
        />
        <View style={styles.footer}>
          {currentIndex < slides.length - 1 ? (
            <TouchableOpacity onPress={handleNext} style={styles.iconButton}>
              <Ionicons name="arrow-forward" size={hp('4%')} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.button,
                mobileNumber.length === 10
                  ? styles.buttonActive
                  : styles.buttonDisabled,
              ]}
              onPress={completeOnboarding}
              disabled={mobileNumber.length !== 10}>
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  gradientBackground: {flex: 1},
  slideContainer: {
    width: wp('100%'),
    height: hp('90%'),
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp('5%'),
  },
  svgContainer: {marginBottom: hp('3%')},
  title: {
    fontSize: hp('4%'),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: hp('2%'),
  },
  text: {
    fontSize: hp('2.5%'),
    color: 'orange',
    textAlign: 'center',
    marginTop: hp('3%'),
    fontWeight: 'bold',
  },
  tagline: {
    fontSize: hp('3%'),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: hp('3%'),
  },
  input: {
    width: wp('85%'),
    height: hp('6%'),
    paddingHorizontal: wp('3%'),
    borderWidth: 1.5,
    borderColor: '#FFA500',
    borderRadius: wp('2%'),
    color: 'white',
    backgroundColor: '#333',
    textAlign: 'center',
    marginTop: hp('2%'),
  },
  lottie: {width: wp('70%'), height: hp('35%'), marginBottom: hp('2%')},
  footer: {alignItems: 'center', paddingVertical: hp('2%')},
  iconButton: {
    backgroundColor: '#FFA500',
    padding: hp('1.5%'),
    borderRadius: wp('3%'),
  },
  button: {
    padding: hp('2%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    width: wp('50%'),
  },
  buttonActive: {backgroundColor: '#FFA500'},
  buttonDisabled: {backgroundColor: '#555'},
  buttonText: {
    color: 'white',
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
  },
});

export default Onboard;
