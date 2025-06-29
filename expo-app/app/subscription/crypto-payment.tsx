import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator, 
  Alert,
  Clipboard,
  Linking,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Copy, ExternalLink, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import QRCode from 'react-native-qrcode-svg';
import { useAuthStore } from '@/store/auth';
import { 
  getPaymentDetails, 
  verifyTransaction, 
  getExchangeRate, 
  calculateCryptoAmount 
} from '@/api/wallet';
import CountdownTimer from '@components/wallet/CountdownTimer';

const PAYMENT_EXPIRY_TIME = 30 * 60; // 30 minutes in seconds

export default function CryptoPaymentScreen() {
  const { plan } = useLocalSearchParams();
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [txHash, setTxHash] = useState('');
  const [timeLeft, setTimeLeft] = useState(PAYMENT_EXPIRY_TIME);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'verifying' | 'success' | 'failed'>('pending');
  
  // Get payment details (wallet address, amount, etc.)
  const { 
    data: paymentDetails, 
    isLoading: isLoadingPayment,
    error: paymentError,
    refetch: refetchPayment
  } = useQuery({
    queryKey: ['paymentDetails', plan, user?.id],
    queryFn: () => getPaymentDetails(user?.id, plan as string),
    enabled: !!user?.id && !!plan,
  });
  
  // Get current exchange rate
  const {
    data: exchangeRate,
    isLoading: isLoadingRate,
    refetch: refetchRate
  } = useQuery({
    queryKey: ['exchangeRate'],
    queryFn: () => getExchangeRate(),
    refetchInterval: 60000, // Refresh every minute
  });
  
  // Calculate crypto amount based on current exchange rate
  const cryptoAmount = exchangeRate && paymentDetails?.fiatAmount
    ? calculateCryptoAmount(
        paymentDetails.fiatAmount,
        exchangeRate.rate,
        paymentDetails.currency
      )
    : null;
  
  // Verify transaction mutation
  const verifyMutation = useMutation({
    mutationFn: () => verifyTransaction(
      user?.id,
      plan as string,
      paymentDetails?.walletAddress,
      txHash,
      paymentDetails?.currency
    ),
    onMutate: () => {
      setPaymentStatus('verifying');
    },
    onSuccess: (data) => {
      if (data.verified) {
        setPaymentStatus('success');
        // Auto-navigate after success
        setTimeout(() => {
          router.replace('/dashboard');
        }, 2000);
      } else {
        setPaymentStatus('failed');
        Alert.alert(
          t('payment.verification_failed'),
          data.message || t('payment.transaction_not_found'),
          [{ text: t('common.ok') }]
        );
      }
    },
    onError: () => {
      setPaymentStatus('failed');
      Alert.alert(
        t('payment.verification_error'),
        t('payment.try_again'),
        [{ text: t('common.ok') }]
      );
    }
  });
  
  // Handle verification
  const handleVerifyTransaction = () => {
    if (!txHash.trim()) {
      Alert.alert(
        t('payment.missing_hash'),
        t('payment.enter_tx_hash'),
        [{ text: t('common.ok') }]
      );
      return;
    }
    
    verifyMutation.mutate();
  };
  
  // Copy address to clipboard
  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    Alert.alert(
      t('payment.copied'),
      t('payment.address_copied'),
      [{ text: t('common.ok') }]
    );
  };
  
  // Open block explorer
  const openBlockExplorer = () => {
    if (!paymentDetails?.explorerUrl) return;
    
    Linking.openURL(paymentDetails.explorerUrl);
  };
  
  // Refresh rates and payment details
  const handleRefresh = () => {
    refetchRate();
    refetchPayment();
  };
  
  // Handle countdown expiration
  const handleCountdownFinished = () => {
    Alert.alert(
      t('payment.time_expired'),
      t('payment.refresh_or_cancel'),
      [
        {
          text: t('common.refresh'),
          onPress: handleRefresh
        },
        {
          text: t('common.cancel'),
          style: 'cancel',
          onPress: () => router.back()
        }
      ]
    );
  };
  
  if (isLoadingPayment || isLoadingRate) {
    return (
      <SafeAreaView className="flex-1 bg-background-primary">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-text-secondary mt-4">
            {t('payment.loading')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (paymentError || !paymentDetails) {
    return (
      <SafeAreaView className="flex-1 bg-background-primary">
        <View className="px-4 py-4 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#E5E5E5" />
          </TouchableOpacity>
          
          <Text className="text-text-primary font-semibold text-lg ml-4">
            {t('payment.error')}
          </Text>
        </View>
        
        <View className="flex-1 items-center justify-center p-4">
          <AlertTriangle size={48} color="#EF4444" />
          <Text className="text-status-error text-lg mt-4 mb-2 text-center">
            {t('payment.load_error')}
          </Text>
          <Text className="text-text-secondary text-center mb-6">
            {t('payment.try_again_later')}
          </Text>
          <TouchableOpacity
            className="bg-primary px-6 py-3 rounded-lg"
            onPress={handleRefresh}
          >
            <Text className="text-white font-medium">
              {t('common.retry')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-4 py-4 flex-row items-center border-b border-border-primary">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#E5E5E5" />
          </TouchableOpacity>
          
          <Text className="text-text-primary font-semibold text-lg ml-4">
            {t('payment.crypto_payment')}
          </Text>
          
          <TouchableOpacity 
            className="ml-auto"
            onPress={handleRefresh}
          >
            <RefreshCw size={20} color="#E5E5E5" />
          </TouchableOpacity>
        </View>
        
        <ScrollView className="flex-1 p-4">
          {/* Plan Info */}
          <View className="bg-background-secondary p-4 rounded-lg mb-6">
            <Text className="text-text-primary font-semibold text-lg mb-2">
              {t(`payment.plan_${plan}`)}
            </Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-text-secondary">
                {t('payment.amount')}:
              </Text>
              <Text className="text-text-primary font-medium">
                ${paymentDetails.fiatAmount.toFixed(2)} USD
              </Text>
            </View>
            <View className="flex-row items-center justify-between mt-1">
              <Text className="text-text-secondary">
                {t('payment.crypto_amount')}:
              </Text>
              <Text className="text-text-primary font-medium">
                {cryptoAmount?.toFixed(8)} {paymentDetails.currency}
              </Text>
            </View>
            <View className="flex-row items-center justify-between mt-1">
              <Text className="text-text-secondary">
                {t('payment.exchange_rate')}:
              </Text>
              <Text className="text-text-primary font-medium">
                1 {paymentDetails.currency} = ${exchangeRate?.rate.toFixed(2)} USD
              </Text>
            </View>
            
            {/* Countdown */}
            <View className="mt-4 pt-4 border-t border-border-primary">
              <Text className="text-text-secondary text-center mb-2">
                {t('payment.price_valid_for')}:
              </Text>
              <CountdownTimer 
                initialTime={timeLeft}
                onFinish={handleCountdownFinished}
                onTick={(seconds) => setTimeLeft(seconds)}
              />
            </View>
          </View>
          
          {/* Payment Instructions */}
          <Text className="text-text-primary font-semibold text-lg mb-3">
            {t('payment.instructions')}
          </Text>
          
          <View className="bg-background-secondary p-4 rounded-lg mb-6">
            <Text className="text-text-secondary mb-4">
              {t('payment.send_exactly')} <Text className="text-primary font-medium">{cryptoAmount?.toFixed(8)}</Text> {paymentDetails.currency} {t('payment.to_address')}:
            </Text>
            
            {/* QR Code */}
            <View className="items-center mb-4">
              <View className="bg-white p-4 rounded-md">
                <QRCode
                  value={paymentDetails.walletAddress}
                  size={180}
                  backgroundColor="white"
                  color="black"
                />
              </View>
            </View>
            
            {/* Wallet Address */}
            <View className="bg-background-tertiary rounded-md p-3 mb-4">
              <Text className="text-text-primary font-mono break-all">
                {paymentDetails.walletAddress}
              </Text>
              <View className="flex-row mt-2">
                <TouchableOpacity
                  className="bg-background-interactive mr-2 px-3 py-1.5 rounded flex-row items-center"
                  onPress={() => copyToClipboard(paymentDetails.walletAddress)}
                >
                  <Copy size={14} color="#E5E5E5" />
                  <Text className="text-text-secondary text-xs ml-1">
                    {t('payment.copy')}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="bg-background-interactive px-3 py-1.5 rounded flex-row items-center"
                  onPress={openBlockExplorer}
                >
                  <ExternalLink size={14} color="#E5E5E5" />
                  <Text className="text-text-secondary text-xs ml-1">
                    {t('payment.open_explorer')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <Text className="text-text-secondary mb-4">
              {t('payment.after_sending')}
            </Text>
            
            {/* Transaction Hash Input */}
            <Text className="text-text-secondary mb-2">
              {t('payment.transaction_id')}:
            </Text>
            <TextInput
              className="bg-background-interactive rounded-md px-4 py-3 text-text-primary border border-border-primary font-mono mb-4"
              placeholder={t('payment.enter_tx_hash')}
              placeholderTextColor="#9CA3AF"
              value={txHash}
              onChangeText={setTxHash}
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            {/* Verify Button */}
            <TouchableOpacity
              className={`bg-primary rounded-lg py-4 flex-row justify-center items-center ${
                verifyMutation.isPending ? 'opacity-70' : ''
              }`}
              onPress={handleVerifyTransaction}
              disabled={verifyMutation.isPending}
            >
              {verifyMutation.isPending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-white font-semibold">
                  {t('payment.verify_transaction')}
                </Text>
              )}
            </TouchableOpacity>
            
            {/* Payment Status */}
            {paymentStatus === 'success' && (
              <View className="mt-4 bg-status-success/20 p-4 rounded-lg flex-row items-center">
                <CheckCircle size={20} color="#10B981" />
                <Text className="ml-2 text-status-success">
                  {t('payment.payment_confirmed')}
                </Text>
              </View>
            )}
            
            {paymentStatus === 'failed' && (
              <View className="mt-4 bg-status-error/20 p-4 rounded-lg flex-row items-center">
                <AlertTriangle size={20} color="#EF4444" />
                <Text className="ml-2 text-status-error">
                  {t('payment.payment_failed')}
                </Text>
              </View>
            )}
          </View>
          
          {/* Support */}
          <View className="mb-6 p-4 bg-background-secondary rounded-lg">
            <Text className="text-text-primary font-medium mb-2">
              {t('payment.need_help')}
            </Text>
            <Text className="text-text-secondary">
              {t('payment.contact_support')}
            </Text>
            <TouchableOpacity
              className="mt-3 bg-background-interactive p-3 rounded"
              onPress={() => router.push('/support')}
            >
              <Text className="text-text-primary text-center">
                {t('payment.contact_support_button')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 