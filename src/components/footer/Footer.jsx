import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Linking,
  Dimensions,
  Alert,
} from 'react-native';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width} = Dimensions.get('window');

const Footer = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const openLink = url => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const handleSubscribe = () => {
    const phoneRegex = /^\d{10}$/;
    if (phoneRegex.test(phoneNumber)) {
      Alert.alert('Success', 'You have subscribed successfully!');
      setPhoneNumber(''); // Clear input after submission
    } else {
      Alert.alert(
        'Invalid Number',
        'Please enter a valid 10-digit phone number.',
      );
    }
  };

  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/infinityprime',
      icon: 'instagram',
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/infinityprime',
      icon: 'facebook',
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/infinityprime',
      icon: 'twitter',
    },
  ];

  return (
    <View style={styles.footerContainer}>
      <View style={styles.logoContainer}>
        <LottieView
          source={require('../../assets/logo.json')}
          autoPlay
          loop
          style={styles.logo}
        />
        <Text style={styles.welcomeText}>Welcome to Infinity World</Text>
      </View>

      <View style={styles.topSection}>
        <View style={styles.aboutContainer}>
          <Text style={styles.sectionTitle}>About Us</Text>
          <Text style={styles.sectionText}>
            Infinity Prime is dedicated to delivering the best gaming
            experiences with cutting-edge technology and seamless user
            interfaces.
          </Text>
        </View>

        <View style={styles.contactContainer}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
        </View>

        <View style={styles.subscriptionContainer}>
          <Text style={styles.sectionTitle}>Get Updates</Text>
          <TextInput
            placeholder="Phone No.."
            placeholderTextColor="#888"
            keyboardType="phone-pad"
            maxLength={10}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={handleSubscribe}>
            <Text style={styles.subscribeButtonText}>Subscribe</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.socialContainer}>
        {socialLinks.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => openLink(item.url)}
            style={styles.linkButton}>
            <Icon name={item.icon} size={24} color="#FFA500" />
            <Text style={styles.linkText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.footerText}>
        © {new Date().getFullYear()} Infinity Prime. All rights reserved.
      </Text>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#121212',
    paddingVertical: width * 0.05,
    paddingHorizontal: width * 0.06,
    borderTopWidth: 1,
    borderTopColor: '#FFA500',
    marginTop: 50,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
  },
  welcomeText: {
    color: '#FFA500',
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: width * 0.06,
  },
  aboutContainer: {
    width: '30%',
    marginBottom: 20,
  },
  contactContainer: {
    width: '30%',
    marginBottom: 20,
  },
  subscriptionContainer: {
    width: '30%',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFA500',
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionText: {
    color: '#DDD',
    fontSize: width * 0.038,
    lineHeight: 22,
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFA500',
    borderRadius: 10,
    padding: 12,
    color: '#FFF',
    fontSize: width * 0.04,
    backgroundColor: '#1F1F1F',
    marginBottom: 10,
  },
  subscribeButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  subscribeButtonText: {
    color: '#121212',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: width * 0.08,
    paddingVertical: 20,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#1F1F1F',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#FFA500',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  linkText: {
    color: '#FFA500',
    fontSize: width * 0.04,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  footerText: {
    color: '#AAA',
    fontSize: width * 0.035,
    textAlign: 'center',
    marginTop: 20,
  },
});
