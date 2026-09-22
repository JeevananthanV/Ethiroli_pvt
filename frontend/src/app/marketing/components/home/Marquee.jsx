import React from 'react';
import { motion } from 'framer-motion';

const clientLogos = [
    {
        name: "AAROGYA HOSPITALS",
        logo: "/assets/images/logos/aarogya_hospitals.svg"
    },
    {
        name: "SRI SAI FOODS",
        logo: "/assets/images/logos/sri_sai_foods.svg"
    },
    {
        name: "VetriTech",
        logo: "/assets/images/logos/vetritech.svg"
    },
    {
        name: "MARUTHI CONSTRUCTIONS",
        logo: "/assets/images/logos/maruthi_constructions.svg"
    },
    {
        name: "Bloom BOUTIQUE",
        logo: "/assets/images/logos/bloom_boutique.svg"
    },
    {
        name: "ZENITH ACADEMY",
        logo: "/assets/images/logos/zenith_academy.svg"
    }
];

const Marquee = () => {
    return (
        <section className="replica-logos-section">
            <motion.div 
                className="replica-container" 
                style={{ textAlign: 'center', marginBottom: '24px' }}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <span className="subtitle">
                    <span className="star-rotate">★</span> Trusted by Businesses Across Industries
                </span>
            </motion.div>
            
            {/* Infinite Marquee Logo Scroll */}
            <motion.div 
                className="replica-marquee-container"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
            >
                <div className="replica-marquee-track">
                    {/* First set of logos */}
                    {clientLogos.map((client, idx) => (
                        <div className="replica-logo-item" key={`orig-${idx}`}>
                            <img 
                                src={client.logo} 
                                alt={`${client.name} logo`} 
                                className="replica-logo-img" 
                                loading="lazy"
                            />
                        </div>
                    ))}
                    {/* Cloned set 1 for infinite continuous scrolling */}
                    {clientLogos.map((client, idx) => (
                        <div className="replica-logo-item" key={`clone-1-${idx}`} aria-hidden="true">
                            <img 
                                src={client.logo} 
                                alt="" 
                                className="replica-logo-img" 
                                loading="lazy"
                            />
                        </div>
                    ))}
                    {/* Cloned set 2 to guarantee seamlessness on ultra-wide screens */}
                    {clientLogos.map((client, idx) => (
                        <div className="replica-logo-item" key={`clone-2-${idx}`} aria-hidden="true">
                            <img 
                                src={client.logo} 
                                alt="" 
                                className="replica-logo-img" 
                                loading="lazy"
                            />
                        </div>
                    ))}
                    {/* Cloned set 3 */}
                    {clientLogos.map((client, idx) => (
                        <div className="replica-logo-item" key={`clone-3-${idx}`} aria-hidden="true">
                            <img 
                                src={client.logo} 
                                alt="" 
                                className="replica-logo-img" 
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default Marquee;

