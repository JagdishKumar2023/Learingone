import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import Card from './card/Card';
import Info from '../components/info/Info';
import Potfolio from './potfolio/Potfolio';
import FeedBack from './../components/FeedBack/FeedBack';
import Footer from './footer/Footer';
import CustomerReview from './customerreview/CustomerReview';
import Accordion from './accordion/Accordion';

const {width, height} = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();
  const textAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(textAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(textAnim, {
          toValue: 2,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(textAnim, {
          toValue: 3,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const startCircleMotion = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      rotateAnim.setValue(0);
      translateAnim.setValue(0);
      navigation.navigate('game'); // Redirect to Game screen
    });
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const translateInterpolate = translateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50], // Moves in a circular path
  });

  const textOpacity = textAnim.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [1, 0, 0, 0],
  });
  const text2Opacity = textAnim.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [0, 1, 0, 0],
  });
  const text3Opacity = textAnim.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [0, 0, 1, 0],
  });

  return (
    <ScrollView style={styles.scrollContainer}>
      <LinearGradient
        colors={['#1a1a1a', '#000']}
        style={styles.gradientContainer}>
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.heading}>
              Innovative Platform for Smart Investment
            </Text>
            <Text style={styles.subHeading}>No Demo Account Available</Text>
            <Text style={styles.attractiveLine}>
              Start investing with confidence Real profits, Real growth.
            </Text>
            <View style={styles.overlayText}>
              <Animated.Text style={[styles.subText, {opacity: textOpacity}]}>
                Welcome Professional Trader
              </Animated.Text>
              <Animated.Text style={[styles.subText, {opacity: text2Opacity}]}>
                Welcome Investors
              </Animated.Text>
              <Animated.Text style={[styles.subText, {opacity: text3Opacity}]}>
                Guaranteed Profit is waiting for you
              </Animated.Text>
            </View>
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signUpText}>Get Started</Text>
            </TouchableOpacity>{' '}
          </View>

          {/* Circular Motion + Navigation */}
          <TouchableOpacity onPress={startCircleMotion}>
            <Animated.View
              style={[
                styles.animatedCircle,
                {
                  transform: [
                    {scale: scaleAnim},
                    {rotate: rotateInterpolate},
                    {translateX: translateInterpolate},
                    {translateY: translateInterpolate},
                  ],
                },
              ]}>
              <Text style={styles.circleText}>Invest Now</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <Card />
      <Potfolio />
      <Info />
      <CustomerReview />
      <Accordion />
      <FeedBack />
      <Footer />
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradientContainer: {
    width: '100%',
    minHeight: height * 0.7,
    paddingVertical: height * 0.08,
    paddingHorizontal: width * 0.08,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#F7931A',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
    borderColor: 'orange',
    borderWidth: 3,
    borderRadius: 10,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    color: 'orange',
    fontSize: width * 0.08,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subHeading: {
    color: 'cyan',
    fontSize: width * 0.06,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
  },
  attractiveLine: {
    color: 'gold',
    fontSize: width * 0.05,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 30,
  },
  overlayText: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    color: 'cyan',
  },
  subText: {
    color: 'cyan',
    fontSize: width * 0.05,
    textAlign: 'center',
    marginBottom: 10,
  },
  signUpButton: {
    backgroundColor: '#F7931A',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 50,
    marginTop: 20,
    shadowColor: '#F7931A',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  signUpText: {
    color: '#000',
    fontSize: width * 0.05,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  animatedCircle: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: 'orange',
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'orange',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 8,
  },
  circleText: {
    color: 'cyan',
    fontSize: width * 0.06,
    fontWeight: 'bold',
  },
});
