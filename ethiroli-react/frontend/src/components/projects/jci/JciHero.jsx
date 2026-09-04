import React from 'react';
import { motion } from 'framer-motion';

const JciHero = ({ title, subtitle, tag, mainImage, floatImage, primaryCta, secondaryCta }) => {
    return (
        <section
            className="jci-hero"
            style={{ backgroundImage: "url('/assets/images/banner/banner.png')" }}
        >
            <div className="jci-hero-overlay" />
            <div className="jci-hero-content">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {tag && <span className="jci-tag">{tag}</span>}
                    <h1>{title}</h1>
                    <p>{subtitle}</p>
                    <div className="jci-hero-btns">
                        <button className="jci-btn-primary" onClick={primaryCta?.onClick}>
                            {primaryCta?.label || 'Launch Your Career'}
                        </button>
                        <button className="jci-btn-outline" onClick={secondaryCta?.onClick}>
                            {secondaryCta?.label || 'Explore Impact'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default JciHero;
