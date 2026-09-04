import React from 'react';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const EthiroliPage = () => {
  const [ready, setReady] = useState(false);
  const marqueeLogos = [
    { src: '/assets/images/services/branding.png', alt: 'Branding' },
    { src: '/assets/images/services/development.png', alt: 'Development' },
    { src: '/assets/images/services/graphic_design.png', alt: 'Graphic Design' },
    { src: '/assets/images/services/lead_generation.png', alt: 'Lead Generation' },
    { src: '/assets/images/services/seo.png', alt: 'SEO' },
    { src: '/assets/images/services/ui_ux.png', alt: 'UI UX' },
    { src: '/assets/images/services/video.png', alt: 'Video Editing' },
  ];

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 650);
    return () => window.clearTimeout(t);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0 },
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
  };

  function AnimatedNumber({ value, suffix = '' }) {
    const count = useMotionValue(0);
    const display = useTransform(count, (latest) => `${Math.round(latest)}${suffix}`);

    useEffect(() => {
      const numericValue = Number(String(value).replace(/[^0-9.]/g, ''));
      const controls = animate(count, numericValue, { duration: 2, ease: 'easeOut' });
      return () => controls.stop();
    }, [value, count]);

    return <motion.span>{display}</motion.span>;
  }

  const getStatSuffix = (value) => {
    const text = String(value);
    if (text.includes('%')) return '%';
    if (text.includes('x')) return 'x';
    if (text.includes('+')) return '+';
    return '';
  };

  return (
    <div className="et-services-page">
      <motion.section className="et-services-hero" initial="hidden" animate="show" variants={stagger}>
        <div className="et-services-hero__glow" />
        <div className="et-services-container et-services-hero__grid">
          <motion.div className="et-services-hero__content" variants={fadeUp} transition={{ duration: 0.8, ease: 'easeOut' }}>
            <div className="et-services-badge">
              <span className="et-services-badge__dot" />
              Creative Digital Agency
            </div>
            <h1 className="et-services-title">
              We Deliver <span className="et-services-title__accent">Digital</span>  Solutions Driving  <span className="et-services-title__highlight">Growth</span>
            </h1>
            <p className="et-services-description">
              Transforming bold ideas into cinematic digital experiences through strategic innovation and world-class design craftsmanship.
            </p>
            <div className="et-services-actions">
              <button className="et-services-btn et-services-btn--primary">
                Explore Services <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button className="et-services-btn et-services-btn--secondary">
                Start Your Project
              </button>
            </div>
          </motion.div>
          <div className={`et-services-skeleton ${ready ? 'is-ready' : ''}`} aria-hidden="true">
            <div className="et-services-skeleton__hero">
              <div className="et-services-skeleton__line et-services-skeleton__line--short" />
              <div className="et-services-skeleton__line et-services-skeleton__line--title" />
              <div className="et-services-skeleton__line" />
              <div className="et-services-skeleton__buttons">
                <div className="et-services-skeleton__pill" />
                <div className="et-services-skeleton__pill" />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section className="et-services-clients" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
        <div className="et-services-container">
          <motion.div className="et-services-section-header" variants={fadeUp}>
            <span className="et-services-label"><span className="star-rotate">&#9733;</span> Trusted Partnerships</span>
            <h2 className="et-services-section-title">Brands That Trust Ethiroli</h2>
            <p className="et-services-section-description">
              We collaborate with forward-thinking enterprises and ambitious startups to redefine digital excellence across global markets.
            </p>
          </motion.div>

          <div className="et-services-marquee et-services-marquee--full">
            <div className="et-services-marquee__row et-services-marquee__row--forward">
              <div className="et-services-marquee__track">
                {[...marqueeLogos, ...marqueeLogos].map((logo, i) => (
                  <div key={`${logo.alt}-${i}`} className="et-services-marquee__card et-services-marquee__card--olive">
                    <img className="et-services-marquee__image" src={logo.src} alt={logo.alt} />
                  </div>
                ))}
              </div>
            </div>
            {/* <div className="et-services-marquee__row et-services-marquee__row--reverse">
              <div className="et-services-marquee__track">
                {[...marqueeLogos, ...marqueeLogos].map((logo, i) => (
                  <div key={`${logo.alt}-reverse-${i}`} className="et-services-marquee__card et-services-marquee__card--clay">
                    <img className="et-services-marquee__image" src={logo.src} alt={logo.alt} />
                  </div>
                ))}
              </div>
            </div> */}
          </div>

          <div className="et-services-stats">
            <motion.div className="et-services-journey" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="et-services-journey__overlay" />
              <div className="et-services-journey__content">
                <h2 className="et-services-journey__title">Our Journey</h2>
                <p className="et-services-journey__subtitle">Growing with Passion & Innovation</p>
                <p className="et-services-journey__text">
                We help brands and businesses build impactful digital experiences through creative strategy and dedicated execution. In just our first year, we have established a strong foundation of trust and measurable results with our clients.
                </p>
              </div>
            </motion.div>
            <div className="et-services-stats__grid">
              {[
                { value: '1+', label: 'Years of Experience', cls: 'et-services-stat-card__value--primary' },
                { value: '10+', label: 'Happy Clients', cls: 'et-services-stat-card__value--secondary' },
                { value: '25+', label: 'Projects Completed', cls: 'et-services-stat-card__value--tertiary' },
                { value: '95%', label: 'Client Satisfaction', cls: 'et-services-stat-card__value--dark' },
                { value: '12+', label: 'Industries Served', cls: 'et-services-stat-card__value--primary' },
                { value: '3x', label: 'Average ROI Boost', cls: 'et-services-stat-card__value--secondary' },
                { value: '24/7', label: 'Support Availability', cls: 'et-services-stat-card__value--tertiary', staticValue: true },
                { value: '8+', label: 'Internship', cls: 'et-services-stat-card__value--dark' },
              ].map((stat, idx) => (
                <motion.div key={stat.label} className="et-services-stat-card" variants={fadeUp} transition={{ duration: 0.55, delay: idx * 0.04 }}>
                  <div className={`et-services-stat-card__value ${stat.cls}`}>
                    {stat.staticValue ? stat.value : (
                      <AnimatedNumber value={stat.value} suffix={getStatSuffix(stat.value)} />
                    )}
                  </div>
                  <div className="et-services-stat-card__label">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section className="et-services-about" id="about" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
        <div className="et-services-container et-services-about__grid">
          <motion.div className="et-services-about__content" variants={fadeUp}>
            <span className="et-services-label"><span className="star-rotate">&#9733;</span> The Ethiroli Story</span>
            <h2 className="et-services-about__title">Where Visionary Creativity Meets Technical Precision</h2>
            <motion.div className="et-services-about__text" variants={stagger}>
              <p>At Ethiroli Services, we don't just build websites or manage social media. We create digital legacies. Our philosophy is rooted in "Cinematic Organic" design-the seamless blend of high-end aesthetics and human-centric experiences.</p>
              <p>Our multidisciplinary team of designers, developers, and strategists work in unison to solve complex business challenges with elegant, future-proof solutions.</p>
            </motion.div>
            <div className="et-services-about__mission">
              <div className="et-services-about__mission-block">
                <div className="et-services-about__mission-title">Our Vision</div>
                <p className="et-services-about__mission-text">To set the global standard for immersive digital storytelling.</p>
              </div>
              <div className="et-services-about__mission-block">
                <div className="et-services-about__mission-title">Our Mission</div>
                <p className="et-services-about__mission-text">Empowering brands through intentional design and strategic growth.</p>
              </div>
            </div>
          </motion.div>
          <div className="et-services-about__visual">
            <div className="et-services-about__image-wrap">
              <img
                className="et-services-about__image"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeHnuTShjTt0J_ez3-pIBUN3hL-Xld1pKCfnAsEChXLLSLbrZZtI2DZ5xzCC8d1M6mDLMeMa6oxywQDxMaGxubmiXj7xhLD2PYNDIYhpsoJnBP4OJUS2OS7vNqGI-KBY0uQ5HF7Av497UdF_1ictITZOeIKZW8TvhJclpSfzLtbswbuYlV8jp4Xs0gMtnPX7-k9Nem5KDGqNUvaQhMGbJ8-pg3aTtb0NTm8X9mCAsupnMZF6UXS-A_bAql0CXUbk-EoFw_-ngIoJ82"
                alt="Creative team collaboration"
              />
            </div>
            <div className="et-services-about__floating-card">
              <div className="et-services-about__floating-title">Cinematic Organic</div>
              <p className="et-services-about__floating-text">A unique design philosophy that prioritizes flow, depth, and human connection in every digital touchpoint.</p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section className="et-services-offerings" id="services" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.12 }} variants={stagger}>
        <div className="et-services-container">
          <motion.div className="et-services-section-header" variants={fadeUp}>
            <h2 className="et-services-section-title">Our Specialized Services</h2>
            <p className="et-services-section-description">
              Tailored digital craftsmanship designed to elevate your brand presence and drive measurable results.
            </p>
          </motion.div>
          <div className="et-services-grid">
            <motion.div className="et-services-card" variants={fadeUp}>
              <div className="et-services-icon et-services-icon--primary">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <h3 className="et-services-card__title">Brand Identity</h3>
              <p className="et-services-card__text">Crafting unique visual stories that resonate with your audience and define your market position.</p>
              <motion.ul className="et-services-card__list" variants={stagger}>
                {['Logo & Visual Systems', 'Brand Strategy', 'Style Guidelines'].map((point) => (
                  <motion.li key={point} variants={fadeUp}>
                    <span className="material-symbols-outlined et-services-check">check_circle</span> {point}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
            <motion.div className="et-services-card" variants={fadeUp}>
              <div className="et-services-icon et-services-icon--secondary">
                <span className="material-symbols-outlined">video_library</span>
              </div>
              <h3 className="et-services-card__title">Video Editing</h3>
              <p className="et-services-card__text">Cinematic storytelling and post-production that captures attention and delivers your message.</p>
              <motion.ul className="et-services-card__list" variants={stagger}>
                {['Commercial Editing', 'Motion Graphics', 'Color Grading'].map((point) => (
                  <motion.li key={point} variants={fadeUp}>
                    <span className="material-symbols-outlined et-services-check et-services-check--secondary">check_circle</span> {point}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
            <motion.div className="et-services-card" variants={fadeUp}>
              <div className="et-services-icon et-services-icon--tertiary">
                <span className="material-symbols-outlined">search</span>
              </div>
              <h3 className="et-services-card__title">SEO Optimization</h3>
              <p className="et-services-card__text">Strategic search engine positioning to increase visibility and organic traffic acquisition.</p>
              <motion.ul className="et-services-card__list" variants={stagger}>
                {['Keyword Strategy', 'Technical Audit', 'Content Marketing'].map((point) => (
                  <motion.li key={point} variants={fadeUp}>
                    <span className="material-symbols-outlined et-services-check et-services-check--tertiary">check_circle</span> {point}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
            <motion.div className="et-services-card et-services-card--wide" variants={fadeUp}>
              <div className="et-services-wide">
                <div className="et-services-wide__left">
                  <div className="et-services-icon et-services-icon--primary">
                    <span className="material-symbols-outlined">code</span>
                  </div>
                  <h3 className="et-services-card__title">Website Development</h3>
                  <p className="et-services-card__text">Building robust, scalable digital platforms using cutting-edge technologies.</p>
                </div>
                <div className="et-services-wide__right">
                  <div className="et-services-wide__item"><span className="material-symbols-outlined">smartphone</span> Landing Pages</div>
                  <div className="et-services-wide__item"><span className="material-symbols-outlined">desktop_windows</span> Custom Websites</div>
                  <div className="et-services-wide__item"><span className="material-symbols-outlined">shopping_cart</span> E-commerce Sites</div>
                  <div className="et-services-wide__item"><span className="material-symbols-outlined">cloud_done</span> with Modern Frameworks</div>
                </div>
              </div>
            </motion.div>
            <motion.div className="et-services-card" variants={fadeUp}>
              <div className="et-services-icon et-services-icon--secondary">
                <span className="material-symbols-outlined">trending_up</span>
              </div>
              <h3 className="et-services-card__title">Lead Generation</h3>
              <p className="et-services-card__text">Targeted campaigns designed to attract, engage, and convert high-quality prospects.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section className="et-services-process" id="process" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
        <div className="et-services-container">
          <motion.div className="et-services-section-header" variants={fadeUp}>
            <span className="et-services-label"><span className="star-rotate">&#9733;</span> Our Framework</span>
            <h2 className="et-services-section-title">The Creative Journey</h2>
          </motion.div>
          <div className="et-services-process__steps">
            <div className="et-services-process__line" />
            {[
              { num: '1', title: 'Research', desc: 'Deep dive into market trends and user behavior.' },
              { num: '2', title: 'Strategy', desc: 'Mapping the roadmap to achieving your goals.' },
              { num: '3', title: 'Design', desc: 'Bringing ideas to life with cinematic precision.' },
              { num: '4', title: 'Build', desc: 'Technical execution with scalable codebases.' },
              { num: '5', title: 'Growth', desc: 'Continuous optimization for ongoing success.' },
            ].map((step) => (
              <motion.div key={step.num} className="et-services-process__step" variants={fadeUp}>
                <div className="et-services-process__number">{step.num}</div>
                <h4 className="et-services-process__title">{step.title}</h4>
                <p className="et-services-process__desc">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section className="et-services-portfolio" id="work" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <div className="et-services-container">
          <motion.div className="et-services-portfolio__header" variants={fadeUp}>
            <div className="et-services-portfolio__header-left">
              <span className="et-services-label"><span className="star-rotate">&#9733;</span> Our Work</span>
              <h2 className="et-services-section-title">Selected Projects</h2>
            </div>
            <a className="et-services-portfolio__view-all" href="/projects">
              View All Projects<span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </motion.div>
          <div className="et-services-portfolio__grid">
            <motion.div className="et-services-portfolio__card et-services-portfolio__card--large" variants={fadeUp}>
              <img
                className="et-services-portfolio__image"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDho5xrs8EOwYfMXn6jHReq9UZSozo1k5Jwn9UkGx7K5Xfio3wUk87k0LzLHbsjnJnfpB7DSaLUbnkjMu4DEmsJjbYjsACRESidWL3xk_X4TUSsedCid8fdp9_CCaaoWw2X4fi96PhkD0YSr1pzm3im2ROoeJTOQTATEue9RMpiZTI7zZxvFi0x6BxCOkn4Uy74wYt9sDUnfhRWc6p1FuXIHEcezsnB45FN1jksaMugjCRZyGcWi3X0axtXf1osg39PmPAwbxhIaRP6"
                alt="Aura Luxury Fashion"
              />
              <div className="et-services-portfolio__overlay">
                <span className="et-services-portfolio__tag">UX Design & Web Development</span>
                <h3 className="et-services-portfolio__title">Kottai varahi</h3>
                <p className="et-services-portfolio__desc">The site promotes community, Vedic culture, and spiritual services, rather than commercial e-commerce.</p>
              </div>
            </motion.div>
            <motion.div className="et-services-portfolio__card et-services-portfolio__card--small" variants={fadeUp}>
              <img
                className="et-services-portfolio__image"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9UvmZV5CUNZSvRmrJ4aigHo1VPFKgtR5KLoKcMtXXdkl6HsYSmLlkNH_dguM3W4aGV1s-fwMrS8Eu9iFTSVZFiECawbFMPThXXy0FojAXt8SgNjygYQCjwbVRVmTU4PKdFeymbozvWhdEnSfD6GYknZ1ns8svYiIUQeEQHVF41ARj5LU0YelBGLZxzpZ2tHPGMETUrqklBds1xXS99PHwQ2s2nZBv6u7LiaHlWNsNXgumyhzghDnfwoMLSGrvpYTNDWdxcdo1fiAg"
                alt="Nexus Analytics"
              />
              <div className="et-services-portfolio__overlay et-services-portfolio__overlay--small">
                <span className="et-services-portfolio__tag">video editing</span>
                <h3 className="et-services-portfolio__title">Atti cafe</h3>
                <button className="et-services-portfolio__btn">
                  <span className="material-symbols-outlined">call_made</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.div className="et-services-cta" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={stagger}>
        <div className="et-services-container">
          <motion.div className="et-services-cta__card" variants={fadeUp}>
            <div className="et-services-cta__glow et-services-cta__glow--top" />
            <div className="et-services-cta__glow et-services-cta__glow--bottom" />
            <div className="et-services-cta__content">
              <h2 className="et-services-cta__title">Let's Build Something Extraordinary Together</h2>
              <p className="et-services-cta__description">
                Ready to elevate your brand's digital presence? Partner with Ethiroli Services for results that matter.
              </p>
              <div className="et-services-cta__actions">
                <a className="et-services-cta__btn et-services-cta__btn--primary" href="/contact_us">
                  Book a Free Consultation
                </a>
                <a className="et-services-cta__btn et-services-cta__btn--secondary" href="/pricing">
                  View Pricing
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default EthiroliPage;
