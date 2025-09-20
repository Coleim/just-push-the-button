import React from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AVAILABLE_LANGUAGES } from '../locales/i18nConfig';
import { useTranslation } from 'react-i18next';

interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (lang: string) => void;
  currentLang: string;
}

const FLAG_MAP: Record<string, string> = {
  en: '🇬🇧',
  fr: '🇫🇷',
  zh: '🇨🇳',
};

export const LanguageModal: React.FC<LanguageModalProps> = ({ visible, onClose, onSelect, currentLang }) => {
  const { t } = useTranslation();
  return (
    <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.title}>{t('select_language')}</Text>
        {AVAILABLE_LANGUAGES.map(lang => (
          <TouchableOpacity
            key={lang.code}
            style={[styles.langRow, currentLang === lang.code && styles.selectedRow]}
            onPress={() => onSelect(lang.code)}
          >
            <Text style={styles.flag}>{FLAG_MAP[lang.code] || '🏳️'}</Text>
            <Text style={styles.langLabel}>{lang.label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>{t('close')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
    );
  };

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#222',
    borderRadius: 16,
    padding: 24,
    minWidth: 260,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 18,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 6,
    width: 180,
  },
  selectedRow: {
    backgroundColor: '#4CAF50',
  },
  flag: {
    fontSize: 22,
    marginRight: 12,
  },
  langLabel: {
    color: '#fff',
    fontSize: 16,
  },
  closeBtn: {
    marginTop: 18,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#444',
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
