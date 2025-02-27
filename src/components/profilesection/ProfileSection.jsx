import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width, height} = Dimensions.get('window');

const options = [
  {name: 'My Orders', icon: 'clipboard-list-outline'},
  {name: 'Transaction Details', icon: 'bank-transfer'},
  {name: 'eKYC', icon: 'card-account-details-outline'},
  {name: 'Support', icon: 'headset'},
  {name: 'Logout', icon: 'logout'},
  {name: 'About', icon: 'information-outline'},
];

const ProfileSection = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.optionsContainer}>
        {options.map((item, index) => (
          <TouchableOpacity key={index} style={styles.option}>
            <View style={styles.optionContent}>
              <Icon name={item.icon} size={28} color="#FFA500" />
              <Text style={styles.optionText}>{item.name}</Text>
            </View>
            <Icon name="chevron-right" size={28} color="#FF8C00" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default ProfileSection;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#121212',
    borderRadius: 20,
    paddingVertical: height * 0.02,
  },
  optionsContainer: {
    width: width * 0.9,
    alignItems: 'center',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: height * 0.025,
    paddingHorizontal: width * 0.05,
    borderBottomWidth: 1,
    borderBottomColor: '#FFA500',
    borderRadius: 12,
    backgroundColor: '#1C1C1C',
    elevation: 6,
    shadowColor: '#FFA500',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.4,
    shadowRadius: 8,
    marginBottom: height * 0.015,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: width * 0.05,
    color: 'orange',
    fontWeight: '600',
    marginLeft: width * 0.04,
  },
});
