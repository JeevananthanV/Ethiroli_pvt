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

const TermsOfService = () => {
    const sections = [
        {
            id: 'acceptance-of-terms',
            title: 'Acceptance of Terms',
            body: 'By accessing or using Eithiroli\'s website and services, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, please do not use our services. We reserve the right to update or modify these terms at any time, and continued use constitutes acceptance of the revised terms.',
        },
        {
            id: 'services-description',
            title: 'Services Description',
            body: 'Eithiroli provides digital marketing, branding, website development, lead generation, and related services as described on our website. The scope, deliverables, and timelines for each engagement are agreed upon individually and documented in a separate service agreement or statement of work.',
        },
        {
            id: 'user-responsibilities',
            title: 'User Responsibilities',
            body: 'You agree to use our services in a manner consistent with all applicable laws and regulations. You are responsible for providing accurate information, maintaining the confidentiality of your account credentials, and promptly notifying us of any unauthorized use of your account or services.',
        },
        {
            id: 'intellectual-property',
            title: 'Intellectual Property',
            body: 'All content, trademarks, logos, and other intellectual property displayed on this website are the property of Eithiroli or its licensors. Nothing in these terms grants you any right to use our proprietary materials without our prior written consent. Client deliverables are handled according to individual agreements.',
        },
        {
            id: 'limitation-of-liability',
            title: 'Limitation of Liability',
            body: 'Eithiroli shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of our services. Our total liability for any claim arising from these terms shall not exceed the amount paid by you to us for the specific services giving rise to the claim.',
        },
        {
            id: 'changes-to-terms',
            title: 'Changes to Terms',
            body: 'We may revise these Terms of Service periodically. When we do, we will update the effective date and post the revised terms on this page. It is your responsibility to review these terms regularly. Your continued use of our services after any changes constitutes your acceptance of the updated terms.',
        },
        {
            id: 'contact-information',
            title: 'Contact Information',
            body: 'For questions regarding these Terms of Service, please contact us at ethiroli.net@gmail.com or call +91 63800 49042. Our registered address is 1st Floor Gopala Krishnan complex guagi, Salem, India 636005.',
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
                        Terms of Service
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Please read these terms carefully before using our services.
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

export default TermsOfService;
