import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Send, Sparkles, ChevronDown, ChevronUp, Trash, Save, Code, PlusCircle } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth';
import { generateStrategyFromPrompt, saveStrategy, createStrategy, getUserStrategies } from '@/api/strategy';
import StrategyParameters from '@components/strategy/StrategyParameters';

export default function StrategyBuilderScreen() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [prompt, setPrompt] = useState('');
  const [strategyName, setStrategyName] = useState('');
  const [strategyDescription, setStrategyDescription] = useState('');
  const [generatedStrategy, setGeneratedStrategy] = useState<any>(null);
  const [parameters, setParameters] = useState<any[]>([]);
  const [showParameters, setShowParameters] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [savedStrategy, setSavedStrategy] = useState<any>(null);
  const [parameterValues, setParameterValues] = useState<Record<string, any>>({});
  
  useEffect(() => {
    // Load user's strategies
    const loadStrategies = async () => {
      if (!user) return;
      
      try {
        const strategies = await getUserStrategies(user.id);
        // If there are strategies, set the first one as the current strategy
        if (strategies.length > 0) {
          setSavedStrategy(strategies[0]);
          setStrategyName(strategies[0].name);
          setStrategyDescription(strategies[0].description);
          setPrompt(strategies[0].code);
        }
      } catch (error) {
        console.error('Error loading strategies:', error);
      }
    };
    
    loadStrategies();
  }, [user]);
  
  // AI Strategy generation
  const generateMutation = useMutation({
    mutationFn: (promptText: string) => generateStrategyFromPrompt(promptText, user?.id),
    onSuccess: (data) => {
      setGeneratedStrategy(data.strategy);
      setParameters(data.parameters || []);
      setStrategyName(data.name || '');
      setStrategyDescription(data.description || '');
    },
  });
  
  // Save strategy to database
  const saveMutation = useMutation({
    mutationFn: (strategyData: any) => saveStrategy(strategyData, user?.id),
    onSuccess: (savedStrategy) => {
      Alert.alert(
        t('strategy.save_success_title'),
        t('strategy.save_success_message'),
        [
          { 
            text: t('common.view'), 
            onPress: () => router.push(`/strategy/${savedStrategy.id}`) 
          },
          { 
            text: t('common.close'), 
            style: 'cancel' 
          },
        ]
      );
    },
    onError: (error) => {
      Alert.alert(
        t('strategy.save_error_title'),
        t('strategy.save_error_message'),
        [{ text: t('common.ok') }]
      );
    }
  });
  
  const handlePromptSubmit = () => {
    if (!prompt.trim()) return;
    generateMutation.mutate(prompt);
  };
  
  const handleParameterChange = (paramName: string, value: any) => {
    setParameterValues(prev => ({
      ...prev,
      [paramName]: value
    }));
  };
  
  const handleSaveStrategy = async () => {
    if (!user) return;
    if (!strategyName || !prompt) return;
    
    try {
      setIsLoading(true);
      
      const strategy = await createStrategy(
        user.id,
        strategyName,
        strategyDescription,
        prompt
      );
      
      if (strategy) {
        setSavedStrategy(strategy);
        router.push('/');
      }
    } catch (error) {
      console.error('Error saving strategy:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>{t('strategy.builder_title')}</Text>
          
          <TouchableOpacity
            onPress={handleSaveStrategy}
            disabled={isLoading || !strategyName || !prompt}
            style={[
              styles.saveButton,
              (!strategyName || !prompt || isLoading) && styles.disabledButton
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Save size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <Text style={styles.label}>Strategy Name</Text>
            <TextInput
              style={styles.input}
              placeholder={t('strategy.name_placeholder')}
              placeholderTextColor="#666"
              value={strategyName}
              onChangeText={setStrategyName}
            />
            
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={t('strategy.description_placeholder')}
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
              value={strategyDescription}
              onChangeText={setStrategyDescription}
            />
          </View>
          
          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Strategy Code</Text>
              <TouchableOpacity style={styles.codeHelpButton}>
                <Code size={16} color="#3b82f6" />
                <Text style={styles.codeHelpText}>View Examples</Text>
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={[styles.input, styles.codeEditor]}
              placeholder={t('strategy.prompt_placeholder')}
              placeholderTextColor="#666"
              multiline
              numberOfLines={10}
              value={prompt}
              onChangeText={setPrompt}
            />
            
            <View style={styles.codeHints}>
              <Text style={styles.hintText}>
                Use Pine Script syntax for TradingView compatibility
              </Text>
              <Text style={styles.hintText}>
                Define entry and exit conditions clearly
              </Text>
              <Text style={styles.hintText}>
                Include risk management parameters
              </Text>
              <Text style={styles.hintText}>
                Add comments to explain your logic
              </Text>
            </View>
          </View>
          
          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Parameters</Text>
              <TouchableOpacity style={styles.addParameterButton}>
                <PlusCircle size={16} color="#3b82f6" />
                <Text style={styles.addParameterText}>Add Parameter</Text>
              </TouchableOpacity>
            </View>
            
            <StrategyParameters
              parameters={parameters}
              values={parameterValues}
              onChange={handleParameterChange}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    padding: 8,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#64748b',
    opacity: 0.6,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#e2e8f0',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  codeEditor: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    minHeight: 200,
    maxHeight: 400,
    textAlignVertical: 'top',
  },
  codeHelpButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeHelpText: {
    marginLeft: 4,
    color: '#3b82f6',
    fontSize: 14,
  },
  codeHints: {
    marginTop: 8,
  },
  hintText: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 4,
  },
  addParameterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addParameterText: {
    marginLeft: 4,
    color: '#3b82f6',
    fontSize: 14,
  },
}); 