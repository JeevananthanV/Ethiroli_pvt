import React from 'react';
import SEO from '../components/shared/SEO';
import CareerHero from '../components/career/CareerHero';
import CareerContent from '../components/career/CareerContent';

const Career = () => {
    return (
        <>
            <SEO
                title="Careers & Internships — Ethiroli Branding & Marketing Agency"
                description="Join Ethiroli Branding & Marketing Agency. Explore hands-on internships and roles in video editing, visual design, digital presence, and marketing automation."
                canonical="https://ethiroli.net/career"
                keywords="careers ethiroli, marketing internships, branding agency jobs, video editor intern, graphic designer intern, Salem digital agency"
            />
            <CareerHero />
            <CareerContent />
        </>
    );
};

export default Career;
