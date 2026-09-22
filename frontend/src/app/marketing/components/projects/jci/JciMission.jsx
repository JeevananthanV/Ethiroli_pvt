import React from 'react';
import { motion } from 'framer-motion';

const JciMission = ({ quote, author, role, image }) => {
    return (
        <section className="jci-mission">
            <div className="jci-mission-container">
                <motion.div 
                    className="jci-organic-shape"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <img src={image} alt="Mission" className="jci-mission-image" />
                </motion.div>
                <div>
                    <motion.div
                        className="jci-quote"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        "{quote}"
                    </motion.div>
                    <div className="jci-author-name">{author}</div>
                    <div className="jci-author-role">{role}</div>
                </div>
            </div>
        </section>
    );
};

export default JciMission;
