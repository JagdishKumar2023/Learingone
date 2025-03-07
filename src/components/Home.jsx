import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Card from './card/Card';
import Info from '../components/info/Info';
import Potfolio from './potfolio/Potfolio';
import FeedBack from './../components/FeedBack/FeedBack';
import Footer from './footer/Footer';
import CustomerReview from './customerreview/CustomerReview';
import Accordion from './accordion/Accordion';

const {width, height} = Dimensions.get('window');

const Home = () => {
  const [isSignUpVisible, setIsSignUpVisible] = useState(false);
  const [isSignInVisible, setIsSignInVisible] = useState(false);

  const textAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(textAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(textAnim, {
          toValue: 2,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(textAnim, {
          toValue: 3,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const startInPlaceAnimation = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
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
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      rotateAnim.setValue(0);
    });
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
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
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.heading}>
              Innovative platform for Smart Investment Platform
            </Text>
            <Text style={styles.subHeading}>No Demo Account Available</Text>
            <Text style={styles.attractiveLine}>
              Start investing with confidence Real profits Real growth
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
              onPress={() => setIsSignUpVisible(true)}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={startInPlaceAnimation}>
            <Animated.View
              style={[
                styles.svgContainer,
                {transform: [{scale: scaleAnim}, {rotate: rotateInterpolate}]},
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>
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
    backgroundColor: 'black',
  },
  container: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: width * 0.05,
    width: '100%',
    minHeight: height * 0.1,
    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '110%',
  },
  textContainer: {
    width: '100%',
    paddingHorizontal: width * 0.05,
  },
  overlayText: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  heading: {
    color: 'orange',
    fontSize: width * 0.1,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
    marginBottom: 10,
  },
  subHeading: {
    color: 'cyan',
    fontSize: width * 0.08,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
    marginBottom: 10,
  },
  attractiveLine: {
    color: 'gold',
    fontSize: width * 0.07,
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
    marginBottom: 15,
  },
  subText: {
    color: 'cyan',
    fontSize: width * 0.06,
    textAlign: 'center',
    width: '100%',
  },
  signUpButton: {
    backgroundColor: 'orange',
    borderRadius: 25,
    paddingVertical: height * 0.04,
    paddingHorizontal: width * 0.2,
    marginTop: height * 0.04,
    width: '80%',
    alignSelf: 'center',
  },
  signUpText: {
    color: 'white',
    fontSize: width * 0.06,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  svgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: width * 0.5,
    marginTop: 20,
  },
});
