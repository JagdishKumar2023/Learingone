import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Dimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width} = Dimensions.get('window');

const Footer = () => {
  const openLink = url => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/infinityprime',
      icon: <Icon name="instagram" size={24} color="#FFA500" />,
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/infinityprime',
      icon: <Icon name="facebook" size={24} color="#FFA500" />,
    },
  ];

  return (
    <View style={styles.footerContainer}>
      <View style={styles.socialContainer}>
        {socialLinks.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => openLink(item.url)}
            style={styles.linkButton}>
            {item.icon}
            <Text style={styles.linkText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.footerText}>
        © 2018 Infinity Prime. All rights reserved.
      </Text>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#121212',
    paddingVertical: width * 0.04,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#FFA500',
    marginTop: width * 0.06,
  },
  footerText: {
    color: '#FFA500',
    fontSize: width * 0.035,
    fontWeight: '600',
    marginBottom: width * 0.02,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: width * 0.08,
    padding: 15,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: width * 0.02,
    paddingHorizontal: width * 0.04,
    backgroundColor: '#1F1F1F',
    borderRadius: 10,
    marginBottom: width * 0.02,
    elevation: 5,
    shadowColor: '#FFA500',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  telegramIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  linkText: {
    color: '#FFA500',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
});
