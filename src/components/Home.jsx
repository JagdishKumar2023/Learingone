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
import HeaderImageSrc from '../assets/headerImage.svg';
import Card from './card/Card';
import Info from '../components/info/Info';
import Potfolio from './potfolio/Potfolio';
import FeedBack from './../components/FeedBack/FeedBack';
import Footer from './footer/Footer';
import CustomerReview from './customerreview/CustomerReview';
import Accordion from './accordion/Accordion';

// Get device dimensions
const {width, height} = Dimensions.get('window');

const Home = () => {
  const [isSignUpVisible, setIsSignUpVisible] = useState(false);
  const textAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.ValueXY({x: 0, y: 0})).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(textAnim, {
          toValue: 1,
          duration: 1900,
          useNativeDriver: true,
        }),
        Animated.delay(1800),
        Animated.timing(textAnim, {
          toValue: 4,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.delay(1500),
        Animated.timing(textAnim, {
          toValue: 3,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(textAnim, {
          toValue: 3,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const startCircularMotion = () => {
    Animated.sequence([
      Animated.timing(moveAnim, {
        toValue: {x: 50, y: -50},
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(moveAnim, {
        toValue: {x: 100, y: 0},
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(moveAnim, {
        toValue: {x: 50, y: 50},
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(moveAnim, {
        toValue: {x: 0, y: 0},
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

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
              Innovative Platform for Smart Investments
            </Text>
            <Animated.Text style={[styles.subText, {opacity: textOpacity}]}>
              Welcome Professional Trader
            </Animated.Text>
            <Animated.Text style={[styles.subText, {opacity: text2Opacity}]}>
              Welcome Investors
            </Animated.Text>
            <Animated.Text style={[styles.subText, {opacity: text3Opacity}]}>
              Guaranteed Profit is waiting for you
            </Animated.Text>
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={() => setIsSignUpVisible(true)}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={startCircularMotion}>
            <Animated.View
              style={[
                styles.svgContainer,
                {
                  transform: [
                    {translateX: moveAnim.x},
                    {translateY: moveAnim.y},
                  ],
                },
              ]}></Animated.View>
          </TouchableOpacity>
        </View>
      </View>
      {/* <GstPage /> */}
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
    backgroundColor: 'black',
    paddingHorizontal: width * 0.05,
    height: height * 0.5,
    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 15,
    marginTop: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  textContainer: {
    flex: 1,
    maxWidth: '60%',
  },
  heading: {
    color: 'orange',
    fontSize: width * 0.1,
    fontWeight: 'bold',
  },
  subText: {
    color: 'cyan',
    fontSize: width * 0.05,
    marginTop: 10,
    textAlign: 'center',
  },
  signUpButton: {
    backgroundColor: 'orange',
    borderRadius: 25,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.03,
  },
  signUpText: {
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  svgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: width * 0.4,
  },
});
