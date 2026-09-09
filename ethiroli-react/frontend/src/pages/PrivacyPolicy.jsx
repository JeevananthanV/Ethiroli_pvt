import React from 'react';
import { motion } from 'framer-motion';

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 },
    },
};

const PrivacyPolicy = () => {
    const sections = [
        {
            id: 'introduction',
            title: 'Introduction',
            body: 'At Eithiroli, we are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website and services. By engaging with us, you agree to the practices described in this policy.',
        },
        {
            id: 'information-we-collect',
            title: 'Information We Collect',
            body: 'We may collect personal information such as your name, email address, phone number, company details, and any other information you voluntarily provide when filling out forms, subscribing to newsletters, or contacting us. We also collect non-personal data such as browser type, IP address, and usage statistics.',
        },
        {
            id: 'how-we-use-information',
            title: 'How We Use Information',
            body: 'We use the information we collect to deliver and improve our services, respond to your inquiries, send relevant updates, and personalize your experience. We do not sell or rent your personal data to third parties. Processing is based on your consent or our legitimate business interests.',
        },
        {
            id: 'data-sharing',
            title: 'Data Sharing',
            body: 'We may share your information with trusted service providers who assist us in operating our business, subject to strict confidentiality obligations. We may also disclose information when required by law, regulation, or legal process. Aggregate, anonymized data may be used for analytics purposes.',
        },
        {
            id: 'data-security',
            title: 'Data Security',
            body: 'We implement industry-standard security measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction. While we strive to safeguard your information, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.',
        },
        {
            id: 'your-rights',
            title: 'Your Rights',
            body: 'You have the right to access, update, or delete the personal information we hold about you. You may also object to certain processing activities or request data portability. To exercise these rights, please contact us using the details provided below.',
        },
        {
            id: 'contact-us',
            title: 'Contact Us',
            body: 'If you have any questions or concerns about this Privacy Policy, please reach out to us at ethiroli.net@gmail.com or call +91 63800 49042. We are located at 1st Floor Gopala Krishnan complex guagi, Salem, India 636005.',
        },
    ];

    return (
        <div className="ab-page">
            <section className="ab-hero" style={{ backgroundImage: "url('/assets/images/banner/banner.png')" }}>
                <motion.div
                    className="ab-hero-content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Privacy Policy
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Your trust matters. Learn how we collect, use, and protect your personal information.
                    </motion.p>
                </motion.div>
            </section>

            <section className="ab-section">
                <div className="ab-container">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.id}
                            id={section.id}
                            className="ab-copy ab-title-center"
                            variants={fadeIn}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <h2>{section.title}</h2>
                            <p>{section.body}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
