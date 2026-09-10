import React from 'react';
import { motion } from 'framer-motion';

const teamMembers = [
    {
        name: "Vijitha Kannan",
        role: "Founder & CEO",
        image: "/assets/images/team/founder.png",
        linkedin: "https://www.linkedin.com/in/vijitha-kannan-2i2h1a/"
    },
    {
        name: "Balaji G.E.",
        role: "Co-Founder & COO",
        image: "/assets/images/team/co-founder.png",
        linkedin: "https://www.linkedin.com/in/balaji-elango-6383b8292"
    },
    {
        name: "Jeevananthan",
        role: "Senior Developer",
        image: "/assets/images/team/jeeva cool.png",
        linkedin: "https://www.linkedin.com/company/ethiroli-pvt-ltd/"
    },
    {
        name: "Reshma",
        role: "Business Development Executive",
        image: "/assets/images/team/reshma.png",
        linkedin: "https://www.linkedin.com/company/ethiroli-pvt-ltd/"
    },
    // {
    //     name: "Daniel Foster",
    //     role: "Creative Director",
    //     image: "/assets/images/team/team5.png"
    // }
];

const Team = () => {
    return (
        <section className="et-team-section" aria-labelledby="team-title">
            <div className="et-team-header">
                <span className="et-label"><span className="star-rotate">★</span>Meet our</span>
                <h2 id="team-title">Team</h2>
                <p>A diverse group of thinkers, creators, and strategists dedicated to building the future of design.</p>
            </div>

            <span className="et-watermark">team</span>

            <div className="et-grid">
                {teamMembers.map((member, idx) => (
                    <motion.article
                        key={idx}
                        className="et-card"
                        itemScope
                        itemType="http://schema.org/Person"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                    // Mimicking CSS .is-visible state natively with Framer instead
                    >
                        <img src={member.image} alt={`${member.name} - ${member.role}`} itemProp="image" loading="lazy" />
                        <div className="et-card-content">
                            <h3 itemProp="name">{member.name}</h3>
                            <p itemProp="jobTitle">{member.role}</p>
                            <div className="et-social-links">
                                <a
                                    href={member.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn Profile"
                                    itemProp="sameAs"
                                >
                                    <i className="fa-brands fa-linkedin-in"></i>
                                </a>
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>
        </section>
    );
};

export default Team;
