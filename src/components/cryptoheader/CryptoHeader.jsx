import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

const {width, height} = Dimensions.get('window');

const CryptoHeader = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(-30)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(textAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(2000),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(textAnim, {
            toValue: -30,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.title,
          {opacity: fadeAnim, transform: [{translateY: textAnim}]},
        ]}>
        <Text style={styles.text}>Infinity Prime</Text> The Future of Crypto
        Transactions.
      </Animated.Text>
      <Animated.Text
        style={[
          styles.subtitle,
          {opacity: fadeAnim, transform: [{translateY: textAnim}]},
        ]}>
        Secure, Lightning-Fast Deposits & Withdrawals Your Assets, Your Power
      </Animated.Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          Animated.sequence([
            Animated.timing(fadeAnim, {
              toValue: 0.5,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
          ]).start();
        }}>
        <Icon name="bitcoin" size={20} color="white" style={styles.icon} />
        <Text style={styles.buttonText}>Deposit Now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CryptoHeader;

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: height * 0.5,
    padding: width * 0.07,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    borderRadius: width * 0.05,
    borderWidth: 2,
    borderColor: '#FF8C00',
    shadowColor: '#FF8C00',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 12,
    alignSelf: 'center',
    marginTop: height * 0.03,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: 'orange',
    textAlign: 'center',
    marginBottom: width * 0.04,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  text: {
    color: 'cyan',
  },
  subtitle: {
    fontSize: width * 0.05,
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    paddingHorizontal: width * 0.05,
    marginBottom: width * 0.06,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF8C00',
    paddingVertical: width * 0.04,
    paddingHorizontal: width * 0.08,
    borderRadius: width * 0.07,
    shadowColor: '#FF4500',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 6,
    marginTop: width * 0.05,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
});
