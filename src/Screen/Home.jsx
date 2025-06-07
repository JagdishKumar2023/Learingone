import React, {useEffect, useRef, useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  ImageBackground,
  Image,
  Platform,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import Card from '../components/card/Card';
import Info from '../components/info/Info';
import Potfolio from '../components/potfolio/Potfolio';
import FeedBack from './../components/FeedBack/FeedBack';
import Footer from '../components/footer/Footer';
import CustomerReview from '../components/customerreview/CustomerReview';
import Accordion from '../components/accordion/Accordion';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const {width, height} = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();
  const textAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [username, setUsername] = useState('');
  
  // Check if user is signed in
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setIsSignedIn(true);
          setUsername(parsedData.username || 'Trader');
        } else {
          setIsSignedIn(false);
        }
      } catch (error) {
        console.log('Error checking auth status:', error);
        setIsSignedIn(false);
      }
    };
    
    checkUserAuth();
  }, []);
  
  // Memoize the animation to prevent recreation on re-renders
  const startAnimations = useCallback(() => {
    // Simple fade-in with native driver for better performance
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    
    // Simpler animation sequence with better timing for smooth transitions
    const textAnimation = Animated.loop(
      Animated.sequence([
        // Show text 1
        Animated.timing(textAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textAnim, {
          toValue: 0,
          duration: 2000, // Stay visible
          useNativeDriver: true,
        }),
        // Transition to text 2
        Animated.timing(textAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textAnim, {
          toValue: 1,
          duration: 2000, // Stay visible
          useNativeDriver: true,
        }),
        // Transition to text 3
        Animated.timing(textAnim, {
          toValue: 2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textAnim, {
          toValue: 2,
          duration: 2000, // Stay visible
          useNativeDriver: true,
        }),
      ])
    );
    
    textAnimation.start();
    
    return () => {
      textAnimation.stop();
    };
  }, []);
  
  useEffect(() => {
    startAnimations();
  }, [startAnimations]);

  // Text display conditions based on animation value
  const text1Opacity = useRef(new Animated.Value(1)).current;
  const text2Opacity = useRef(new Animated.Value(0)).current;
  const text3Opacity = useRef(new Animated.Value(0)).current;
  
  // Update text opacities based on textAnim value
  useEffect(() => {
    const listener = textAnim.addListener(({value}) => {
      if (value < 0.5) {
        text1Opacity.setValue(1);
        text2Opacity.setValue(0);
        text3Opacity.setValue(0);
      } else if (value < 1.5) {
        text1Opacity.setValue(0);
        text2Opacity.setValue(1);
        text3Opacity.setValue(0);
      } else {
        text1Opacity.setValue(0);
        text2Opacity.setValue(0);
        text3Opacity.setValue(1);
      }
    });
    
    return () => textAnim.removeListener(listener);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent={true} />
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}>
        
        {/* Hero Section with optimized animations */}
        <Animated.View style={[styles.fadeContainer, {opacity: fadeAnim}]}>
          <LinearGradient
            colors={['#1a1a1a', '#121212', '#000']}
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
                  <Animated.Text style={[styles.subText, {opacity: text1Opacity}]}>
                    Welcome Professional Trader
                  </Animated.Text>
                  <Animated.Text style={[styles.subText, {opacity: text2Opacity}]}>
                    Welcome Investors
                  </Animated.Text>
                  <Animated.Text style={[styles.subText, {opacity: text3Opacity}]}>
                    Guaranteed Profit is waiting for you
                  </Animated.Text>
                </View>
                
                {isSignedIn ? (
                  <View style={styles.welcomeContainer}>
                    <LinearGradient
                      colors={['#f7931a', '#FF8C00']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      style={styles.welcomeGradient}>
                      <Text style={styles.welcomeText}>
                        Hi Professional Trader {username}
                      </Text>
                      <Icon name="verified-user" size={24} color="#FFFFFF" style={{marginLeft: 8}} />
                    </LinearGradient>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.signUpButton}
                    onPress={() => navigation.navigate('SignUp')}>
                    <LinearGradient
                      colors={['#4CC9FE', '#3B9ED4']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      style={styles.buttonGradient}>
                      <Text style={styles.signUpText}>Get Started</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>

              {/* COMPLETELY RECTANGULAR BUTTON WITH NO ANIMATIONS */}
              <View style={styles.investButtonWrapper}>
                <TouchableOpacity 
                  style={styles.rectangularButton}
                  onPress={() => navigation.navigate('game')}>
                  <View style={styles.buttonInner}>
                    <Text style={styles.buttonText}>INVEST NOW</Text>
                    <Icon name="arrow-forward" size={24} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
                <Text style={styles.secureText}>100% Secure Investment</Text>
              </View>
            </View>
          </LinearGradient>
          
          {/* Content Sections */}
          <View style={styles.sectionContainer}>
            <Card />
          </View>
          
          <View style={styles.sectionContainer}>
            <Potfolio />
          </View>
          
          <LinearGradient
            colors={['#1a1a1a', '#121212']}
            style={styles.sectionContainer}>
            <Info />
          </LinearGradient>
          
          <View style={styles.sectionContainer}>
            <CustomerReview />
          </View>
          
          <LinearGradient
            colors={['#121212', '#1a1a1a']}
            style={styles.sectionContainer}>
            <Accordion />
          </LinearGradient>
          
          <View style={styles.sectionContainer}>
            <FeedBack />
          </View>
          
          <Footer />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  fadeContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  gradientContainer: {
    width: '100%',
    minHeight: hp('70%'),
    paddingTop: Platform.OS === 'ios' ? hp('6%') : hp('8%'),
    paddingBottom: hp('5%'),
    paddingHorizontal: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
    shadowColor: '#F7931A',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    borderBottomColor: 'rgba(247, 147, 26, 0.3)',
    borderBottomWidth: 2,
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
    color: '#F7931A',
    fontSize: wp('8%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp('2%'),
    textShadowColor: 'rgba(247, 147, 26, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 5,
  },
  subHeading: {
    color: '#4CC9FE',
    fontSize: wp('6%'),
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: hp('1.5%'),
    textShadowColor: 'rgba(76, 201, 254, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 5,
  },
  attractiveLine: {
    color: 'gold',
    fontSize: wp('5%'),
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: hp('3%'),
  },
  overlayText: {
    height: hp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp('2%'),
  },
  subText: {
    color: '#4CC9FE',
    fontSize: wp('5%'),
    textAlign: 'center',
    marginBottom: hp('1%'),
    position: 'absolute',
    textShadowColor: 'rgba(76, 201, 254, 0.5)',
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 3,
  },
  signUpButton: {
    width: wp('50%'),
    height: hp('6%'),
    borderRadius: hp('3%'),
    overflow: 'hidden',
    marginTop: hp('2%'),
    shadowColor: '#4CC9FE',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  welcomeContainer: {
    width: wp('80%'),
    height: hp('6%'),
    borderRadius: hp('1%'),
    overflow: 'hidden',
    marginTop: hp('2%'),
    shadowColor: '#F7931A',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  welcomeGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: wp('5%'),
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  investButtonWrapper: {
    width: '80%',
    alignItems: 'center',
    marginTop: hp('4%'),
    marginBottom: hp('2%'),
  },
  rectangularButton: {
    width: wp('90%'),
    height: hp('7%'),
    backgroundColor: '#F7931A',
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF8C00',
  },
  buttonInner: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: wp('4.5%'),
    fontWeight: '700',
    marginRight: wp('2%'),
    letterSpacing: 1,
  },
  secureText: {
    color: '#AAA',
    fontSize: wp('3%'),
    marginTop: hp('0.5%'),
  },
  sectionContainer: {
    marginBottom: hp('1.5%'),
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('1.5%'),
    borderRadius: 8,
    marginHorizontal: wp('2.5%'),
    shadowColor: '#F7931A',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
    backgroundColor: '#0d0d0d',
  },
});
