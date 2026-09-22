import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
const Projects = () => {
    return (
        <section className="ab-section ab-projects-zigzag" id="projects">
            <div className="ab-projects-header">
                <p>
                    <span className="star-rotate">&#9733;</span> Our Projects
                </p>
                <h2>Projects That Created Real Impact</h2>
                <p className="ab-projects-subtitle">
                    We have successfully completed a variety of projects that made a
                    measurable impact on our clients' growth.
                </p>
            </div>

            <div className="ab-projects-zigzag-list">
                <motion.article
                    className="ab-projects-zigzag-item"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="ab-projects-zigzag-media">
                        <img
                            src="/assets/images/founder/WhatsApp Image 2026-03-16 at 2.11.29 PM.jpeg"
                            alt="Workshops and training sessions"
                            loading="lazy"
                        />
                    </div>
                    <div className="ab-projects-zigzag-content">
                        <h3>Empowering Women with JCI & Digital Skills</h3>
                        <p>
                            Ethiroli is a premier branding and marketing agency in Salem empowering the next generation of women leaders. In partnership with JCI, we provide certified branding training, expert mentorship, and creative marketing workshops. Our structured roadmap bridges education and employment through college seminars, a 2-month creative internship, and a guaranteed 1-year placement in branding and media operations.
                        </p>
                        <Link to="/projects/jci-digital-skills" className="ab-projects-link">
                            Learn More <i className="fas fa-arrow-right"></i>
                        </Link>
                    </div>
                </motion.article>

                <motion.article
                    className="ab-projects-zigzag-item"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="ab-projects-zigzag-media">
                        <img
                            src="/assets/images/banner/gals.png"
                            alt="Networking events and mentorship programs"
                            loading="lazy"
                        />
                    </div>
                    <div className="ab-projects-zigzag-content">
                        <h3>Glamers Gathering</h3>
                        <p>
                            As official digital partner, Ethiroli built a premium digital identity for Glamers Gathering to elevate its fashion and women empowerment showcase. They delivered a responsive, high-end website, an aggressive social media strategy, and luxury visual branding. The campaign successfully generated over 50K+ reach and 10K+ engagements, seamlessly connecting models, designers, and creators.
                        </p>
                        <Link to="/projects/glamers-gathering" className="ab-projects-link">
                            Learn More <i className="fas fa-arrow-right"></i>
                        </Link>
                    </div>
                </motion.article>
            </div>
        </section>
    );
};

export default Projects;
