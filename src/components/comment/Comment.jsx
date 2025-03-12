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
import comment1 from '../../assets/comment1.png';
import comment2 from '../../assets/comment2.png';
import comment3 from '../../assets/comment3.png';
import comment4 from '../../assets/comment4.png';
import comment5 from '../../assets/comment5.png';
import comment6 from '../../assets/comment6.png';
import comment7 from '../../assets/comment7.png';

const {width} = Dimensions.get('window');

const images = [
  comment1,
  comment2,
  comment3,
  comment4,
  comment5,
  comment6,
  comment7,
];

const Comment = () => {
  const carouselRef = useRef(null);

  const renderItem = ({item}) => (
    <View style={styles.slide}>
      <Image source={item} style={styles.image} />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Click Me</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comment</Text>
      <Carousel
        ref={carouselRef}
        data={images}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={width * 0.8}
        loop
        autoplay
        autoplayInterval={3000}
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  button: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'rgba(85, 34, 34, 0.5)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Comment;
