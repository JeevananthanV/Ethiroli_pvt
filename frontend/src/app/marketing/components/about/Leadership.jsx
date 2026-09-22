import React from 'react';
import { motion } from 'framer-motion';

const Leadership = () => {
    return (
        <section className="ab-section ab-leadership" id="leadership" aria-labelledby="leadership-title">
            <div className="ab-container">
                <div className="ab-title-center">
                    <motion.h2
                        id="leadership-title"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        Meet Our Leadership
                    </motion.h2>
                    <p className="ab-leadership-subtitle">
                        Visionary leaders building impact-driven programs, partnerships, and opportunities for women entrepreneurs.
                    </p>
                </div>

                <div className="ab-card-grid-two">
                    {/* Leader 1 */}
                    <motion.div
                        className="leader-wrapper"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="leader-visual">
                            <img src="/assets/images/founder/founder.png" alt="Portrait of Vijitha Kannan, Founder of Ethiroli" loading="lazy" />
                            <div className="leader-overlay">
                                <h3>Vijitha Kannan</h3>
                                <p>Founder</p>
                                <a
                                    href="https://www.linkedin.com/in/vijitha-kannan-2i2h1a/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Founder LinkedIn"
                                >
                                    <i className="fa-brands fa-linkedin-in"></i>
                                </a>                            
                            </div>
                        </div>
                        <article className="ab-leader-card">
                            <h3>Founder</h3>
                            <p>Vijitha Kannan is the Founder of Ethiroli, a passionate Brand Strategist and Social Media Marketing (SMM) Trainer dedicated to helping businesses grow through creative branding and digital strategy. A BCA First Class graduate and Vice President – Management at Junior Chamber International, she has empowered 200+ women through training and mentorship, with a vision to create opportunities for young women entrepreneurs to start and scale their own businesses. </p>
                        </article>
                    </motion.div>

                    {/* Leader 2 */}
                    <motion.div
                        className="leader-wrapper"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        
                        <div className="leader-visual">
                            <img src="/assets/images/founder/co-founder.png" alt="Portrait of Balaji, Co-Founder of Ethiroli" loading="lazy" />
                            <div className="leader-overlay">
                                <h3>Balaji G. E.</h3>
                                <p>Co-Founder</p>
                                <a
                                    href="https://www.linkedin.com/in/balaji-elango-6383b8292"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Co-Founder LinkedIn"
                                >
                                    <i className="fa-brands fa-linkedin-in"></i>
                                </a>
                            </div>
                        </div>
                        <article className="ab-leader-card">
                            <h3>Co-Founder</h3>
                            <p>
                                G. E. Balaji is the Co-Founder of Ethiroli Pvt. Ltd. and a Marketing Strategist who works with businesses across cafés, NGOs, spiritual organizations, self-help groups, and personal brands. With a background in the National Cadet Corps (NCC), he brings leadership, empathy, and strategic thinking to help organizations grow through branding, performance marketing, and marketing automation.
                            </p>
                        </article>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Leadership;
