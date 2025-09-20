import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';

interface GameButtonProps {
  isRed: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export const GameButton: React.FC<GameButtonProps> = ({ isRed, onPress, disabled = false }) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isRed ? styles.redButton : styles.greenButton,
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={styles.buttonInner}>
        <Text style={[styles.buttonText, isRed ? styles.redText : styles.greenText]}>
          {isRed ? t('danger_button') : t('push_button')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  greenButton: {
    backgroundColor: '#4CAF50',
  },
  redButton: {
    backgroundColor: '#F44336',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonInner: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  greenText: {
    color: '#FFFFFF',
  },
  redText: {
    color: '#FFFFFF',
  },
});
