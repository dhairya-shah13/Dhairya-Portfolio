import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AVENGERS = [
    { name: 'IRON MAN', color: 'var(--accent-orange)', emoji: '🦾' },
    { name: 'CAPTAIN AMERICA', color: 'var(--primary)', emoji: '🛡️' },
    { name: 'THOR', color: 'var(--accent-green)', emoji: '⚡' },
    { name: 'HULK', color: 'var(--primary-light)', emoji: '💪' },
    { name: 'BLACK WIDOW', color: 'var(--accent-orange)', emoji: '⧗' },
    { name: 'HAWKEYE', color: 'var(--primary-light)', emoji: '🏹' },
    { name: 'DOCTOR STRANGE', color: 'var(--accent-orange)', emoji: '🔮' },
];

const BossBattle = ({ onVictory }) => {
    const [phase, setPhase] = useState('intro'); // intro → knockouts → fight → victory
    const [knockoutIndex, setKnockoutIndex] = useState(-1);
    const [hp, setHp] = useState(5);
    const [defeated, setDefeated] = useState(false);
    const [doomPos, setDoomPos] = useState({ x: 50, y: 40 });
    const [hits, setHits] = useState([]);
    const [shaking, setShaking] = useState(false);
    const hitIdRef = useRef(0);
    const moveIntervalRef = useRef(null);
    const containerRef = useRef(null);

    // --- INTRO: Knock out Avengers one by one ---
    useEffect(() => {
        if (phase !== 'intro') return;
        const startTimeout = setTimeout(() => {
            setKnockoutIndex(0);
        }, 1000);
        return () => clearTimeout(startTimeout);
    }, [phase]);

    useEffect(() => {
        if (phase !== 'intro' || knockoutIndex < 0) return;
        if (knockoutIndex >= AVENGERS.length) {
            // All knocked out, transition to fight phase
            const t = setTimeout(() => setPhase('message'), 1500);
            return () => clearTimeout(t);
        }
        const t = setTimeout(() => {
            setKnockoutIndex(prev => prev + 1);
        }, 800);
        return () => clearTimeout(t);
    }, [knockoutIndex, phase]);

    useEffect(() => {
        if (phase !== 'message') return;
        const t = setTimeout(() => setPhase('fight'), 3000);
        return () => clearTimeout(t);
    }, [phase]);

    // --- FIGHT: Doom is now stationary as requested ---
    useEffect(() => {
        if (phase !== 'fight' || defeated) return;
        setDoomPos({ x: 50, y: 40 });
    }, [phase, defeated]);

    const handleDoomClick = useCallback((e) => {
        if (defeated || phase !== 'fight') return;
        e.stopPropagation();

        hitIdRef.current++;
        const rect = containerRef.current?.getBoundingClientRect();
        const x = e.clientX - (rect?.left || 0);
        const y = e.clientY - (rect?.top || 0);
        setHits(prev => [...prev, { id: hitIdRef.current, x, y }]);

        setShaking(true);
        setTimeout(() => setShaking(false), 300);

        const newHp = hp - 1;
        setHp(newHp);

        if (newHp <= 0) {
            setDefeated(true);
            clearInterval(moveIntervalRef.current);
            setTimeout(() => {
                setPhase('victory');
            }, 1500);
            setTimeout(() => {
                onVictory();
            }, 4000);
        }
    }, [defeated, phase, hp, onVictory]);

    // Remove hit effects
    useEffect(() => {
        if (hits.length > 0) {
            const timer = setTimeout(() => setHits(prev => prev.slice(1)), 600);
            return () => clearTimeout(timer);
        }
    }, [hits]);

    const hpPercentage = (hp / 5) * 100;

    // --- PIXEL ART DOOM (CSS-based for boss battle) ---
    const DoomSprite = ({ size = 1, onClick, className = '' }) => (
        <div
            onClick={onClick}
            className={className}
            style={{
                width: `${80 * size}px`,
                height: `${100 * size}px`,
                position: 'relative',
                cursor: phase === 'fight' ? 'crosshair' : 'default',
                imageRendering: 'pixelated',
            }}
        >
            {/* Hood */}
            <div style={{
                position: 'absolute', top: 0, left: `${10 * size}px`,
                width: `${60 * size}px`, height: `${25 * size}px`,
                background: '#333c38',
            }} />
            {/* Mask */}
            <div style={{
                position: 'absolute', top: `${15 * size}px`, left: `${15 * size}px`,
                width: `${50 * size}px`, height: `${25 * size}px`,
                background: '#76908e',
            }} />
            {/* Eyes */}
            <div style={{
                position: 'absolute', top: `${20 * size}px`, left: `${22 * size}px`,
                width: `${10 * size}px`, height: `${6 * size}px`,
                background: hp > 2 ? '#bf4723' : '#e2a449',
                boxShadow: `0 0 ${8 * size}px ${hp > 2 ? '#bf4723' : '#e2a449'}`,
            }} />
            <div style={{
                position: 'absolute', top: `${20 * size}px`, left: `${48 * size}px`,
                width: `${10 * size}px`, height: `${6 * size}px`,
                background: hp > 2 ? '#bf4723' : '#e2a449',
                boxShadow: `0 0 ${8 * size}px ${hp > 2 ? '#bf4723' : '#e2a449'}`,
            }} />
            {/* Cape */}
            <div style={{
                position: 'absolute', top: `${35 * size}px`, left: `${-5 * size}px`,
                width: `${90 * size}px`, height: `${60 * size}px`,
                background: '#333c38',
                clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
            }} />
            {/* Body */}
            <div style={{
                position: 'absolute', top: `${38 * size}px`, left: `${15 * size}px`,
                width: `${50 * size}px`, height: `${40 * size}px`,
                background: '#76908e',
            }} />
            {/* Belt */}
            <div style={{
                position: 'absolute', top: `${60 * size}px`, left: `${15 * size}px`,
                width: `${50 * size}px`, height: `${5 * size}px`,
                background: '#e2a449',
            }} />
            {/* Legs */}
            <div style={{
                position: 'absolute', top: `${78 * size}px`, left: `${18 * size}px`,
                width: `${18 * size}px`, height: `${22 * size}px`,
                background: '#76908e',
            }} />
            <div style={{
                position: 'absolute', top: `${78 * size}px`, left: `${44 * size}px`,
                width: `${18 * size}px`, height: `${22 * size}px`,
                background: '#76908e',
            }} />
        </div>
    );

    return (
        <motion.div
            ref={containerRef}
            className="boss-battle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}
        >
            {/* --- INTRO: KNOCKOUT PHASE --- */}
            {phase === 'intro' && (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', minHeight: '100vh', gap: '20px', padding: '40px'
                }}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="boss-hud-label"
                        style={{ marginBottom: '30px', fontSize: '1.2rem' }}
                    >
                        ⚠ DOOM STRIKES ⚠
                    </motion.div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                        {AVENGERS.map((av, i) => (
                            <motion.div
                                key={av.name}
                                initial={{ opacity: 1, scale: 1 }}
                                animate={knockoutIndex > i ? {
                                    opacity: 0.2, scale: 0.7, rotate: -15, y: 30,
                                    filter: 'grayscale(100%)'
                                } : {}}
                                transition={{ duration: 0.5 }}
                                style={{
                                    background: 'var(--dark)',
                                    border: `3px solid ${av.color}`,
                                    padding: '24px 20px',
                                    textAlign: 'center',
                                    fontFamily: "var(--font-pixel)",
                                    fontSize: '0.6rem',
                                    color: av.color,
                                    minWidth: '150px',
                                    position: 'relative',
                                    boxShadow: 'inset -3px -3px 0px 0px rgba(0, 0, 0, 0.5), 4px 4px 0px 0px rgba(0, 0, 0, 0.3)'
                                }}
                            >
                                <div style={{ fontSize: '2.5rem', marginBottom: '12px', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>{av.emoji}</div>
                                {av.name}
                                {knockoutIndex > i && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        style={{
                                            position: 'absolute', top: '50%', left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            fontSize: '2rem', color: '#bf4723',
                                            textShadow: '0 0 10px #bf4723',
                                        }}
                                    >
                                        💥
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {knockoutIndex >= 0 && knockoutIndex < AVENGERS.length && (
                        <motion.div
                            key={knockoutIndex}
                            initial={{ scale: 2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                fontFamily: "'Press Start 2P', cursive",
                                fontSize: '0.7rem',
                                color: '#bf4723',
                                marginTop: '20px',
                                textShadow: '0 0 10px rgba(191, 71, 35, 0.5)',
                            }}
                        >
                            DOOM DEFEATS {AVENGERS[knockoutIndex].name}!
                        </motion.div>
                    )}
                </div>
            )}

            {/* --- MESSAGE PHASE --- */}
            {phase === 'message' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'center', minHeight: '100vh', textAlign: 'center',
                        padding: '40px',
                    }}
                >
                    <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{
                            fontFamily: "var(--font-pixel)",
                            fontSize: '1.1rem',
                            color: 'var(--accent-orange)',
                            marginBottom: '20px',
                            textShadow: '3px 3px 0px var(--dark), var(--glow-rust)',
                            lineHeight: '2',
                        }}
                    >
                        DHAIRYA'S TEAM HAS FALLEN...
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        style={{
                            fontFamily: "var(--font-pixel)",
                            fontSize: '0.85rem',
                            color: 'var(--accent-green)',
                            textShadow: '2px 2px 0px var(--dark), var(--glow-gold)',
                            lineHeight: '2.2',
                        }}
                    >
                        IT'S UP TO YOU NOW, PLAYER 1!<br />
                        CLICK DOOM TO DEFEAT HIM!
                    </motion.div>
                </motion.div>
            )}

            {/* --- FIGHT PHASE --- */}
            {phase === 'fight' && (
                <>
                    <div className="boss-hud">
                        <div className="boss-hud-label">⚔ FINAL BATTLE ⚔</div>
                        <div className="boss-hp-bar">
                            <div className="boss-hp-label" style={{ color: 'var(--text)' }}>DOOM HP</div>
                            <div className="boss-hp-track" style={{ border: '3px solid var(--primary)', background: 'var(--dark)' }}>
                                <motion.div
                                    className="boss-hp-fill"
                                    animate={{ width: `${hpPercentage}%` }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        background: hp > 3 ? 'var(--primary)' : hp > 1 ? 'var(--accent-green)' : 'var(--accent-orange)',
                                    }}
                                />
                            </div>
                            <div className="boss-hp-text" style={{ color: 'var(--text)', marginLeft: '10px' }}>{hp}/5</div>
                        </div>
                        <div className="boss-instruction">
                            {defeated ? 'DOOM DEFEATED!' : 'CLICK DOOM TO ATTACK!'}
                        </div>
                    </div>

                    {!defeated ? (
                        <motion.div
                            className={`boss-alien ${shaking ? 'boss-shake' : ''}`}
                            animate={{
                                left: `${doomPos.x}%`,
                                top: `${doomPos.y}%`,
                            }}
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                            style={{
                                position: 'absolute',
                                cursor: 'crosshair',
                                zIndex: 10,
                            }}
                            onClick={handleDoomClick}
                        >
                            <DoomSprite size={1.5} />
                        </motion.div>
                    ) : (
                        <motion.div
                            className="alien-explosion"
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ scale: 3, opacity: 0 }}
                            transition={{ duration: 2 }}
                            style={{
                                position: 'absolute',
                                left: `${doomPos.x}%`,
                                top: `${doomPos.y}%`,
                                fontSize: '3rem',
                                textAlign: 'center',
                            }}
                        >
                            <div className="explosion-text">💥 BOOM 💥</div>
                        </motion.div>
                    )}

                    {/* Hit effects */}
                    <AnimatePresence>
                        {hits.map(hit => (
                            <motion.div
                                key={hit.id}
                                className="hit-effect"
                                initial={{ scale: 0, opacity: 1, x: hit.x - 30, y: hit.y - 30 }}
                                animate={{ scale: 2.5, opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                style={{ position: 'absolute', fontSize: '2rem', pointerEvents: 'none', zIndex: 20 }}
                            >
                                💥
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </>
            )}

            {/* --- VICTORY PHASE --- */}
            {phase === 'victory' && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    background: 'rgba(51, 60, 56, 0.4)', // Subtle backing
                    pointerEvents: 'none'
                }}>
                    <motion.div
                        className="victory-text"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
                        style={{
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            position: 'relative', // Relative to the fixed parent
                            top: 'auto',
                            left: 'auto',
                            transform: 'none'
                        }}
                    >
                        <div className="victory-title">🏆 VICTORY! 🏆</div>
                        <div className="victory-sub">DOOM HAS BEEN DEFEATED!</div>
                        <div className="victory-sub" style={{ fontSize: '0.65rem', marginTop: '10px' }}>
                            THE WORLD IS SAVED!
                        </div>
                        <div className="victory-loading">LOADING CREDITS...</div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default BossBattle;
