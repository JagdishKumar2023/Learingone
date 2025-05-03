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
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const options = [
  {name: 'My Order', icon: 'clipboard-list-outline', route: 'My Order'},
  {
    name: 'Transaction Details',
    icon: 'bank-transfer',
    route: 'Transaction Details',
  },
  {name: 'eKYC', icon: 'card-account-details-outline', route: 'eKYC'},
  {name: 'Support', icon: 'headset', route: 'Support'},
  {name: 'About', icon: 'information-outline', route: 'About'},
];

const ProfileSection = () => {
  const navigation = useNavigation();

  return (
    <ScrollView
      contentContainerStyle={styles.optionsContainer}
      showsVerticalScrollIndicator={false}>
      {options.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.option}
          onPress={() => navigation.navigate(item.route)}>
          <View style={styles.optionContent}>
            <Icon name={item.icon} size={28} color="#FFA500" />
            <Text style={styles.optionText}>{item.name}</Text>
          </View>
          <Icon name="chevron-right" size={28} color="#FF8C00" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default ProfileSection;

const styles = StyleSheet.create({
  optionsContainer: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.01,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: height * 0.025,
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
    padding: 10,
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
