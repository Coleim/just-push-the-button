export interface LevelConfig {
  level: number;
  requiredProgress: number; // Pourcentage requis
  timeLimit: number; // En secondes
  // Anciennes propriétés conservées pour compat, mais ignorées si scheduling défini
  redButtonChance: number; // Chance par seconde (0-1)
  redButtonPattern: 'predictable' | 'random';
  redButtonMinSafe: number; // Temps minimum safe en secondes
  redButtonMaxSafe: number; // Temps maximum safe en secondes

  // Nouveau système de scheduling
  fixedRedWindows?: { start: number; duration: number }[]; // secondes depuis début du niveau
  randomRedsCount?: number; // nombre de rouges aléatoires (durée 1s max chacun)
  progressiveRedsCount?: number; // pour niveaux avancés: rouges biaisés vers la fin
}

export interface GameState {
  currentLevel: number;
  progress: number; // Pourcentage actuel
  timeLeft: number; // Temps restant en secondes
  isButtonRed: boolean;
  score: number;
  isGameOver: boolean;
  isGameWon: boolean;
  successfulClicks: number;
  gameStartTime: number;
}

export interface GameStats {
  totalScore: number;
  levelsCompleted: number;
  totalClicks: number;
  bestLevel: number;
}
