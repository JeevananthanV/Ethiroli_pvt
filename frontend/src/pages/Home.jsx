import React from 'react';
import Hero from '../app/marketing/components/home/Hero';
import Marquee from '../app/marketing/components/home/Marquee';
import ServicesSlider from '../app/marketing/components/home/ServicesSlider';
import ProjectsPreview from '../app/marketing/components/home/ProjectsPreview';
import Activities from '../app/marketing/components/home/Activities';
import Testimonials from '../app/marketing/components/home/Testimonials';
import CTA from '../app/marketing/components/home/CTA';

const Home = () => {
    return (
        <div className="et-home-page-container">
            <Hero />
            <Marquee />
            <ServicesSlider />
            <ProjectsPreview />
            <Activities />
            <Testimonials />
            <CTA />
        </div>
    );
};

export default Home;
