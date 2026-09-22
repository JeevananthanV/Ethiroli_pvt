import React, { useState } from 'react';
import JciHero from './jci/JciHero';
import JciMission from './jci/JciMission';
import JciImpact from './jci/JciImpact';
import JciJourney from './jci/JciJourney';
import JciAlumni from './jci/JciAlumni';
import JciEligibility from './jci/JciEligibility';
import JciFAQ from './jci/JciFAQ';
import '../../styles/jcidigitalskills.css';

const JciDigitalSkills = () => {
    const [activeFaq, setActiveFaq] = useState(null);

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    // Data Schema
    const projectData = {
        hero: {
            title: "Empowering the Next Generation of Women Leaders",
            subtitle: "A transformative partnership dedicated to nurturing talent, fostering entrepreneurship, and creating sustainable career pathways for women in Salem.",
            tag: "Empowerment & Heritage"
        },
        mission: {
            quote: "Every woman has the power to rise, lead, and transform her world. Our mission is to provide the bridge between potential and position.",
            author: "Vijitha Kannan",
            role: "Founder & CEO, Ethiroli Pvt. Ltd.",
            image: "/assets/images/founder/WhatsApp Image 2026-03-16 at 2.11.29 PM.jpeg"
        },
        impact: {
            stats: [
                { 
                    label: 'Direct Job Creation', 
                    value: '500+',
                    icon: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                    )
                },
                { 
                    label: 'Women Trained', 
                    value: '2k+',
                    icon: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    )
                },
                { 
                    label: 'College Partners', 
                    value: '15+',
                    icon: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                            <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                        </svg>
                    )
                },
                { 
                    label: 'Growth Success', 
                    value: '85%',
                    icon: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                            <polyline points="17 6 23 6 23 12"></polyline>
                        </svg>
                    )
                }
            ],
            title: "Measurable Impact, Sustained Growth",
            description: "Our program doesn't just teach—it employs. By bridging the gap between education and the creative industry, we are building a self-sustaining ecosystem.",
            features: [
                {
                    title: "Future Leader Mentorship",
                    description: "Personalized guidance from industry veterans throughout the journey.",
                    icon: (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    )
                },
                {
                    title: "Skill Modernization",
                    description: "Focusing on high-value digital assets and media production using AI-driven tools.",
                    icon: (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="16 18 22 12 16 6"></polyline>
                            <polyline points="8 6 2 12 8 18"></polyline>
                        </svg>
                    )
                }
            ]
        },
        journey: {
            title: "The Program Journey",
            description: "A structured, three-phase roadmap designed to take you from foundational knowledge to full-scale professional operations.",
            steps: [
                { 
                    title: 'College Training', 
                    description: 'Foundational seminars covering Digital Marketing Basics and essential soft skills for the modern workplace.',
                    tags: ["SEMINARS", "DIGITAL LITERACY"]
                },
                { 
                    title: '2-Month Internship', 
                    description: 'Hands-on experience in high-demand creative fields: Branding, Graphic Design, and Video Editing.',
                    tags: ["BRANDING", "DESIGN"]
                },
                { 
                    title: '1-Year Employment', 
                    description: 'Guaranteed placement within Branding & Media Operations roles to solidify your professional career.',
                    tags: ["OPERATIONS", "MANAGEMENT"]
                }
            ]
        },
        alumni: {
            title: "Life-Changing Transformations",
            description: "Real stories from our alumni who have successfully bridged the gap.",
            stories: [
                {
                    quote: "I was a fresh graduate unsure of how to use my creative skills in the real world. The internship at Ethiroli gave me the practical confidence I needed.",
                    author: "Priya S.",
                    location: "Salem"
                },
                {
                    quote: "The training program was a revelation. I learned tools I didn't even know existed. The one-year employment guarantee removed all my job-search stress.",
                    author: "Ananya R.",
                    location: "Mettur"
                }
            ]
        },
        eligibility: {
            title: "Is This For You?",
            description: "We are looking for motivated women ready to take the next step in their professional lives. You are the right fit if you are:",
            criteria: [
                "Final year college students across any discipline",
                "Recent graduates (2023-2026 batches)",
                "Currently studying students looking for internships",
                "Residents of Salem district and surrounding areas",
                "Eager to learn digital design and media management",
                "Committed to a long-term professional growth journey"
            ],
            image: "/assets/images/founder/WhatsApp Image 2026-03-16 at 2.11.29 PM.jpeg",
            floatCard: {
                title: "Limited Slots",
                description: "Applications for the next cohort close soon. Apply now!"
            }
        },
        faqs: [
            { question: "Are there any fees for the program?", answer: "The initial college seminars are free. The intensive internship and job placement training involve a nominal administrative fee, often subsidized through scholarships." },
            { question: "Do I need my own laptop?", answer: "Having your own laptop is recommended for training. For employment, workstations are provided at Ethiroli center." },
            { question: "How does the 1-year employment guarantee work?", answer: "Successful completion of the 2-month internship makes you eligible for an immediate 1-year contract." }
        ]
    };

    return (
        <div className="jci-digital-skills">
            <JciHero 
                {...projectData.hero} 
                onCtaClick={() => document.getElementById('eligibility')?.scrollIntoView()} 
            />
            
            <JciMission {...projectData.mission} />
            
            <JciImpact {...projectData.impact} />
            
            <JciJourney {...projectData.journey} />
            
            {/* <JciAlumni {...projectData.alumni} /> */}
            
            <div id="eligibility">
                <JciEligibility {...projectData.eligibility} />
            </div>
            
            <JciFAQ 
                title="Frequently Asked Questions" 
                faqs={projectData.faqs} 
                activeFaq={activeFaq} 
                onToggle={toggleFaq} 
            />
            
            <section className="jci-hero1" style={{ backgroundImage: "url('/assets/images/banner/banner.png')" , backgroundSize: 'cover', backgroundPosition: 'center', padding: '4rem 2rem', display: 'flex', }}>
                <div style={{ color: 'white' }}>
                    <h2 style={{ color: 'white', fontFamily: 'var(--jci-font-heading)', fontSize: '3rem', marginBottom: '1.5rem' }}>Be Part of the Journey</h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', marginBottom: '2.5rem' }}>Your involvement shapes the future of women in media and technology.</p>
                    <button className="jci-btn-primary jci-btn-clay">Apply Now</button>
                </div>
            </section>
        </div>
    );
};

export default JciDigitalSkills;
