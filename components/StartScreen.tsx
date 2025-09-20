import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { AVAILABLE_LANGUAGES } from '../locales/i18nConfig';
import { LanguageModal } from './LanguageModal';

interface StartScreenProps {
  onStartGame: () => void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  langFlagButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginRight: 24,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  langFlag: {
    fontSize: 22,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#E8F5E9',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
  },
  rulesCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    padding: 18,
    borderRadius: 16,
    marginBottom: 36,
    width: '100%',
  },
  rule: {
    fontSize: 15,
    color: '#E0F2F1',
    marginBottom: 8,
    textAlign: 'center',
  },
  startButton: {
    borderRadius: 32,
    overflow: 'hidden',
  },
  startButtonBg: {
    paddingHorizontal: 54,
    paddingVertical: 16,
    borderRadius: 32,
    elevation: 10,
    shadowColor: '#43A047',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 13,
    color: '#B2DFDB',
    textAlign: 'center',
    marginBottom: 20,
  },
  ruleHighlight: {
    fontWeight: '900',
    color: '#FFD700',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: {
    color: '#E0F2F1',
    fontSize: 12,
    fontWeight: '700',
  },
});
    interface StartScreenProps {
      onStartGame: () => void;
    }

export const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const [modalVisible, setModalVisible] = React.useState(false);
  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const FLAG_MAP: Record<string, string> = { en: '🇬🇧', fr: '🇫🇷', zh: '🇨🇳' };

  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setModalVisible(false);
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1500, useNativeDriver: false }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [glowAnim, pulseAnim]);

  const glowShadow = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(76,175,80,0.2)', 'rgba(76,175,80,0.8)'],
  });

  return (
    <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.container}>
      <View style={{ width: '100%' }}>
        <TouchableOpacity
          style={styles.langFlagButton}
          onPress={() => setModalVisible(true)}
          accessibilityLabel="Change language"
        >
          <Text style={styles.langFlag}>{FLAG_MAP[currentLang] || '🏳️'}</Text>
        </TouchableOpacity>
      </View>
      <LanguageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleChangeLanguage}
        currentLang={currentLang}
      />
      <View style={styles.content}>
            <Animated.Text
              style={[
                styles.title,
                {
                  textShadowColor: glowShadow as unknown as string,
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 14,
                },
              ]}
            >
              {t('start_title')}
            </Animated.Text>

            <Text style={styles.subtitle}>{t('start_subtitle')}</Text>
{/* 
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: 'rgba(76,175,80,0.15)', borderColor: '#4CAF50' }]}>
                <Text style={styles.badgeText}>{t('badge_reflex')}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: 'rgba(255,87,34,0.15)', borderColor: '#FF5722' }]}>
                <Text style={styles.badgeText}>{t('badge_arcade')}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: 'rgba(33,150,243,0.15)', borderColor: '#2196F3' }]}>
                <Text style={styles.badgeText}>{t('badge_fast')}</Text>
              </View>
            </View> */}


            <View style={styles.rulesCard}>
              <Text style={styles.rule}>🟢 <Text style={styles.ruleHighlight}>{t('rule_green_title')}</Text>{"\n"}{t('rule_green_desc')}</Text>
              <Text style={styles.rule}>🔴 <Text style={styles.ruleHighlight}>{t('rule_red_title')}</Text>{"\n"}{t('rule_red_desc')}</Text>
              <Text style={styles.rule}>⏰ <Text style={styles.ruleHighlight}>{t('rule_time_title')}</Text>{"\n"}{t('rule_time_desc')}</Text>
              <Text style={styles.rule}>🏆 <Text style={styles.ruleHighlight}>{t('rule_levels_title')}</Text>{"\n"}{t('rule_levels_desc')}</Text>
            </View>

            <Text style={styles.subtitle}>{t('start_cta')}</Text>

            <Animated.View style={{ transform: [{ scale: pulseAnim }], width: '100%' }}>
              <TouchableOpacity activeOpacity={0.9} style={styles.startButton} onPress={onStartGame}>
                <LinearGradient colors={["#66BB6A", "#43A047"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.startButtonBg}>
                  <Text style={styles.startButtonText}>{t('start_button')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

          </View>
        </LinearGradient>
      );
    };
