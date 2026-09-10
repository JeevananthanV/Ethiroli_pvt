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
                    <h2 id="intro-title">A Women-Led Branding & Marketing Agency Driving Growth & Impact</h2>
                    <p>
                        Eithiroli is a premier women-led branding and marketing agency dedicated to empowering businesses with iconic visual identities, performance marketing, and automated growth funnels.
                        We combine strategic branding, creative storytelling, and data-driven marketing campaigns to help businesses build strong market dominance while nurturing the next generation of creative women leaders in marketing.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default Introduction;
