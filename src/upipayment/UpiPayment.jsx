import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking,
  Share,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useRoute, useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');
const depositAmounts = [250, 500, 1000, 10000];
const withdrawAmounts = [500, 1000, 2000, 5000];
const MIN_DEPOSIT_AMOUNT = 250;
const WHATSAPP_NUMBER = '919993994409'; // Replace with your actual WhatsApp number

const UpiCryptoDeposit = () => {
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showManualPayment, setShowManualPayment] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [showMobileNumber, setShowMobileNumber] = useState(false);
  const [copied, setCopied] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const route = useRoute();
  const navigation = useNavigation();
  const isDeposit = route.name === 'Deposit';
  const amounts = isDeposit ? depositAmounts : withdrawAmounts;
  const upiMobileNumber = '9993994409';

  const handleAmountSelect = amount => {
    if (selectedAmount === amount) {
      setMultiplier(prevMultiplier => prevMultiplier + 1);
      setCustomAmount((amount * (multiplier + 1)).toString());
    } else {
      setMultiplier(1);
      setSelectedAmount(amount);
      setCustomAmount(amount.toString());
    }
  };

  const handlePaymentSelect = method => {
    setSelectedPayment(method);

    if (method === 'upi') {
      setShowManualPayment(true);
    }
  };

  const handleProceedToPay = () => {
    if (parseInt(customAmount) < MIN_DEPOSIT_AMOUNT) {
      Alert.alert(
        'Minimum Amount Required',
        `The minimum deposit amount is ₹${MIN_DEPOSIT_AMOUNT}.`,
        [{text: 'OK'}],
      );
      return;
    }

    if (
      selectedPayment === 'phonepe' ||
      selectedPayment === 'googlepay' ||
      selectedPayment === 'paytm'
    ) {
      // Navigate to payment details page instead of showing modal
      navigation.navigate('PaymentDetails', {
        upiId: upiMobileNumber,
        amount: customAmount,
        paymentMethod: selectedPayment,
      });
    } else {
      // Handle other payment methods
      navigation.goBack();
    }
  };

  const handleCopyMobileNumber = () => {
    Share.share({
      message: upiMobileNumber,
      title: 'UPI ID',
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

  const handleCopyAndOpenApp = appName => {
    Share.share({
      message: upiMobileNumber,
      title: 'UPI ID',
    });
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);

    // Open the respective payment app
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

  const handlePayNow = () => {
    // Navigate to payment details page instead of showing modal
    navigation.navigate('PaymentDetails', {
      upiId: upiMobileNumber,
      amount: customAmount,
      paymentMethod: selectedPayment,
    });
  };

  const handleShareQRCode = () => {
    Share.share({
      message: `UPI ID: ${upiMobileNumber}\nAmount: ₹${customAmount}\n\nScan this QR code or use the UPI ID to make payment.`,
      title: 'UPI Payment QR Code',
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

  const handleWhatsAppInquiry = () => {
    const message = `Hello, I made a payment of ₹${customAmount} but it hasn't been credited to my wallet. Transaction ID: ${Date.now()}. Please help.`;
    const whatsappUrl = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(
      message,
    )}`;

    Linking.canOpenURL(whatsappUrl)
      .then(supported => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          Alert.alert(
            'WhatsApp Not Available',
            'Please install WhatsApp to contact support.',
            [{text: 'OK'}],
          );
        }
      })
      .catch(err => console.error('Error opening WhatsApp:', err));
  };

  const handlePaymentDone = () => {
    Alert.alert(
      'Payment Confirmation',
      'Please send your transaction screenshot on WhatsApp for verification. Your payment will be processed after verification.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Send Screenshot',
          onPress: () => {
            const message = `Hello, I have completed the payment of ₹${customAmount}. Transaction ID: ${Date.now()}. Please find my transaction screenshot attached.`;
            const whatsappUrl = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(
              message,
            )}`;

            Linking.canOpenURL(whatsappUrl)
              .then(supported => {
                if (supported) {
                  return Linking.openURL(whatsappUrl);
                } else {
                  Alert.alert(
                    'WhatsApp Not Available',
                    'Please install WhatsApp to send your transaction screenshot.',
                    [{text: 'OK'}],
                  );
                }
              })
              .catch(err => console.error('Error opening WhatsApp:', err));
          },
        },
      ],
    );
  };

  const paymentMethods = [
    {id: 'phonepe', name: 'PhonePe', color: '#5f259f', logo: 'P'},
    {id: 'googlepay', name: 'Google Pay', color: '#4285F4', logo: 'G'},
    {id: 'paytm', name: 'Paytm', color: '#00BAF2', logo: 'P'},
  ];

  const renderManualPaymentModal = () => (
    <Modal
      visible={showManualPayment}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowManualPayment(false)}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowManualPayment(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Manual Payment</Text>
              <TouchableOpacity
                onPress={() => setShowManualPayment(false)}
                style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>Enter your mobile number</Text>
            <TextInput
              style={styles.mobileInput}
              placeholder="Mobile Number"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              maxLength={10}
            />

            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => {
                setShowManualPayment(false);
                setShowQRCode(true);
              }}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );

  const renderQRCodeModal = () => (
    <Modal
      visible={showQRCode}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowQRCode(false)}>
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowQRCode(false)}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Scan QR Code</Text>
            <TouchableOpacity
              onPress={() => setShowQRCode(false)}
              style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.qrContainer}>
            <View style={styles.qrPlaceholder}>
              <MaterialCommunityIcons
                name="qrcode"
                size={120}
                color="#FF8C00"
              />
            </View>
            <Text style={styles.qrText}>
              Scan this QR code with your UPI app to complete the payment
            </Text>
          </View>

          <View style={styles.paymentDetails}>
            <Text style={styles.paymentLabel}>Amount:</Text>
            <Text style={styles.paymentValue}>₹{customAmount}</Text>
          </View>

          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => {
              setShowQRCode(false);
              handlePaymentDone();
            }}>
            <Text style={styles.doneButtonText}>Payment Done</Text>
          </TouchableOpacity>
        </View>
    </TouchableOpacity>
    </Modal>
  );

  const renderMobileNumberModal = () => (
    <Modal
      visible={showMobileNumber}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowMobileNumber(false)}>
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowMobileNumber(false)}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>UPI Payment Details</Text>
            <TouchableOpacity
              onPress={() => setShowMobileNumber(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mobileNumberContainer}>
            <Text style={styles.mobileNumberLabel}>UPI ID:</Text>
            <View style={styles.mobileNumberRow}>
              <Text style={styles.mobileNumberText}>{upiMobileNumber}</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={handleCopyMobileNumber}>
                {copied ? (
                  <Text style={styles.copySuccessText}>✓</Text>
                ) : (
                  <Text style={styles.copyButtonText}>Copy</Text>
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.upiNoteText}>
              This is the UPI ID to send your payment to
            </Text>
          </View>

          <View style={styles.paymentDetails}>
            <Text style={styles.paymentLabel}>Amount:</Text>
            <Text style={styles.paymentValue}>₹{customAmount}</Text>
          </View>



          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Payment Instructions:</Text>
            <Text style={styles.instructionsText}>
              1. Copy the UPI ID by tapping the "Copy" button
            </Text>
            <Text style={styles.instructionsText}>
              2. Open your preferred payment app (PhonePe, Google Pay, or Paytm)
            </Text>
            <Text style={styles.instructionsText}>
              3. Paste the UPI ID in the recipient field
            </Text>
            <Text style={styles.instructionsText}>
              4. Enter the amount: ₹{customAmount}
            </Text>
            <Text style={styles.instructionsText}>
              5. Complete the payment in your app
            </Text>
            <Text style={styles.instructionsText}>
              OR scan the QR code with any UPI app
            </Text>
            <Text style={styles.instructionsText}>
              6. After successful payment, click "I've Made the Payment"
            </Text>
            <Text style={styles.instructionsText}>
              7. You will be prompted to send your transaction screenshot via
              WhatsApp
            </Text>
            <Text style={styles.instructionsText}>
              8. Send the screenshot to verify your payment
            </Text>
            <Text style={styles.instructionsText}>
              9. For any payment issues or inquiries, use the "Payment Not
              Credited? Contact on WhatsApp" button below
            </Text>
            <Text style={styles.instructionsText}>
              10. Our team will verify your payment and credit it to your wallet
              within 1-24 hours
            </Text>
            <Text style={styles.instructionsText}>
              11. If payment is successful but not credited to your account:
            </Text>
            <Text style={styles.instructionsText}>
              - Take a screenshot of your successful payment transaction
            </Text>
            <Text style={styles.instructionsText}>
              - Click the WhatsApp button below to send the screenshot
            </Text>
            <Text style={styles.instructionsText}>
              - Include your transaction ID and amount in the message
            </Text>
            <Text style={styles.instructionsText}>
              12. Don't worry - your amount is safe! Our team will verify and
              credit it to your account
            </Text>
          </View>

          <View style={styles.disclaimerContainer}>
            <Text style={styles.disclaimerText}>
              ⚠️ Important: Please ensure you're sending the payment to the
              correct UPI ID. If you send payment to any other number, we will
              not be responsible for the transaction.
            </Text>
          </View>

          <View style={styles.paymentAppButtons}>
            <TouchableOpacity
              style={[styles.paymentAppButton, {backgroundColor: '#5f259f'}]}
              onPress={() => handleCopyAndOpenApp('PhonePe')}>
              <Text style={styles.paymentAppButtonText}>Open PhonePe</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.paymentAppButton, {backgroundColor: '#4285F4'}]}
              onPress={() => handleCopyAndOpenApp('Google Pay')}>
              <Text style={styles.paymentAppButtonText}>Open Google Pay</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.paymentAppButton, {backgroundColor: '#00BAF2'}]}
              onPress={() => handleCopyAndOpenApp('Paytm')}>
              <Text style={styles.paymentAppButtonText}>Open Paytm</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.payButton}
            onPress={() => {
              setShowMobileNumber(false);
              handlePaymentDone();
            }}>
            <Text style={styles.payButtonText}>I've Made the Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.whatsappButton}
            onPress={handleWhatsAppInquiry}>
            <Text style={styles.whatsappButtonText}>
              Payment Not Credited? Contact on WhatsApp
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

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
            <Text style={styles.header}>
              {isDeposit ? 'Deposit' : 'Withdraw'} Funds
            </Text>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>{isDeposit ? '↓' : '↑'}</Text>
            <Text style={styles.infoText}>
              {isDeposit ? 'Minimum Deposit: ₹250' : 'Minimum Withdrawal: ₹500'}
            </Text>
          </View>

          {/* Amount Selection */}
          <Text style={styles.sectionTitle}>Select Amount</Text>
          <View style={styles.amountGrid}>
            {amounts.map(item => (
              <TouchableOpacity
                key={item.toString()}
                style={[
                  styles.amountButton,
                  selectedAmount === item && styles.selectedAmount,
                ]}
                onPress={() => handleAmountSelect(item)}>
                <Text
                  style={[
                    styles.amountText,
                    selectedAmount === item && styles.selectedAmountText,
                  ]}>
                  ₹{item}
                  {selectedAmount === item && multiplier > 1
                    ? ` × ${multiplier}`
                    : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Amount */}
          <Text style={styles.sectionTitle}>Or Enter Custom Amount</Text>
          <View style={styles.customAmountContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter amount"
              placeholderTextColor="#666"
              value={customAmount}
              onChangeText={text => {
                setCustomAmount(text);
                setSelectedAmount(null);
              }}
            />
          </View>

          {/* Payment Methods */}
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          <View style={styles.paymentMethodsContainer}>
            {paymentMethods.map(method => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethod,
                  selectedPayment === method.id && styles.selectedPayment,
                  {borderColor: method.color},
                ]}
                onPress={() => handlePaymentSelect(method.id)}>
                <View
                  style={[styles.paymentLogo, {backgroundColor: method.color}]}>
                  <Text style={styles.paymentLogoText}>{method.logo}</Text>
                </View>
                <Text style={[styles.paymentMethodText, {color: method.color}]}>
                  {method.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Payment Instructions */}
          {customAmount && selectedPayment && (
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>
                Payment Instructions:
              </Text>
              <Text style={styles.instructionsText}>
                1. Click "Proceed to Pay" to continue
              </Text>
              <Text style={styles.instructionsText}>
                2. Copy the UPI ID or scan the QR code
              </Text>
              <Text style={styles.instructionsText}>
                3. Complete the payment in your app
              </Text>
              <Text style={styles.instructionsText}>
                4. After successful payment, click "I've Made the Payment"
              </Text>
              <Text style={styles.instructionsText}>
                5. You will be prompted to send your transaction screenshot via
                WhatsApp
              </Text>
              <Text style={styles.instructionsText}>
                6. Send the screenshot to verify your payment
              </Text>
              <Text style={styles.instructionsText}>
                7. For any payment issues or inquiries, use the "Payment Not
                Credited? Contact on WhatsApp" button
              </Text>
              <Text style={styles.instructionsText}>
                8. Our team will verify your payment and credit it to your
                wallet within 1-24 hours
              </Text>
              <Text style={styles.instructionsText}>
                9. If payment is successful but not credited to your account:
              </Text>
              <Text style={styles.instructionsText}>
                - Take a screenshot of your successful payment transaction
              </Text>
              <Text style={styles.instructionsText}>
                - Click the WhatsApp button to send the screenshot
              </Text>
              <Text style={styles.instructionsText}>
                - Include your transaction ID and amount in the message
              </Text>
              <Text style={styles.instructionsText}>
                10. Don't worry - your amount is safe! Our team will verify and
                credit it to your account
              </Text>
            </View>
          )}

          {/* Pay Now Button - Always visible when amount is entered */}
          {customAmount && (
            <TouchableOpacity
              style={[
                styles.directPayButton,
                parseInt(customAmount) < MIN_DEPOSIT_AMOUNT &&
                  styles.disabledButton,
              ]}
              disabled={parseInt(customAmount) < MIN_DEPOSIT_AMOUNT}
              onPress={handlePayNow}>
              <Text style={styles.directPayButtonText}>Pay Now</Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={24}
                color="#FF8C00"
                style={styles.actionButtonIcon}
              />
            </TouchableOpacity>
          )}

          {parseInt(customAmount) < MIN_DEPOSIT_AMOUNT && customAmount && (
            <Text style={styles.minAmountWarning}>
              Minimum deposit amount is ₹{MIN_DEPOSIT_AMOUNT}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Modals */}
      {renderManualPaymentModal()}
      {renderQRCodeModal()}
      {renderMobileNumberModal()}
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
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 15,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  infoText: {
    color: '#FFF',
    fontSize: 16,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 15,
    fontWeight: '600',
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  amountButton: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 15,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedAmount: {
    borderColor: '#FF8C00',
    backgroundColor: 'rgba(255, 140, 0, 0.2)',
  },
  amountText: {
    fontSize: 22,
    color: '#FFF',
    fontWeight: '600',
  },
  selectedAmountText: {
    color: '#FF8C00',
  },
  customAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 25,
    paddingHorizontal: 15,
  },
  currencySymbol: {
    fontSize: 24,
    color: '#FF8C00',
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 24,
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
  paymentMethodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  paymentMethod: {
    width: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedPayment: {
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  paymentLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentLogoText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#666',
    opacity: 0.7,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButtonIcon: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  closeButton: {
    padding: 5,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  mobileInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    color: '#FFF',
    fontSize: 18,
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  paymentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 20,
  },
  paymentLabel: {
    color: '#FFF',
    fontSize: 16,
  },
  paymentValue: {
    color: '#FF8C00',
    fontSize: 18,
    fontWeight: 'bold',
  },
  doneButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  directPayButton: {
    flexDirection: 'row',
    backgroundColor: '#FF8C00',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  directPayButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  mobileNumberContainer: {
    width: '100%',
    marginBottom: 20,
  },
  mobileNumberLabel: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 10,
  },
  mobileNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
  },
  mobileNumberText: {
    color: '#FF8C00',
    fontSize: 22,
    fontWeight: 'bold',
  },
  copyButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 140, 0, 0.2)',
    borderRadius: 8,
  },
  instructionsContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  instructionsTitle: {
    color: '#FF8C00',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructionsText: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 5,
    lineHeight: 20,
  },
  disclaimerContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.3)',
  },
  disclaimerText: {
    color: '#FFF',
    fontSize: 14,
    lineHeight: 20,
  },
  payButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  payButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  upiNoteText: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 10,
    fontStyle: 'italic',
  },
  backButtonText: {
    fontSize: 30,
    color: '#FFF',
  },
  infoIcon: {
    fontSize: 40,
    color: '#4CAF50',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#FFF',
  },
  copyButtonText: {
    color: '#FF8C00',
    fontSize: 14,
    fontWeight: 'bold',
  },
  paymentAppButtons: {
    width: '100%',
    marginBottom: 20,
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
  copySuccessText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  qrCodeContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
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
  whatsappButton: {
    backgroundColor: '#25D366',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  whatsappButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  minAmountWarning: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});

export default UpiCryptoDeposit;
