import React from 'react';
import SEO from '../components/shared/SEO';
import Hero from '../components/home/Hero';
import Marquee from '../components/home/Marquee';
import ServicesSlider from '../components/home/ServicesSlider';
import ProjectsPreview from '../components/home/ProjectsPreview';
import Activities from '../components/home/Activities';
import Testimonials from '../components/home/Testimonials';
import CTA from '../components/home/CTA';

const Home = () => {
    return (
        <div className="et-home-page-container">
            <SEO    
                title="Ethiroli — Premier Branding, Marketing &amp; Automation Agency"
                description="Ethiroli is a premier branding and marketing agency in Tamil Nadu. We specialize in iconic brand identities, performance marketing, marketing automation, and SEO/AEO/GEO optimization."
                canonical="https://ethiroli.net/"
                keywords="branding agency, marketing agency, branding and marketing agency, marketing automation, performance marketing, SEO, AEO, GEO, lead generation, Salem branding agency, Tamil Nadu marketing agency, Ethiroli, ethiroli.net"
            />
            {/* 1. Hero Section */}
            <Hero />

            {/* 2. Client Logos */}
            <Marquee />

            {/* 3. Services / Solutions */}
            <ServicesSlider />

            {/* 4. Portfolio / Work */}
            <ProjectsPreview />

            {/* 5. Why Choose Ethiroli? */}
            <Activities />

            {/* 6. Testimonials */}
            <Testimonials />

            {/* 7. Strong CTA Section */}
            <CTA />
        </div>
    );
};

export default Home;
