import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

const Hero = () => {
    return (
        <section className="hero" id="home">
            <div className="container">
                <div className="hero-content">
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="hero-label"
                    >
                        FULL STACK DEVELOPER | BACKEND SPECIALIST | CYBERSECURITY ENTHUSIAST
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="hero-title"
                    >
                        Hello, I’m <span>Dhairya.</span><br />
                        <span className="hero-subtitle" style={{ fontSize: '0.5em', display: 'block', marginTop: '10px', color: 'var(--text)' }}>
                            I build secure, scalable, and efficient digital systems.
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="hero-description"
                    >
                        I’m a full stack developer with a strong focus on back-end engineering and database architecture. I specialize in building robust APIs, designing optimized data models, and creating systems that are secure, maintainable, and production-ready.
                        <br /><br />
                        Currently, I’m sharpening my expertise in backend scalability, DevOps practices, and cybersecurity to engineer systems that don’t just work — but withstand real-world challenges.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="hero-buttons"
                    >
                        <a href="#projects" className="btn btn-primary">
                            <Briefcase size={18} /> Projects
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                            <i className="fab fa-linkedin-in"></i> LinkedIn
                        </a>
                    </motion.div>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="hero-image-wrapper"
                >
                    <div className="hero-blob"></div>
                    <img src="/assets/images/hero-potrait.png" alt="Dhairya" className="hero-image" />
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
