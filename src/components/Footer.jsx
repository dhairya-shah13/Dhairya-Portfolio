import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <a href="#home" className="footer-logo">Dhairya</a>
                    <div className="footer-links">
                        <a href="#about">About</a>
                        <a href="#skills">Skills</a>
                        <a href="#experience">Experience</a>
                        <a href="#projects">Projects</a>
                        <a href="#certificates">Certificates</a>
                    </div>
                    <div className="footer-socials">
                        <a href="https://github.com/dhairya-shah13" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <Github size={20} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <Linkedin size={20} />
                        </a>
                        <a href="mailto:shah.dhairya.p13@gmail.com" aria-label="Email">
                            <Mail size={20} />
                        </a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Dhairya. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
