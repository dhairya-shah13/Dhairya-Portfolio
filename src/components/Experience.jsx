import React from 'react';
import Section from './Section';
import { motion } from 'framer-motion';

const Experience = () => {
    const experiences = [
        {
            title: 'Bachelor of Technology',
            meta: 'CHARUSAT • 2024 – 2028',
            desc: 'Pursuing my degree in Information Technology with a focus on software development and design.',
        },
        {
            title: 'Full Stack Developer Intern',
            meta: 'VassuInfotech • December 2025 – Present',
            desc: 'Worked on building and maintaining web applications using modern technologies. Collaborated with cross-functional teams.',
        },
        {
            title: 'Freelance Projects',
            meta: 'Self Employed • December 2025 – Present',
            desc: 'Designed and developed custom websites and applications for clients, delivering pixel-perfect and performant solutions.',
        },
    ];

    return (
        <Section id="experience" title="Education & Experience" subtitle="My academic background and professional journey so far.">
            <div className="timeline">
                {experiences.map((exp, index) => (
                    <motion.div
                        key={exp.title}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        className="timeline-item"
                    >
                        <h3>{exp.title}</h3>
                        <span className="timeline-meta">{exp.meta}</span>
                        <p>{exp.desc}</p>
                    </motion.div>
                ))}
            </div>
        </Section>
    );
};

export default Experience;
