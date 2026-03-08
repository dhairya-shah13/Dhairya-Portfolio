import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BossBattle = ({ onVictory }) => {
    const [hp, setHp] = useState(5);
    const [defeated, setDefeated] = useState(false);
    const [hits, setHits] = useState([]);
    const [shaking, setShaking] = useState(false);
    const [shipLasers, setShipLasers] = useState([]);
    const bossRef = useRef(null);
    const hitIdRef = useRef(0);
    const laserIntervalRef = useRef(null);

    // Ships shoot lasers at the alien periodically
    useEffect(() => {
        laserIntervalRef.current = setInterval(() => {
            if (defeated) return;
            const side = Math.random() > 0.5 ? 'left' : 'right';
            const startX = side === 'left' ? -50 : window.innerWidth + 50;
            const startY = 100 + Math.random() * 300;
            setShipLasers(prev => [...prev, {
                id: Date.now() + Math.random(),
                side,
                startX,
                startY,
            }]);
        }, 800);
        return () => clearInterval(laserIntervalRef.current);
    }, [defeated]);

    // Clean up old lasers
    useEffect(() => {
        const timer = setInterval(() => {
            setShipLasers(prev => prev.length > 6 ? prev.slice(-4) : prev);
        }, 2000);
        return () => clearInterval(timer);
    }, []);

    const handleClick = (e) => {
        if (defeated) return;

        const rect = bossRef.current?.getBoundingClientRect();
        const x = e.clientX - (rect?.left || 0);
        const y = e.clientY - (rect?.top || 0);

        hitIdRef.current++;
        setHits(prev => [...prev, { id: hitIdRef.current, x, y }]);

        setShaking(true);
        setTimeout(() => setShaking(false), 300);

        const newHp = hp - 1;
        setHp(newHp);

        if (newHp <= 0) {
            setDefeated(true);
            setTimeout(() => {
                onVictory();
            }, 3000);
        }
    };

    // Remove hit effects after animation
    useEffect(() => {
        if (hits.length > 0) {
            const timer = setTimeout(() => {
                setHits(prev => prev.slice(1));
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [hits]);

    const hpPercentage = (hp / 5) * 100;

    return (
        <motion.div
            className="boss-battle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Ship lasers flying across */}
            <AnimatePresence>
                {shipLasers.map(laser => (
                    <motion.div
                        key={laser.id}
                        className="ship-laser"
                        initial={{
                            x: laser.startX,
                            y: laser.startY,
                            opacity: 1,
                        }}
                        animate={{
                            x: window.innerWidth / 2 + (Math.random() - 0.5) * 100,
                            y: window.innerHeight / 2 + (Math.random() - 0.5) * 80,
                            opacity: 0,
                        }}
                        transition={{ duration: 0.6, ease: 'linear' }}
                    />
                ))}
            </AnimatePresence>

            <div className="boss-hud">
                <div className="boss-hud-label">⚠ BOSS FIGHT ⚠</div>
                <div className="boss-hp-bar">
                    <div className="boss-hp-label">ALIEN HP</div>
                    <div className="boss-hp-track">
                        <motion.div
                            className="boss-hp-fill"
                            animate={{ width: `${hpPercentage}%` }}
                            transition={{ duration: 0.3 }}
                            style={{
                                background: hp > 3 ? '#00ff87' : hp > 1 ? '#ffb300' : '#ff4444',
                            }}
                        />
                    </div>
                    <div className="boss-hp-text">{hp}/5</div>
                </div>
                <div className="boss-instruction">
                    {defeated ? 'ALIEN DEFEATED!' : 'CLICK THE ALIEN TO ATTACK!'}
                </div>
            </div>

            <div
                ref={bossRef}
                className={`boss-alien ${shaking ? 'boss-shake' : ''} ${defeated ? 'boss-defeated' : ''}`}
                onClick={handleClick}
            >
                {!defeated ? (
                    <div className="alien-sprite">
                        {/* Pixel art alien built with divs */}
                        <div className="alien-body">
                            {/* Head / dome */}
                            <div className="alien-head">
                                <div className="alien-dome"></div>
                                <div className="alien-face">
                                    <div className="alien-eye left">
                                        <div className="alien-pupil"></div>
                                    </div>
                                    <div className="alien-eye right">
                                        <div className="alien-pupil"></div>
                                    </div>
                                    <div className="alien-mouth">
                                        {hp <= 2 ? '😰' : hp <= 4 ? '😠' : '👾'}
                                    </div>
                                </div>
                            </div>
                            {/* Tentacles */}
                            <div className="alien-tentacles">
                                <motion.div
                                    className="tentacle left"
                                    animate={{ rotate: [0, -15, 0, 15, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />
                                <motion.div
                                    className="tentacle center-left"
                                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
                                />
                                <motion.div
                                    className="tentacle center-right"
                                    animate={{ rotate: [0, -10, 0, 10, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.6 }}
                                />
                                <motion.div
                                    className="tentacle right"
                                    animate={{ rotate: [0, 15, 0, -15, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <motion.div
                        className="alien-explosion"
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        transition={{ duration: 2 }}
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
                            animate={{ scale: 2, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            💥
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {defeated && (
                <motion.div
                    className="victory-text"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
                >
                    <div className="victory-title">🏆 VICTORY! 🏆</div>
                    <div className="victory-sub">THE GALAXY IS SAVED!</div>
                    <div className="victory-loading">LOADING CREDITS...</div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default BossBattle;
