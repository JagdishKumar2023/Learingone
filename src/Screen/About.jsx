import React from 'react';
import {View, StyleSheet} from 'react-native';
import ProfileSection from '../components/profilesection/ProfileSection';
import ImageUpload from '../components/imageuploader/Imageupload';

const About = () => {
  return (
    <View style={styles.container}>
      <ImageUpload />
      <ProfileSection />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Black background
    padding: 10,
  },
  imageUploadContainer: {
    marginBottom: 40, // Adds a gap between ImageUpload and ProfileSection
  },
});

export default About;
