import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ id, children, className = '', title, subtitle, style }) => {
    return (
        <section id={id} className={`section ${className}`} style={style}>
            <div className="container">
                {title && (
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="section-title text-center"
                    >
                        {title}
                    </motion.h2>
                )}
                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="section-subtitle text-center mx-auto"
                    >
                        {subtitle}
                    </motion.p>
                )}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {children}
                </motion.div>
            </div>
        </section>
    );
};

export default Section;
