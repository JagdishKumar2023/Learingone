import React, {useEffect} from 'react';
import {View, StyleSheet, Animated, Text} from 'react-native';
import LottieView from 'lottie-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const SplashScreen = ({navigation}) => {
  const fadeAnim = new Animated.Value(0);
  const slideAnim1 = new Animated.Value(50); // For "Invest Smart"
  const slideAnim2 = new Animated.Value(50); // For "Earn Infinite Profit"
  const slideAnim3 = new Animated.Value(50); // For "Infinity Prime"

  useEffect(() => {
    // Sequential animations for each line
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim1, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(slideAnim2, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim3, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to Home screen after splash
    setTimeout(() => {
      navigation.replace('TabNavigator');
    }, 2500);
  }, []);

  return (
    <View style={styles.container}>
      {/* Lottie Logo Animation */}
      <LottieView
        source={require('../assets/logo.json')}
        autoPlay
        loop={false}
        style={styles.lottie}
      />

      {/* Animated Taglines */}
      <Animated.View
        style={[
          styles.textContainer,
          {opacity: fadeAnim, transform: [{translateY: slideAnim1}]},
        ]}>
        <Text style={styles.highlight}>Invest Smartly</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.textContainer,
          {opacity: fadeAnim, transform: [{translateY: slideAnim2}]},
        ]}>
        <Text style={styles.primary}>Earn Infinite Profit</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.textContainer,
          {opacity: fadeAnim, transform: [{translateY: slideAnim3}]},
        ]}>
        <Text style={styles.secondary}>India's First Prime Rings Trading.</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: wp('80%'), // 80% of the screen width
    height: hp('40%'), // 40% of the screen height
  },
  textContainer: {
    marginTop: 20,
  },
  highlight: {
    color: '#F7931A',
    fontFamily: 'Verdana',
    fontSize: wp('8%'), // Responsive font size based on screen width
    textAlign: 'center',
  },
  primary: {
    color: '#F7931A',
    fontFamily: 'Georgia',
    fontSize: wp('7.5%'), // Responsive font size based on screen width
    textAlign: 'center',
  },
  secondary: {
    color: 'cyan',
    fontFamily: 'Courier New',
    fontSize: wp('7%'), // Responsive font size based on screen width
    textAlign: 'center',
  },
});

export default SplashScreen;
