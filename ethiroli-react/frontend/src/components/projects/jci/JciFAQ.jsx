import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const JciFAQ = ({ title, faqs, activeFaq, onToggle }) => {
    return (
        <section className="jci-section-spacing" style={{ padding: '0 10%' }}>
            <h2 className="jci-section-title-center">{title}</h2>
            <div className="jci-faq-container">
                {faqs.map((faq, idx) => (
                    <div key={idx} className="jci-faq-item">
                        <button className="jci-faq-trigger" onClick={() => onToggle(idx)}>
                            {faq.question}
                            <span className={`jci-faq-icon ${activeFaq === idx ? 'active' : ''}`}>+</span>
                        </button>
                        <AnimatePresence>
                            {activeFaq === idx && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="jci-faq-content"
                                >
                                    <p>{faq.answer}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default JciFAQ;
