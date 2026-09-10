import React from 'react';
import SEO from '../components/shared/SEO';
import Hero from '../components/about/Hero';
import Introduction from '../components/about/Introduction';
import VisionMission from '../components/about/VisionMission';
import Leadership from '../components/about/Leadership';
import Team from '../components/about/Team';
import Projects from '../components/about/Projects';
import CTAJoin from '../components/about/CTAJoin';
import CTAabout from '../components/about/CTAabout';

const About = () => {
    return (
        <div className="ab-page">
            <SEO
                title="About Us — Ethiroli | Creative Branding & Marketing Agency"
                description="Discover Ethiroli, a premier women-led branding and marketing agency in Tamil Nadu. We empower brands with iconic design, marketing automation, and performance campaigns."
                canonical="https://ethiroli.net/about"
                keywords="about ethiroli, branding agency team, marketing agency founders, women-led marketing agency, Salem branding agency"
            />
            <Hero />
            <Introduction />
            <VisionMission />
            <Leadership />
            <Team />
            <Projects />
            <CTAabout />
        </div>
    );
};

export default About;
