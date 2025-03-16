import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const CommonButton = ({title, onPress, width = '100%'}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{width}}>
      <LinearGradient
        colors={['#FF9800', '#F57C00']} // Orange gradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.button}>
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CommonButton;
