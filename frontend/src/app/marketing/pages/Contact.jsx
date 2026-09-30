import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/shared/SEO';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submitState, setSubmitState] = useState({
        loading: false,
        error: '',
        success: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitState({ loading: true, error: '', success: '' });

        try {
            const rawBase = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000');
            const apiBase = rawBase.replace(/\/api\/?$/, '');
            const response = await fetch(`${apiBase}/api/v1/contact-messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const payload = await response.json();
            if (!response.ok) {
                throw new Error(payload.message || 'Failed to send your message.');
            }

            setFormData({
                name: '',
                phone: '',
                email: '',
                subject: '',
                message: '',
            });
            setSubmitState({
                loading: false,
                error: '',
                success: 'Your message was sent. Our team will contact you shortly.',
            });
        } catch (error) {
            setSubmitState({
                loading: false,
                error: error.message || 'Something went wrong. Please try again.',
                success: '',
            });
        }
    };

    return (
        <div className="contact-page">
            <SEO
                title="Contact Us — Ethiroli Branding & Marketing Agency"
                description="Get in touch with Ethiroli, premier branding, performance marketing, and marketing automation agency in Salem, Tamil Nadu. Reach out for brand strategy and campaigns."
                canonical="https://ethiroli.net/contact_us"
                keywords="contact ethiroli, branding agency contact, marketing agency salem, ethiroli phone number, ethiroli address, ethiroli.net"
            />
            <section className="ab-hero" style={{ backgroundImage: "url('/assets/images/banner/banner.png')" }}>
                <div className="ab-hero-content">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Contact Us
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Let us collaborate to create meaningful impact together.
                    </motion.p>
                </div>
            </section>

            <section className="contact-premium" id="contactFormSection">
                <motion.div
                    className="contact-panel contact-panel-form"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="contact-badge"><span className="star-rotate">&#9733;</span>Start A Conversation</p>
                    <h2>Send Us A Message</h2>
                    <p className="contact-note">Share your requirement and our team will get back to you within 24 hours.</p>
                    <form className="contact-form-grid" id="contactForm" onSubmit={handleSubmit} autoComplete="on">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name *"
                            required
                            aria-label="Your Name"
                            autoComplete="name"
                        />
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone Number *"
                            required
                            aria-label="Phone Number"
                            autoComplete="tel"
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email *"
                            required
                            aria-label="Email Address"
                            autoComplete="email"
                        />
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Subject *"
                            required
                            aria-label="Subject"
                            autoComplete="off"
                        />
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Write your message..."
                            required
                            aria-label="Message"
                            autoComplete="off"
                        ></textarea>
                        <button type="submit" className="btn" disabled={submitState.loading}>
                            {submitState.loading ? 'Sending...' : 'Submit Now'}
                        </button>
                        {submitState.error ? <p className="contact-feedback error">{submitState.error}</p> : null}
                        {submitState.success ? <p className="contact-feedback success">{submitState.success}</p> : null}
                    </form>
                </motion.div>

                <motion.div
                    className="contact-panel contact-panel-info"
                    id="contact"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="contact-badge"><span className="star-rotate">&#9733;</span> Reach Us</p>
                    <div>
                        <h2>We are here to support your vision with strategy, creativity, and execution.</h2>
                        <p className="contact-note">Prefer direct communication? Use any of the channels below.</p>
                    </div>
                    <div className="contact-channel-list">
                        <a href="mailto:ethiroli.net@gmail.com">
                            <i className="fa-regular fa-envelope"></i>
                            ethiroli.net@gmail.com
                        </a>
                        <a href="tel:+916380049042">
                            <i className="fa-solid fa-phone"></i>
                            +91 63800 49042
                        </a>
                        <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                            <i className="fa-solid fa-location-dot"></i>
                            1st Floor Gopala Krishnan complex guagi, Salem, India 636005
                        </a>
                    </div>
                    <a className="btn" href="#faq">Read FAQs</a>
                </motion.div>
            </section>

            <section id="faq" className="et-faq-section">
                <div className="et-faq-body">
                    <div className="et-faq-header">
                        <h3 className="et-faq-title">Frequently Asked Questions</h3>
                        <div className="et-faq-seperator"></div>
                    </div>

                    <div className="et-faq-list">
                        <div>
                            <details>
                                <summary title="What services does Eithiroli offer?">What services does Eithiroli offer?</summary>
                                <p className="et-faq-content">
                                    Eithiroli is a premier branding and marketing agency in Tamil Nadu offering brand strategy, visual identity design, performance marketing, marketing automation, SEO/AEO/GEO optimization, and high-converting lead generation.
                                </p>
                            </details>
                        </div>
                        <div>
                            <details>
                                <summary title="Do you provide marketing automation and digital presence services?">Do you provide marketing automation and digital presence services?</summary>
                                <p className="et-faq-content">
                                    Yes. We design and build high-converting brand landing pages, automated lead capture funnels, and CRM workflow integrations focused on user experience, fast performance, and customer conversion.
                                </p>
                            </details>
                        </div>
                        <div>
                            <details>
                                <summary title="How does Eithiroli generate leads for businesses?">How does Eithiroli generate leads for businesses?</summary>
                                <p className="et-faq-content">
                                    We deploy data-driven performance marketing strategies including multi-channel paid ads, automated marketing funnels, landing page optimization, and analytics tracking to generate high-intent leads and measurable business growth.
                                </p>
                            </details>
                        </div>
                        <div>
                            <details>
                                <summary title="Do you offer branding, personal branding, and SEO services?">Do you offer branding, personal branding, and SEO services?</summary>
                                <p className="et-faq-content">
                                    Yes. We provide complete brand strategy, logo design, visual identity, personal branding, and advanced SEO, AEO, and GEO optimization so your brand ranks top on Google and AI search engines.
                                </p>
                            </details>
                        </div>
                        <div>
                            <details>
                                <summary title="Do you provide digital marketing and creative internships?">Do you provide digital marketing and creative internships?</summary>
                                <p className="et-faq-content">
                                    Yes. As a women-led branding and marketing agency, Ethiroli empowers emerging talent through structured skill training, real-world internships, and hands-on campaign experience.
                                </p>
                            </details>
                        </div>
                    </div>
                </div>
            </section>
            <section className="et-map-section">
                <div className="et-map-frame">
                    <iframe
                        src="https://www.google.com/maps?q=1st+Floor+Gopala+Krishnan+complex+guagi,+Salem,+India+636005&output=embed"
                        title="Eithiroli Location"
                        className="et-map-iframe"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </section>
            <section className="et-cta-section">
                <div className="et-cta-content">
                    <h1>LET'S BUILD IMPACT TOGETHER</h1>
                    <a href="#contactFormSection" className="et-btn">Start a Conversation</a>
                </div>
            </section>

        </div>
    );
};

export default Contact;
