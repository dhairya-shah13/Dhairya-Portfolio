import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

const CreditsScreen = ({ onRestart }) => {
    const credits = [
        { role: 'DEVELOPER', name: 'DHAIRYA' },
        { role: 'DESIGNER', name: 'DHAIRYA' },
        { role: 'BACKEND ARCHITECT', name: 'DHAIRYA' },
        { role: 'SECURITY SPECIALIST', name: 'DHAIRYA' },
        { role: 'DEVOPS ENGINEER', name: 'DHAIRYA' },
        { role: 'ALIEN SLAYER', name: 'YOU!' },
    ];

    return (
        <motion.div
            className="credits-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="credits-content">
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="credits-header"
                >
                    <div className="credits-trophy">🏆</div>
                    <h1 className="credits-title">CONGRATULATIONS!</h1>
                    <p className="credits-subtitle">ALL LEVELS CLEARED • ALIEN DEFEATED</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="credits-message"
                >
                    <p>
                        You did it, Player 1! You fought your way through all 5 levels of my portfolio
                        AND took down the giant alien boss threatening the galaxy.
                        The ships salute you. The stars shine brighter because of you. 🌟
                    </p>
                    <p>
                        Thank you for taking the time to explore my journey — every project, skill, and
                        certificate you saw represents countless hours of learning and building.
                        I hope you had as much fun playing through my portfolio as I did building it!
                    </p>
                    <p>
                        Now that we've saved the galaxy together, maybe we should build something next? 🚀
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="credits-roll"
                >
                    <div className="credits-roll-title">— CREDITS —</div>
                    {credits.map((credit, i) => (
                        <motion.div
                            key={credit.role}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.8 + i * 0.3 }}
                            className="credit-item"
                        >
                            <span className="credit-role">{credit.role}</span>
                            <span className="credit-dots">................</span>
                            <span className="credit-name">{credit.name}</span>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.8 }}
                    className="credits-socials"
                >
                    <div className="credits-connect-title">CONNECT WITH ME</div>
                    <div className="credits-social-links">
                        <a href="https://github.com/dhairya-shah13" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <Github size={24} />
                            <span>GITHUB</span>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <Linkedin size={24} />
                            <span>LINKEDIN</span>
                        </a>
                        <a href="mailto:shah.dhairya.p13@gmail.com" aria-label="Email">
                            <Mail size={24} />
                            <span>EMAIL</span>
                        </a>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 4.3 }}
                    className="credits-restart"
                >
                    <button className="btn btn-outline" onClick={onRestart}>
                        &#8634; PLAY AGAIN
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ delay: 4.8 }}
                    className="credits-footer-text"
                >
                    <p>© {new Date().getFullYear()} DHAIRYA. ALL RIGHTS RESERVED.</p>
                    <p>NO ALIENS WERE HARMED IN THE MAKING OF THIS PORTFOLIO (MAYBE ONE)</p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default CreditsScreen;
