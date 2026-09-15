import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CTA = () => {
    return (
        <section className="replica-strong-cta-section" id="cta">
            <div className="replica-container">
                <motion.div 
                    className="replica-cta-banner"
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="replica-cta-content">
                        <div style={{ marginBottom: '12px' }}>
                            <span className="subtitle" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--base-gold)', borderColor: 'rgba(232,214,87,0.3)' }}>
                                <span className="star-rotate">★</span> Let's Build Something Great
                            </span>
                        </div>
                        <h2 className="replica-cta-heading">Ready to Take Your Business to the Next Level?</h2>
                        <p className="replica-cta-sub">Let's discuss how Ethiroli can help you grow.</p>
                        
                        <div className="replica-cta-buttons">
                            <Link to="/contact_us" className="replica-btn-gold">
                                Get a Free Consultation &rarr;
                            </Link>
                            <a 
                                href="https://wa.me/916380049042?text=Hello%20Ethiroli!%20I%20would%20like%20to%20inquire%20about%20your%20services." 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="replica-btn-dark-outline"
                            >
                                &#128172; Chat on WhatsApp
                            </a>
                        </div>
                    </div>

                    <div className="replica-cta-backdrop">
                        <img 
                            src="/assets/images/banner/golden_ribbon_cta.jpg" 
                            alt="Bigger Brighter Together" 
                            className="replica-cta-img"
                            loading="lazy"
                        />
                        <motion.div 
                            className="replica-cta-script"
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            Bigger. Brighter. Together.
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;

