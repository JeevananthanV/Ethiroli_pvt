import React from 'react';
import { motion } from 'framer-motion';

const JciEligibility = ({ title, description, criteria, image, floatCard }) => {
    return (
        <section className="jci-eligibility-split">
            <div className="jci-eligibility-content-left">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2>{title}</h2>
                    <p>{description}</p>
                    <div className="jci-eligibility-list">
                        {criteria.map((item, idx) => (
                            <motion.div 
                                key={idx} 
                                className="jci-eligibility-item"
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 + (idx * 0.1) }}
                            >
                                <div className="jci-eligibility-icon-circle">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <span className="jci-eligibility-text">{item}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="jci-eligibility-media-right">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                >
                    <img src={image} alt="Eligibility" className="jci-eligibility-img-main" />
                    {floatCard && (
                        <motion.div 
                            className="jci-eligibility-float-card"
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                        >
                            <h4>{floatCard.title}</h4>
                            <p>{floatCard.description}</p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default JciEligibility;
