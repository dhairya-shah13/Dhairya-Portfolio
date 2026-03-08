import React from 'react';
import { motion } from 'framer-motion';

const WelcomeScreen = ({ onContinue }) => {
    return (
        <motion.div
            className="welcome-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="welcome-content">
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="welcome-label">INCOMING TRANSMISSION...</div>
                </motion.div>

                <motion.h1
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6, type: 'spring', stiffness: 120 }}
                    className="welcome-title"
                >
                    MISSION:<br />DEFEAT DOOM
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="welcome-info"
                >
                    <div className="welcome-stats" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                        <div className="stat-item" style={{ width: '100%', maxWidth: '450px' }}>
                            <span className="stat-label">OPERATIVE SPECS</span>
                            <span className="stat-value" style={{ fontSize: '0.65rem', color: 'var(--accent-green)' }}>
                                FULL STACK DEV | BACKEND SPECIALIST
                            </span>
                        </div>
                        <div className="stat-item" style={{ width: '100%', maxWidth: '450px' }}>
                            <span className="stat-label">UPGRADING SUBSYSTEMS</span>
                            <span className="stat-value" style={{ fontSize: '0.5rem', color: 'var(--text)' }}>
                                CYBERSECURITY & DEVOPS
                            </span>
                        </div>
                        <div className="stat-item" style={{ width: '100%', maxWidth: '450px', border: '3px solid var(--accent-orange)' }}>
                            <span className="stat-label" style={{ color: 'var(--accent-orange)' }}>PRIMARY TARGET</span>
                            <span className="stat-value" style={{ color: 'var(--accent-orange)', textShadow: 'var(--glow-rust)' }}>
                                DOCTOR DOOM
                            </span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8 }}
                    className="welcome-actions"
                >
                    <button className="btn btn-primary welcome-start-btn" onClick={onContinue}>
                        &#9654; ASSEMBLE TEAM
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ delay: 2.2 }}
                    className="welcome-hint"
                >
                    COMPLETE ALL 5 LEVELS TO CONFRONT DOOM
                </motion.div>
            </div>
        </motion.div>
    );
};

export default WelcomeScreen;
