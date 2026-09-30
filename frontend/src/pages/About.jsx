import React from 'react';
import Hero from '../components/about/Hero';
import Introduction from '../components/about/Introduction';
import VisionMission from '../components/about/VisionMission';
import Leadership from '../components/about/Leadership';
import Team from '../components/about/Team';
import Projects from '../components/about/Projects';
import CTAabout from '../components/about/CTAabout';

const About = () => {
    return (
        <div className="ab-page">
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
