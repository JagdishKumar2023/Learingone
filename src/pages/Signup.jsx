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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const validateEmail = email => /\S+@\S+\.\S+/.test(email);

  const showModal = message => {
    setModalMessage(message);
    setModalVisible(true);
    setTimeout(() => setModalVisible(false), 2000); // Auto-close modal after 2 seconds
  };

  const handleLogin = () => {
    if (!email || !password) {
      showModal('All fields are required.');
      return;
    }
    if (!validateEmail(email)) {
      showModal('Invalid email format.');
      return;
    }
    if (password.length < 6) {
      showModal('Password must be at least 6 characters.');
      return;
    }
    showModal('Logged in successfully!');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}>
        <Icon name="arrow-left" size={30} color="orange" />
      </TouchableOpacity>

      <LottieView
        source={require('../assets/logo.json')}
        autoPlay
        loop
        style={styles.lottie}
      />

      <Text style={styles.title}>Welcome Back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="gray"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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
    alignItems: 'center',
    backgroundColor: '#000',
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
    marginBottom: 20,
    marginTop: 80,
  },
  title: {
    color: 'orange',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    color: 'white',
    borderRadius: 10,
    padding: 25,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'orange',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: 'orange',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    elevation: 8,
    marginTop: 20,
  },
  loginText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpLink: {
    color: 'cyan',
    fontSize: 16,
    marginTop: 40,
  },
  modalContainer: {
    marginTop: '50%',
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 10,
    borderColor: 'orange',
    borderWidth: 1,
    alignSelf: 'center',
  },
  modalText: {
    color: 'orange',
    fontSize: 18,
  },
});
