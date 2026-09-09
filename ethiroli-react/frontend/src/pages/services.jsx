import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const allProjects = [
  {
    id: 'kottai-varahi',
    title: 'Kottai Varahi Temple Platform',
    subtitle: 'Community Web Portal',
    category: 'Portals & Devotee Systems',
    image: '/assets/images/services/project_kottai_varahi.jpg',
    tags: ['React', 'Node.js', 'Cloud DB'],
    link: '/contact_us',
  },
  {
    id: 'crm-pms',
    title: 'Enterprise CRM / PMS',
    subtitle: 'SaaS Platform',
    category: 'Web Platforms & Apps',
    image: '/assets/images/services/project_crm_dashboard.jpg',
    tags: ['React', 'Node.js', 'MySQL'],
    link: '/contact_us',
  },
  {
    id: 'atti-cafe',
    title: 'Atti Cafe',
    subtitle: 'Restaurant Website',
    category: 'Landing Pages & E-Commerce',
    image: '/assets/images/services/project_atti_cafe.jpg',
    tags: ['React', 'Vite', 'Tailwind'],
    link: '/contact_us',
  },
  {
    id: 'aura-ecommerce',
    title: 'Aura E-Commerce',
    subtitle: 'Beauty & Skincare Store',
    category: 'Landing Pages & E-Commerce',
    image: '/assets/images/services/project_aura_ecommerce.jpg',
    tags: ['React', 'Stripe', 'Node.js'],
    link: '/contact_us',
  },
];

const disciplines = [
  {
    title: 'Branding',
    desc: 'Build memorable brand identities',
    icon: 'palette',
  },
  {
    title: 'Development',
    desc: 'Scalable web applications',
    icon: 'desktop_windows',
  },
  {
    title: 'Graphic Design',
    desc: 'Visual storytelling that connects',
    icon: 'draw',
  },
  {
    title: 'Lead Generation',
    desc: 'Data-driven growth strategies',
    icon: 'groups',
  },
  {
    title: 'SEO',
    desc: 'Rank higher, grow organically',
    icon: 'search',
  },
  {
    title: 'UI UX',
    desc: 'Intuitive experiences that convert',
    icon: 'design_services',
  },
  {
    title: 'Video Editing',
    desc: 'Engaging visuals that engage',
    icon: 'videocam',
  },
];

const journeyStats = [
  { value: '25+', label: 'Web & Digital Projects', icon: 'devices' },
  { value: '10+', label: 'Satisfied Brands', icon: 'verified' },
  { value: '99%', label: 'Performance Score', icon: 'speed' },
  { value: '3x', label: 'Conversion Lift', icon: 'auto_awesome' },
  { value: '100%', label: 'Mobile Optimized', icon: 'smartphone' },
  { value: '24/7', label: 'Support & Uptime', icon: 'schedule' },
];

const approachSteps = [
  {
    num: '01',
    title: 'Discover',
    desc: 'Understanding your goals & audience',
    icon: 'handshake',
  },
  {
    num: '02',
    title: 'Design',
    desc: 'Crafting intuitive & engaging UI/UX',
    icon: 'architecture',
  },
  {
    num: '03',
    title: 'Build',
    desc: 'Developing scalable & clean code',
    icon: 'terminal',
  },
  {
    num: '04',
    title: 'Optimize',
    desc: 'Performance, SEO & best practices',
    icon: 'troubleshoot',
  },
  {
    num: '05',
    title: 'Scale',
    desc: 'Launch, support & continuous growth',
    icon: 'rocket_launch',
  },
];

const categories = ['All', 'Web Platforms & Apps', 'Portals & Devotee Systems', 'Landing Pages & E-Commerce'];

const EthiroliPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return allProjects;
    return allProjects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
  };

  const sectionFade = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  const containerStagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.06,
      },
    },
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="et-srv-page">
      {/* 1. HERO SECTION */}
      <section className="et-srv-hero">
        <div className="et-srv-hero-ambient" />
        <div className="et-srv-container et-srv-hero-grid">
          {/* Left Column */}
          <motion.div className="et-srv-hero-left" initial="hidden" animate="show" variants={stagger}>
            <motion.div className="et-srv-badge" variants={fadeUp}>
              <span className="et-srv-badge-star star-rotate">&#9733;</span>
              <span>DIGITAL INNOVATION & WEB ENGINEERING</span>
            </motion.div>

            <motion.h1 className="et-srv-hero-title" variants={fadeUp}>
              We build digital solutions that drive{' '}
              <span className="et-srv-brand-gradient">growth.</span>
            </motion.h1>

            <motion.p className="et-srv-hero-desc" variants={fadeUp}>
              Transforming bold visions into scalable web applications, bespoke digital architectures, and high-impact digital experiences engineered for global reach.
            </motion.p>

            <motion.div className="et-srv-hero-actions" variants={fadeUp}>
              <motion.a
                href="#showcase"
                className="et-srv-btn et-srv-btn--primary"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                View Web Showcase <span className="material-symbols-outlined">arrow_downward</span>
              </motion.a>
              <motion.a
                href="#disciplines"
                className="et-srv-btn et-srv-btn--outline"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Explore All Services <span className="material-symbols-outlined">arrow_forward</span>
              </motion.a>
            </motion.div>

            {/* Feature Pills */}
            <motion.div className="et-srv-feature-pills" variants={fadeUp}>
              <motion.div className="et-srv-pill-item" whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                <div className="et-srv-pill-icon">
                  <span className="material-symbols-outlined">speed</span>
                </div>
                <div className="et-srv-pill-text">
                  <strong>High</strong>
                  <span>Performance Apps</span>
                </div>
              </motion.div>

              <motion.div className="et-srv-pill-item" whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                <div className="et-srv-pill-icon">
                  <span className="material-symbols-outlined">devices</span>
                </div>
                <div className="et-srv-pill-text">
                  <strong>100%</strong>
                  <span>Responsive</span>
                </div>
              </motion.div>

              <motion.div className="et-srv-pill-item" whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                <div className="et-srv-pill-icon">
                  <span className="material-symbols-outlined">cloud</span>
                </div>
                <div className="et-srv-pill-text">
                  <strong>Scalable</strong>
                  <span>Cloud Code</span>
                </div>
              </motion.div>

              <motion.div className="et-srv-pill-item" whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                <div className="et-srv-pill-icon">
                  <span className="material-symbols-outlined">hub</span>
                </div>
                <div className="et-srv-pill-text">
                  <strong>ethiroli.com/</strong>
                  <span>web-development</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Column: Luminous Brand Ambient Visual & Case Study Card */}
          <motion.div
            className="et-srv-hero-right"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Ambient Brand Glow Aura (Teal & Olive) */}
            <div className="et-srv-ambient-aura" aria-hidden="true" />

            <div className="et-srv-preview-card">
              <div className="et-srv-card-tag">Featured Case Study</div>
              <h3 className="et-srv-card-title">Kottai Varahi Temple Platform</h3>
              <p className="et-srv-card-subtitle">Community Web Portal & Devotee Booking Infrastructure</p>

              <div className="et-srv-card-tags">
                <span>React</span>
                <span>Node.js</span>
                <span>Vite</span>
                <span>Cloud DB</span>
              </div>

              <div className="et-srv-card-stats">
                <div className="et-srv-card-stat">
                  <span className="et-srv-stat-num">&lt; 0.8s</span>
                  <span className="et-srv-stat-lbl">Avg Load Speed</span>
                </div>
                <div className="et-srv-card-stat">
                  <span className="et-srv-stat-num">99.9%</span>
                  <span className="et-srv-stat-lbl">Reliability</span>
                </div>
                <div className="et-srv-card-stat">
                  <span className="et-srv-stat-num">100%</span>
                  <span className="et-srv-stat-lbl">Mobile First</span>
                </div>
              </div>

              <div className="et-srv-card-footer">
                <div className="et-srv-card-score">
                  <strong>99+ Score</strong>
                  <small>Lighthouse Tested</small>
                </div>
                <div className="et-srv-progress-bar">
                  <div className="et-srv-progress-fill" />
                </div>
              </div>

              {/* Floating Code Badge on Right */}
              <motion.div
                className="et-srv-floating-code"
                aria-hidden="true"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span>&lt;/&gt;</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. CORE DISCIPLINES SECTION */}
      <section className="et-srv-disciplines" id="disciplines">
        <div className="et-srv-container et-srv-disciplines-grid">
          {/* Left Title */}
          <motion.div
            className="et-srv-section-intro"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            variants={sectionFade}
          >
            <div className="et-srv-badge">
              <span className="et-srv-badge-star star-rotate">&#9733;</span>
              <span>TRUSTED PARTNERSHIPS & CAPABILITIES</span>
            </div>
            <h2 className="et-srv-section-title">Core Disciplines We Deliver</h2>
            <p className="et-srv-section-desc">
              We collaborate with forward-thinking enterprises and ambitious startups to redefine digital excellence across modern web standards.
            </p>
          </motion.div>

          {/* Right Disciplines Grid */}
          <motion.div
            className="et-srv-disciplines-cards"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            variants={containerStagger}
          >
            {disciplines.map((d) => (
              <motion.div
                key={d.title}
                className="et-srv-discipline-card"
                variants={itemFadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <motion.div
                  className="et-srv-discipline-icon"
                  whileHover={{ rotate: 8, scale: 1.08 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="material-symbols-outlined">{d.icon}</span>
                </motion.div>
                <div className="et-srv-discipline-info">
                  <h4>{d.title}</h4>
                  <p>{d.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. OUR DIGITAL JOURNEY & STATS */}
      <section className="et-srv-journey">
        <div className="et-srv-container et-srv-journey-grid">
          {/* Left Title */}
          <motion.div
            className="et-srv-section-intro"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            variants={sectionFade}
          >
            <div className="et-srv-badge">
              <span className="et-srv-badge-star star-rotate">&#9733;</span>
              <span>ETHIROLI IMPACT</span>
            </div>
            <h2 className="et-srv-section-title">Our Digital Journey</h2>
            <p className="et-srv-section-desc">
              Engineering scalable & beautiful web ecosystems that drive measurable results and lasting impact.
            </p>
          </motion.div>

          {/* Right 6 Stat Cards in Horizontal Row */}
          <motion.div
            className="et-srv-stats-row"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            variants={containerStagger}
          >
            {journeyStats.map((st) => (
              <motion.div
                key={st.label}
                className="et-srv-stat-box"
                variants={itemFadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <motion.div
                  className="et-srv-stat-box-icon"
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="material-symbols-outlined">{st.icon}</span>
                </motion.div>
                <span className="et-srv-stat-box-val">{st.value}</span>
                <span className="et-srv-stat-box-lbl">{st.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. PROJECT SHOWCASE (WEB DEVELOPMENT CASE STUDIES) */}
      <section className="et-srv-showcase" id="showcase">
        <div className="et-srv-container">
          {/* Top Header Row with Title & Filter Tabs */}
          <div className="et-srv-showcase-header">
            <motion.div
              className="et-srv-showcase-intro"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
              variants={sectionFade}
            >
              <div className="et-srv-badge">
                <span className="et-srv-badge-star star-rotate">&#9733;</span>
                <span>PROJECT SHOWCASE</span>
              </div>
              <h2 className="et-srv-section-title">Web Development Case Studies</h2>
              <p className="et-srv-section-desc">
                Explore our production-grade web applications, custom portals, high-performance dashboards, and engaging digital storefronts.
              </p>
            </motion.div>

            {/* Filter Tabs on the Right */}
            <motion.div
              className="et-srv-filter-tabs"
              role="tablist"
              aria-label="Project Categories"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
              variants={sectionFade}
            >
              {categories.map((cat) => {
                const isSelected = activeCategory === cat;
                return (
                  <motion.button
                    key={cat}
                    role="tab"
                    aria-selected={isSelected}
                    className={`et-srv-filter-tab ${isSelected ? 'et-srv-filter-tab--active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                  >
                    {cat}
                  </motion.button>
                );
              })}
            </motion.div>
          </div>

          {/* 4-Card Grid */}
          <div className="et-srv-showcase-grid">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((p) => (
                <motion.div
                  key={p.id}
                  className="et-srv-showcase-card"
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="et-srv-card-thumb">
                    <img src={p.image} alt={p.title} loading="lazy" decoding="async" />
                  </div>
                  <div className="et-srv-card-info">
                    <h3 className="et-srv-card-name">{p.title}</h3>
                    {p.subtitle && <span className="et-srv-card-sub">{p.subtitle}</span>}
                    <div className="et-srv-card-bottom">
                      <div className="et-srv-project-tags">
                        {p.tags.map((t) => (
                          <span key={t} className="et-srv-ptag">
                            {t}
                          </span>
                        ))}
                      </div>
                      <motion.a
                        href={p.link}
                        className="et-srv-card-arrow"
                        aria-label={`View ${p.title}`}
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.92 }}
                      >
                        <span className="material-symbols-outlined">arrow_outward</span>
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 5. OUR APPROACH / PROCESS */}
      <section className="et-srv-approach" id="process">
        <div className="et-srv-container et-srv-approach-grid">
          {/* Left Title */}
          <motion.div
            className="et-srv-section-intro"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            variants={sectionFade}
          >
            <div className="et-srv-badge">
              <span className="et-srv-badge-star star-rotate">&#9733;</span>
              <span>OUR APPROACH</span>
            </div>
            <h2 className="et-srv-section-title">A Process Built for Excellence</h2>
            <p className="et-srv-section-desc">
              From strategy to scale, we follow a proven workflow to deliver digital products that perform.
            </p>
          </motion.div>

          {/* Right 5 Step Nodes */}
          <motion.div
            className="et-srv-approach-steps"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            variants={containerStagger}
          >
            {approachSteps.map((step, idx) => (
              <motion.div
                key={step.num}
                className="et-srv-step-node"
                variants={itemFadeUp}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <div className="et-srv-step-top">
                  <motion.div
                    className="et-srv-step-icon"
                    whileHover={{ scale: 1.1, rotate: 6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="material-symbols-outlined">{step.icon}</span>
                  </motion.div>
                  {idx < approachSteps.length - 1 && (
                    <motion.span
                      className="et-srv-step-arrow"
                      aria-hidden="true"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.25 }}
                    >
                      &rarr;
                    </motion.span>
                  )}
                </div>
                <span className="et-srv-step-num">{step.num}</span>
                <h4 className="et-srv-step-title">{step.title}</h4>
                <p className="et-srv-step-desc">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="et-srv-cta-section">
        <div className="et-srv-container">
          <motion.div
            className="et-srv-cta-card"
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="et-srv-cta-ambient" aria-hidden="true" />

            <motion.div
              className="et-srv-cta-left"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="et-srv-cta-tag">Have a big idea?</span>
              <h2 className="et-srv-cta-title">Let's Build Something Remarkable Together.</h2>
            </motion.div>

            <motion.div
              className="et-srv-cta-right"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <p className="et-srv-cta-desc">
                Whether you need a high-performing website, a custom web application, or a complete digital transformation — we're here to make it happen.
              </p>
              <motion.a
                href="/contact_us"
                className="et-srv-btn et-srv-btn--primary"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                Start a Conversation <span className="material-symbols-outlined">arrow_forward</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default EthiroliPage;
