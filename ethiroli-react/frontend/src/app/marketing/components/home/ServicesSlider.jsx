import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const servicesSet = [
    {
        id: 'branding',
        number: '01',
        title: 'Brand Identity',
        icon: '/assets/images/services/branding.png',
        description: 'Brand Identity is how a business presents itself through its logo, visual style, messaging, and distinct personality. We craft iconic brand identities so customers recognize, trust, and remember your business easily.'
    },
    {
        id: 'video',
        number: '02',
        title: 'Video Marketing',
        icon: '/assets/images/services/video.png',
        description: 'High-impact promotional videos, social reels, and brand storytelling that captivate audiences. We turn creative video concepts into powerful customer engagement and brand awareness.'
    },
    {
        id: 'seo-aeo-geo',
        number: '03',
        title: 'SEO, AEO & GEO',
        icon: '/assets/images/services/seo.png',
        description: 'Search Engine Optimization, Answer Engine Optimization, and Generative AI Optimization. We position your brand at the very top of Google, ChatGPT, Perplexity, and AI search results.'
    },
    {
        id: 'automation',
        number: '04',
        title: 'Marketing Automation',
        icon: '/assets/images/services/development.png',
        description: 'Automated lead nurturing, WhatsApp funnels, email sequences, and CRM workflow integrations. Streamline customer acquisition and close deals with zero manual friction.'
    },
    {
        id: 'lead',
        number: '05',
        title: 'Lead Generation',
        icon: '/assets/images/services/lead_generation.png',
        description: 'Data-driven customer acquisition funnels designed to turn online attention into qualified leads, measurable revenue, and sustainable long-term business growth.'
    },
    {
        id: 'uiux',
        number: '06',
        title: 'Brand UI/UX & Web Presence',
        icon: '/assets/images/services/ui_ux.png',
        description: 'Speed-optimized, high-converting brand websites and landing pages. We design intuitive digital touchpoints that reflect your brand identity and convert visitors into loyal clients.'
    },
    {
        id: 'graphic',
        number: '07',
        title: 'Graphic Design',
        icon: '/assets/images/services/graphic_design.png',
        description: 'Visual identity assets including posters, social media creatives, ad banners, and marketing collateral that communicate your brand values with elegance and impact.'
    }
];

const getVisibleSlides = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
};

const ServicesSlider = () => {
    const navigate = useNavigate();
    const clonesCount = servicesSet.length;
    const slides = [...servicesSet, ...servicesSet, ...servicesSet];

    const [currentIndex, setCurrentIndex] = useState(clonesCount);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [visibleSlides, setVisibleSlides] = useState(() => getVisibleSlides());
    const [isPaused, setIsPaused] = useState(false);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => {
            if (prev >= slides.length - visibleSlides) return prev;
            setIsTransitioning(true);
            return prev + 1;
        });
    }, [slides.length, visibleSlides]);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => {
            if (prev <= 0) return prev;
            setIsTransitioning(true);
            return prev - 1;
        });
    }, []);

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            handleNext();
        }, 3500);
        return () => clearInterval(interval);
    }, [handleNext, isPaused]);

    useEffect(() => {
        const handleResize = () => {
            setVisibleSlides(getVisibleSlides());
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleTransitionEnd = () => {
        if (currentIndex >= clonesCount * 2) {
            setIsTransitioning(false);
            setCurrentIndex(clonesCount);
        } else if (currentIndex < clonesCount) {
            setIsTransitioning(false);
            setCurrentIndex(clonesCount * 2 - 1);
        }
    };

    const getLogicalIndex = () => {
        return (currentIndex - clonesCount + clonesCount) % clonesCount;
    };

    return (
        <section className="et-services-section" id="services">
            <div className="et-services-label">
                <p><span className="star-rotate">&#9733;</span>Branding & Marketing Services</p>
            </div>
            <div className="et-services-intro">
                <h3>We Deliver Powerful Branding & Marketing Strategies That Drive Growth</h3>
                <button onClick={() => navigate('/services')}>Explore All Services <i className="fas fa-arrow-right"></i></button>
            </div>

            <div
                className="et-services-slider-wrapper"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
            >
                <button className="et-services-nav et-services-nav-prev" aria-label="Previous Service" onClick={handlePrev}>
                    <i className="fas fa-chevron-left"></i>
                </button>

                <div
                    className="et-services-slider"
                    style={{
                        '--visible-slides': visibleSlides,
                        '--current-index': currentIndex
                    }}
                >
                    <div
                        className="et-services-track"
                        style={{
                            transition: isTransitioning ? 'transform 0.55s cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
                        }}
                        onTransitionEnd={handleTransitionEnd}
                    >
                        {slides.map((service, idx) => {
                            const logicalIdx = getLogicalIndex();
                            const isOriginalSet = Math.floor(idx / clonesCount) === 1;
                            const isCurrent = isOriginalSet && (idx % clonesCount === logicalIdx);

                            return (
                                <div className={`et-services-slide ${isCurrent ? 'active' : ''}`} key={`${service.id}-${idx}`}>
                                    <div className="et-glass-card">
                                        <div className="media">
                                            <img src={service.icon} alt={`${service.title} Icon`} />
                                            <p className="desc">{service.number}</p>
                                        </div>
                                        <div className="title">
                                            <h3>{service.title}</h3>
                                            <div className="thumb-wrapper">
                                                <p>{service.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <button className="et-services-nav et-services-nav-next" aria-label="Next Service" onClick={handleNext}>
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>
        </section>
    );
};

export default ServicesSlider;
