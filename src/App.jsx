import React, { useState, useEffect } from 'react';
import StarField from './components/StarField';
import SplashScreen from './components/SplashScreen';
import WelcomeScreen from './components/WelcomeScreen';
import CreditsScreen from './components/CreditsScreen';
import BossBattle from './components/BossBattle';
import GameLevel from './components/GameLevel';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import { AnimatePresence } from 'framer-motion';

// Game states: splash → welcome → level1..level5 → boss → credits
const GAME_STATES = ['splash', 'welcome', 'level1', 'level2', 'level3', 'level4', 'level5', 'boss', 'credits'];

// Doom HP decreases as levels progress
const DOOM_HP_BY_LEVEL = {
  level1: 100,
  level2: 80,
  level3: 60,
  level4: 40,
  level5: 20,
};

function App() {
  const [gameState, setGameState] = useState('splash');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [gameState]);

  const goToNext = () => {
    const currentIndex = GAME_STATES.indexOf(gameState);
    if (currentIndex < GAME_STATES.length - 1) {
      setGameState(GAME_STATES[currentIndex + 1]);
    }
  };

  const restart = () => {
    setGameState('splash');
  };

  // Current Doom HP for background and level display
  const currentDoomHp = DOOM_HP_BY_LEVEL[gameState] || (gameState === 'boss' ? 5 : gameState === 'credits' ? 0 : 100);

  return (
    <div className="game-container">
      <StarField doomHp={currentDoomHp} gameState={gameState} />
      <div className="portfolio-app">
        <AnimatePresence mode="wait">
          {gameState === 'splash' && (
            <SplashScreen key="splash" onStart={goToNext} />
          )}

          {gameState === 'welcome' && (
            <WelcomeScreen key="welcome" onContinue={goToNext} />
          )}

          <GameLevel
            key="level1"
            level={1}
            levelTitle="ABOUT ME"
            isActive={gameState === 'level1'}
            onNext={goToNext}
            nextLabel="NEXT LEVEL ▸"
            doomHp={DOOM_HP_BY_LEVEL.level1}
          >
            <About />
          </GameLevel>

          <GameLevel
            key="level2"
            level={2}
            levelTitle="MY SKILLS"
            isActive={gameState === 'level2'}
            onNext={goToNext}
            nextLabel="NEXT LEVEL ▸"
            doomHp={DOOM_HP_BY_LEVEL.level2}
          >
            <Skills />
          </GameLevel>

          <GameLevel
            key="level3"
            level={3}
            levelTitle="EXPERIENCE"
            isActive={gameState === 'level3'}
            onNext={goToNext}
            nextLabel="NEXT LEVEL ▸"
            doomHp={DOOM_HP_BY_LEVEL.level3}
          >
            <Experience />
          </GameLevel>

          <GameLevel
            key="level4"
            level={4}
            levelTitle="MY PROJECTS"
            isActive={gameState === 'level4'}
            onNext={goToNext}
            nextLabel="NEXT LEVEL ▸"
            doomHp={DOOM_HP_BY_LEVEL.level4}
          >
            <Projects />
          </GameLevel>

          <GameLevel
            key="level5"
            level={5}
            levelTitle="CERTIFICATES"
            isActive={gameState === 'level5'}
            onNext={goToNext}
            nextLabel="⚔ CONFRONT DOOM ▸"
            doomHp={DOOM_HP_BY_LEVEL.level5}
          >
            <Certificates />
          </GameLevel>

          {gameState === 'boss' && (
            <BossBattle key="boss" onVictory={goToNext} />
          )}

          {gameState === 'credits' && (
            <CreditsScreen key="credits" onRestart={restart} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
