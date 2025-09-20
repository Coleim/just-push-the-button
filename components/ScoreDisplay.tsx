import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

interface ScoreDisplayProps {
  score: number;
  successfulClicks: number;
  level: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, successfulClicks, level }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.scoreRow}>
        <Text style={styles.label}>{t('score_label')}</Text>
        <Text style={styles.value}>{score}</Text>
      </View>
      <View style={styles.scoreRow}>
        <Text style={styles.label}>{t('clicks_label')}</Text>
        <Text style={styles.value}>{successfulClicks}</Text>
      </View>
      <View style={styles.scoreRow}>
        <Text style={styles.label}>{t('level_label')}</Text>
        <Text style={styles.value}>{level}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
    padding: 12,
    borderRadius: 12,
    minWidth: 120,
    //backdropFilter: 'blur(10px)' as unknown as any,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    color: '#B2DFDB',
    fontWeight: '600',
  },
  value: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});
