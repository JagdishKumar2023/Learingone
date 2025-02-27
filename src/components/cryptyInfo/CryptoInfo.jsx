import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';

import cryptoInfo1 from '../../assets/cryptoinfo1.png';
import cryptoInfo2 from '../../assets/cryptoinfo2.png';
import cryptoInfo3 from '../../assets/cryptoinfo3.png';
import cryptoInfo4 from '../../assets/cryptoinfo4.png';

const {width} = Dimensions.get('window');
const images = [cryptoInfo1, cryptoInfo2, cryptoInfo3, cryptoInfo4];

const CryptoInfo = () => {
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current; // Start at 1 to prevent flicker
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % images.length;

      // Reset animation before starting new fade-in
      fadeAnim.setValue(0);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500, // Smooth fade transition
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex(nextIndex);
        flatListRef.current?.scrollToIndex({index: nextIndex, animated: true});
      });
    }, 3000); // Auto-slide every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleScroll = event => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Benefits of <Text style={styles.highlight}>Crypto Deposit</Text>
      </Text>

      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={({item}) => (
          <Animated.View style={[styles.slide, {opacity: fadeAnim}]}>
            <Image source={item} style={styles.image} />
          </Animated.View>
        )}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled
        onMomentumScrollEnd={handleScroll}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff',
  },
  highlight: {
    color: 'cyan',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width * 0.85,
    height: 400,
    resizeMode: 'contain',
    borderRadius: 12,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 30,
  },
});

export default CryptoInfo;
