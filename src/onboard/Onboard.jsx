import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Dimensions,
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

const {width, height} = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Welcome to the Investing world with Prime Rings Trading 🔥',
    description: 'Infinity Prime: The Key to Your Infinite Financial Growth',
    tagline: 'Your journey to success starts here ✨',
    icon: 'diamond-outline',
    svg: HeaderImage,
  },
  {
    id: '2',
    title: 'Your Path to Financial Freedom ⭐',
    description: 'Let’s connect with Infinity Prime',
    tagline: '✨ Invest smart, grow fast',
    showInput: true,
    animation: require('../assets/logo.json'),
  },
];

const Onboard = ({navigation}) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const rotation = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, {duration: 1000});
    scale.value = withTiming(1, {duration: 1000});
    rotation.value = withRepeat(withTiming(360, {duration: 5000}), -1);
  }, [currentIndex]);

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{scale: scale.value}],
    };
  });

  const animatedSvgStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${rotation.value}deg`}],
    };
  });

  const handleNumberInput = text => {
    const formattedText = text.replace(/[^0-9]/g, '');
    setMobileNumber(formattedText);
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
        <Animated.View style={animatedSvgStyle}>
          <item.svg width={200} height={200} />
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
      <Animated.Text style={[styles.title, animatedTextStyle]}>
        {item.title}
      </Animated.Text>
      <Animated.Text style={[styles.text, animatedTextStyle]}>
        {item.description}
      </Animated.Text>
      <Animated.Text style={[styles.tagline, animatedTextStyle]}>
        {item.tagline}
      </Animated.Text>
      {item.showInput && (
        <TextInput
          style={styles.input}
          placeholder="Enter your mobile number"
          placeholderTextColor="#ccc"
          keyboardType="number-pad"
          maxLength={10}
          value={mobileNumber}
          onChangeText={handleNumberInput}
        />
      )}
    </View>
  );

  return (
    <LinearGradient
      colors={['#000000', '#FF8C00']}
      style={styles.gradientBackground}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        onMomentumScrollEnd={e => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />
      <View style={styles.footer}>
        {currentIndex < slides.length - 1 ? (
          <TouchableOpacity onPress={handleNext} style={styles.iconButton}>
            <Ionicons name="arrow-forward" size={24} color="#000" />
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
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  slideContainer: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  lottie: {
    width: width * 0.7,
    height: height * 0.35,
    marginBottom: 20,
  },
});

export default Onboard;
