# Just Push The Button

Un jeu mobile minimaliste et addictif où tout repose sur un seul bouton.

## Description

Le joueur doit cliquer quand le bouton est vert pour remplir une barre de progression avant la fin du temps. Parfois, le bouton devient rouge : cliquer dessus réinitialise la progression du niveau.

Plus les niveaux avancent, plus le défi augmente : barre plus longue, temps réduit, apparitions rouges plus fréquentes et imprévisibles.

## Règles du jeu

- 🟢 **Cliquer vert** → progression +2%
- 🔴 **Éviter le rouge** → reset progression (barre repart de 0)
- ⏰ **Timer** → si temps écoulé avant d'avoir 100%, le joueur perd
- 🎯 **Niveaux** → à chaque niveau, la difficulté augmente

## Système de score

- **Base** : 100 points par niveau terminé
- **Clics réussis** : +1 par clic vert
- **Bonus** : à la fin d'un niveau, + (niveau × 10)

## Installation et développement

### Prérequis

- Node.js (version 16 ou plus récente)
- npm ou yarn
- Expo CLI
- Android Studio (pour tester sur Android)

### Installation

```bash
npm install
```

### Démarrage

```bash
# Démarrer le serveur de développement
npm start

# Lancer sur Android
npm run android

# Lancer sur web
npm run web
```

## Publication sur le Play Store

### Avec EAS Build (recommandé)

1. Installer EAS CLI :
```bash
npm install -g @expo/eas-cli
```

2. Se connecter à Expo :
```bash
eas login
```

3. Configurer le projet :
```bash
eas build:configure
```

4. Construire l'APK/AAB :
```bash
# Pour tester
eas build --platform android --profile preview

# Pour production
eas build --platform android --profile production
```

5. Soumettre au Play Store :
```bash
eas submit --platform android
```

### Build local

```bash
# Générer l'APK
npx expo run:android --variant release
```

## Structure du projet

```
├── components/          # Composants React Native
│   ├── GameButton.tsx   # Bouton principal du jeu
│   ├── ProgressBar.tsx  # Barre de progression
│   ├── Timer.tsx        # Affichage du timer
│   ├── ScoreDisplay.tsx # Affichage du score
│   ├── GameOverModal.tsx # Modal de fin de jeu
│   └── StartScreen.tsx  # Écran de démarrage
├── hooks/               # Hooks personnalisés
│   └── useGameLogic.ts  # Logique principale du jeu
├── data/                # Données du jeu
│   └── LevelData.ts     # Configuration des niveaux
├── types/               # Types TypeScript
│   └── GameTypes.ts     # Interfaces du jeu
├── App.tsx              # Composant principal
├── app.json             # Configuration Expo
└── eas.json             # Configuration EAS Build
```

## Technologies utilisées

- **React Native** avec **Expo** - Framework mobile
- **TypeScript** - Typage statique
- **Expo EAS Build** - Build et déploiement
- **React Hooks** - Gestion d'état

## Fonctionnalités

- ✅ 10 niveaux avec difficulté progressive
- ✅ Système de score avec bonus
- ✅ Interface minimaliste et intuitive
- ✅ Patterns de bouton rouge prévisibles et aléatoires
- ✅ Timer avec couleurs d'alerte
- ✅ Barre de progression visuelle
- ✅ Modal de fin de jeu
- ✅ Configuration pour publication Android

## Niveaux de difficulté

| Niveau | Progression | Temps | Chance Rouge | Pattern |
|--------|-------------|-------|--------------|---------|
| 1-3    | 100-140%    | 11-12s| 5-10%        | Prévisible |
| 4-6    | 160-200%    | 9-10s | 12-16%       | Aléatoire |
| 7-10   | 220-300%    | 7-8s  | 18-25%       | Aléatoire |

## Licence

Ce projet est sous licence MIT.
