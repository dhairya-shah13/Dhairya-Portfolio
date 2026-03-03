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
                        Developer & Designer
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="hero-title"
                    >
                        Hello, my name<br />is <span>Dhairya</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="hero-description"
                    >
                        I'm a passionate developer who loves building elegant solutions.
                        Explore my projects and certifications to learn more about my work
                        and professional journey.
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
