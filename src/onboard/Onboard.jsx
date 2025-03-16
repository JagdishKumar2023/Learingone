import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withRepeat,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import HeaderImage from '../assets/headerImage.svg';
import {Easing} from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

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
  const flatListRef = useRef(null);
  const inputRef = useRef(null);

  const rotation = useSharedValue(0);

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
  }, [currentIndex]);

  const animatedSvgStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation.value}deg`}],
  }));

  const handleNumberInput = text => {
    setMobileNumber(text.replace(/[^0-9]/g, ''));
  };

  const completeOnboarding = async () => {
    if (mobileNumber.length !== 10) {
      Alert.alert(
        'Invalid Number',
        'Please enter a valid 10-digit mobile number.',
      );
      return;
    }
    await AsyncStorage.setItem('userMobileNumber', mobileNumber);
    await AsyncStorage.setItem('isFirstTime', 'false');
    navigation.replace('TabNavigator');
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({index: currentIndex + 1});
      setCurrentIndex(currentIndex + 1);
    } else {
      completeOnboarding();
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
          keyboardType="numeric"
          maxLength={10}
          value={mobileNumber}
          onChangeText={handleNumberInput}
        />
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            keyboardShouldPersistTaps="handled"
            onMomentumScrollEnd={e => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / wp('100%'),
              );
              setCurrentIndex(index);
            }}
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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  gradientBackground: {flex: 1},
  slideContainer: {
    width: wp('100%'),
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
    padding: hp('2%'),
    borderWidth: 1.5,
    borderColor: '#FFA500',
    borderRadius: 12,
    color: 'white',
    backgroundColor: '#333',
    textAlign: 'center',
    minHeight: hp('6%'),
    marginTop: hp('2%'),
  },
  lottie: {width: wp('70%'), height: hp('35%'), marginBottom: hp('2%')},
  button: {padding: hp('2%'), borderRadius: 10, alignItems: 'center'},
  buttonActive: {backgroundColor: '#FFA500'},
  buttonDisabled: {backgroundColor: '#555'},
  buttonText: {color: 'white', fontSize: hp('2.5%'), fontWeight: 'bold'},
});

export default Onboard;
