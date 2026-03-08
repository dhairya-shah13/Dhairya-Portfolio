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
                    WELCOME<br />PLAYER 1
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="welcome-info"
                >
                    <div className="welcome-stats">
                        <div className="stat-item">
                            <span className="stat-label">NAME</span>
                            <span className="stat-value">DHAIRYA</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">CLASS</span>
                            <span className="stat-value">FULL STACK DEV</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">LEVELS</span>
                            <span className="stat-value">5</span>
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
                        &#9654; START GAME
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ delay: 2.2 }}
                    className="welcome-hint"
                >
                    COMPLETE ALL 5 LEVELS TO ROLL CREDITS
                </motion.div>
            </div>
        </motion.div>
    );
};

export default WelcomeScreen;
