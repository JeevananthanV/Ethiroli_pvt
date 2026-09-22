import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, animate } from 'framer-motion';
import SEO from '../shared/SEO';
// import './GlamersStyles.css';

const GlamersGathering = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState('');
  const countersStartedRef = useRef(false);
  const revealRefs = useRef([]);
  const impactRef = useRef(null);

  // Counter animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersStartedRef.current) {
            countersStartedRef.current = true;
          }
        });
      },
      { threshold: 0.3 }
    );

    if (impactRef.current) observer.observe(impactRef.current);
    return () => observer.disconnect();
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0 },
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
  };

  const Counter = ({ target }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!countersStartedRef.current) return;
      const controls = animate(0, target, {
        duration: 2,
        ease: 'easeOut',
        onUpdate: (latest) => setCount(Math.round(latest)),
      });
      return () => controls.stop();
    }, [target]);

    return <span>{count}</span>;
  };

  useEffect(() => {
    const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const openLightbox = useCallback((src) => {
    setLightboxSrc(src);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [closeLightbox]);

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <div className="glamers-page">
      <SEO
        title="Glamers Gathering — Case Study | Ethiroli Branding & Marketing Agency"
        description="Explore how Ethiroli powered Glamers Gathering as official branding and marketing media partner, blending glamour, creative storytelling, and audience reach."
        canonical="https://ethiroli.net/projects/glamers-gathering"
        keywords="glamers gathering, ethiroli case study, event branding, marketing agency salem, fashion event media"
      />
      {/* ===== HERO SECTION ===== */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <motion.div className="hero-content reveal" ref={addToRefs} initial="hidden" animate="show" variants={stagger}>
          <h1 className="glam-heading">Glamers Gathering</h1>
          <p>
            Where glamour, creativity, and technology come together. Proudly powered by Ethiroli as the official digital partner.
          </p>
          <div className="hero-buttons">
            <a href="#showcase" className="btn">View Project</a>
            <a href="#gallery" className="btn btn-outline">Explore Gallery</a>
          </div>
        </motion.div>
      </section>

      {/* ===== PARTNERSHIP SECTION ===== */}
      <section className="partnership-section">
        <div className="container">
          <div className="grid-2">
            <motion.div className="reveal" ref={addToRefs} variants={fadeUp}>
              <span className="section-tag"><span className="star-rotate">★</span>Collaboration</span>
              <h2>Official Digital Partner</h2>
              <p>
                Ethiroli collaborated with Glamers Gathering to establish a powerful digital identity through website development, social media strategy, visual branding, and audience engagement.
              </p>
              <ul className="deliverables-list">
                <li><span className="check-icon">✔</span> Website Design & Dev</li>
                <li><span className="check-icon">✔</span> Social Media Mgmt</li>
                <li><span className="check-icon">✔</span> Digital Branding</li>
                <li><span className="check-icon">✔</span> Creative Strategy</li>
                <li><span className="check-icon">✔</span> Event Promotion</li>
                <li><span className="check-icon">✔</span> Audience Engagement</li>
              </ul>
            </motion.div>
            <motion.div className="mockup-wrapper reveal" ref={addToRefs} variants={fadeUp} whileHover={{ scale: 1.02, rotate: -0.5 }}>
              <img
                src="https://picsum.photos/seed/partnership/600/400"
                alt="Partnership Visuals"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section className="about-section">
        <motion.div className="container reveal" ref={addToRefs} variants={fadeUp}>
          <h2>About Glamers Gathering</h2>
          <div className="about-inner">
            <p>
              A platform celebrating fashion, creativity, women empowerment, and collaboration. The initiative connects models, makeup artists, designers, creators, and emerging talents through experiences that inspire confidence and innovation.
            </p>
            <div className="tags-container">
              <span className="tag">Fashion</span>
              <span className="tag">Empowerment</span>
              <span className="tag">Talent Growth</span>
              <span className="tag">Innovation</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== PROJECT SHOWCASE ===== */}
      <section id="showcase" className="showcase-section">
        <div className="container">
          <motion.div className="showcase-header reveal" ref={addToRefs} variants={fadeUp}>
            <span className="section-tag text-olive"><span className="star-rotate">★</span>Our Work</span>
            <h2>Project Showcase</h2>
          </motion.div>

          {/* Website */}
          <motion.div className="showcase-block reveal" ref={addToRefs} variants={fadeUp} whileHover={{ y: -6 }}>
            <div className="showcase-text">
              <h3>Website Experience</h3>
              <p>
                Designed and developed a modern, immersive, and responsive website experience that reflects the elegance and energy of Glamers Gathering.
              </p>
              <ul className="feature-list">
                <li><span className="check-icon">✔</span> Premium UI/UX</li>
                <li><span className="check-icon">✔</span> Mobile Responsive</li>
                <li><span className="check-icon">✔</span> Event Showcase</li>
              </ul>
            </div>
            <motion.div className="showcase-img" whileHover={{ scale: 1.02 }}>
              <img
                src="https://picsum.photos/seed/laptop/600/400"
                alt="Website Design"
              />
            </motion.div>
          </motion.div>

          {/* Social Media */}
          <motion.div className="showcase-block reverse reveal" ref={addToRefs} variants={fadeUp} whileHover={{ y: -6 }}>
            
            <motion.div className="showcase-img" whileHover={{ scale: 1.02 }}>
              <img
                src="https://picsum.photos/seed/social/600/500"
                alt="Social Media"
              />
            </motion.div>
            <div className="showcase-text">
              <h3>Social Media Presence</h3>
              <p>
                Created a visually engaging and audience-focused social media strategy to increase reach, awareness, and engagement across digital platforms.
              </p>
              <ul className="feature-list">
                <li><span className="check-icon">✔</span> Event Promotions</li>
                <li><span className="check-icon">✔</span> Reels & Content</li>
                <li><span className="check-icon">✔</span> Branding Consistency</li>
              </ul>
            </div>
          </motion.div>

          {/* Branding */}
          <motion.div className="showcase-block reveal" ref={addToRefs} variants={fadeUp} whileHover={{ y: -6 }}>
            <div className="showcase-text">
              <h3>Branding & Creative Direction</h3>
              <p>
                Developed a consistent visual identity combining glamour, elegance, and modern digital aesthetics to strengthen the event's presence online.
              </p>
            </div>
            <motion.div className="showcase-img" whileHover={{ scale: 1.02 }}>
              <img
                src="https://picsum.photos/seed/branding/600/400"
                alt="Branding"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== IMPACT SECTION ===== */}
      <section className="impact-section" ref={impactRef}>
        <div className="container">
          <h2 className="reveal" ref={addToRefs} style={{textAlign:'center'}}>Project Impact</h2>
          <div className="grid-4 impact-grid">
            <div className="stat-card reveal" ref={addToRefs}>
              <span className="stat-number"><Counter target={50} />+</span>
              <span className="stat-label">K+ Reach</span>
            </div>
            <div className="stat-card reveal" ref={addToRefs}>
              <span className="stat-number"><Counter target={10} />+</span>
              <span className="stat-label">K+ Engagement</span>
            </div>
            <div className="stat-card reveal" ref={addToRefs}>
              <span className="stat-number"><Counter target={30} />+</span>
              <span className="stat-label">Participants</span>
            </div>
            <div className="stat-card reveal" ref={addToRefs}>
              <span className="stat-number"><Counter target={100} /></span>
              <span className="stat-label">Assets</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GALLERY SECTION ===== */}
      <section id="gallery" className="gallery-section">
        <div className="container">
          <div className="gallery-header reveal" ref={addToRefs}>
            <h2>Event Gallery</h2>
          </div>
          <div className="masonry-grid">
            <motion.div
              className="gallery-item tall reveal"
              ref={addToRefs}
              onClick={() =>
                openLightbox('https://picsum.photos/seed/glam1/600/800')
              }
              variants={fadeUp}
              whileHover={{ scale: 1.03 }}
            >
              <img src="https://picsum.photos/seed/glam1/600/800" alt="Gallery 1" />
              <div className="gallery-overlay"><span>View</span></div>
            </motion.div>
            <motion.div
              className="gallery-item reveal"
              ref={addToRefs}
              onClick={() =>
                openLightbox('https://picsum.photos/seed/glam2/400/400')
              }
              variants={fadeUp}
              whileHover={{ scale: 1.03 }}
            >
              <img src="https://picsum.photos/seed/glam2/400/400" alt="Gallery 2" />
              <div className="gallery-overlay"><span>View</span></div>
            </motion.div>
            <motion.div
              className="gallery-item reveal"
              ref={addToRefs}
              onClick={() =>
                openLightbox('https://picsum.photos/seed/glam3/400/400')
              }
              variants={fadeUp}
              whileHover={{ scale: 1.03 }}
            >
              <img src="https://picsum.photos/seed/glam3/400/400" alt="Gallery 3" />
              <div className="gallery-overlay"><span>View</span></div>
            </motion.div>
            <motion.div
              className="gallery-item wide reveal"
              ref={addToRefs}
              onClick={() =>
                openLightbox('https://picsum.photos/seed/glam4/800/400')
              }
              variants={fadeUp}
              whileHover={{ scale: 1.03 }}
            >
              <img src="https://picsum.photos/seed/glam4/800/400" alt="Gallery 4" />
              <div className="gallery-overlay"><span>View</span></div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* ===== PROCESS SECTION ===== */}
      <section className="process-section">
        <motion.div className="container reveal" ref={addToRefs} variants={fadeUp}>
          <div className="process-header">
            <span className="section-tag text-olive"><span className="star-rotate">★</span>Workflow</span>
            <h2>Our Process</h2>
          </div>
          <div className="process-wrapper">
            <div className="process-step">
              <div className="step-circle">1</div>
              <h4>Discovery</h4>
            </div>
            <div className="process-step">
              <div className="step-circle">2</div>
              <h4>Strategy</h4>
            </div>
            <div className="process-step">
              <div className="step-circle">3</div>
              <h4>Branding</h4>
            </div>
            <div className="process-step">
              <div className="step-circle">4</div>
              <h4>Design</h4>
            </div>
            <div className="process-step">
              <div className="step-circle">5</div>
              <h4>Launch</h4>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== TESTIMONIAL SECTION ===== */}
      <section className="testimonial-section">
        <motion.div className="container reveal" ref={addToRefs} variants={fadeUp}>
          <div className="testimonial-quote-mark">❝</div>
          <p className="testimonial-text">
            “Ethiroli transformed our digital presence and helped Glamers Gathering reach a wider audience with a premium identity.”
          </p>
          <p className="testimonial-author">— Glamers Gathering Team</p>
        </motion.div>
      </section>

      {/* ===== BEHIND THE SCENES ===== */}
      {/* <section className="bts-section">
        <motion.div className="container reveal" ref={addToRefs} variants={fadeUp}>
          <h2>Behind The Scenes</h2>
          <div className="bts-grid">
            <div className="bts-item">
              <img src="https://picsum.photos/seed/bts1/400/400" alt="BTS 1" />
            </div>
            <div className="bts-item">
              <img src="https://picsum.photos/seed/bts2/400/400" alt="BTS 2" />
            </div>
            <div className="bts-item">
              <img src="https://picsum.photos/seed/bts3/400/400" alt="BTS 3" />
            </div>
            <div className="bts-item">
              <img src="https://picsum.photos/seed/bts4/400/400" alt="BTS 4" />
            </div>
          </div>
        </motion.div>
      </section> */}

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section">
        <div className="container reveal" ref={addToRefs}>
          <h2>Let’s Build Your Next Digital Experience</h2>
          <p>
            From branding and websites to social media campaigns, Ethiroli helps brands create impactful digital experiences.
          </p>
          <div className="cta-button-wrap">
            <a href="#" className="btn btn-cta">Start a Project</a>
          </div>
        </div>
      </section>

      {/* ===== LIGHTBOX ===== */}
      {lightboxOpen && (
        <div
          className="lightbox active"
          onClick={(e) => {
            if (e.target.tagName !== 'IMG') closeLightbox();
          }}
        >
          <button className="lightbox-close" onClick={closeLightbox}>
            ✕
          </button>
          <img src={lightboxSrc} alt="Full view" />
        </div>
      )}
    </div>
  );
};

export default GlamersGathering;
