import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Linking,
  Alert,
  Dimensions,
} from 'react-native';
// import Clipboard from '@react-native-clipboard/clipboard';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useRoute, useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const PaymentDetails = () => {
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, completed, failed
  const route = useRoute();
  const navigation = useNavigation();

  // Get payment details from navigation params
  const {upiId, amount, paymentMethod} = route.params || {
    upiId: '9993994409',
    amount: '1000',
    paymentMethod: 'upi',
  };

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopyUpiId = () => {
    Share.share({
      message: upiId,
      title: 'UPI ID'
    })
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch(error => {
        console.error('Failed to share UPI ID:', error);
        Alert.alert('Error', 'Failed to share UPI ID');
      });
  };

  const handleShareDetails = () => {
    Share.share({
      message: `UPI ID: ${upiId}\nAmount: ₹${amount}\n\nPlease make the payment using this UPI ID.`,
      title: 'UPI Payment Details',
    })
      .then(result => {
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            console.log('shared with activity type of', result.activityType);
          } else {
            console.log('shared');
          }
        } else if (result.action === Share.dismissedAction) {
          console.log('dismissed');
        }
      })
      .catch(error => Alert.alert('Error', error.message));
  };

  const handleOpenPaymentApp = appName => {
    let url = '';
    switch (appName) {
      case 'PhonePe':
        url = 'phonepe://';
        break;
      case 'Google Pay':
        url = 'tez://';
        break;
      case 'Paytm':
        url = 'paytm://';
        break;
      default:
        return;
    }

    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          // If app is not installed, try to open the app store
          if (appName === 'PhonePe') {
            return Linking.openURL('market://details?id=com.phonepe.app');
          } else if (appName === 'Google Pay') {
            return Linking.openURL(
              'market://details?id=com.google.android.apps.nbu.paisa.user',
            );
          } else if (appName === 'Paytm') {
            return Linking.openURL('market://details?id=net.one97.paytm');
          }
        }
      })
      .catch(err => console.error('Error opening app:', err));
  };

  const handlePaymentComplete = () => {
    setPaymentStatus('completed');
    // Here you would typically update your backend with the payment status
    // For now, we'll just show a success message
    Alert.alert(
      'Payment Successful',
      'Your payment has been processed successfully!',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('TabNavigator'), // Navigate to home or another appropriate screen
        },
      ],
    );
  };

  const handlePaymentFailed = () => {
    setPaymentStatus('failed');
    Alert.alert(
      'Payment Failed',
      'There was an issue with your payment. Please try again.',
      [
        {
          text: 'Try Again',
          onPress: () => setPaymentStatus('pending'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a', '#333333']}
      style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Payment Details</Text>
          </View>

          {/* Payment Status */}
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusIndicator,
                paymentStatus === 'pending' && styles.pendingStatus,
                paymentStatus === 'completed' && styles.completedStatus,
                paymentStatus === 'failed' && styles.failedStatus,
              ]}>
              <Text style={styles.statusText}>
                {paymentStatus === 'pending'
                  ? 'Payment Pending'
                  : paymentStatus === 'completed'
                  ? 'Payment Completed'
                  : 'Payment Failed'}
              </Text>
            </View>
          </View>

          {/* Payment Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Amount:</Text>
              <Text style={styles.infoValue}>₹{amount}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payment Method:</Text>
              <Text style={styles.infoValue}>
                {paymentMethod === 'phonepe'
                  ? 'PhonePe'
                  : paymentMethod === 'googlepay'
                  ? 'Google Pay'
                  : paymentMethod === 'paytm'
                  ? 'Paytm'
                  : 'UPI'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Transaction ID:</Text>
              <Text style={styles.infoValue}>
                TXN{Math.floor(Math.random() * 1000000)}
              </Text>
            </View>
          </View>

          {/* UPI ID Section */}
          <View style={styles.upiSection}>
            <Text style={styles.sectionTitle}>UPI ID</Text>
            <View style={styles.upiContainer}>
              <Text style={styles.upiId}>{upiId}</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={handleCopyUpiId}>
                {copied ? (
                  <Text style={styles.copySuccessText}>✓</Text>
                ) : (
                  <Text style={styles.copyButtonText}>Copy</Text>
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.upiNote}>
              This is the UPI ID to send your payment to
            </Text>
          </View>

          {/* QR Code Section */}
          <View style={styles.qrSection}>
            <Text style={styles.sectionTitle}>Scan QR Code</Text>
            <View style={styles.qrContainer}>
              <View style={styles.qrPlaceholder}>
                <MaterialCommunityIcons
                  name="qrcode"
                  size={120}
                  color="#FF8C00"
                />
                <Text style={styles.qrText}>QR Code</Text>
              </View>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={handleShareDetails}>
                <Text style={styles.downloadButtonText}>Share QR Code</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Payment Instructions */}
          <View style={styles.instructionsSection}>
            <Text style={styles.sectionTitle}>Payment Instructions</Text>
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsText}>
                1. Copy the UPI ID by tapping the "Copy" button
              </Text>
              <Text style={styles.instructionsText}>
                2. Open your preferred payment app (PhonePe, Google Pay, or
                Paytm)
              </Text>
              <Text style={styles.instructionsText}>
                3. Paste the UPI ID in the recipient field
              </Text>
              <Text style={styles.instructionsText}>
                4. Enter the amount: ₹{amount}
              </Text>
              <Text style={styles.instructionsText}>
                5. Complete the payment in your app
              </Text>
              <Text style={styles.instructionsText}>
                OR scan the QR code with any UPI app
              </Text>
            </View>
          </View>

          {/* Payment App Buttons */}
          <View style={styles.paymentAppSection}>
            <Text style={styles.sectionTitle}>Open Payment App</Text>
            <View style={styles.paymentAppButtons}>
              <TouchableOpacity
                style={[styles.paymentAppButton, {backgroundColor: '#5f259f'}]}
                onPress={() => handleOpenPaymentApp('PhonePe')}>
                <Text style={styles.paymentAppButtonText}>Open PhonePe</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.paymentAppButton, {backgroundColor: '#4285F4'}]}
                onPress={() => handleOpenPaymentApp('Google Pay')}>
                <Text style={styles.paymentAppButtonText}>Open Google Pay</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.paymentAppButton, {backgroundColor: '#00BAF2'}]}
                onPress={() => handleOpenPaymentApp('Paytm')}>
                <Text style={styles.paymentAppButtonText}>Open Paytm</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Disclaimer */}
          <View style={styles.disclaimerContainer}>
            <Text style={styles.disclaimerText}>
              ⚠️ Important: Please ensure you're sending the payment to the
              correct UPI ID. If you send payment to any other number, we will
              not be responsible for the transaction.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.completeButton]}
              onPress={handlePaymentComplete}>
              <Text style={styles.actionButtonText}>I've Made the Payment</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={handlePaymentFailed}>
              <Text style={styles.actionButtonText}>Payment Failed</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 30,
    color: '#FFF',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 15,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusIndicator: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  pendingStatus: {
    backgroundColor: 'rgba(255, 140, 0, 0.3)',
    borderWidth: 1,
    borderColor: '#FF8C00',
  },
  completedStatus: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  failedStatus: {
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoLabel: {
    color: '#FFF',
    fontSize: 16,
  },
  infoValue: {
    color: '#FF8C00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 15,
    fontWeight: '600',
  },
  upiSection: {
    marginBottom: 25,
  },
  upiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  upiId: {
    color: '#FF8C00',
    fontSize: 22,
    fontWeight: 'bold',
  },
  copyButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 140, 0, 0.2)',
    borderRadius: 8,
  },
  copyButtonText: {
    color: '#FF8C00',
    fontSize: 14,
    fontWeight: 'bold',
  },
  copySuccessText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  upiNote: {
    color: '#FFF',
    fontSize: 14,
    fontStyle: 'italic',
  },
  qrSection: {
    marginBottom: 25,
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#FF8C00',
  },
  qrText: {
    color: '#FF8C00',
    fontSize: 18,
    marginTop: 10,
  },
  downloadButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  downloadButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionsSection: {
    marginBottom: 25,
  },
  instructionsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
  },
  instructionsText: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 5,
    lineHeight: 20,
  },
  paymentAppSection: {
    marginBottom: 25,
  },
  paymentAppButtons: {
    width: '100%',
  },
  paymentAppButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  paymentAppButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimerContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.3)',
  },
  disclaimerText: {
    color: '#FFF',
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentDetails;
