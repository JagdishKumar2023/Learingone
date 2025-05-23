import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  LayoutAnimation,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Accordion = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleAccordion = section => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      title: 'How to Deposit Funds',
      content: (
        <View style={styles.contentContainer}>
          <Text style={styles.bulletPoint}>
            <Text style={styles.step}>Step 1:</Text> Navigate to the Wallet
            section.
          </Text>
          <Text style={styles.bulletPoint}>
            <Text style={styles.step}>Step 2:</Text> Tap on "Deposit": PhonePe,
            Google Pay, Paytm.
          </Text>
          <Text style={styles.bulletPoint}>
            <Text style={styles.step}>Step 3:</Text> Choose your payment method:
          </Text>
          <Text style={styles.subText}>• UPI Transfer</Text>
          <Text style={styles.subText}>• Cryptocurrency (BTC, ETH, USDT)</Text>
          <Text style={styles.bulletPoint}>
            <Text style={styles.step}>Step 4:</Text> Enter the amount (Minimum
            deposit: ₹250) with UPI transaction.
          </Text>
          <Text style={styles.bulletPoint}>
            <Text style={styles.step}>Step 5:</Text> Confirm the transaction —
            most methods are instant.
          </Text>
        </View>
      ),
    },
    {
      title: 'How to Withdraw Earnings',
      content: (
        <View style={styles.contentContainer}>
          <Text style={styles.bulletPoint}>
            <Text style={styles.step}>Step 1:</Text> Go to the Wallet section.
          </Text>
          <Text style={styles.bulletPoint}>
            <Text style={styles.step}>Step 2:</Text> Tap on "Withdraw".
          </Text>
          <Text style={styles.bulletPoint}>
            <Text style={styles.step}>Step 3:</Text> Select your withdrawal
            method:
          </Text>
          <Text style={styles.subText}>• Bank transfer</Text>
          <Text style={styles.subText}>• UPI Transfer</Text>
          <Text style={styles.subText}>• Crypto wallets</Text>
          <Text style={styles.bulletPoint}>
            <Text style={styles.step}>Step 4:</Text> Enter the amount (Minimum
            withdrawal: ₹500).
          </Text>
          <Text style={styles.bulletPoint}>
            <Text style={styles.step}>Step 5:</Text> Confirm — processing takes
            24-48 hours.
          </Text>
        </View>
      ),
    },
    {
      title: 'How to Invest Smartly',
      content: (
        <View style={styles.contentContainer}>
          <Text style={styles.bulletPoint}>
            <Text style={styles.step}>Step 1:</Text> Research market trends
            using the platform's analytics.
          </Text>
          <Text style={styles.bulletPoint}>
            <Text style={styles.step}>Step 2:</Text> Decide your investment
            type:
          </Text>
          <Text style={styles.subText}>
            • Color Rings (Green, Red, Violet) Payout — Red Green: 2x, Violet:
            2.8x
          </Text>
          <Text style={styles.subText}>
            • Number predictions (0-9): Payout — 9x
          </Text>
          <Text style={styles.subText}>
            • Sizing (Big/Mini/Small): Payout — 2x
          </Text>
          <Text style={styles.subText}>
            • This payout is dynamic and changes with market conditions.
          </Text>
          <Text style={styles.bulletPoint}>
            <Text style={styles.step}>Step 3:</Text> Place your investment and
            set a limit.
          </Text>
          <Text style={styles.bulletPoint}>
            <Text style={styles.step}>Step 4:</Text> Use risk management
            strategies — never invest more than you're willing to lose.
          </Text>
          <Text style={styles.bulletPoint}>
            <Text style={styles.step}>Step 5:</Text> Monitor your investments
            through the dashboard.
          </Text>
        </View>
      ),
    },
    {
      title: 'How to Verify Your Account',
      content: (
        <View style={styles.contentContainer}>
          <Text style={styles.bulletPoint}>
            <Text style={styles.step}>Step 1:</Text> Go to your Profile and tap
            "Account Verification".
          </Text>
          <Text style={styles.bulletPoint}>
            <Text style={styles.step}>Step 2:</Text> Upload a valid
            government-issued ID (Aadhar, PAN card, Passport).
          </Text>
          <Text style={styles.bulletPoint}>
            <Text style={styles.step}>Step 3:</Text> Take a Bank account
            identity confirmation is must for withdrawal. It takes 24 hours.
          </Text>
          <Text style={styles.bulletPoint}>
            <Text style={styles.step}>Step 4:</Text> Submit your details —
            verification usually takes 24-72 hours.
          </Text>
          <Text style={styles.bulletPoint}>
            <Text style={styles.step}>Step 5:</Text> Once verified, you can
            withdraw earnings without limits and no delay.
          </Text>
        </View>
      ),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>FAQs</Text>

      {sections.map(section => (
        <View key={section.title}>
          <TouchableOpacity
            style={styles.accordion}
            onPress={() => toggleAccordion(section.title)}>
            <Text style={styles.accordionTitle}>{section.title}</Text>
            <Ionicons
              name={
                expandedSection === section.title
                  ? 'chevron-up'
                  : 'chevron-down'
              }
              size={24}
              color="#121212"
            />
          </TouchableOpacity>
          {expandedSection === section.title && (
            <View style={styles.accordionContent}>{section.content}</View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default Accordion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: wp('5%'),
  },
  header: {
    fontSize: wp('8%'),
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: hp('2%'), // Reduced the space below the header
    textAlign: 'center',
  },
  accordion: {
    backgroundColor: '#FFA500',
    paddingVertical: wp('3%'), // Reduced vertical padding
    paddingHorizontal: wp('5%'),
    borderRadius: wp('2%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.5%'), // Reduced bottom margin
  },
  accordionTitle: {
    fontSize: wp('5.5%'), // Reduced font size for the title
    fontWeight: 'bold',
    color: '#121212',
  },
  accordionContent: {
    backgroundColor: '#1C1C1C',
    paddingVertical: wp('3%'), // Reduced vertical padding
    paddingHorizontal: wp('4%'),
    borderRadius: wp('2%'),
    marginBottom: hp('1%'), // Reduced margin bottom
  },
  contentContainer: {
    paddingLeft: wp('2%'),
  },
  bulletPoint: {
    color: '#FFF',
    fontSize: wp('3.5%'), // Reduced font size
    marginBottom: hp('0.5%'), // Reduced margin bottom
    textAlign: 'left',
  },
  subText: {
    color: '#BBB',
    fontSize: wp('3%'), // Reduced font size
    paddingLeft: wp('3%'),
    marginBottom: hp('0.5%'), // Reduced margin bottom
    textAlign: 'left',
  },
  step: {
    fontWeight: 'bold',
    color: '#FFA500',
  },
});
