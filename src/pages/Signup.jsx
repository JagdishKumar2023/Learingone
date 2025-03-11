import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const SignUpPage = ({navigation}) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let valid = true;
    let newErrors = {};

    if (!form.username) {
      newErrors.username = 'Username is required';
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email)) {
      newErrors.email = 'Valid email is required';
      valid = false;
    }

    if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignUp = () => {
    if (validate()) {
      console.log('Sign Up Successful:', form);
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        placeholder="Username"
        style={styles.input}
        value={form.username}
        onChangeText={text => setForm({...form, username: text})}
      />
      {errors.username && <Text style={styles.error}>{errors.username}</Text>}

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={form.email}
        onChangeText={text => setForm({...form, email: text})}
      />
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={form.password}
        onChangeText={text => setForm({...form, password: text})}
      />
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}

      <TextInput
        placeholder="Confirm Password"
        style={styles.input}
        secureTextEntry
        value={form.confirmPassword}
        onChangeText={text => setForm({...form, confirmPassword: text})}
      />
      {errors.confirmPassword && (
        <Text style={styles.error}>{errors.confirmPassword}</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const LoginPage = ({navigation}) => {
  const [form, setForm] = useState({email: '', password: ''});
  const [errors, setErrors] = useState({});

  const validate = () => {
    let valid = true;
    let newErrors = {};

    if (!form.email) {
      newErrors.email = 'Email is required';
      valid = false;
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = () => {
    if (validate()) {
      console.log('Login Successful:', form);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={form.email}
        onChangeText={text => setForm({...form, email: text})}
      />
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={form.password}
        onChangeText={text => setForm({...form, password: text})}
      />
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {borderBottomWidth: 1, marginBottom: 10, padding: 10},
  error: {color: 'red', fontSize: 12},
  button: {
    backgroundColor: '#16C47F',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {color: 'white', textAlign: 'center', fontWeight: 'bold'},
  link: {color: 'blue', textAlign: 'center', marginTop: 10},
});

export {SignUpPage, LoginPage};
