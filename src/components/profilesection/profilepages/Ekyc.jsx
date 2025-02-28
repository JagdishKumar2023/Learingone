import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

const Ekyc = () => {
  const [verificationStatus, setVerificationStatus] = useState({
    photo: null,
    aadhaar: null,
    bank: null,
  });
  const [uploadedImages, setUploadedImages] = useState({
    photo: null,
    aadhaar: null,
    bank: null,
  });
  const [isModalVisible, setModalVisible] = useState(false);

  const options = [
    {id: '1', name: 'Upload Photo', key: 'photo', required: true},
    {
      id: '2',
      name: 'Aadhaar Card / PAN Card / Driving License',
      key: 'aadhaar',
      required: true,
    },
    {id: '3', name: 'Bank Account (Required)', key: 'bank', required: true},
  ];

  const handleUpload = key => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const uri = response.assets?.[0]?.uri;
        if (uri) {
          setUploadedImages(prev => ({...prev, [key]: uri}));
          setVerificationStatus(prev => ({...prev, [key]: 'Verified'}));
        }
      }
    });
  };

  const validateUploads = () => {
    const {photo, aadhaar, bank} = verificationStatus;
    if (!photo || !aadhaar || !bank) {
      Alert.alert('Error', 'All required documents must be uploaded.');
    } else {
      setModalVisible(true); // Show confirmation popup
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'Verified':
        return '#4CAF50';
      case 'Pending':
        return '#FFC107';
      default:
        return '#666';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>eKYC Verification</Text>

      {options.map(option => (
        <TouchableOpacity
          key={option.id}
          style={styles.card}
          onPress={() => handleUpload(option.key)}>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>
              {option.name} {option.required && '*'}
            </Text>
            {uploadedImages[option.key] && (
              <Image
                source={{uri: uploadedImages[option.key]}}
                style={styles.uploadedImage}
              />
            )}
          </View>
          <Text
            style={[
              styles.statusText,
              {color: getStatusColor(verificationStatus[option.key])},
            ]}>
            {verificationStatus[option.key] || 'Upload'}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.submitButton} onPress={validateUploads}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      {/* Modal for Confirmation */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Submission Successful 🎉</Text>
            <Text style={styles.modalText}>
              Your documents have been uploaded and submitted for review.
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    width: '100%',
  },
  cardContent: {
    flex: 1,
  },
  cardText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  uploadedImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginTop: 10,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'right',
  },
  submitButton: {
    backgroundColor: '#FFA500',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#121212',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#1C1C1C',
    padding: 30,
    borderRadius: 20,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#FFA500',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#121212',
  },
});

export default Ekyc;
