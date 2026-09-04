import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const AnimatedNumber = ({ value, suffix = "" }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest) + suffix);
    
    useEffect(() => {
        const numericValue = parseFloat(value.toString().replace(/[^0-9.]/g, ''));
        const controls = animate(count, numericValue, { duration: 2, ease: "easeOut" });
        return controls.stop;
    }, [value, count]);

    return <motion.span>{rounded}</motion.span>;
};

const JciImpact = ({ stats, title, description, features }) => {
    return (
        <section className="jci-impact-split">
            <div className="jci-impact-grid-left">
                {stats.map((stat, idx) => (
                    <motion.div 
                        key={idx} 
                        className="jci-impact-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1, duration: 0.6 }}
                    >
                        <div className="jci-impact-card-icon">
                            {stat.icon || (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                </svg>
                            )}
                        </div>
                        <h3>
                            <AnimatedNumber 
                                value={stat.value} 
                                suffix={stat.value.toString().includes('+') ? '+' : stat.value.toString().includes('%') ? '%' : stat.value.toString().includes('k') ? 'k+' : ''} 
                            />
                        </h3>
                        <p>{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="jci-impact-content-right">
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2>{title}</h2>
                    <p>{description}</p>
                    
                    <div className="jci-checkmark-list">
                        {features.map((feature, idx) => (
                            <motion.div 
                                key={idx} 
                                className="jci-checkmark-item"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 + (idx * 0.2) }}
                            >
                                <div className="jci-checkmark-icon">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <div className="jci-checkmark-text">
                                    <h4>{feature.title}</h4>
                                    <p>{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default JciImpact;
