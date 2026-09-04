import React from 'react';
import { motion } from 'framer-motion';

const JciJourney = ({ title, description, steps }) => {
    return (
        <section className="jci-section-spacing">
            <div className="jci-section-header">
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
            
            <div className="jci-journey-grid">
                {steps.map((step, idx) => (
                    <motion.div 
                        key={idx} 
                        className="jci-journey-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.2, duration: 0.8 }}
                    >
                        <div className="jci-journey-number">{idx + 1}</div>
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>
                        
                        <div className="jci-journey-tags">
                            {step.tags && step.tags.map((tag, tIdx) => (
                                <span key={tIdx} className="jci-journey-tag">{tag}</span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default JciJourney;
