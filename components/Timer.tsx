import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface TimerProps {
  timeLeft: number;
  isGameOver: boolean;
}

export const Timer: React.FC<TimerProps> = ({ timeLeft, isGameOver }) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  const getTimerColor = (): string => {
    if (isGameOver) return '#F44336';
    if (timeLeft <= 3) return '#FF9800';
    if (timeLeft <= 6) return '#FFC107';
    return '#4CAF50';
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.timerText, { color: getTimerColor() }]}>
        {formatTime(timeLeft)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});
