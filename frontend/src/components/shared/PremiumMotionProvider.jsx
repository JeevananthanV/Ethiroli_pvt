import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fadeIn, fadeInDown, fadeInUp, pulse, zoomIn } from 'react-animations';

const STYLE_ID = 'premium-react-animations';

const toKebabCase = (value) => value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

const frameToCss = (frame) =>
    Object.entries(frame)
        .map(([property, cssValue]) => `${toKebabCase(property)}: ${cssValue};`)
        .join(' ');

const animationToKeyframes = (name, animation) => {
    const frames = Object.entries(animation)
        .map(([step, frame]) => `${step} { ${frameToCss(frame)} }`)
        .join(' ');

    return `@keyframes ${name} { ${frames} }`;
};

const ensurePremiumKeyframes = () => {
    if (document.getElementById(STYLE_ID)) {
        return;
    }

    const styleTag = document.createElement('style');
    styleTag.id = STYLE_ID;
    styleTag.textContent = [
        animationToKeyframes('premiumFadeIn', fadeIn),
        animationToKeyframes('premiumFadeInDown', fadeInDown),
        animationToKeyframes('premiumFadeInUp', fadeInUp),
        animationToKeyframes('premiumZoomIn', zoomIn),
        animationToKeyframes('premiumPulse', pulse),
    ].join('\n');

    document.head.appendChild(styleTag);
};

const PremiumMotionProvider = () => {
    const location = useLocation();

    useEffect(() => {
        ensurePremiumKeyframes();
        document.body.classList.add('premium-motion-ready');

        return () => {
            document.body.classList.remove('premium-motion-ready');
        };
    }, []);

    useEffect(() => {
        const routeStage = document.querySelector('main');
        const revealTargets = document.querySelectorAll(
            'main header, main section, .ab-card-premium, .et-card, .et-glass-card, .et-footer-dark'
        );

        if (routeStage) {
            routeStage.classList.remove('premium-route-enter');
            void routeStage.offsetWidth;
            routeStage.classList.add('premium-route-enter');
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.18, rootMargin: '0px 0px -12% 0px' }
        );

        revealTargets.forEach((target, index) => {
            target.classList.add('premium-reveal');
            target.classList.remove('is-visible');
            target.style.setProperty('--premium-delay', `${Math.min(index * 70, 560)}ms`);
            observer.observe(target);
        });

        return () => {
            observer.disconnect();
        };
    }, [location.pathname]);

    return null;
};

export default PremiumMotionProvider;
