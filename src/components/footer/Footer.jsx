import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Footer = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const openLink = url => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const handleSubscribe = () => {
    const phoneRegex = /^\d{10}$/;
    if (phoneRegex.test(phoneNumber)) {
      Alert.alert('Success', 'You have subscribed successfully!');
      setPhoneNumber('');
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
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <MaterialIcons
              name="info-outline"
              size={hp('2.5%')}
              color="#FFA500"
            />
            <Text style={styles.sectionTitle}>About Us</Text>
          </View>
          <Text style={styles.sectionText}>
            Infinity Prime is dedicated to delivering the best gaming
            experiences with cutting‑edge technology and user interfaces.
          </Text>
        </View>

        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="contacts" size={hp('2.5%')} color="#FFA500" />
            <Text style={styles.sectionTitle}>Contact Us</Text>
          </View>
          <Text style={styles.sectionText}>Phone: +91‑9876543210</Text>
          <Text style={styles.sectionText}>
            Email: support@infinityprime.com
          </Text>
          <TouchableOpacity
            onPress={() => openLink('https://wa.me/919876543210')}>
            <Text style={[styles.sectionText, styles.linkText]}>
              Chat with us on WhatsApp
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <MaterialIcons
              name="notifications-active"
              size={hp('2.5%')}
              color="#FFA500"
            />
            <Text style={styles.sectionTitle}>Get Updates</Text>
          </View>
          <TextInput
            placeholder="Phone No."
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
        {socialLinks.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => openLink(item.url)}
            style={styles.linkButton}
            activeOpacity={0.7}>
            <Icon name={item.icon} size={hp('3%')} color="#FFA500" />
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
    paddingVertical: hp('4%'),
    paddingHorizontal: wp('6%'),
    borderTopWidth: hp('0.3%'),
    borderTopColor: '#FFA500',
    marginTop: hp('2%'), // Reduced margin from top for better alignment
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('3%'),
  },
  logo: {
    width: wp('12%'),
    height: wp('12%'),
  },
  welcomeText: {
    color: '#FFA500',
    fontSize: wp('5.5%'),
    fontWeight: 'bold',
    marginLeft: wp('3%'),
  },

  topSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: hp('3%'),
  },
  sectionBlock: {
    width: wp('30%'),
    minWidth: wp('100%') > 400 ? wp('30%') : wp('100%'),
    marginBottom: hp('2%'),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  sectionTitle: {
    color: '#FFA500',
    fontSize: wp('4%'),
    fontWeight: '600',
    marginLeft: wp('1%'),
  },
  sectionText: {
    color: 'orange',
    fontSize: wp('3.5%'),
    lineHeight: hp('2.5%'),
    marginBottom: hp('0.8%'),
  },
  linkText: {
    color: '#4CC9FE',
    fontSize: wp('3.5%'),
  },

  input: {
    borderWidth: 1,
    borderColor: '#FFA500',
    borderRadius: wp('1.5%'),
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    color: '#FFF',
    fontSize: wp('3.5%'),
    backgroundColor: '#1F1F1F',
    marginBottom: hp('1.5%'),
  },
  subscribeButton: {
    backgroundColor: '#FFA500',
    paddingVertical: hp('1.2%'),
    borderRadius: wp('1.5%'),
    alignItems: 'center',
    elevation: 5,
  },
  subscribeButtonText: {
    color: '#121212',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },

  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: hp('2%'),
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('1.5%'),
    margin: wp('1%'),
    elevation: 5,
    shadowColor: 'orange',
    shadowOffset: {width: 0, height: hp('0.5%')},
    shadowOpacity: 0.3,
    shadowRadius: hp('1%'),
  },

  footerText: {
    color: '#AAA',
    fontSize: wp('3%'),
    textAlign: 'center',
    marginTop: hp('2%'),
  },
});
