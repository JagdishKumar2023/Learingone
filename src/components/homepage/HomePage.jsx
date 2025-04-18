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

const {width, height} = Dimensions.get('window');

const HomePage = () => {
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
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}>
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
            <TouchableOpacity style={styles.signUpButton}>
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
    </ScrollView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#ccc', // Gray background
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.05,
  },
  container: {
    backgroundColor: '#1a1a1a',
    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 15,
    width: width * 0.9,
    paddingVertical: height * 0.05,
    paddingHorizontal: width * 0.05,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    width: '100%',
  },
  overlayText: {
    height: height * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  heading: {
    color: 'orange',
    fontSize: width * 0.07,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.015,
  },
  subHeading: {
    color: 'cyan',
    fontSize: width * 0.06,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: height * 0.01,
  },
  attractiveLine: {
    color: 'gold',
    fontSize: width * 0.05,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  subText: {
    color: 'cyan',
    fontSize: width * 0.05,
    textAlign: 'center',
  },
  signUpButton: {
    backgroundColor: 'orange',
    borderRadius: 25,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.1,
    marginTop: height * 0.03,
    alignSelf: 'center',
  },
  signUpText: {
    color: 'white',
    fontSize: width * 0.05,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  svgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.5,
    height: width * 0.5,
    marginTop: height * 0.03,
    backgroundColor: '#333', // Placeholder for actual SVG or content
    borderRadius: width * 0.25,
  },
});
