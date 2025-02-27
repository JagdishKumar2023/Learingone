import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import {AirbnbRating} from 'react-native-ratings';

const {width} = Dimensions.get('window');

const FeedBack = () => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [ratingKey, setRatingKey] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!rating) {
      setError('Please provide a rating.');
      return;
    }
    if (!feedback.trim()) {
      setError('Feedback cannot be empty.');
      return;
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setFeedback('');
    setRating(0);
    setRatingKey(prevKey => prevKey + 1);
    setError('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>User Feedback</Text>

        <Text style={styles.label}>Rate your experience:</Text>
        <AirbnbRating
          key={ratingKey}
          count={5}
          defaultRating={0}
          size={30}
          showRating={false}
          onFinishRating={setRating}
        />

        <Text style={styles.label}>Your Feedback:</Text>
        <TextInput
          style={styles.input}
          placeholder="Tell us about your experience..."
          placeholderTextColor="#888"
          value={feedback}
          onChangeText={setFeedback}
          multiline
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <Modal transparent visible={modalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Thank You!</Text>
              <Text style={styles.modalText}>We appreciate your feedback.</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleCloseModal}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default FeedBack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'orange',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'orange',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#16C47F',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: 'white',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'orange',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: 'orange',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    width: width * 0.8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: 'black',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
