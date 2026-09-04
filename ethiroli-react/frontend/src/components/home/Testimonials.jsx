import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonialsData = [
    {
        text: "Fast communication, excellent design quality, and reliable service. They understood our vision and turned it into something amazing.",
        name: "Tina Brown",
        role: "CEO, ethiroli",
        rating: "★★★★★",
        image: "https://picsum.photos/seed/tina/100/100"
    },
    {
        text: "The team at Nexella is incredibly professional. They delivered our digital marketing campaign ahead of schedule with results that exceeded our expectations.",
        name: "David Smith",
        role: "CEO, Nexella",
        rating: "★★★★★",
        image: "https://picsum.photos/seed/david/100/100"
    },
    {
        text: "Creative, responsive, and data-driven. Our conversion rates have doubled since we started working with them. Highly recommended!",
        name: "Sarah Jenkins",
        role: "Director, Solaris",
        rating: "★★★★☆",
        image: "https://picsum.photos/seed/sarah/100/100"
    }
];

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
    };

    const currentTestimonial = testimonialsData[currentIndex];

    // Variants matched to original CSS (slide-in-up / slide-out-up)
    const variants = {
        enter: { y: 20, opacity: 0 },
        center: { y: 0, opacity: 1 },
        exit: { y: -20, opacity: 0 }
    };

    return (
        <section className="testimonial-section" id="testimonialSection">
            <div className="testimonial-container">
                <div className="testimonial-header">
                    <p className="testimonial-title"><span className="star-rotate">★</span> Our Testimonials</p>
                    <p className="testimonial-stats">4.8 (5k+) Customer reviews</p>
                </div>

                <div className="testimonial-grid">
                    <div className="testimonial-visual">
                        <div className="visual-badge glass-card">
                            <img src="/assets/images/banner/banner.png" alt="Happy Customers" />
                            <p>300+ Happy Customers</p>
                        </div>
                        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1 }}>4.8</div>
                            <div style={{ color: 'var(--color-text-muted)' }}>Average Rating</div>
                        </div>
                    </div>

                    <div className="testimonial-content">
                        <h3 className="content-heading">What Our Happy clients say about us.</h3>

                        <div className="testimonial-slider">
                            <div className="testimonial-card glass-card" style={{ overflow: 'hidden' }}>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentIndex}
                                        variants={variants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                        className="card-content-wrapper"
                                    >
                                        <div className="card-top">
                                            <div className="star-rating">{currentTestimonial.rating}</div>
                                            <div className="quote-icon">“</div>
                                        </div>
                                        <blockquote className="testimonial-text">
                                            “{currentTestimonial.text}”
                                        </blockquote>
                                        <div className="testimonial-footer">
                                            <div className="client-info">
                                                <img src={currentTestimonial.image} alt="Client" className="client-avatar" />
                                                <div className="client-details">
                                                    <div>
                                                        <p className="client-name">{currentTestimonial.name}</p>
                                                        <p className="client-role" dangerouslySetInnerHTML={{ __html: currentTestimonial.role.replace(', ', ', <br/>') }}></p>
                                                    </div>
                                                    <div className="slider-controls-inline">
                                                        <button className="control-btn" aria-label="Previous" onClick={handlePrev}>↑</button>
                                                        <button className="control-btn" aria-label="Next" onClick={handleNext}>↓</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
