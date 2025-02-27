import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const SignUpModal = ({onClose}) => {
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
      console.log('Form data:', form);
      onClose();
    }
  };

  return (
    <View style={styles.modalContent}>
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
      <TouchableOpacity onPress={onClose}>
        <Text style={styles.close}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {padding: 20, backgroundColor: 'white', borderRadius: 15},
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 20},
  input: {borderBottomWidth: 1, marginBottom: 10, padding: 10},
  error: {color: 'red', fontSize: 12},
  button: {
    backgroundColor: '#16C47F',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {color: 'white', textAlign: 'center', fontWeight: 'bold'},
  close: {color: 'red', textAlign: 'center', marginTop: 10},
});

export default SignUpModal;
