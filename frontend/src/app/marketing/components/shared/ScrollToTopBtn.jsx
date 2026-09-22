import React, { useState, useEffect } from 'react';

const ScrollToTopBtn = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 150) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button
            id="scrollToTopBtn"
            className={`scroll-to-top ${isVisible ? 'show' : ''}`}
            aria-label="Scroll to Top"
            onClick={scrollToTop}
        >
            <i className="fas fa-chevron-up"></i>
        </button>
    );
};

export default ScrollToTopBtn;
