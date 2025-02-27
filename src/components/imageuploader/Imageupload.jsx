import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

const ImageUpload = () => {
  const [imageUri, setImageUri] = useState(null); // To store the selected image URI

  const selectImage = () => {
    launchImageLibrary({mediaType: 'photo', quality: 0.5}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setImageUri(response.assets[0].uri); // Store the URI of the selected image
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Profile</Text>

      {/* Profile Picture Section */}
      <TouchableOpacity onPress={selectImage} style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{uri: imageUri}} style={styles.profileImage} />
        ) : (
          <Text style={styles.placeholderText}>Select an image</Text> // A more descriptive text
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Ensures the content is vertically centered
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20, // Adds space below the title
    color: 'cyan',
  },
  imageContainer: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 50,
    padding: 5,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Light background for the image container
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 30, // Circular image
  },
  placeholderText: {
    color: '#aaa',
    fontSize: 14,
  },
});

export default ImageUpload;
