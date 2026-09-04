import React, { useState, useEffect, useRef } from 'react';

const CountUp = ({ target, duration = 1200, start }) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        if (start) return undefined;
        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && !hasAnimated) {
                setHasAnimated(true);
            }
        }, { threshold: 0.35 });

        if (elementRef.current) observer.observe(elementRef.current);
        return () => observer.disconnect();
    }, [hasAnimated, start]);

    useEffect(() => {
        const shouldAnimate = start || hasAnimated;
        if (!shouldAnimate) return;

        let startTime = null;
        const tick = (now) => {
            if (!startTime) startTime = now;
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const value = Math.round(target * eased);
            setCount(value);

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };
        requestAnimationFrame(tick);
    }, [hasAnimated, start, target, duration]);

    return <span ref={elementRef}>{count}</span>;
};

const Activities = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <section className="et-activities-section" id="activities">
            <div className="et-activities-header">
                <p className="et-activities-kicker"><span className="star-rotate">&#9733;</span> Our Activities</p>
                <h2>Empowering Through Action</h2>
                <p className="et-activities-subtitle">
                    We are committed to empowering women entrepreneurs through focused programs, practical support, and measurable outcomes.
                </p>
            </div>

            <div className="et-activities-impact-grid">
                <article
                    className="et-impact-card"
                    onMouseEnter={() => setActiveIndex(0)}
                    onMouseLeave={() => setActiveIndex(null)}
                    onFocus={() => setActiveIndex(0)}
                    onBlur={() => setActiveIndex(null)}
                >
                    <p className="et-impact-value"><CountUp target={155} start={activeIndex === 0} />+</p>
                    <p className="et-impact-label">Women Trained</p>
                </article>
                <article
                    className="et-impact-card"
                    onMouseEnter={() => setActiveIndex(1)}
                    onMouseLeave={() => setActiveIndex(null)}
                    onFocus={() => setActiveIndex(1)}
                    onBlur={() => setActiveIndex(null)}
                >
                    <p className="et-impact-value"><CountUp target={15} start={activeIndex === 1} />+</p>
                    <p className="et-impact-label">Projects Completed</p>
                </article>
                <article
                    className="et-impact-card"
                    onMouseEnter={() => setActiveIndex(2)}
                    onMouseLeave={() => setActiveIndex(null)}
                    onFocus={() => setActiveIndex(2)}
                    onBlur={() => setActiveIndex(null)}
                >
                    <p className="et-impact-value"><CountUp target={30} start={activeIndex === 2} /> hrs </p>
                    <p className="et-impact-label">Hours Worked</p>
                </article>
                <article
                    className="et-impact-card"
                    onMouseEnter={() => setActiveIndex(3)}
                    onMouseLeave={() => setActiveIndex(null)}
                    onFocus={() => setActiveIndex(3)}
                    onBlur={() => setActiveIndex(null)}
                >
                    <p className="et-impact-value"><CountUp target={8} start={activeIndex === 3} />+</p>
                    <p className="et-impact-label">Internships Enabled</p>
                </article>
            </div>
        </section>
    );
};

export default Activities;
