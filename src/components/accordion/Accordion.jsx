import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  useWindowDimensions,
} from 'react-native';
import {List} from 'react-native-paper';

const Accordion = () => {
  const [expanded, setExpanded] = useState({
    deposit: false,
    withdrawal: false,
    gameEarnings: false,
    bonuses: false,
  });

  const {width, height} = useWindowDimensions();
  const isTablet = width > 600; // Adjust styles for tablets

  const toggleExpand = key => {
    setExpanded(prev => ({...prev, [key]: !prev[key]}));
  };

  return (
    <View style={[styles.container, {paddingHorizontal: isTablet ? 20 : 10}]}>
      <List.Accordion
        title="Deposit Details"
        titleStyle={styles.title}
        left={props => <List.Icon {...props} icon="bank" color="cyan" />}
        expanded={expanded.deposit}
        onPress={() => toggleExpand('deposit')}
        style={styles.accordion}>
        <List.Item title="Amount: $500" titleStyle={styles.itemText} />
        <List.Item title="Status: Completed" titleStyle={styles.itemText} />
        <List.Item title="Time: 10:15 AM" titleStyle={styles.itemText} />
        <List.Item title="Commission: 2.5%" titleStyle={styles.itemText} />
      </List.Accordion>

      <List.Accordion
        title="Withdrawal Details"
        titleStyle={styles.title}
        left={props => (
          <List.Icon {...props} icon="cash-multiple" color="cyan" />
        )}
        expanded={expanded.withdrawal}
        onPress={() => toggleExpand('withdrawal')}
        style={styles.accordion}>
        <List.Item title="Amount: $200" titleStyle={styles.itemText} />
        <List.Item title="Status: Processing" titleStyle={styles.itemText} />
        <List.Item title="Time: 02:45 PM" titleStyle={styles.itemText} />
        <List.Item title="Commission: 1.8%" titleStyle={styles.itemText} />
      </List.Accordion>

      <List.Accordion
        title="Game Earnings"
        titleStyle={styles.title}
        left={props => (
          <List.Icon {...props} icon="gamepad-variant" color="cyan" />
        )}
        expanded={expanded.gameEarnings}
        onPress={() => toggleExpand('gameEarnings')}
        style={styles.accordion}>
        <List.Item title="Total Wins: 15" titleStyle={styles.itemText} />
        <List.Item title="Total Earnings: $1200" titleStyle={styles.itemText} />
        <List.Item title="Best Streak: 5 Wins" titleStyle={styles.itemText} />
      </List.Accordion>

      <List.Accordion
        title="Bonus Rewards"
        titleStyle={styles.title}
        left={props => <List.Icon {...props} icon="gift" color="cyan" />}
        expanded={expanded.bonuses}
        onPress={() => toggleExpand('bonuses')}
        style={styles.accordion}>
        <List.Item title="Welcome Bonus: $50" titleStyle={styles.itemText} />
        <List.Item title="Daily Login Bonus: $5" titleStyle={styles.itemText} />
        <List.Item title="Referral Bonus: $20" titleStyle={styles.itemText} />
      </List.Accordion>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingVertical: 1,
    marginTop: Platform.OS === 'ios' ? 50 : 30,
    marginBottom: 20,
  },
  accordion: {
    backgroundColor: '#121212',
    elevation: 4,
  },
  title: {
    color: 'cyan',
    fontSize: Dimensions.get('window').width > 600 ? 20 : 18, // Larger font for tablets
    fontWeight: 'bold',
  },
  itemText: {
    color: '#bbb',
    fontSize: Dimensions.get('window').width > 600 ? 18 : 16, // Adjust font size dynamically
  },
});

export default Accordion;
