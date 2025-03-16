import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Login = ({navigation}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const validateEmail = email => /\S+@\S+\.\S+/.test(email);
  const validatePhone = phone => /^[6-9]\d{9}$/.test(phone); // Validates 10-digit Indian numbers starting with 6-9

  const showModal = message => {
    setModalMessage(message);
    setModalVisible(true);
    setTimeout(() => setModalVisible(false), 1000); // Auto-close modal after 1 second
  };

  const handleLogin = () => {
    if (!identifier || !password) {
      showModal('All fields are required.');
      return;
    }
    if (!validateEmail(identifier) && !validatePhone(identifier)) {
      showModal('Enter a valid email or mobile number.');
      return;
    }
    if (password.length < 6) {
      showModal('Password must be at least 6 characters.');
      return;
    }
    showModal('Logged in successfully!');
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{name: 'TabNavigator'}],
      });
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          navigation.reset({index: 0, routes: [{name: 'TabNavigator'}]})
        }>
        <Icon name="arrow-left" size={30} color="orange" />
      </TouchableOpacity>

      <LottieView
        source={require('../assets/logo.json')}
        autoPlay
        loop
        style={styles.lottie}
      />

      <Text style={styles.title}>Welcome to Infinity Prime</Text>

      <TextInput
        style={styles.input}
        placeholder="Email or Mobile Number"
        placeholderTextColor="gray"
        value={identifier}
        onChangeText={setIdentifier}
        keyboardType="default"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="gray"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpLink}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{modalMessage}</Text>
        </View>
      </Modal>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  lottie: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  title: {
    color: 'orange',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  input: {
    width: '100%',
    backgroundColor: '#1f1f1f',
    color: 'white',
    borderRadius: 12,
    padding: 18,
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'orange',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: 'orange',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    elevation: 10,
    marginTop: 20,
  },
  loginText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  signUpLink: {
    color: 'cyan',
    fontSize: 18,
    marginTop: 30,
  },
  modalContainer: {
    marginTop: '50%',
    backgroundColor: '#1f1f1f',
    padding: 25,
    borderRadius: 12,
    borderColor: 'orange',
    borderWidth: 1,
    alignSelf: 'center',
  },
  modalText: {
    color: 'orange',
    fontSize: 20,
  },
});
