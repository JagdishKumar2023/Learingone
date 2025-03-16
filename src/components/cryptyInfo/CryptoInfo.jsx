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
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      setCurrentIndex(nextIndex); // Move index before animation

      fadeAnim.setValue(0.5);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700, // Smoother fade-in effect
        useNativeDriver: true,
      }).start();

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, fadeAnim]);

  const handleScroll = event => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <Text style={styles.highlight}>Benefits of Crypto Deposit</Text>
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
        onMomentumScrollEnd={handleScroll}
        scrollEnabled
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
    marginTop: 40,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff',
  },
  highlight: {
    color: 'orange',
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
    bottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#888',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: 'orange',
    width: 12,
    height: 12,
  },
});

export default CryptoInfo;
