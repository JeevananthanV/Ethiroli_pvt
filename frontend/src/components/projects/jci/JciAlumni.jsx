import React from 'react';

const JciAlumni = ({ title, description, stories }) => {
    return (
        <section className="jci-section-spacing">
            <div className="jci-section-header">
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
            <div className="jci-alumni-grid">
                {stories.map((story, idx) => (
                    <div key={idx} className="jci-glass-card">
                        <p className="jci-story-quote">"{story.quote}"</p>
                        <div className="jci-story-footer">
                            <strong className="jci-story-author">— {story.author}</strong>
                            <div className="jci-story-location">{story.location}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default JciAlumni;
