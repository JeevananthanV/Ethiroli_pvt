import React from 'react';
import { motion } from 'framer-motion';

const Introduction = () => {
    return (
        <section className="ab-section ab-intro" id="about-introduction" aria-labelledby="intro-title">
            <div className="ab-container ab-two-col">
                <motion.figure
                    className="ab-image-wrap"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <img className="ab-floating-image" src="/assets/images/img/intro.png" alt="Women collaborating on digital strategy and branding" loading="lazy" />
                </motion.figure>

                <motion.div
                    className="ab-copy"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="ab-label"><span className="star-rotate">★</span>Who We Are</p>
                    <h2 id="intro-title">A Women-Led Digital Ecosystem Driving Growth & Impact</h2>
                    <p>
                        Eithiroli is a women-led digital growth platform dedicated to empowering women with practical digital skills, real-world internship experience, and business opportunities.
                        We combine structured training with measurable marketing strategies to help women build independent careers while delivering real growth for brands.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default Introduction;
