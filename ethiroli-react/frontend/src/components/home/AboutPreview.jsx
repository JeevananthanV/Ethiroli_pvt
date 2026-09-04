import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";


const AboutPreview = () => {
      const navigate = useNavigate();
    return (
        <section id="about-section" className="et-about-section">
            <div className="et-container">
                <motion.div
                    className="et-about-media"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="et-about-images-wrapper">
                        <img

                            src="/assets/images/founder/WhatsApp Image 2026-03-16 at 2.11.29 PM.jpeg"
                            alt="Team Member 1"
                            className="et-about-img img-main"
                        />
                        <img
                            src="/assets/images/founder/WhatsApp Image 2026-03-16 at 2.11.29 PM.jpeg"
                            alt="Team Member 2"
                            className="et-about-img img-overlay"
                        />

                    </div>
                </motion.div>

                <motion.div
                    className="et-about-content"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="et-about-heading">
                        <p className="section-tag"><span className="star-rotate">★</span> About Our Company</p>
                        <h2>Empowering Women-Led Businesses Through Innovation</h2>
                    </div>
                    <p className="et-about-desc">
                        At Ethiroli, we create transformative digital experiences that empower women entrepreneurs and strengthen women-led businesses. Our purpose-driven solutions are visually compelling and strategically designed for measurable growth and long-term success.
                    </p>
                    <ul className="et-about-features">
                        <li>✔ Powerful branding & marketing solutions</li>
                        <li>✔ Empowering women through sustainable growth</li>
                    </ul>
                    {/* <div className="et-about-company-info">
                        <img src="/assets/images/ethiroli_logo.png" alt="Ethiroli Logo" />
                        <h3>Built by Women to Empower Women<br /></h3>
                    </div> */}
                    <button className="et-btn" onClick={() => navigate("/about")}>
                        More About Us →
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutPreview;

