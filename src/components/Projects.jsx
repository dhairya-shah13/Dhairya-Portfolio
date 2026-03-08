import React, { useState } from 'react';
import Section from './Section';
import ProjectModal from './ProjectModal';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

const Projects = () => {
    const [selectedProject, setSelectedProject] = useState(null);

    const projectData = [
        {
            id: 'fintrack',
            title: 'FinTrack — Expense Tracker',
            tags: ['Python', 'Flask', 'JS', 'Chart.js'],
            desc: '<p>A full-stack expense tracking application with category breakdowns, interactive charts, and split expense features. Optimized for performance and scale.</p>',
            gradient: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
            icon: 'fa-chart-line',
            live: 'https://fintrack-swart-theta.vercel.app/',
            github: 'https://github.com/dhairya-shah13/FinTrack'
        },
        {
            id: 'hrms',
            title: 'HRMS Dashboard',
            tags: ['MongoDB', 'Express', 'React', 'Node'],
            desc: '<p>A human resource management system with employee authentication, attendance tracking, and dynamic dashboards. Built for secure enterprise operations.</p>',
            gradient: 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary-dark) 100%)',
            icon: 'fa-users',
            live: '#',
            github: '#'
        }
    ];

    return (
        <>
            <Section id="projects" title="My Projects" subtitle="A collection of projects I've built — from full-stack apps to creative experiments.">
                <div className="projects-grid">
                    {projectData.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="project-card"
                            onClick={() => setSelectedProject(project)}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    background: project.gradient,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderBottom: '4px solid var(--primary)'
                                }}
                            >
                                <i className={`fas ${project.icon}`} style={{ fontSize: '3.5rem', color: 'var(--accent-green)', textShadow: '3px 3px 0px var(--dark)' }}></i>
                            </div>
                            <div className="project-card-body">
                                <h3>{project.title}</h3>
                                <p>{project.desc.replace(/<[^>]*>?/gm, '').substring(0, 100)}...</p>
                                <div className="project-tags">
                                    {project.tags.slice(0, 3).map(tag => (
                                        <span key={tag}>{tag}</span>
                                    ))}
                                </div>
                                <div className="project-links">
                                    <a href={project.live} onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} /> Live Demo</a>
                                    <a href={project.github} onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer"><Github size={16} /> GitHub</a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Section>

            <ProjectModal
                project={selectedProject}
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </>
    );
};

export default Projects;
