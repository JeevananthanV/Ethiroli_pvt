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
                        <p className="section-tag"><span className="star-rotate">★</span> Branding & Marketing Agency</p>
                        <h2>Empowering Brands Through Creative Marketing & Strategy</h2>
                    </div>
                    <p className="et-about-desc">
                        At Ethiroli, we are a premier branding and marketing agency dedicated to elevating ambitious businesses and women-led enterprises. Our purpose-driven solutions combine iconic visual identity, performance marketing, marketing automation, and creative storytelling for measurable growth and lasting market leadership.
                    </p>
                    <ul className="et-about-features">
                        <li>✔ Strategic branding & iconic visual identities</li>
                        <li>✔ High-impact performance marketing & lead automation</li>
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

