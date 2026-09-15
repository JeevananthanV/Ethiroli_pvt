import React, { useState } from 'react';
import { motion } from 'framer-motion';

const testimonials = [
    {
        quote: "Ethiroli transformed our brand presence. Professional, creative and results-driven.",
        name: "Dr. Karthik",
        company: "Aarogya Hospitals",
        avatar: "/assets/images/team/founder.png",
        stars: "★★★★★"
    },
    {
        quote: "Our social media engagement increased significantly. Great team to work with!",
        name: "Priya S",
        company: "Sri Sai Foods",
        avatar: "/assets/images/team/reshma.png",
        stars: "★★★★★"
    },
    {
        quote: "They built our website and automated our lead process. Highly recommended!",
        name: "Manoj Kumar",
        company: "Maruthi Constructions",
        avatar: "/assets/images/team/co-founder.png",
        stars: "★★★★★"
    }
];

const Testimonials = () => {
    const [page, setPage] = useState(0);

    const handleNext = () => {
        setPage((prev) => (prev + 1) % testimonials.length);
    };

    const handlePrev = () => {
        setPage((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="replica-testimonials-section" id="testimonials">
            <div className="replica-container">
                <motion.div 
                    className="replica-test-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div>
                        <div style={{ marginBottom: '8px' }}>
                            <span className="subtitle">
                                <span className="star-rotate">★</span> Client Testimonials
                            </span>
                        </div>
                        <h2 className="replica-test-title">What Our Clients Say</h2>
                    </div>
                    <div className="replica-arrows">
                        <button className="replica-arrow-btn" aria-label="Previous" onClick={handlePrev}>&larr;</button>
                        <button className="replica-arrow-btn" aria-label="Next" onClick={handleNext}>&rarr;</button>
                    </div>
                </motion.div>

                <div className="replica-test-grid">
                    {testimonials.map((item, idx) => (
                        <motion.div 
                            className="replica-test-card" 
                            key={idx}
                            initial={{ opacity: 0, y: 35 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: idx * 0.14 }}
                            whileHover={{ y: -8, transition: { duration: 0.25 } }}
                        >
                            <div className="replica-quote-icon">&ldquo;</div>
                            <p className="replica-quote-text">"{item.quote}"</p>
                            <div className="replica-client-meta">
                                <img 
                                    src={item.avatar} 
                                    alt={item.name} 
                                    className="replica-client-avatar" 
                                    loading="lazy"
                                />
                                <div>
                                    <div className="replica-client-name">{item.name}</div>
                                    <div className="replica-client-corp">{item.company}</div>
                                </div>
                                <div className="replica-star-row">{item.stars}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;

