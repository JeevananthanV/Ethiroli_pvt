import React from 'react';
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
