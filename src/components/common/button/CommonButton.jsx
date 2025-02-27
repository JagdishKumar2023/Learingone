import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

const CommonButton = ({
  title,
  onPress,
  backgroundColor = '#f39c12',
  textColor = '#fff',
  width = '100%',
  height = 50,
  borderRadius = 8,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor,
          width,
          height,
          borderRadius,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      onPress={!disabled ? onPress : null}
      activeOpacity={0.7}>
      <Text style={[styles.buttonText, {color: textColor}]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CommonButton;
