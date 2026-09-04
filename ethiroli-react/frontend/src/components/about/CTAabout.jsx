import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CTAabout = () => {
    return (
        <section className="ab-section ab-cta" id="join">
            <motion.div
                className="ab-container ab-cta-inner"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <h2>Make Your Brand Heard with Ethiroli</h2>
                <p>Ethiroli helps your brand stand out with creative strategies and smart digital marketing, turning ideas into real engagement, stronger presence, and measurable business growth.</p>
                <div className="ab-cta-actions">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        <Link className="btn" to="/contact_us">Start Now</Link>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                    >
                        <Link className="ab-ghost-light" to="/contact_us">Partner With Us</Link>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default CTAabout;
