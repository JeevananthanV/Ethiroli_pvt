import React, { useState, useEffect, useCallback } from 'react';

const servicesSet = [
    {
        id: 'branding',
        number: '01',
        title: 'Brand Identity',
        icon: '/assets/images/services/branding.png',
        description: 'Brand Identity is the way a business presents itself to the public through its logo, colors, design style, messaging, and overall personality. We help businesses create a strong brand identity so customers can recognize, trust, and remember the brand easily.'
    },
    {
        id: 'video',
        number: '02',
        title: 'Video editing',
        icon: '/assets/images/services/video.png', // assumed missing extension from source html
        description: 'Video creation means producing engaging videos to promote a business, product, or service. We create promotional videos, reels, and ads that attract attention on social media and help businesses connect with their audience. These videos help increase brand awareness and customer engagement.'
    },
    {
        id: 'seo',
        number: '03',
        title: 'Search Engine Optimization',
        icon: '/assets/images/services/seo.png',
        description: 'We focus on SEO-based lead generation strategies to bring potential customers to your business. Our goal is to increase online visibility, website traffic, and high-quality leads for sustainable growth.'
    },
    {
        id: 'dev',
        number: '04',
        title: 'Web & Mobile Development',
        icon: '/assets/images/services/development.png',
        description: 'Web development involves building responsive, SEO-friendly websites that help businesses establish a strong online presence. It includes website design, development, and optimization to improve user experience, website performance, and digital visibility.'
    },
    {
        id: 'lead',
        number: '05',
        title: 'Lead Generation',
        icon: '/assets/images/services/lead_generation.png',
        description: 'We create powerful lead generation strategies that bring the right customers to your business. Our goal is to turn online attention into real leads and long-term growth.'
    },
    {
        id: 'uiux',
        number: '06',
        title: 'UI/UX Design',
        icon: '/assets/images/services/ui_ux.png',
        description: 'UX/UI design focuses on creating a user-friendly website and mobile app design that improves user experience and interface usability. It helps businesses build responsive websites, improve website performance, and increase customer engagement through effective digital design.'
    },
    {
        id: 'graphic',
        number: '07',
        title: 'Graphic Design',
        icon: '/assets/images/services/graphic_design.png',
        description: 'Graphic design involves creating visual content such as posters, social media creatives, banners, and marketing materials for businesses. It helps present the brand in a professional and attractive way. Good graphic design grabs attention and communicates the brand message clearly.'
    }


];

const getVisibleSlides = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
};

const ServicesSlider = () => {
    // By duplicating sets, we get infinite scroll effect when translating bounds
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

    // Auto Play
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            handleNext();
        }, 3500);
        return () => clearInterval(interval);
    }, [handleNext, isPaused]);

    useEffect(() => {
        const handleResize = () => {
            const next = getVisibleSlides();
            setVisibleSlides((prev) => {
                if (prev === next) return prev;
                setIsTransitioning(false);
                setCurrentIndex(clonesCount);
                return next;
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [clonesCount]);

    const handleTransitionEnd = () => {
        setIsTransitioning(false);
        // Seamless loop jump
        if (currentIndex <= clonesCount - 1) {
            setCurrentIndex(currentIndex + clonesCount);
        } else if (currentIndex >= clonesCount * 2) {
            setCurrentIndex(currentIndex - clonesCount);
        }
    };

    const jumpToSlide = (index) => {
        setIsTransitioning(true);
        setCurrentIndex(clonesCount + index);
    };

    const getLogicalIndex = () => ((currentIndex - clonesCount) % clonesCount + clonesCount) % clonesCount;

    return (
        <section className="et-services-section" id="services">
            <div className="et-services-label">
                <p><span className="star-rotate">&#9733;</span>Ethiroli Services</p>
            </div>
            <div className="et-services-intro">
                <h3>We Deliver Powerful Digital Solutions That Drive Growth</h3>
                <button>Ethiroli Services <i className="fas fa-arrow-right"></i></button>
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

            <div className="et-services-dots">
                {servicesSet.map((_, idx) => (
                    <button
                        key={`dot-${idx}`}
                        className={`et-services-dot ${getLogicalIndex() === idx ? 'active' : ''}`}
                        aria-label={`Slide ${idx + 1}`}
                        onClick={() => jumpToSlide(idx)}
                    ></button>
                ))}
            </div>
        </section>
    );
};

export default ServicesSlider;

