import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github } from 'lucide-react';

const ProjectModal = ({ project, isOpen, onClose }) => {
    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="modal-overlay active"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-close" onClick={onClose}>
                            <X size={32} />
                        </div>
                        <div
                            className="modal-image"
                            style={{ background: project.gradient }}
                        >
                            <i className={`fas ${project.icon}`} style={{ fontSize: '4rem' }}></i>
                        </div>
                        <h2 className="modal-title">{project.title}</h2>
                        <div className="modal-body">
                            <div className="modal-tags">
                                {project.tags.map(tag => (
                                    <span key={tag}>{tag}</span>
                                ))}
                            </div>
                            <div className="modal-desc" dangerouslySetInnerHTML={{ __html: project.desc }}></div>
                            <div className="modal-links">
                                <a href={project.live} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                                    <ExternalLink size={18} /> Live Demo
                                </a>
                                <a href={project.github} className="btn btn-outline" target="_blank" rel="noopener noreferrer">
                                    <Github size={18} /> GitHub
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProjectModal;
