import React, {useState} from 'react';
import {View, StyleSheet, useWindowDimensions, Platform} from 'react-native';
import {List} from 'react-native-paper';

const Accordion = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const {width} = useWindowDimensions();
  const isTablet = width > 600;

  const handlePress = key => {
    setActiveAccordion(prevKey => (prevKey === key ? null : key));
  };

  return (
    <View style={[styles.container, {paddingHorizontal: isTablet ? 30 : 15}]}>
      <List.Accordion
        title="Important Info Infinity Prime"
        titleStyle={styles.title}
        left={props => <List.Icon {...props} icon="information" color="#fff" />}
        expanded={activeAccordion === 'about'}
        onPress={() => handlePress('about')}
        style={styles.accordion}>
        <List.Item
          title="Experience real trading with no demo accounts."
          titleStyle={styles.itemText}
        />
        <List.Item
          title="Unlock Prime Rings for exclusive rewards."
          titleStyle={styles.itemText}
        />
        <List.Item
          title="24/7 customer support for Prime members."
          titleStyle={styles.itemText}
        />
      </List.Accordion>

      <List.Accordion
        title="Wallet Information"
        titleStyle={styles.title}
        left={props => <List.Icon {...props} icon="wallet" color="#fff" />}
        expanded={activeAccordion === 'wallet'}
        onPress={() => handlePress('wallet')}
        style={styles.accordion}>
        <List.Item
          title="Your wallet has and any issue make ticket"
          titleStyle={styles.itemText}
        />
        <List.Item
          title="Deposit Time 0 min - 24 hours"
          titleStyle={styles.itemText}
        />
        <List.Item
          title="Wallet withdrwal Time is 24 hours to 2 bussiness day"
          titleStyle={styles.itemText}
        />
      </List.Accordion>

      <List.Accordion
        title="Deposit Information"
        titleStyle={styles.title}
        left={props => <List.Icon {...props} icon="cash-fast" color="#fff" />}
        expanded={activeAccordion === 'deposit'}
        onPress={() => handlePress('deposit')}
        style={styles.accordion}>
        <List.Item
          title="Deposits are processed instantly."
          titleStyle={styles.itemText}
        />
        <List.Item
          title="Deposit time ranges from 0 min to under 24 hours."
          titleStyle={styles.itemText}
        />
        <List.Item
          title="Ensure you use verified payment methods."
          titleStyle={styles.itemText}
        />
      </List.Accordion>

      <List.Accordion
        title="How to Play Prime Rings"
        titleStyle={styles.title}
        left={props => (
          <List.Icon {...props} icon="gamepad-variant" color="#fff" />
        )}
        expanded={activeAccordion === 'howToPlay'}
        onPress={() => handlePress('howToPlay')}
        style={styles.accordion}>
        <List.Item title="1. Select your ring." titleStyle={styles.itemText} />
        <List.Item title="2. Place your bet." titleStyle={styles.itemText} />
        <List.Item
          title="3. Wait for the result."
          titleStyle={styles.itemText}
        />
        <List.Item
          title="4. Win and earn rewards!"
          titleStyle={styles.itemText}
        />
      </List.Accordion>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  accordion: {
    backgroundColor: '#FF8C00',
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  itemText: {
    color: 'orange',
    fontSize: 18,
    paddingVertical: 8,
  },
});

export default Accordion;
