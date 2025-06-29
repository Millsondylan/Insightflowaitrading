import React, { useState } from 'react';
import { View, Text, TextInput, Switch, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StrategyParameter } from '../../api/strategy';

interface StrategyParametersProps {
  parameters: StrategyParameter[];
  values: Record<string, any>;
  onChange: (paramName: string, value: any) => void;
}

export default function StrategyParameters({ parameters, values, onChange }: StrategyParametersProps) {
  if (!parameters || parameters.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No parameters available for this strategy</Text>
      </View>
    );
  }

  const renderParameter = (param: StrategyParameter) => {
    const currentValue = values[param.name] !== undefined ? values[param.name] : param.default;

    switch (param.type) {
      case 'number':
        return (
          <View style={styles.parameterContainer} key={param.id}>
            <Text style={styles.parameterLabel}>{param.name}</Text>
            <Text style={styles.parameterDescription}>{param.description}</Text>
            <View style={styles.numberInputContainer}>
              {param.min !== undefined && param.max !== undefined && (
                <View style={styles.sliderContainer}>
                  <Text style={styles.rangeText}>{param.min}</Text>
                  <View style={styles.sliderTrack}>
                    <View 
                      style={[
                        styles.sliderFill, 
                        { 
                          width: `${((currentValue - param.min) / (param.max - param.min)) * 100}%` 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.rangeText}>{param.max}</Text>
                </View>
              )}
              <TextInput
                style={styles.numberInput}
                value={String(currentValue)}
                onChangeText={(text) => {
                  const numValue = parseFloat(text);
                  if (!isNaN(numValue)) {
                    onChange(param.name, numValue);
                  }
                }}
                keyboardType="numeric"
              />
            </View>
          </View>
        );

      case 'boolean':
        return (
          <View style={styles.parameterContainer} key={param.id}>
            <View style={styles.booleanContainer}>
              <View>
                <Text style={styles.parameterLabel}>{param.name}</Text>
                <Text style={styles.parameterDescription}>{param.description}</Text>
              </View>
              <Switch
                value={Boolean(currentValue)}
                onValueChange={(value) => onChange(param.name, value)}
                trackColor={{ false: '#3f3f46', true: '#3b82f6' }}
                thumbColor={currentValue ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>
        );

      case 'select':
        return (
          <View style={styles.parameterContainer} key={param.id}>
            <Text style={styles.parameterLabel}>{param.name}</Text>
            <Text style={styles.parameterDescription}>{param.description}</Text>
            <View style={styles.selectContainer}>
              {param.options?.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.selectOption,
                    currentValue === option && styles.selectOptionActive
                  ]}
                  onPress={() => onChange(param.name, option)}
                >
                  <Text 
                    style={[
                      styles.selectOptionText,
                      currentValue === option && styles.selectOptionTextActive
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'string':
      default:
        return (
          <View style={styles.parameterContainer} key={param.id}>
            <Text style={styles.parameterLabel}>{param.name}</Text>
            <Text style={styles.parameterDescription}>{param.description}</Text>
            <TextInput
              style={styles.textInput}
              value={String(currentValue)}
              onChangeText={(text) => onChange(param.name, text)}
              placeholder="Enter value"
              placeholderTextColor="#6b7280"
            />
          </View>
        );
    }
  };

  return (
    <ScrollView style={styles.container}>
      {parameters.map(renderParameter)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  parameterContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  parameterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  parameterDescription: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#0f172a',
    borderRadius: 6,
    padding: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#334155',
  },
  numberInputContainer: {
    marginTop: 8,
  },
  numberInput: {
    backgroundColor: '#0f172a',
    borderRadius: 6,
    padding: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#334155',
    marginTop: 8,
  },
  booleanContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
  rangeText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  selectOption: {
    backgroundColor: '#0f172a',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  selectOptionActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  selectOptionText: {
    color: '#e2e8f0',
    fontSize: 14,
  },
  selectOptionTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
}); 