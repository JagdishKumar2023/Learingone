import React from 'react';
import {View, Text, Modal, TouchableOpacity} from 'react-native';

const OrderModal = ({orderVisible, setOrderVisible, title, children}) => {
  return (
    <Modal
      visible={orderVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setOrderVisible(false)}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <View
          style={{
            width: '80%',
            padding: 20,
            backgroundColor: 'white',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: 'red',
          }}>
          {/* Header Section */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 15,
            }}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>{title}</Text>
            <TouchableOpacity onPress={() => setOrderVisible(false)}>
              <Text style={{fontSize: 20, fontWeight: 'bold', color: 'red'}}>
                X
              </Text>
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          {children}
        </View>
      </View>
    </Modal>
  );
};

export default OrderModal;
