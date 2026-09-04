import React, { useState } from 'react';

const ContactForm = () => {
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
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const response = await fetch(`${baseUrl}/api/contact-messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, source: 'free_consultation' }),
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
                success: 'Thanks! We will contact you shortly.',
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
        <section className="et-consultation-section" style={{ backgroundImage: "url('/assets/images/banner/banner.png')" }}>
            <div className="et-consultation-form-wrapper">
                <h1>Free Consultation</h1>
                <p>We’ve been doing this for a while now and great news for deliver results that matter.</p>
                <form className="et-consultation-form" id="contactForm" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name *"
                        required
                        aria-label="Your Name"
                    />
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone No *"
                        required
                        aria-label="Phone Number"
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter E-Mail *"
                        required
                        aria-label="Email Address"
                    />
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Subject *"
                        required
                        aria-label="Subject"
                    />
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Write Message..."
                        required
                        aria-label="Message"
                    ></textarea>
                    <button type="submit" disabled={submitState.loading}>
                        {submitState.loading ? 'Sending...' : 'SUBMIT NOW'}
                    </button>
                    {submitState.error ? <p className="contact-feedback error">{submitState.error}</p> : null}
                    {submitState.success ? <p className="contact-feedback success">{submitState.success}</p> : null}
                </form>
            </div>

            <div className="contact-info">
                <p><span className="star-rotate">★</span> Contact Us</p>
                <div className="h1-wrapper">
                    <h1>Let’s Make Your Website Work Smarter — Contact for Marketing Help<br /></h1>
                </div>
                <div className="contact-item">
                    <a href="mailto:ethiroli.net@gmail.com">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        ethiroli.net@gmail.com
                    </a>
                    <a href="tel:+916380049042">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        +91 63800 49042
                    </a>
                </div>
                <button>All Blog Post</button>
            </div>
        </section>
        
    );
};

export default ContactForm;
