import React from 'react';
import { motion } from 'framer-motion';

const GameLevel = ({ level, levelTitle, children, onNext, nextLabel, isActive }) => {
    if (!isActive) return null;

    return (
        <motion.div
            className="game-level"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
        >
            <div className="game-level-intro">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 150 }}
                    className="level-intro-badge"
                >
                    <span className="level-intro-number">LEVEL {level}</span>
                    <span className="level-intro-title">{levelTitle}</span>
                </motion.div>
            </div>

            <div className="game-level-content">
                {children}
            </div>

            <div className="game-level-footer">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="level-complete-section"
                >
                    <div className="level-complete-text">
                        ✦ LEVEL {level} COMPLETE ✦
                    </div>
                    <button
                        className="btn btn-primary next-level-btn"
                        onClick={onNext}
                    >
                        {nextLabel || `NEXT LEVEL ▸`}
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default GameLevel;
