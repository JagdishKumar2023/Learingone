import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Image,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const WHATSAPP_BASE_URL = 'https://wa.me/';
const SUPPORT_NUMBER = '+919669378436'; // Replace with your actual support number

const SupportCategory = ({title, description, iconName, phoneNumber, issue}) => {
  const handlePress = () => {
    const message = `Hello, I need assistance with ${issue}.`;
    const whatsappUrl = `${WHATSAPP_BASE_URL}${phoneNumber}?text=${encodeURIComponent(message)}`;
    Linking.openURL(whatsappUrl);
  };

  return (
    <TouchableOpacity style={styles.categoryCard} onPress={handlePress}>
      <LinearGradient
        colors={['#441752', '#6A237C']}
        style={styles.gradientContainer}>
        <View style={styles.iconContainer}>
          <Icon name={iconName} size={36} color="#FFD700" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.categoryTitle}>{title}</Text>
          <Text style={styles.categoryDesc}>{description}</Text>
          <View style={styles.chatButton}>
            <Icon name="whatsapp" size={18} color="#25D366" />
            <Text style={styles.chatButtonText}>Chat Now</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const WhatsappSupport = () => {
  const supportCategories = [
    {
      title: 'Deposit Issues',
      description: 'Problems with adding money to your account',
      iconName: 'cash-plus',
      phoneNumber: SUPPORT_NUMBER,
      issue: 'deposit',
    },
    {
      title: 'Withdrawal Problems',
      description: 'Help with withdrawing your winnings',
      iconName: 'cash-minus',
      phoneNumber: SUPPORT_NUMBER,
      issue: 'withdrawal',
    },
    {
      title: 'Game Technical Issues',
      description: 'Game not working properly? Get help here',
      iconName: 'gamepad-variant',
      phoneNumber: SUPPORT_NUMBER,
      issue: 'technical issues',
    },
    {
      title: 'General Inquiries',
      description: 'Any other questions about our platform',
      iconName: 'help-circle',
      phoneNumber: SUPPORT_NUMBER,
      issue: 'a general inquiry',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#121212" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Customer Support</Text>
          <Icon name="headset" size={32} color="#FFD700" />
        </View>
        
        <View style={styles.supportBanner}>
          <LinearGradient
            colors={['#25D366', '#128C7E']}
            style={styles.bannerGradient}>
            <Icon name="whatsapp" size={50} color="#FFFFFF" />
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Need Help?</Text>
              <Text style={styles.bannerText}>
                Our support team is ready to assist you. Select an option below to get started.
              </Text>
            </View>
          </LinearGradient>
        </View>

        <Text style={styles.sectionTitle}>Choose Support Category</Text>
        
        {supportCategories.map((category, index) => (
          <SupportCategory
            key={index}
            title={category.title}
            description={category.description}
            iconName={category.iconName}
            phoneNumber={category.phoneNumber}
            issue={category.issue}
          />
        ))}

        <View style={styles.responseInfo}>
          <Icon name="clock-outline" size={20} color="#FFD700" />
          <Text style={styles.responseText}>
            Average response time: Under 5 minutes
          </Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Available 24/7 for all your support needs
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  supportBanner: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
  },
  bannerGradient: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  bannerTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  bannerText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  categoryCard: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  gradientContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  textContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  categoryDesc: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 10,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  chatButtonText: {
    color: '#FFFFFF',
    marginLeft: 6,
    fontWeight: 'bold',
    fontSize: 12,
  },
  responseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 10,
    borderRadius: 8,
  },
  responseText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    marginTop: 15,
    paddingVertical: 10,
  },
  footerText: {
    color: '#999999',
    fontSize: 12,
  },
});

export default WhatsappSupport; 