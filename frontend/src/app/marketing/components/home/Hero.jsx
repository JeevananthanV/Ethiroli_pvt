import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <header className="replica-hero-section">
            {/* Background Video Layer */}
            <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/assets/images/banner/golden_ribbon_hero.jpg"
                className="replica-hero-bg-video"
            >
                <source src="/assets/images/ethiroli.mp4" type="video/mp4" />
            </video>
            <div className="replica-hero-video-overlay"></div>

            {/* Foreground Blueprint Grid */}
            <div className="replica-container replica-hero-grid">
                {/* Left Column: Value proposition, headline, CTAs, stats */}
                <motion.div 
                    className="replica-hero-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                    <motion.div 
                        className="replica-hero-eyebrow"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Creative Thinking. Digital Growth. Smart Automation.
                    </motion.div>
                    
                    <motion.h1 
                        className="replica-hero-title"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        We Build Brands That Get Noticed, <span className="gold-text">Trusted &amp; Chosen.</span>
                    </motion.h1>

                    <motion.p 
                        className="replica-hero-desc"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        Branding &bull; Digital Marketing &bull; Content &bull; Automation<br />
                        Helping ambitious businesses grow in the digital world.
                    </motion.p>

                    <motion.div 
                        className="replica-hero-ctas"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                    >
                        <Link to="/contact_us" className="replica-btn-gold">
                            Book a Free Consultation &rarr;
                        </Link>
                        <Link to="/projects" className="replica-btn-dark-outline">
                            &#9658; Watch Our Work
                        </Link>
                    </motion.div>

                    <motion.div 
                        className="replica-hero-stats"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                    >
                        <div className="replica-stat-box">
                            <div className="replica-stat-val">50+</div>
                            <div className="replica-stat-lbl">Happy Clients</div>
                        </div>
                        <div className="replica-stat-box">
                            <div className="replica-stat-val">150+</div>
                            <div className="replica-stat-lbl">Projects Completed</div>
                        </div>
                        <div className="replica-stat-box">
                            <div className="replica-stat-val">3+</div>
                            <div className="replica-stat-lbl">Years of Impact</div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right Column: Desk/Laptop Media Frame */}
                <motion.div 
                    className="replica-hero-media"
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="replica-laptop-frame">
                        <img 
                            src="/assets/images/banner/golden_ribbon_hero.jpg" 
                            alt="Ideas Strategy Content Growth" 
                            className="replica-laptop-img"
                        />
                        <div className="replica-hero-ambient-text">
                            Good Brands Create Brighter Tomorrow
                        </div>
                    </div>
                </motion.div>
            </div>
        </header>
    );
};

export default Hero;

