import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = email => /\S+@\S+\.\S+/.test(email);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Invalid email format.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }
    Alert.alert('Success', 'Logged in successfully!');
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={30} color="orange" />
      </TouchableOpacity>

      {/* Logo Animation */}
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
      <View style={styles.inputSpacing} />
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
  },
  inputSpacing: {
    height: 20,
  },
  loginButton: {
    backgroundColor: 'orange',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    shadowColor: 'orange',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
    marginTop: 50,
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
});
