import React from 'react';

const Marquee = () => {
    // Duplicated twice to ensure seamless infinite pure CSS scroll
    const items = [
        "Search Engine Optimization (SEO)",
        "Pay-Per-Click Advertising (PPC)",
        "Content Marketing",
        "Email Marketing",
        "Web Design and Development",
        "Social Media Marketing (SMM)"
    ];

    return (
        <section className="et-services-marquee">
            <div className="et-marquee-track">
                {items.map((item, idx) => (
                    <div className="et-marquee-item " key={`orig-${idx}`}>{item}</div>
                ))}
                {/* Clone for infinite scroll seamlessly */}
                {items.map((item, idx) => (
                    <div className="et-marquee-item " aria-hidden="true" key={`clone-${idx}`}>{item}</div>
                ))}
            </div>
        </section>
    );
};

export default Marquee;
