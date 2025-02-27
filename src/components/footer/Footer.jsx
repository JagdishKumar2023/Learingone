import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width} = Dimensions.get('window'); // Get screen width for responsive sizing

const Footer = () => {
  const openLink = url => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
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
    {name: 'Telegram', url: 'https://t.me/infinityprime', icon: 'telegram'},
  ];

  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>
        © 2018 Infinity Prime. All rights reserved.
      </Text>

      <View style={styles.socialContainer}>
        {socialLinks.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => openLink(item.url)}
            style={styles.linkButton}>
            <Icon
              name={item.icon}
              size={24}
              color="#16C47F"
              style={styles.icon}
            />
            <Text style={styles.linkText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: 'black',
    paddingVertical: width * 0.04,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#16C47F',
    marginTop: width * 0.05,
  },
  footerText: {
    color: '#16C47F',
    fontSize: width * 0.035,
    fontWeight: '600',
    marginBottom: width * 0.02,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: width * 0.05,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: width * 0.02,
    paddingHorizontal: width * 0.04,
  },
  icon: {
    marginRight: 8,
  },
  linkText: {
    color: '#16C47F',
    fontSize: width * 0.04,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
