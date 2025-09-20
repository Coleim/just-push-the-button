import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SocialShareButtons } from './SocialShareButtons';
import { useTranslation } from 'react-i18next';

interface GameOverModalProps {
  visible: boolean;
  isGameWon: boolean;
  finalScore: number;
  levelReached: number;
  onRestart: () => void;
  onClose: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  visible,
  isGameWon,
  finalScore,
  levelReached,
  onRestart,
  onClose,
}) => {
  const { t, i18n } = useTranslation();
  const randomFrom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  // Les phrases d'humiliation sont extraites dans les fichiers de locale
  const humiliationTiers = [
    'tier_0', 'tier_1', 'tier_2', 'tier_3', 'tier_4', 'tier_5', 'tier_6', 'tier_7', 'tier_8', 'tier_9',
    'tier_10', 'tier_11', 'tier_12', 'tier_13', 'tier_14', 'tier_15', 'tier_16', 'tier_17', 'tier_18', 'tier_19'
  ];
  const getHumiliationTier = (score: number): { label: string; phrase: string } => {
    const idx = Math.min(19, Math.floor(Math.max(0, score) / 50));
    const label = t(`gameover.tiers.${humiliationTiers[idx]}.label`);
    const phrases = t(`gameover.tiers.${humiliationTiers[idx]}.phrases`, { returnObjects: true }) as string[];
    return { label, phrase: randomFrom(phrases) };
  };
  const getVictoryMessage = () => {
    if (isGameWon) {
      return t('gameover.victory.win');
    }
    if (levelReached >= 8) {
      return t('gameover.victory.level8');
    }
    if (levelReached >= 5) {
      return t('gameover.victory.level5');
    }
    if (levelReached >= 3) {
      return t('gameover.victory.level3');
    }
    return t('gameover.victory.default');
  };

  const getSubtitle = () => {
    if (isGameWon) {
      return t('gameover.subtitle_win');
    }
    const { phrase } = getHumiliationTier(finalScore);
    return t('gameover.subtitle', { level: levelReached, phrase });
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <LinearGradient 
          colors={["#0f2027", "#203a43", "#2c5364"]} 
          style={styles.modal}
        >
          <Text style={styles.title}>
            {getVictoryMessage()}
          </Text>
          
          <Text style={styles.subtitle}>
            {getSubtitle()}
          </Text>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>{t('gameover.final_score')}</Text>
            <Text style={styles.scoreValue}>{finalScore.toLocaleString()}</Text>
            <Text style={styles.scoreSubtext}>
              {getHumiliationTier(finalScore).label}
            </Text>
          </View>
          
          <SocialShareButtons
            finalScore={finalScore}
            levelReached={levelReached}
            isGameWon={isGameWon}
          />
          
          <View style={styles.mainButtonContainer}>
            <TouchableOpacity style={styles.button} onPress={onRestart}>
              <LinearGradient colors={["#66BB6A", "#43A047"]} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>🚀 {t('gameover.replay')}</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>🏠 {t('gameover.menu')}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    minWidth: 320,
    maxWidth: '90%',
    borderWidth: 2,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 15,
    color: '#E8F5E9',
    textShadowColor: 'rgba(76, 175, 80, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    color: '#B2DFDB',
    lineHeight: 22,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 35,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 8,
    fontWeight: '700',
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFD700',
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  scoreSubtext: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  mainButtonContainer: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 25,
  },
  button: {
    borderRadius: 25,
    overflow: 'hidden',
    minWidth: 120,
  },
  buttonGradient: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
});
