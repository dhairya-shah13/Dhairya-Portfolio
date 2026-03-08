import React from 'react';
import Section from './Section';
import { motion } from 'framer-motion';

const Skills = () => {
    const skills = [
        { name: 'HTML5', icon: 'fab fa-html5' },
        { name: 'CSS3', icon: 'fab fa-css3-alt' },
        { name: 'JavaScript', icon: 'fab fa-js' },
        { name: 'Java', icon: 'fab fa-java' },
        { name: 'C / C++', icon: 'fas fa-code' },
        { name: 'Python', icon: 'fab fa-python' },
        { name: 'SQL', icon: 'fas fa-database' },
        { name: 'Git', icon: 'fab fa-git-alt' },
    ];

    return (
        <Section
            id="skills"
            title="My Skills"
            subtitle="Technologies and tools I work with on a daily basis."
            style={{ background: 'transparent' }}
        >
            <div className="skills-grid">
                {skills.map((skill, index) => (
                    <motion.div
                        key={skill.name}
                        whileHover={{ y: -4, boxShadow: 'var(--shadow-hover)', borderColor: 'var(--primary)' }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="skill-card"
                    >
                        <i className={skill.icon}></i>
                        <span>{skill.name}</span>
                    </motion.div>
                ))}
            </div>
        </Section>
    );
};

export default Skills;
