import React from 'react';
import Section from './Section';

const About = () => {
    return (
        <Section id="about" title="About Me" subtitle="Get to know my background, skills, and the journey that shaped my career.">
            <div className="about-intro">
                <div className="about-photo-wrapper">
                    <img src="/assets/images/hero-potrait.png" alt="Dhairya" className="about-photo" />
                </div>
                <div className="about-text">
                    <h2>Who Am I?</h2>
                    <p>
                        Hi! I'm <strong>Dhairya</strong>, a passionate developer and designer who thrives on creating
                        beautiful, functional digital experiences. I love turning ideas into reality through clean code
                        and thoughtful design.
                    </p>
                    <p>
                        With a strong foundation in both front-end and back-end development, I enjoy building
                        full-stack applications that solve real-world problems. I'm always eager to learn new
                        technologies and push the boundaries of what's possible on the web.
                    </p>
                    <p>
                        When I'm not coding, you'll find me exploring new tech trends, contributing to open-source
                        projects, or working on personal projects that challenge my skills.
                    </p>
                </div>
            </div>
        </Section>
    );
};

export default About;
