import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import { useTranslation } from 'react-i18next';

interface SocialShareButtonsProps {
  finalScore: number;
  levelReached: number;
  isGameWon: boolean;
}

export const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  finalScore,
  levelReached,
  isGameWon,
}) => {
  const { t } = useTranslation();
  const generateShareText = () => {
    const gameStatus = isGameWon
      ? t('share_conquered')
      : t('share_reached_level', { level: levelReached });
    return t('share_message', { gameStatus, score: finalScore.toLocaleString() });
  };

  const shareToTwitter = async () => {
    const text = generateShareText();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Clipboard.setStringAsync(text);
        Alert.alert(t('copied_title'), t('copied_text'));
      }
    } catch (error) {
      console.error('Error sharing to Twitter:', error);
      Alert.alert(t('error_title'), t('error_twitter'));
    }
  };

  const shareToFacebook = async () => {
    const text = generateShareText();
    const url = `https://www.facebook.com/sharer/sharer.php?u=&quote=${encodeURIComponent(text)}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Clipboard.setStringAsync(text);
        Alert.alert(t('copied_title'), t('copied_text'));
      }
    } catch (error) {
      console.error('Error sharing to Facebook:', error);
      Alert.alert(t('error_title'), t('error_facebook'));
    }
  };

  const shareGeneric = async () => {
    const text = generateShareText();
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync('', {
          mimeType: 'text/plain',
          dialogTitle: t('share_dialog_title'),
          UTI: 'public.text',
        });
        await Clipboard.setStringAsync(text);
        Alert.alert(t('copied_title'), t('copied_text_long'));
      } else {
        await Clipboard.setStringAsync(text);
        Alert.alert(t('copied_title'), t('copied_text'));
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert(t('error_title'), t('error_share'));
    }
  };

  const copyToClipboard = async () => {
    const text = generateShareText();
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert(t('copied_title_clipboard'), t('copied_text_clipboard'));
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      Alert.alert(t('error_title'), t('error_copy'));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.shareTitle}>{t('share_title')}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.shareButton} onPress={shareToTwitter}>
          <LinearGradient colors={["#1DA1F2", "#0d8bd9"]} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>🐦 {t('twitter')}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={shareToFacebook}>
          <LinearGradient colors={["#4267B2", "#365899"]} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>📘 {t('facebook')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.shareButton} onPress={shareGeneric}>
          <LinearGradient colors={["#4CAF50", "#43A047"]} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>📤 {t('share')}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={copyToClipboard}>
          <LinearGradient colors={["#9E9E9E", "#757575"]} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>📋 {t('copy')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
  },
  shareTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    justifyContent: 'center',
  },
  shareButton: {
    borderRadius: 20,
    overflow: 'hidden',
    minWidth: 100,
  },
  buttonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
