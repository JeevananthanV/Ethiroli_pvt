import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <header className="ab-hero" id="about-hero" style={{ backgroundImage: "url('/assets/images/banner/banner.png')" }} role="banner">
            <div className="ab-hero-content">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    About Ethiroli
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Empowering Voices. Inspiring Change.
                </motion.p>
            </div>
        </header>
    );
};

export default Hero;
