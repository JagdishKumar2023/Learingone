import React, {useRef, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CroptoSilder from '../croptosilder/CroptoSilder';
import CryptoHeader from '../components/cryptoheader/CryptoHeader';
import SilderOfCrypto from '../silderofCrypto/SilderOfCrypto';
import CryptoInfo from '../components/cryptyInfo/CryptoInfo';
import Footer from '../components/footer/Footer';

const {width} = Dimensions.get('window');

const cryptoIcons = [
  {name: 'Bitcoin', icon: 'bitcoin', color: '#F7931A'},
  {name: 'Ethereum', icon: 'ethereum', color: '#3C3C3D'},
  {name: 'Litecoin', icon: 'litecoin', color: '#A6A9AA'},
  {name: 'Dogecoin', icon: 'doge', color: '#C2A633'},
  {name: 'Ripple', icon: 'bitcoin', color: '#0085C0'}, // Placeholder
  {name: 'Cardano', icon: 'ethereum', color: '#3E7BF6'}, // Placeholder
  {name: 'Solana', icon: 'bitcoin', color: '#9945FF'}, // Placeholder
  {name: 'Polkadot', icon: 'ethereum', color: '#E6007A'}, // Placeholder
];

const Crypto = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  useEffect(() => {
    let scrollValue = 0;
    const scrollStep = 1; // Adjust for smoothness
    const intervalTime = 20; // Lower for smoother animation

    const scroller = setInterval(() => {
      scrollValue += scrollStep;
      flatListRef.current?.scrollToOffset({
        animated: false, // instant shift for smoother feel
        offset: scrollValue,
      });

      if (scrollValue >= width * cryptoIcons.length) {
        scrollValue = 0; // seamless reset
      }
    }, intervalTime);

    return () => clearInterval(scroller);
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <CryptoHeader />

      {/* Auto-scrolling Crypto Icons */}
      <FlatList
        ref={flatListRef}
        data={cryptoIcons.concat(cryptoIcons)} // Duplicate for infinite effect
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.iconRow}
        renderItem={({item}) => (
          <View style={styles.iconContainer}>
            <Icon name={item.icon} size={50} color={item.color} />
            <Text style={styles.iconText}>{item.name}</Text>
          </View>
        )}
        pagingEnabled={false}
        scrollEnabled={false}
      />

      <SilderOfCrypto />
      <CroptoSilder />
      <CryptoInfo />
      <Footer />
    </ScrollView>
  );
};

export default Crypto;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  iconRow: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  iconText: {
    color: 'white',
    marginTop: 5,
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1c1c1c',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
});
