import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

const ImageUpload = () => {
  const [imageUri, setImageUri] = useState(null);

  const selectImage = () => {
    launchImageLibrary({mediaType: 'photo', quality: 0.5}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const selectedImage = response.assets[0];

        if (selectedImage.fileSize > 30720) {
          // 30KB limit
          Alert.alert(
            'File Size Exceeded',
            'Please select an image smaller than 30KB.',
          );
          return;
        }

        setImageUri(selectedImage.uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={selectImage} style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{uri: imageUri}} style={styles.profileImage} />
        ) : (
          <Text style={styles.placeholderText}>Select an image</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginTop: 60,
  },
  imageContainer: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 5,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 10,
  },
  placeholderText: {
    color: '#aaa',
    fontSize: 14,
  },
});

export default ImageUpload;
