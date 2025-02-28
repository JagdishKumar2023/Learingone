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

const About = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleAccordion = section => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>About Infinity Prime</Text>

      <Text style={styles.description}>
        Infinity Prime is a cutting-edge platform for investors and professional
        traders providing a seamless experience with unmatched profit
        opportunities.
      </Text>

      <Text style={styles.highlight}>
        Real-time strategies, secure transactions, and lightning-fast orders
        redefine your trading experience.
      </Text>

      <View style={styles.noDemoAccountContainer}>
        <Text style={styles.noDemoAccountTitle}>No Demo Account</Text>
        <Text style={styles.noDemoAccountText}>
          Infinity Prime only offers real trading experiences, no demo accounts.
        </Text>
      </View>

      {[
        {
          title: 'Platform Details',
          content: (
            <>
              <Text style={styles.bulletPoint}>
                • Three colors for predictions:
              </Text>
              <Text style={styles.subText}>- Green (1.8x return)</Text>
              <Text style={styles.subText}>- Red (1.8x return)</Text>
              <Text style={styles.subText}>- Violet (3x return)</Text>
              <Text style={styles.bulletPoint}>
                • Number predictions (0-9): 9x return
              </Text>
              <Text style={styles.bulletPoint}>
                • Big/Mini/Small bets: 2x payout
              </Text>
            </>
          ),
        },
        {
          title: 'Security Features',
          content: (
            <>
              <Text style={styles.bulletPoint}>
                • End-to-end encrypted transactions
              </Text>
              <Text style={styles.bulletPoint}>
                • Real-time fraud detection
              </Text>
              <Text style={styles.bulletPoint}>
                • 24/7 monitoring for suspicious activity
              </Text>
            </>
          ),
        },
        {
          title: 'User Experience',
          content: (
            <>
              <Text style={styles.bulletPoint}>
                • Intuitive and sleek interface
              </Text>
              <Text style={styles.bulletPoint}>
                • Lightning-fast order placements
              </Text>
              <Text style={styles.bulletPoint}>• Personalized dashboards</Text>
            </>
          ),
        },
        {
          title: 'Future Goals',
          content: (
            <>
              <Text style={styles.bulletPoint}>
                • Introduce AI-powered predictions for smarter investments
              </Text>
              <Text style={styles.bulletPoint}>
                • Expand platform accessibility with multi-language support
              </Text>
              <Text style={styles.bulletPoint}>
                • Implement social trading features to connect users globally
              </Text>
              <Text style={styles.bulletPoint}>
                • Launch exclusive tournaments with high-reward pools
              </Text>
              <Text style={styles.bulletPoint}>
                • Enhance security with blockchain-based transaction tracking
              </Text>
            </>
          ),
        },
      ].map(section => (
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

export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  header: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 20,
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  highlight: {
    fontSize: 24,
    color: '#FFA500',
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  noDemoAccountContainer: {
    backgroundColor: '#1C1C1C',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  noDemoAccountTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 10,
    textAlign: 'center',
  },
  noDemoAccountText: {
    fontSize: 18,
    color: '#FFF',
    textAlign: 'center',
  },
  accordion: {
    backgroundColor: '#FFA500',
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  accordionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#121212',
  },
  accordionContent: {
    backgroundColor: '#1C1C1C',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  bulletPoint: {
    color: '#FFF',
    fontSize: 20,
    marginBottom: 8,
  },
  subText: {
    color: '#BBB',
    fontSize: 18,
    paddingLeft: 15,
    marginBottom: 8,
  },
});
