import { LevelConfig } from '../types/GameTypes';

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    level: 1,
    requiredProgress: 100,
  timeLimit: 15,
    redButtonChance: 0.0,
    redButtonPattern: 'predictable',
    redButtonMinSafe: 4,
    redButtonMaxSafe: 1,
    fixedRedWindows: [], // Aucun rouge
  },
  {
    level: 2,
    requiredProgress: 120,
  timeLimit: 15,
    redButtonChance: 0.0,
    redButtonPattern: 'predictable',
    redButtonMinSafe: 3,
    redButtonMaxSafe: 1,
    fixedRedWindows: [{ start: 6, duration: 1 }], // 1 rouge fixe
  },
  {
    level: 3,
    requiredProgress: 140,
  timeLimit: 15,
    redButtonChance: 0.0,
    redButtonPattern: 'predictable',
    redButtonMinSafe: 3,
    redButtonMaxSafe: 1,
    fixedRedWindows: [
      { start: 4, duration: 1 },
      { start: 8, duration: 1 },
    ], // 2 rouges fixes
  },
  {
    level: 4,
    requiredProgress: 160,
    timeLimit: 15,
    redButtonChance: 0.0,
    redButtonPattern: 'predictable',
    redButtonMinSafe: 3,
    redButtonMaxSafe: 1,
    fixedRedWindows: [
      { start: 4, duration: 1 },
      { start: 8, duration: 1 },
      { start: 12, duration: 1 },
    ], // 3 rouges fixes
  },
  {
    level: 5,
    requiredProgress: 180,
    timeLimit: 15,
    redButtonChance: 0.0,
    redButtonPattern: 'random',
    redButtonMinSafe: 2,
    redButtonMaxSafe: 4,
    randomRedsCount: 1, // 1 rouge aléatoire (1s)
  },
  {
    level: 6,
    requiredProgress: 200,
    timeLimit: 15,
    redButtonChance: 0.0,
    redButtonPattern: 'random',
    redButtonMinSafe: 2,
    redButtonMaxSafe: 4,
    randomRedsCount: 2, // 2 rouges aléatoires (1s)
  },
  {
    level: 7,
    requiredProgress: 220,
  timeLimit: 15,
    redButtonChance: 0.18,
    redButtonPattern: 'random',
    redButtonMinSafe: 2,
    redButtonMaxSafe: 4,
    progressiveRedsCount: 3, // biaisés vers la fin
  },
  {
    level: 8,
    requiredProgress: 240,
  timeLimit: 15,
    redButtonChance: 0.2,
    redButtonPattern: 'random',
    redButtonMinSafe: 2,
    redButtonMaxSafe: 4,
    progressiveRedsCount: 4,
  },
  {
    level: 9,
    requiredProgress: 260,
  timeLimit: 15,
    redButtonChance: 0.22,
    redButtonPattern: 'random',
    redButtonMinSafe: 2,
    redButtonMaxSafe: 4,
    progressiveRedsCount: 5,
  },
  {
    level: 10,
    requiredProgress: 300,
  timeLimit: 15,
    redButtonChance: 0.25,
    redButtonPattern: 'random',
    redButtonMinSafe: 2,
    redButtonMaxSafe: 4,
    progressiveRedsCount: 6,
  },
];
