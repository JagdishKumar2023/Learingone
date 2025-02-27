import React, {useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';

// Import images
import comment1 from '../../assets/comment1.png';
import comment2 from '../../assets/comment2.png';
import comment3 from '../../assets/comment3.png';
import comment4 from '../../assets/comment4.png';
import comment6 from '../../assets/comment6.png';
import comment7 from '../../assets/comment7.png';

const {width} = Dimensions.get('window');

const images = [comment1, comment2, comment3, comment4, comment6, comment7];

const Comment = () => {
  const carouselRef = useRef(null);

  const renderItem = ({item}) => (
    <View style={styles.slide}>
      <Image source={item} style={styles.image} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => alert('Button Clicked!')}>
        <Text style={styles.buttonText}>Click Me</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comments</Text>
      <Carousel
        ref={carouselRef}
        data={images}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={width * 0.85}
        loop
        autoplay
        autoplayInterval={3000}
        loopClonesPerSide={images.length} // Fix blinking issue
        useScrollView={true} // Smooth scrolling
        enableMomentum={false} // Prevents sudden jumps
        decelerationRate="fast" // Ensures smooth transitions
        removeClippedSubviews={false} // Fix Android rendering issue
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'contain', // Ensures proper scaling
  },
  button: {
    position: 'absolute',
    bottom: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Comment;
