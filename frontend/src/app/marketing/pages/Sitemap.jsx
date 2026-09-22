import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/shared/SEO';

const sitemapSections = [
  {
    category: 'Core Pages',
    icon: 'home',
    links: [
      { name: 'Home — Branding & Marketing Agency', path: '/' },
      { name: 'About Us — Mission, Vision & Team', path: '/about' },
      { name: 'Services — Branding, Marketing & Automation', path: '/services' },
      { name: 'Projects — Portfolio & Case Studies', path: '/projects' },
      { name: 'Career — Internships & Openings', path: '/career' },
      { name: 'Contact Us — Inquiries & Consultations', path: '/contact_us' },
    ],
  },
  {
    category: 'Branding & Marketing Services',
    icon: 'palette',
    links: [
      { name: 'Brand Identity & Visual Storytelling', path: '/services#disciplines' },
      { name: 'Performance Marketing & Multi-Channel Ads', path: '/services#disciplines' },
      { name: 'Marketing Automation & Lead Funnels', path: '/services#disciplines' },
      { name: 'SEO, AEO & GEO (AI Search Optimization)', path: '/services#disciplines' },
      { name: 'Brand UI/UX Design & Landing Pages', path: '/services#disciplines' },
      { name: 'Video Marketing & Motion Production', path: '/services#disciplines' },
      { name: 'Lead Generation & Sales Pipelines', path: '/services#disciplines' },
    ],
  },
  {
    category: 'Case Studies & Community Impact',
    icon: 'campaign',
    links: [
      { name: 'Empowering Women with JCI & Digital Skills', path: '/projects/jci-digital-skills' },
      { name: 'Glamers Gathering — Fashion & Media Event', path: '/projects/glamers-gathering' },
      { name: 'Empowering Students Seminar (Jayarani College)', path: '/projects/Ethiroliseminarjayarani' },
      { name: 'Digital Strategy & Business Models (KSRCT)', path: '/projects/Ethiroliseminarksrct' },
    ],
  },
  {
    category: 'Careers & Team',
    icon: 'work',
    links: [
      { name: 'Careers & Internship Opportunities', path: '/career' },
      { name: 'Apply for Open Positions', path: '/career/apply' },
      { name: 'Leadership & Creative Team', path: '/about#team' },
    ],
  },
  {
    category: 'Legal, Compliance & Meta',
    icon: 'policy',
    links: [
      { name: 'Privacy Policy', path: '/privacy-policy' },
      { name: 'Terms of Service', path: '/terms-of-service' },
      { name: 'Frequently Asked Questions (FAQs)', path: '/contact_us#faq' },
      { name: 'XML Sitemap (Search Engines)', path: '/sitemap.xml', external: true },
    ],
  },
];

const Sitemap = () => {
  return (
    <div className="ab-page sitemap-page">
      <SEO
        title="HTML Sitemap — Ethiroli Branding & Marketing Agency"
        description="Comprehensive sitemap of Ethiroli. Explore our branding, performance marketing, marketing automation, SEO/AEO/GEO services, and case studies on ethiroli.net."
        canonical="https://ethiroli.net/sitemap"
        keywords="sitemap, ethiroli sitemap, branding agency pages, marketing agency navigation, ethiroli.net"
      />
      <section className="ab-hero" style={{ backgroundImage: "url('/assets/images/banner/banner.png')" }}>
        <motion.div
          className="ab-hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Site Directory & Sitemap</h1>
          <p>Complete guide to all pages, services, and resources on ethiroli.net</p>
        </motion.div>
      </section>

      <section className="ab-section" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          {sitemapSections.map((sec, idx) => (
            <motion.div
              key={sec.category}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '28px',
                backdropFilter: 'blur(10px)',
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <span className="material-symbols-outlined" style={{ color: '#d4af37', fontSize: '24px' }}>
                  {sec.icon}
                </span>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>{sec.category}</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {sec.links.map((link) => (
                  <li key={link.name} style={{ marginBottom: '12px' }}>
                    {link.external ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#b0b8c4',
                          textDecoration: 'none',
                          fontSize: '0.95rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#d4af37')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#b0b8c4')}
                      >
                        <span>→</span> {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        style={{
                          color: '#b0b8c4',
                          textDecoration: 'none',
                          fontSize: '0.95rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#d4af37')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#b0b8c4')}
                      >
                        <span>→</span> {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Sitemap;
