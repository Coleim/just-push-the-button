import React, { useEffect, useState } from 'react';
import './i18n';
import { StatusBar } from 'expo-status-bar';
import SystemUI from 'expo-system-ui';
import * as NavigationBar from 'expo-navigation-bar';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameLogic } from './hooks/useGameLogic';
import { StartScreen } from './components/StartScreen';
import { GameButton } from './components/GameButton';
import { ProgressBar } from './components/ProgressBar';
import { Timer } from './components/Timer';
import { ScoreDisplay } from './components/ScoreDisplay';
import { GameOverModal } from './components/GameOverModal';
import { useTranslation } from 'react-i18next';
import { SoundManager } from './utils/SoundManager';
import { SoundProvider } from './utils/SoundProvider';
// Confetti supprimé

export default function App() {
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showFinishOverlay, setShowFinishOverlay] = useState(false);
  const [lastLevelSeen, setLastLevelSeen] = useState<number>(1);
  // Plus de confetti
  
  const {
    gameState,
    isPlaying,
    startGame,
    resetGame,
    handleButtonPress,
    getCurrentLevelConfig,
  } = useGameLogic();
  const { t } = useTranslation();

  const handleStartGame = () => {
    setShowStartScreen(false);
    startGame();
  };

  const handleGameOver = () => {
    setShowGameOverModal(true);
  };

  const handleRestart = () => {
    setShowGameOverModal(false);
    setShowStartScreen(false);
    resetGame();
    // relance immédiate du jeu avec timer du niveau 1
    setTimeout(() => {
      startGame();
    }, 0);
  };

  const handleCloseModal = () => {
    setShowGameOverModal(false);
    setShowStartScreen(true);
  };

  // Harmonize Android system bars (status + navigation) with app theme
  useEffect(() => {
    // Set a dark background to avoid blue bars on Android
    // SystemUI.setBackgroundColorAsync('#000000').catch(() => {});
    // NavigationBar.setBackgroundColorAsync('#000000').catch(() => {});
    // NavigationBar.setButtonStyleAsync('light').catch(() => {});
  }, []);

  // Affiche un écran "TERMINÉ" pendant ~2.5s avant d'ouvrir le score/share
  useEffect(() => {
    if (gameState.isGameOver || gameState.isGameWon) {
      // play final sting
      if (gameState.isGameWon) {
        SoundManager.playWin();
      } else if (gameState.isGameOver) {
        SoundManager.playGameOver();
      }
      setShowFinishOverlay(true);
      const timer = setTimeout(() => {
        setShowFinishOverlay(false);
        setShowGameOverModal(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [gameState.isGameOver, gameState.isGameWon]);

  useEffect(() => {
    if (gameState.currentLevel > lastLevelSeen && !gameState.isGameOver && !gameState.isGameWon) {
      setLastLevelSeen(gameState.currentLevel);
      SoundManager.playLevelUp();
    }
  }, [gameState.currentLevel, gameState.isGameOver, gameState.isGameWon, lastLevelSeen]);

  // Preload sounds at app start
  useEffect(() => {
    SoundManager.preload().catch(() => {});
  }, []);

  // Afficher l'écran de démarrage
  if (showStartScreen) {
    return (
      <SoundProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar style="auto" />
          <StartScreen onStartGame={handleStartGame} />
        </SafeAreaView>
      </SoundProvider>
    );
  }

  // Afficher le jeu
  // Choisir un background par niveau
  const levelBgMap: Record<number, [string, string] | [string, string, string]> = {
    1: ["#0f2027", "#203a43", "#2c5364"],
    2: ["#001510", "#004d40", "#00b894"],
    3: ["#1a2a6c", "#b21f1f", "#fdbb2d"],
    4: ["#2b5876", "#4e4376"],
    5: ["#000046", "#1cb5e0"],
    6: ["#232526", "#414345"],
    7: ["#42275a", "#734b6d"],
    8: ["#0f0c29", "#302b63", "#24243e"],
    9: ["#870000", "#190A05"],
    10: ["#141E30", "#243B55"],
  };
  const currentBg = levelBgMap[gameState.currentLevel] || levelBgMap[1];

  return (
    <SoundProvider>
      <LinearGradient colors={currentBg} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        
        <ScoreDisplay
          score={gameState.score}
          successfulClicks={gameState.successfulClicks}
          level={gameState.currentLevel}
        />
        
        <View style={styles.gameContainer}>
          <Timer timeLeft={gameState.timeLeft} isGameOver={gameState.isGameOver} />
          
          <ProgressBar
            progress={gameState.progress}
            requiredProgress={getCurrentLevelConfig().requiredProgress}
            level={gameState.currentLevel}
          />
          
          <View style={styles.buttonContainer}>
            <GameButton
              isRed={gameState.isButtonRed}
              onPress={handleButtonPress}
              disabled={gameState.isGameOver || gameState.isGameWon}
            />
          </View>
        </View>
        
        {showFinishOverlay && (
          <View style={styles.finishOverlay} pointerEvents="auto">
            <LinearGradient colors={["#000000dd", "#000000cc"]} style={styles.finishOverlayGradient}>
              <Text style={styles.finishText}>{t('finished')}</Text>
            </LinearGradient>
          </View>
        )}
        
        <GameOverModal
          visible={showGameOverModal}
          isGameWon={gameState.isGameWon}
          finalScore={gameState.score}
          levelReached={gameState.currentLevel}
          onRestart={handleRestart}
          onClose={handleCloseModal}
        />

          {/* Plus de confetti */}
        </SafeAreaView>
      </LinearGradient>
    </SoundProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    marginTop: 40,
  },
  finishOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishOverlayGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  }
});
