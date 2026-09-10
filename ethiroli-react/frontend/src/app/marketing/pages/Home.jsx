import React from 'react';
import SEO from '../components/shared/SEO';
import Hero from '../components/home/Hero';
import Marquee from '../components/home/Marquee';
import AboutPreview from '../components/home/AboutPreview';
import ServicesSlider from '../components/home/ServicesSlider';
import Activities from '../components/home/Activities';
import ProjectsPreview from '../components/home/ProjectsPreview';
import ContactForm from '../components/home/ContactForm';
import Testimonials from '../components/home/Testimonials';
// import CTA from '../components/home/CTA';
import CTAJoin from '../components/about/CTAJoin';

const Home = () => {
    return (
        <>
            <SEO
                title="Ethiroli — Premier Branding, Marketing & Automation Agency"
                description="Ethiroli is a premier branding and marketing agency in Tamil Nadu. We specialize in iconic brand identities, performance marketing, marketing automation, and SEO/AEO/GEO optimization."
                canonical="https://ethiroli.net/"
                keywords="branding agency, marketing agency, branding and marketing agency, marketing automation, performance marketing, SEO, AEO, GEO, lead generation, Salem branding agency, Tamil Nadu marketing agency, Ethiroli, ethiroli.net"
            />
            <Hero />
            <Marquee />
            <AboutPreview />
            <ServicesSlider />
            <Activities />
            <ProjectsPreview />
            <ContactForm />
            {/* <Testimonials /> */}
            {/* <CTA > */}
            <CTAJoin />
        </>
    );
};

export default Home;
