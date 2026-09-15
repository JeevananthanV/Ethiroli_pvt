import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../shared/SEO';

const initialForm = {
    fullName: '',
    email: '',
    phone: '',
    role: '',
    portfolioUrl: '',
    experienceLevel: '',
    message: '',
};

const CareerApply = () => {
    const [searchParams] = useSearchParams();
    const preselectedRole = searchParams.get('role') || '';
    const [formData, setFormData] = useState(initialForm);
    const [submitState, setSubmitState] = useState({ loading: false, error: '', success: '' });

    useEffect(() => {
        if (!preselectedRole) return;
        setFormData((prev) => ({ ...prev, role: preselectedRole }));
    }, [preselectedRole]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitState({ loading: true, error: '', success: '' });

        try {
            const rawBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const apiBase = rawBase.replace(/\/api\/?$/, '');
            const response = await fetch(`${apiBase}/api/v1/candidates`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const payload = await response.json();
            if (!response.ok) {
                throw new Error(payload.message || 'Failed to submit application.');
            }

            setFormData(initialForm);
            setSubmitState({
                loading: false,
                error: '',
                success: 'Application submitted successfully. Our team will contact you soon.',
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
        <section className="career-apply-page">
            <SEO
                title="Apply for Career — Ethiroli Branding & Marketing Agency"
                description="Submit your application for internships and creative roles at Ethiroli Branding & Marketing Agency."
                canonical="https://ethiroli.net/career/apply"
                keywords="apply ethiroli, career application, internship application, marketing agency hiring"
            />
            <div className="career-apply-shell">
                <div className="career-apply-header">
                    <p className="career-apply-kicker">Career Application</p>
                    <h1>Apply To Ethiroli </h1>
                    <p className="career-apply-subtitle">
                        Fill the form below and submit your details. We review every application carefully.
                    </p>
                    <Link to="/career" className="career-apply-back">Back to Careers</Link>
                </div>

                <form className="career-apply-form" onSubmit={handleSubmit} autoComplete="on">
                    <label>
                        Full Name *
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            autoComplete="name"
                        />
                    </label>

                    <label>
                        Email Address *
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                        />
                    </label>

                    <label>
                        Phone Number *
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            autoComplete="tel"
                        />
                    </label>

                    <label>
                        Applying For *
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            autoComplete="off"
                        >
                            <option value="">Select a role</option>
                            <option value="Video Editor Intern">Video Editor </option>
                            <option value="Web Developer Intern">Web Developer </option>
                            <option value="Graphic Designer Intern">Graphic Designer </option>
                        </select>
                    </label>

                    <label>
                        Experience Level
                        <select
                            name="experienceLevel"
                            value={formData.experienceLevel}
                            onChange={handleChange}
                            autoComplete="off"
                        >
                            <option value="">Select level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </label>

                    <label>
                        Portfolio / Resume URL
                        <input
                            type="url"
                            name="portfolioUrl"
                            value={formData.portfolioUrl}
                            onChange={handleChange}
                            placeholder="https://"
                            autoComplete="url"
                        />
                    </label>

                    <label className="career-apply-full">
                        Why should we hire you? *
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={5}
                            required
                            autoComplete="off"
                        />
                    </label>

                    <button type="submit" className="btn career-apply-submit" disabled={submitState.loading}>
                        {submitState.loading ? 'Submitting...' : 'Submit Application'}
                    </button>

                    {submitState.error ? <p className="career-apply-error">{submitState.error}</p> : null}
                    {submitState.success ? <p className="career-apply-success">{submitState.success}</p> : null}
                </form>
            </div>
        </section>
    );
};

export default CareerApply;
