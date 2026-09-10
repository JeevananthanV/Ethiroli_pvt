import React from 'react';
import { Link } from 'react-router-dom';

const CTA = () => {
    return (
        <section className="et-cta-section">
            <div className="et-cta-content">
                <h1>LET’S — DISCUSS NEW PROJECT</h1>
                <Link to="/contact_us" className="et-cta-btn btn">Contact Us</Link>
            </div>
        </section>
    );
};

export default CTA;
