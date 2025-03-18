// src/components/InfinityPrimeSplash.js
import React, {useEffect} from 'react';
import {View, StyleSheet, Animated, Text} from 'react-native';
import LottieView from 'lottie-react-native';

const SpleshScreen = ({navigation}) => {
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
  },
  lottie: {
    width: 400,
    height: 430,
  },
  textContainer: {
    marginTop: 20,
  },
  highlight: {
    color: '#F7931A',
    fontFamily: 'Verdana',
    fontSize: 32, // Smallest
    textAlign: 'center',
  },
  primary: {
    color: '#F7931A',
    fontFamily: 'Georgia',
    fontSize: 31, // Medium
    textAlign: 'center',
  },
  secondary: {
    color: 'cyan',
    fontFamily: 'Courier New',
    fontSize: 30, // Largest
    textAlign: 'center',
  },
});

export default SpleshScreen;
