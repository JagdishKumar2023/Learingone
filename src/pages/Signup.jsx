import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useRegisterUser} from '../apiforgame/useBackendApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUp = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {mutate: registerUser, isLoading} = useRegisterUser();

  const validateEmail = email => /\S+@\S+\.\S+/.test(email);
  const validateMobile = mobile => /^[0-9]{10}$/.test(mobile);

  const showModal = message => {
    setModalMessage(message);
    setModalVisible(true);
    setTimeout(() => setModalVisible(false), 2000);
  };

  // const registerUser = async userData => {
  //   try {
  //     const data = mutate(userData);
  //     console.log('User registered successfully:', data); // Log the response
  //     return data;
  //   } catch (error) {
  //     console.error('Registration failed:', error);
  //     throw error; // Propagate error
  //   }
  // };

  const handleSignUp = () => {
    if (!username || !email || !mobile || !password) {
      showModal('All fields are required.');
      return;
    }
    if (!validateEmail(email)) {
      showModal('Invalid email format.');
      return;
    }
    if (!validateMobile(mobile)) {
      showModal('Invalid mobile number.');
      return;
    }
    if (password.length < 6) {
      showModal('Password must be at least 6 characters.');
      return;
    }
    // if (password !== confirmPassword) {
    //   showModal('Passwords do not match.');
    //   return;
    // }

    const userData = {fullName: username, email, phoneNumber: mobile, password};

    registerUser(userData, {
      onSuccess: async data => {
        showModal('Account created successfully!');
        await AsyncStorage.setItem('userData', data);
        console.log(data, 'data'); // Log data on success
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        }, 1000);
      },
      onError: err => {
        showModal('Registration failed. Please try again.');
        console.error(err); // Log error on failure
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="gray"
        value={username}
        onChangeText={setUsername}
      />
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
        placeholder="Mobile Number"
        placeholderTextColor="gray"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="gray"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color="orange"
          />
        </TouchableOpacity>
      </View>
      {/* <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          placeholderTextColor="gray"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Icon
            name={showConfirmPassword ? 'eye-off' : 'eye'}
            size={24}
            color="orange"
          />
        </TouchableOpacity>
      </View> */}

      <TouchableOpacity
        style={styles.signUpButton}
        onPress={handleSignUp}
        disabled={isLoading}>
        <Text style={styles.signUpText}>
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>Already have an account? SignIn</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{modalMessage}</Text>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  lottie: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  title: {
    color: 'orange',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    color: 'white',
    borderRadius: 10,
    padding: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'orange',
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'orange',
    marginBottom: 15,
    width: '100%',
  },
  passwordInput: {
    flex: 1,
    color: 'white',
    padding: 23,
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: 'orange',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    elevation: 8,
    marginTop: 20,
  },
  signUpText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    color: 'cyan',
    fontSize: 16,
    marginTop: 30,
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
