import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CountdownTimerProps {
  initialTime: number; // in seconds
  onFinish: () => void;
  onTick?: (secondsLeft: number) => void;
}

export default function CountdownTimer({
  initialTime,
  onFinish,
  onTick,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = Math.max(0, prevTime - 1);
        
        if (onTick) {
          onTick(newTime);
        }
        
        if (newTime === 0 && timerRef.current) {
          clearInterval(timerRef.current);
          onFinish();
        }
        
        return newTime;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [onFinish, onTick]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const progressPercentage = Math.max(0, (timeLeft / initialTime) * 100);
  
  // Determine color based on time left
  const getColor = () => {
    if (timeLeft < 60) return '#EF4444'; // Less than 1 minute: Red
    if (timeLeft < 300) return '#F59E0B'; // Less than 5 minutes: Amber
    return '#3B82F6'; // Default: Blue
  };
  
  return (
    <View className="w-full">
      <View className="flex-row justify-center mb-2">
        <Text 
          className="text-xl font-bold"
          style={{ color: getColor() }}
        >
          {formatTime(timeLeft)}
        </Text>
      </View>
      
      {/* Progress bar */}
      <View className="h-2 w-full bg-background-interactive rounded-full overflow-hidden">
        <View 
          className="h-full rounded-full" 
          style={{ 
            width: `${progressPercentage}%`,
            backgroundColor: getColor()
          }}
        />
      </View>
    </View>
  );
} 