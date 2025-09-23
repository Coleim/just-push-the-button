import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, LevelConfig } from '../types/GameTypes';
import { SoundManager } from '../utils/SoundManager';
import { LEVEL_CONFIGS } from '../data/LevelData';

// Set to a number (1..LEVEL_CONFIGS.length) to start directly at that level during dev/testing.
// Leave undefined to start at level 1 normally.
const DEBUG_START_LEVEL: number | undefined = undefined; // e.g., 5

// Compute the progress penalty applied when pressing during a red state for a given level
const getRedPenaltyForLevel = (level: number): number => {
  if (level >= 10) return 25;
  if (level === 9) return 22;
  if (level === 8) return 20;
  if (level === 7) return 18;
  if (level === 6) return 16;
  if (level === 5) return 14;
  if (level >= 3 && level <= 4) return 12;
  return 10; // levels 1-2
};

const INITIAL_STATE: GameState = {
  currentLevel: 1,
  progress: 0,
  timeLeft: 0,
  isButtonRed: false,
  score: 0,
  isGameOver: false,
  isGameWon: false,
  successfulClicks: 0,
  gameStartTime: Date.now(),
};

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [isPlaying, setIsPlaying] = useState(false);
  // RAF and timing refs
  const rafIdRef = useRef<number | null>(null);
  const lastTickMsRef = useRef<number>(0);
  // Red button control without timeouts
  const lastRedButtonTimeRef = useRef<number>(0); // seconds since epoch
  const redUntilTimeRef = useRef<number>(0); // absolute seconds when red should end
  const lastRedEvalMsRef = useRef<number>(0); // throttle red evaluation (ms)
  const redSpawnsThisLevelRef = useRef<number>(0); // number of red spawns in current level
  const scheduledRedTimesRef = useRef<number[]>([]); // seconds since level start when reds should appear
  const scheduledRedTriggeredRef = useRef<boolean[]>([]); // whether scheduled index has been triggered

  const getCurrentLevelConfig = useCallback((): LevelConfig => {
    return LEVEL_CONFIGS[gameState.currentLevel - 1] || LEVEL_CONFIGS[LEVEL_CONFIGS.length - 1];
  }, [gameState.currentLevel]);

  const startGame = useCallback(() => {
    const desiredLevel = typeof DEBUG_START_LEVEL === 'number'
      ? Math.min(Math.max(1, Math.floor(DEBUG_START_LEVEL)), LEVEL_CONFIGS.length)
      : 1;
    const config = LEVEL_CONFIGS[desiredLevel - 1];
    setGameState(prev => ({
      ...INITIAL_STATE,
      currentLevel: desiredLevel,
      timeLeft: config.timeLimit,
      gameStartTime: Date.now(),
    }));
    redSpawnsThisLevelRef.current = 0;
    // schedule reds for level
    const scheduleForLevel = (cfg: LevelConfig) => {
      scheduledRedTimesRef.current = [];
      scheduledRedTriggeredRef.current = [];
      const timeLimit = Math.max(0, cfg.timeLimit || 0);
      const maxStart = Math.max(0, timeLimit - 1); // ensure 1s fits
      const minGap = (cfg.level >= 5) ? 0.5 : 1.05;
      const generateSpacedTimes = (count: number, biasTowardsEnd: boolean): number[] => {
        if (count <= 0 || maxStart <= 0) return [];
        // Upper bound due to spacing
        const maxCountBySpace = Math.floor(maxStart / minGap) + 1;
        const targetCount = Math.min(count, Math.max(1, maxCountBySpace));
        const times: number[] = [];
        let attempts = 0;
        const maxAttempts = 2000;
        while (times.length < targetCount && attempts < maxAttempts) {
          attempts++;
          let u = Math.random();
          if (biasTowardsEnd) {
            // currently disabled in callers, but keep shape if re-enabled later
            u = (0.5 + 0.5 * (u * u));
          }
          const t = u * maxStart;
          // Check min distance to existing picks
          let ok = true;
          for (let i = 0; i < times.length; i++) {
            if (Math.abs(times[i] - t) < minGap) { ok = false; break; }
          }
          if (ok) {
            times.push(t);
          }
        }
        times.sort((a, b) => a - b);
        return times;
      };
      if (typeof cfg.randomRedsCount === 'number' && cfg.randomRedsCount > 0) {
        const count = Math.min(cfg.randomRedsCount, 30);
        const spaced = generateSpacedTimes(count, false);
        scheduledRedTimesRef.current = spaced;
        scheduledRedTriggeredRef.current = new Array(spaced.length).fill(false);
      } else if (typeof cfg.progressiveRedsCount === 'number' && cfg.progressiveRedsCount > 0) {
        // bias towards the end of level (closer to timeLimit)
        const count = Math.min(cfg.progressiveRedsCount, 30);
        const spaced = generateSpacedTimes(count, false);
        scheduledRedTimesRef.current = spaced;
        scheduledRedTriggeredRef.current = new Array(spaced.length).fill(false);
      } else {
        scheduledRedTimesRef.current = [];
        scheduledRedTriggeredRef.current = [];
      }
    };
    scheduleForLevel(config);
    setIsPlaying(true);
  }, [getCurrentLevelConfig]);

  const resetGame = useCallback(() => {
    setIsPlaying(false);
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    lastTickMsRef.current = 0;
    lastRedButtonTimeRef.current = 0;
    redUntilTimeRef.current = 0;
    lastRedEvalMsRef.current = 0;
    redSpawnsThisLevelRef.current = 0;
    scheduledRedTimesRef.current = [];
    scheduledRedTriggeredRef.current = [];
    setGameState(INITIAL_STATE);
  }, []);

  const handleButtonPress = useCallback(() => {
    if (!isPlaying || gameState.isGameOver || gameState.isGameWon) return;

    // Trigger level-up sound immediately if this press will complete the level
    if (!gameState.isButtonRed) {
      const required = getCurrentLevelConfig().requiredProgress;
      const newProgressPreview = Math.min(gameState.progress + 2, required);
      const willComplete = newProgressPreview >= required;
      if (willComplete && gameState.currentLevel < LEVEL_CONFIGS.length) {
        SoundManager.playLevelUp();
      }
    }

    setGameState(prev => {
      if (prev.isButtonRed) {
        // Pénalité progressive selon le niveau
        const level = prev.currentLevel;
        let penalty = 10; // base pour niv 1-2
        if (level >= 3 && level <= 4) penalty = 12;
        else if (level === 5) penalty = 14;
        else if (level === 6) penalty = 16;
        else if (level === 7) penalty = 18;
        else if (level === 8) penalty = 20;
        else if (level === 9) penalty = 22;
        else if (level >= 10) penalty = 25;

        const reduced = Math.max(0, prev.progress - penalty);
        // play error buzz once when pressing on red
        SoundManager.playError();
        return { ...prev, progress: reduced };
      } else {
        // Bouton vert : progression +2%
        const newProgress = Math.min(prev.progress + 2, getCurrentLevelConfig().requiredProgress);
        const isLevelComplete = newProgress >= getCurrentLevelConfig().requiredProgress;
        
        if (isLevelComplete) {          
          SoundManager.playLevelUp();
          // Niveau terminé
          const levelBonus = prev.currentLevel * 10;
          const newScore = prev.score + 100 + prev.successfulClicks + levelBonus;
          
          if (prev.currentLevel >= LEVEL_CONFIGS.length) {
            // Jeu terminé
            return {
              ...prev,
              progress: newProgress,
              score: newScore,
              isGameWon: true,
            };
          } else {
            // Niveau suivant
            const nextLevel = prev.currentLevel + 1;
            const nextConfig = LEVEL_CONFIGS[nextLevel - 1];
              // reset red spawns count when entering a new level
              redSpawnsThisLevelRef.current = 0;
              // reschedule reds for next level
              (function scheduleForLevel(cfg: LevelConfig) {
                scheduledRedTimesRef.current = [];
                scheduledRedTriggeredRef.current = [];
                const timeLimit = Math.max(0, cfg.timeLimit || 0);
                const maxStart = Math.max(0, timeLimit - 1);
                const minGap = (cfg.level >= 7) ? 1.1 : 1.05;
                const generateSpacedTimes = (count: number, biasTowardsEnd: boolean): number[] => {
                  if (count <= 0 || maxStart <= 0) return [];
                  const maxCountBySpace = Math.floor(maxStart / minGap) + 1;
                  const finalCount = Math.min(count, Math.max(1, maxCountBySpace));
                  const available = Math.max(0, maxStart - (finalCount - 1) * minGap);
                  const base: number[] = [];
                  const jitters: number[] = [];
                  for (let i = 0; i < finalCount; i++) {
                    const u = Math.random();
                    const b = biasTowardsEnd ? (0.5 + 0.5 * (u * u)) : u;
                    jitters.push(b);
                  }
                  jitters.sort((a, b) => a - b);
                  for (let i = 0; i < finalCount; i++) {
                    const jitter = available * jitters[i];
                    const t = i * minGap + jitter;
                    base.push(Math.min(maxStart, t));
                  }
                  return base;
                };
                if (typeof cfg.randomRedsCount === 'number' && cfg.randomRedsCount > 0) {
                  const count = Math.min(cfg.randomRedsCount, 30);
                  const spaced = generateSpacedTimes(count, false);
                  scheduledRedTimesRef.current = spaced;
                  scheduledRedTriggeredRef.current = new Array(spaced.length).fill(false);
                } else if (typeof cfg.progressiveRedsCount === 'number' && cfg.progressiveRedsCount > 0) {
                  const count = Math.min(cfg.progressiveRedsCount, 30);
                  const spaced = generateSpacedTimes(count, false);
                  scheduledRedTimesRef.current = spaced;
                  scheduledRedTriggeredRef.current = new Array(spaced.length).fill(false);
                } else {
                  scheduledRedTimesRef.current = [];
                  scheduledRedTriggeredRef.current = [];
                }
              })(nextConfig);
            return {
              ...prev,
              currentLevel: nextLevel,
              progress: 0,
              timeLeft: nextConfig.timeLimit,
              score: newScore,
              successfulClicks: 0,
            };
          }
        } else {
          // Progression normale
          return {
            ...prev,
            progress: newProgress,
            successfulClicks: prev.successfulClicks + 1,
          };
        }
      }
    });
  }, [isPlaying, gameState.isGameOver, gameState.isGameWon, getCurrentLevelConfig]);

  // RAF-based main loop with delta time and integrated red-button logic
  useEffect(() => {
    if (!isPlaying || gameState.isGameOver || gameState.isGameWon) return;

    const getNowMs = () => (globalThis.performance && typeof globalThis.performance.now === 'function') ? globalThis.performance.now() : Date.now();

    // initialize timing refs at start of loop
    if (lastTickMsRef.current === 0) {
      lastTickMsRef.current = getNowMs();
    }

    const tick = () => {
      const nowMs = getNowMs();
      const deltaSec = Math.min(0.2, Math.max(0, (nowMs - lastTickMsRef.current) / 1000)); // clamp to avoid large jumps
      lastTickMsRef.current = nowMs;

      setGameState(prev => {
        const config = LEVEL_CONFIGS[prev.currentLevel - 1] || LEVEL_CONFIGS[LEVEL_CONFIGS.length - 1];

        // advance timer by real delta
        const updatedTimeLeft = Math.max(0, prev.timeLeft - deltaSec);

        // compute elapsed time in level for predictable windows
        const levelElapsed = (config.timeLimit - updatedTimeLeft);

        let nextIsRed = prev.isButtonRed;
        const nowSec = Date.now() / 1000;

        // throttle red evaluation to ~10Hz
        const shouldEvalRed = (nowMs - lastRedEvalMsRef.current) >= 100;
        if (shouldEvalRed) {
          lastRedEvalMsRef.current = nowMs;

          // end red if duration elapsed
          if (nextIsRed && nowSec >= redUntilTimeRef.current) {
            nextIsRed = false;
          }

          if (config.redButtonPattern === 'predictable') {
            if (config.fixedRedWindows !== undefined) {
              const inFixedRed = (config.fixedRedWindows || []).some(w => levelElapsed >= w.start && levelElapsed < w.start + Math.min(w.duration, 1));
              nextIsRed = inFixedRed;
              if (inFixedRed) {
                // keep red tightly bounded by windows
                redUntilTimeRef.current = nowSec + 0.05; // small guard to allow quick off
              }
            } else {
              const cycleTime = 4;
              const redDuration = 1;
              const timeSinceLastRed = Math.max(0, nowSec - lastRedButtonTimeRef.current);
              const cyclePosition = (timeSinceLastRed % cycleTime);
              nextIsRed = cyclePosition < redDuration;
              if (nextIsRed) {
                redUntilTimeRef.current = nowSec + redDuration;
              }
            }
          } else {
            // Scheduled reds across the whole duration
            const scheduled = scheduledRedTimesRef.current;
            const triggered = scheduledRedTriggeredRef.current;
            if (Array.isArray(scheduled) && scheduled.length > 0) {
              for (let i = 0; i < scheduled.length; i++) {
                if (triggered[i]) continue;
                const t = scheduled[i];
                const inWindow = levelElapsed >= t && levelElapsed < (t + 1);
                if (inWindow && !nextIsRed) {
                  nextIsRed = true;
                  triggered[i] = true;
                  lastRedButtonTimeRef.current = nowSec;
                  const redDuration = 1;
                  redUntilTimeRef.current = nowSec + redDuration;
                  redSpawnsThisLevelRef.current += 1;
                }
              }
            }
          }
        }

        const nextState: GameState = {
          ...prev,
          timeLeft: updatedTimeLeft,
          isButtonRed: nextIsRed,
        };

        if (updatedTimeLeft <= 0 && !prev.isGameOver) {
          nextState.isGameOver = true;
        }

        return nextState;
      });

      // continue loop if still playing
      if (isPlaying && !gameState.isGameOver && !gameState.isGameWon) {
        rafIdRef.current = requestAnimationFrame(tick);
      }
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isPlaying, gameState.isGameOver, gameState.isGameWon]);

  return {
    gameState,
    isPlaying,
    startGame,
    resetGame,
    handleButtonPress,
    getCurrentLevelConfig,
  };
};
