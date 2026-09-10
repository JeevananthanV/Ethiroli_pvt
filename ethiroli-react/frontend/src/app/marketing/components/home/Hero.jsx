import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <header>
            <div className="et-hero-section">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster="/assets/images/banner/golden_ribbon_hero.jpg"
                    className="bg-video"
                >
                    <source src="/assets/images/ethiroli.mp4" type="video/mp4" />
                    <source src="/assets/images/ethiroli.webm" type="video/webm" />
                </video>
                <div className="video-overlay"></div>
                <div className="video-content">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    >
                        BRANDING
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1 }}
                    >
                        MARKETING
                    </motion.h1>
                </div>
            </div>
        </header>
    );
};

export default Hero;
