import React from 'react';
import { motion } from 'framer-motion';

const SplashScreen = ({ onStart }) => {
    return (
        <motion.div
            className="splash-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="splash-stars"></div>
            <div className="splash-content">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="splash-title-container"
                >
                    <h1 className="splash-title">DHAIRYA</h1>
                    <div className="splash-subtitle">THE PORTFOLIO</div>
                    <div className="splash-version">v1.0</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.4, 1] }}
                    transition={{ duration: 1.5, delay: 1.2, repeat: Infinity, repeatType: 'loop' }}
                    className="splash-tap"
                    onClick={onStart}
                >
                    <span>&#9654; TAP TO PLAY &#9664;</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 2 }}
                    className="splash-footer"
                >
                    <p>© 2025 ALL RIGHTS RESERVED</p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default SplashScreen;
