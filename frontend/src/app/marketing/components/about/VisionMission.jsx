import React from 'react';
import { motion } from 'framer-motion';

const VisionMission = () => {
    return (
        <section className="ab-section ab-vision-mission" id="vision-mission" aria-labelledby="vision-mission-title">
            <div className="ab-container">
                <div className="ab-title-center">
                    <span className="subtitle"><span className="star-rotate">★</span>Our Purpose</span>
                    <motion.h2
                        id="vision-mission-title"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        Vision & Mission
                    </motion.h2>
                </div>
                <div className="ab-card-grid-two">

                    <motion.article
                        className="vm-card vision"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="vm-icon">
                            <i className="fa-solid fa-bullseye"></i>
                        </div>
                        <h3>Our Vision</h3>
                        <blockquote className="vm-quote">
                            "To become the leading women-led branding and marketing agency in Tamil Nadu."
                        </blockquote>
                        <p className="vm-text">
                            To build a premier branding and marketing agency that transforms businesses through strategic visual identity, marketing automation, and sustainable growth.
                        </p>
                    </motion.article>

                    <motion.article
                        className="vm-card mission"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="vm-icon">
                            <i className="fa-solid fa-rocket"></i>
                        </div>
                        <h3>Our Mission</h3>
                        <div className="vm-tagline">
                            <span className="tag-pill">Iconic Branding.</span>
                            <span className="tag-pill">Marketing Automation.</span>
                            <span className="tag-pill">Deliver Growth.</span>
                        </div>
                        <p className="vm-text">
                            To empower businesses with high-ROI branding and marketing campaigns while providing aspiring women professionals with certified training, real-world internships, and leadership roles in marketing.
                        </p>
                    </motion.article>

                </div>
            </div>
        </section>
    );
};

export default VisionMission;
