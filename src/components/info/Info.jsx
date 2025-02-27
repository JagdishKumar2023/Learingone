import {Image, Text, View, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import InfoImage from '../../assets/info.png';

const {width, height} = Dimensions.get('window'); // Get screen dimensions

const Info = () => {
  const iconData = [
    {name: 'chart-timeline-variant', label: 'Live Market', color: '#4CC9FE'},
    {name: 'currency-usd', label: 'Investments', color: '#00FF00'},
    {name: 'scale-balance', label: 'Profit Loss', color: '#FFA500'},
    {name: 'shield-alert', label: 'Risk Alerts', color: '#FF4500'},
    {name: 'brain', label: 'Emotional Control', color: '#FF1493'},
    {name: 'lightbulb-on-outline', label: 'Smart Ideas', color: '#8A2BE2'},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.infoCard}>
        <Text style={styles.heading}>
          <Icon name="finance" size={30} color="#FFD700" /> Information for{' '}
          <Text style={styles.highlight}>Professional Traders</Text>{' '}
          <Icon name="cog-sync" size={30} color="#FFD700" />
        </Text>
        <Image source={InfoImage} style={styles.image} />

        {/* Icons Grid */}
        <View style={styles.iconsGrid}>
          {iconData.map((item, index) => (
            <View key={index} style={styles.iconWrapper}>
              <Icon name={item.name} size={40} color={item.color} />
              <Text style={styles.iconLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default Info;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: width * 0.05,
    backgroundColor: '#000',
    borderRadius: 20,
    marginTop: height * 0.03,
  },
  infoCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: width * 0.05,
    alignItems: 'center',
    width: width * 0.9,
    shadowColor: '#4CC9FE',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  heading: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    marginBottom: height * 0.015,
    textAlign: 'center',
    color: '#FFF',
  },
  highlight: {
    color: '#4CC9FE',
    fontWeight: 'bold',
  },
  image: {
    width: width * 0.85,
    height: height * 0.4,
    resizeMode: 'contain',
    borderRadius: 20,
    marginBottom: height * 0.02,
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: height * 0.02,
  },
  iconWrapper: {
    alignItems: 'center',
    width: '30%',
    marginBottom: height * 0.02,
  },
  iconLabel: {
    color: '#FFF',
    fontSize: width * 0.04,
    marginTop: 5,
    fontWeight: '600',
    textAlign: 'center',
  },
});
