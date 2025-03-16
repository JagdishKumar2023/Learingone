import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

const Support = () => {
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const issueOptions = [
    'Deposit Issue',
    'Withdrawal Issue',
    'Game Issue',
    'Other',
  ];

  const handleUploadScreenshot = () => {
    launchImageLibrary(
      {mediaType: 'photo', maxWidth: 800, maxHeight: 800, quality: 0.5}, // Adjust quality to reduce size
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];

          if (asset.fileSize > 30 * 1024) {
            // 30KB limit
            setModalMessage('Image size must be less than 30KB.');
            setIsError(true);
            setModalVisible(true);
            return;
          }

          setScreenshot(asset.uri);
        }
      },
    );
  };

  const handleSubmit = () => {
    if (!issueType || !description || !screenshot) {
      setModalMessage(
        'Please fill in all required fields and upload a screenshot.',
      );
      setIsError(true);
      setModalVisible(true);
      return;
    }

    // Simulate submission (replace with actual API call)
    setTimeout(() => {
      setModalMessage('Your support ticket has been submitted.');
      setIsError(false);
      setModalVisible(true);

      // Reset all fields
      setIssueType('');
      setDescription('');
      setScreenshot(null);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>Support & Complaints</Text>

          <Text style={styles.label}>Select Issue Type</Text>
          <View style={styles.issueContainer}>
            {issueOptions.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.issueButton,
                  issueType === option && styles.issueButtonSelected,
                ]}
                onPress={() => setIssueType(option)}>
                <Text
                  style={[
                    styles.issueButtonText,
                    issueType === option && styles.issueButtonTextSelected,
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Describe the Issue</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter details here..."
            placeholderTextColor="#999"
            multiline
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>Upload Screenshot (Required)</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUploadScreenshot}>
            <Text style={styles.uploadButtonText}>Upload Screenshot</Text>
          </TouchableOpacity>

          {screenshot && (
            <Image source={{uri: screenshot}} style={styles.screenshotImage} />
          )}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Complaint</Text>
          </TouchableOpacity>

          {/* Custom Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View
                style={[
                  styles.modalContent,
                  isError ? styles.errorModal : styles.successModal,
                ]}>
                <Text style={styles.modalText}>{modalMessage}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 20,
    textAlign: 'left',
  },
  label: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 10,
  },
  issueContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
    justifyContent: 'center',
  },
  issueButton: {
    backgroundColor: '#1C1C1C',
    padding: 12,
    borderRadius: 10,
    minWidth: '40%',
    alignItems: 'center',
  },
  issueButtonSelected: {
    backgroundColor: '#FFA500',
  },
  issueButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  issueButtonTextSelected: {
    color: '#121212',
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: '#1C1C1C',
    color: '#FFF',
    padding: 15,
    borderRadius: 10,
    height: 120,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  uploadButton: {
    backgroundColor: '#FFA500',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#121212',
    fontSize: 18,
    fontWeight: 'bold',
  },
  screenshotImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#FFA500',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#121212',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  successModal: {
    backgroundColor: '#1C1C1C',
    borderColor: '#FFA500',
    borderWidth: 2,
  },
  errorModal: {
    backgroundColor: '#1C1C1C',
    borderColor: '#FF4444',
    borderWidth: 2,
  },
  modalText: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 10,
    width: '50%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#121212',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Support;
