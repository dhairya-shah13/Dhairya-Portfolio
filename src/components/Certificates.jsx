import React, { useState } from 'react';
import Section from './Section';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Brain, Terminal, Database, Award } from 'lucide-react';

const Certificates = () => {
    const [filter, setFilter] = useState('all');

    const categories = [
        { id: 'all', label: 'All' },
        { id: 'courses', label: 'Courses' },
        { id: 'achievements', label: 'Achievements' },
        { id: 'management', label: 'Management & Leadership' },
    ];

    const certificates = [
        {
            title: 'Microsoft Azure AI Fundamentals AI-900',
            issuer: 'Microsoft',
            date: 'Professional Certification',
            category: 'courses',
            icon: <Brain size={24} />,
            link: '/certificates/Microsoft Azure AI.pdf'
        },
        {
            title: 'Core Java Specialization',
            issuer: 'Coursera',
            date: 'Specialization Certificate',
            category: 'courses',
            icon: <i className="fab fa-java" style={{ fontSize: '1.5rem' }}></i>,
            link: '/certificates/Java Specialization certificate.pdf'
        },
        {
            title: 'Advanced Data Structures & Algorithms',
            issuer: 'Packt',
            date: 'Advanced Course Certification',
            category: 'courses',
            icon: <Database size={24} />,
            link: '/certificates/Advanced_DSA.pdf'
        },
        {
            title: 'Winner of Coder\'s Arcade 2.0',
            issuer: 'Hackathon',
            date: 'Achievement Certificate',
            category: 'achievements',
            icon: <Terminal size={24} />,
            link: '/certificates/Coder\'s Arcade 2.0.pdf'
        },
        {
            title: 'Coordinator - Poster Making Competition',
            issuer: 'Charusat (Equal Opportunity Cell)',
            date: 'February 2026',
            category: 'management',
            icon: <Award size={24} />,
            link: '/certificates/Coordinator_Certificate.png'
        }
    ];

    const filteredCerts = filter === 'all'
        ? certificates
        : certificates.filter(cert => cert.category === filter);

    return (
        <Section id="certificates" title="Certificates" subtitle="Professional certifications and achievements that validate my expertise.">
            <div className="filter-tags">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className={`filter-tag ${filter === cat.id ? 'active' : ''}`}
                        onClick={() => setFilter(cat.id)}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            <div className="certificates-grid">
                <AnimatePresence mode='popLayout'>
                    {filteredCerts.map((cert) => (
                        <motion.div
                            layout
                            key={cert.title}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4 }}
                            className="certificate-card"
                        >
                            <div className="certificate-icon">
                                {cert.icon}
                            </div>
                            <h3>{cert.title}</h3>
                            <p className="cert-issuer">{cert.issuer}</p>
                            <p className="cert-date">{cert.date}</p>
                            <a href={cert.link} className="cert-link" target="_blank" rel="noopener noreferrer">
                                View Certificate <ArrowRight size={16} />
                            </a>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </Section>
    );
};

export default Certificates;
