import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

import comment1 from '../../assets/comment1.png';
import comment2 from '../../assets/comment2.png';
import comment3 from '../../assets/comment3.png';
import comment4 from '../../assets/comment4.png';
import comment5 from '../../assets/comment5.png';
import comment6 from '../../assets/comment6.png';
import comment7 from '../../assets/comment7.png';

const reviews = [
  comment1,
  comment2,
  comment3,
  comment4,
  comment5,
  comment6,
  comment7,
];

const {width} = Dimensions.get('window');
const IMAGE_WIDTH = width * 0.9; // Image takes 90% of the screen width
const IMAGE_HEIGHT = IMAGE_WIDTH * 0.9; // Maintain aspect ratio
const IMAGE_GAP = 20;

const CustomerReview = () => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % reviews.length;

      flatListRef.current?.scrollToOffset({
        offset: nextIndex * (IMAGE_WIDTH + IMAGE_GAP),
        animated: true,
      });

      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>
        What Our <Text style={styles.subHeading}>Customers Say</Text>
      </Text>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={reviews}
          horizontal
          pagingEnabled
          scrollEnabled={false} // Disable manual scrolling
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{paddingHorizontal: IMAGE_GAP / 2}}
          renderItem={({item}) => (
            <View
              style={[styles.imageWrapper, {marginHorizontal: IMAGE_GAP / 2}]}>
              <Image source={item} style={styles.image} />
            </View>
          )}
        />
        <View style={styles.pagination}>
          {reviews.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentIndex ? '#FFD700' : '#D3D3D3',
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default CustomerReview;

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 20,
  },
  container: {
    height: IMAGE_HEIGHT + 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#1E1E1E',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  subHeading: {
    color: 'orange',
  },
  imageWrapper: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 20,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  image: {
    width: '100%',
    height: '110%',
    resizeMode: 'cover',
    borderRadius: 25,
    marginTop: 20,
  },
});
