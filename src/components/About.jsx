import React from 'react';
import Section from './Section';
import { Database, Shield, Settings, Zap, Target, Heart } from 'lucide-react';

const About = () => {
    return (
        <Section
            id="about"
            title="About Me"
            subtitle="Get to know my technical foundation, problem-solving mindset, and the journey shaping my career in backend engineering and security."
        >
            <div className="about-intro">
                <div className="about-photo-wrapper">
                    <img src="/assets/images/hero-potrait.png" alt="Dhairya" className="about-photo" />
                </div>
                <div className="about-text">
                    <h2>Who Am I?</h2>
                    <p>
                        Hi, I’m <strong>Dhairya</strong> — a full stack developer with deep proficiency in back-end development and database design.
                    </p>
                    <p>
                        While I work across the stack, my core strength lies in architecting reliable server-side systems. I enjoy designing RESTful APIs, optimizing database queries, structuring scalable schemas, and ensuring clean separation of concerns within applications.
                    </p>
                    <p>
                        I believe that great software is not just about features — it's about:
                    </p>
                    <div className="value-pills" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                        {['Performance', 'Security', 'Scalability', 'Clean architecture', 'Long-term maintainability'].map(val => (
                            <span key={val} style={{
                                padding: '6px 14px',
                                background: 'rgba(0, 229, 255, 0.1)',
                                color: 'var(--primary)',
                                borderRadius: '0',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                fontFamily: "'Press Start 2P', cursive",
                                border: '1px solid rgba(0, 229, 255, 0.2)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                {val}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="about-focus-grid">
                <div className="focus-card">
                    <div className="focus-header">
                        <div className="focus-icon"><Database size={24} /></div>
                        <h3>Backend & Database Focus</h3>
                    </div>
                    <p>I specialize in:</p>
                    <ul>
                        <li>Designing normalized and efficient database schemas</li>
                        <li>Writing optimized SQL queries</li>
                        <li>Building secure authentication & authorization systems</li>
                        <li>Creating REST APIs with proper validation and error handling</li>
                        <li>Structuring scalable backend architectures</li>
                    </ul>
                    <p style={{ marginTop: '15px', fontSize: '0.9rem', fontStyle: 'italic' }}>
                        Data integrity and system reliability are things I take seriously. A well-designed backend is invisible — but powerful.
                    </p>
                </div>

                <div className="focus-card">
                    <div className="focus-header">
                        <div className="focus-icon"><Shield size={24} /></div>
                        <h3>Growing Into Cybersecurity</h3>
                    </div>
                    <p>Security is not an afterthought — it's a core principle. I’m actively learning and implementing:</p>
                    <ul>
                        <li>Secure coding practices & OWASP principles</li>
                        <li>Authentication flows (JWT, session-based auth)</li>
                        <li>API security and rate limiting</li>
                        <li>Basic penetration testing concepts</li>
                        <li>Threat modeling fundamentals</li>
                    </ul>
                    <p style={{ marginTop: '15px', fontSize: '0.9rem', fontStyle: 'italic' }}>
                        My goal is to build systems that are secure by design, not secured later.
                    </p>
                </div>

                <div className="focus-card">
                    <div className="focus-header">
                        <div className="focus-icon"><Settings size={24} /></div>
                        <h3>DevOps & Scalability Journey</h3>
                    </div>
                    <p>Beyond development, I’m expanding into DevOps to better understand:</p>
                    <ul>
                        <li>CI/CD pipelines & Deployment automation</li>
                        <li>Containerization (Docker)</li>
                        <li>Server management</li>
                        <li>Monitoring and logging</li>
                    </ul>
                    <p style={{ marginTop: '15px', fontSize: '0.9rem', fontStyle: 'italic' }}>
                        I want to bridge the gap between writing code and running it reliably in production.
                    </p>
                </div>
            </div>

            <div className="about-outro">
                <div className="outro-section">
                    <h3><Zap size={24} style={{ marginRight: '10px', verticalAlign: 'middle', color: 'var(--primary)' }} /> What Drives Me</h3>
                    <p>
                        I’m constantly refining my backend engineering skills and pushing myself to understand how large-scale systems operate under load, how data flows efficiently, and how vulnerabilities are prevented before they arise.
                    </p>
                    <p>
                        When I’m not coding, I’m exploring backend optimization techniques, studying cybersecurity concepts, building side projects to test new architectures, and experimenting with deployment and infrastructure tools.
                    </p>
                </div>

                <div className="vision-card">
                    <h3><Target size={32} style={{ marginBottom: '10px' }} /><br />Long-Term Vision</h3>
                    <p>
                        To become a highly skilled backend and systems engineer capable of designing secure, scalable, and high-performance applications that solve real-world problems.
                    </p>
                </div>
            </div>
        </Section>
    );
};

export default About;

