import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SoundManager } from '../utils/SoundManager';

interface TimerProps {
  timeLeft: number;
  isGameOver: boolean;
}

export const Timer: React.FC<TimerProps> = ({ timeLeft, isGameOver }) => {
  const lastWholeSecondRef = useRef<number>(Number.POSITIVE_INFINITY);
  const dingPlayedRef = useRef<boolean>(false);

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

  // Play countdown ticks at 3,2,1 and a ding at 0
  useEffect(() => {
    if (isGameOver) return;
    const whole = Math.max(0, Math.floor(timeLeft));
    if (whole !== lastWholeSecondRef.current) {
      lastWholeSecondRef.current = whole;
      if (whole === 3 || whole === 2 || whole === 1) {
        SoundManager.playTick();
      } else if (whole === 0 && !dingPlayedRef.current) {
        dingPlayedRef.current = true;
        SoundManager.playDing();
      }
    }
  }, [timeLeft, isGameOver]);

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
