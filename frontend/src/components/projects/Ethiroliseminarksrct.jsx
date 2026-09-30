import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import "./seee.css";

/* ── Tiny helpers ─────────────────────────────────────────── */
function Icon({ name, className = "", style = {} }) {
  return (
    <span className={`material-symbols-outlined ${className}`} style={style}>
      {name}
    </span>
  );
}

function StarRow() {
  return (
    <div className="stars">
      {[...Array(5)].map((_, i) => (
        <Icon
          key={i}
          name="star"
          className="star-icon"
          style={{ fontVariationSettings: "'FILL' 1" }}
        />
      ))}
    </div>
  );
}

function AnimatedNumber({ value, suffix = "" }) {
  const count = useMotionValue(0);
  const display = useTransform(count, (latest) => `${Math.round(latest)}${suffix}`);

  useEffect(() => {
    const numericValue = Number(String(value).replace(/[^0-9.]/g, ""));
    const controls = animate(count, numericValue, { duration: 2, ease: "easeOut" });
    return () => controls.stop();
  }, [value, count]);

  return <motion.span>{display}</motion.span>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

const heroText = {
  hidden: { opacity: 0, x: -32 },
  show: { opacity: 1, x: 0 },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

/* ── Main component ───────────────────────────────────────── */
export default function EthiroliSeminar() {
  return (
    <>
      {/* Google Fonts */}
      {/* <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      /> */}

      <div className="page-root">


        {/* ── HERO ─────────────────────────────────────────── */}
        <motion.section
          className="hero"
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          <div className="hero__bg">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8KtEsKaXTQhuwXHz9HTEjq-YGowJ4jh1HtmPMGTIPWH8rMwC5PlC22h7-fQizBIoMmHouR8iwQeOdnss4Ta2yuOS2CxNR96ZkSXHXEgFQGsbz8w7afRndZNO8C8vWPAPnPD7lhozefyxKbX4wAJ4eYQlJCmxllSH8CEv0ERq0s6QFOZrsPwFBc2kVyodrpp05IXr2KyDewTuChRtXgbgQt9U1LVM5aNkyTxIBVkfnALUx0Aw7piz8lBBQ9Fr8AtpMhrTc2dhJzAmP"
              alt="Seminar hall"
              className="hero__img"
            />
            <div className="hero__overlay" />
          </div>

          <div className="container hero__content">
            <motion.div className="hero__text" variants={heroText} transition={{ duration: 0.8, ease: "easeOut" }}>
              <h1 className="hero__heading">
                Web Era {" "}
                <span className="hero__heading-accent">Business Models</span>
              </h1>
              <p className="hero__sub">
                An exclusive session at KSRCT led by Co-founder Balaji G E, bridging the gap between
                academic theory and modern digital business strategies.
              </p>
              <div className="hero__cta-row">
                <button className="btn btn--container">View Seminar Recap</button>
                <button className="btn btn--glass">Explore Business Models</button>
              </div>
            </motion.div>

            <motion.div className="hero__cards" variants={stagger}>
              <motion.div className="glass-card hero__card hero__card--shifted-left" variants={fadeUp} transition={{ duration: 0.7 }}>
                <Icon name="domain" className="hero__card-icon hero__card-icon--primary" style={{ fontSize: 32 }} />
                <h3 className="hero__card-title">KSRCT Host</h3>
                <p className="hero__card-sub">Institutional Excellence</p>
              </motion.div>
              <motion.div className="glass-card hero__card" variants={fadeUp} transition={{ duration: 0.7, delay: 0.08 }}>
                <Icon name="model_training" className="hero__card-icon hero__card-icon--secondary" style={{ fontSize: 32 }} />
                <h3 className="hero__card-title">Business Models</h3>
                <p className="hero__card-sub">Strategic Frameworks</p>
              </motion.div>
              <motion.div className="glass-card hero__card hero__card--shifted-mid" variants={fadeUp} transition={{ duration: 0.7, delay: 0.16 }}>
                <Icon name="person_pin" className="hero__card-icon hero__card-icon--tertiary" style={{ fontSize: 32 }} />
                <h3 className="hero__card-title">Balaji G E</h3>
                <p className="hero__card-sub">Co-founder & Expert</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* ── ABOUT ────────────────────────────────────────── */}
        <motion.section className="about section" id="about" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={stagger}>
          <div className="container about__grid">
            <motion.div className="about__img-wrap" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="about__circle">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9jzEgrLoG0KMSuWNT7lmHxGGbS8D7iSiOTpfNrglOTNiov6esxEUOn2_Qmv32hrs6KdTDs2isKM0PKgkOXHiJwgQJpGuSED-vHAkknzRFFYwbxuCuS4nF18vxJ4vNFCUpSgfeVneUKo3Ha4T-w1RYwQ8q0UEcElKCg9iQZ3M9O_diHpmS-hl61GEZli1fRRcNmwpCFMRFRnNwYJRbZptHpmc6by9Ezj1DoyMSzEZUF3gpmXdLBCyPgAvau0Z0S-zmJNoutVNRJaEP"
                  alt="Students"
                  className="about__circle-img"
                />
              </div>
              <div className="about__thumb">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBfMy-dgSr53f2Ta4YYfBPuiC8mjM7l7iLV0sJlkkvGeOSvsM0XJ5YJKXq37ds5CKVAHh48NU_ZBMio3LMsGmljJOsDVvkur7A3e-oX0lBR8aMmqbNMQAmNUashC8omA-VsHd2ONtMFD6dekJKfKj7M5zPDE_rbQVvVaLP0rj0Qjr7foRm-zu8Oo71doekmeBdoTm794vsXPM842QxFILZqMMb5NGHloWGYPwL33C03BBSlKSTV7JpgIihTltHWhp8Jnn51wI14w8F"
                  alt="Analytics"
                  className="about__thumb-img"
                />
              </div>
            </motion.div>

            <motion.div className="about__body" variants={fadeUp} transition={{ duration: 0.7, delay: 0.08 }}>
              <span className="label-tag label-tag--tertiary">The Seminar</span>
              <h2 className="about__heading">
                Mastering the <span className="text--secondary">Web Era Economy</span>
              </h2>
              <p className="about__para">
                Hosted at KSRCT, this seminar dives deep into the mechanics of the digital world.
                Co-founder Balaji G E unravels the complexities of the web era, teaching students how to
                construct robust, scalable, and successful business models.
              </p>
              <blockquote className="about__quote">
                "The future belongs to those who can leverage digital tools to build sustainable business value."
              </blockquote>
            </motion.div>
          </div>
        </motion.section>

        {/* ── TOPICS ───────────────────────────────────────── */}
        <motion.section className="topics section section--dark" id="topics" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-header__title text--on-dark">Core Business Modules</h2>
              <p className="section-header__sub text--tertiary-dim">Strategic insights for the modern marketer.</p>
            </div>

            <div className="topics__grid">
              <motion.div className="topic-card topic-card--wide glass-dark" variants={fadeUp} transition={{ duration: 0.55 }}>
                <div className="topic-card__icon-wrap topic-card__icon-wrap--primary">
                  <Icon name="business_center" className="text--on-primary" />
                </div>
                <h3 className="topic-card__title">Business Model Innovation</h3>
                <p className="topic-card__desc">
                  Understanding the shift from traditional to digital-first models and how to monetize effectively in the web era.
                </p>
              </motion.div>

              <motion.div className="topic-card glass-dark" variants={fadeUp} transition={{ duration: 0.55, delay: 0.06 }}>
                <div className="topic-card__icon-wrap topic-card__icon-wrap--primary">
                  <Icon name="language" className="text--on-primary" />
                </div>
                <h3 className="topic-card__title">Digital Ecosystems</h3>
                <p className="topic-card__desc">
                  Navigating the complex web of online channels, platforms, and technologies.
                </p>
              </motion.div>

              <motion.div className="topic-card glass-dark" variants={fadeUp} transition={{ duration: 0.55, delay: 0.12 }}>
                <div className="topic-card__icon-wrap topic-card__icon-wrap--primary">
                  <Icon name="analytics" className="text--on-primary" />
                </div>
                <h3 className="topic-card__title">Data-Driven Growth</h3>
                <p className="topic-card__desc">
                  Utilizing analytics to fuel decision-making and scale business operations.
                </p>
              </motion.div>

              {/* <div className="topic-card topic-card--full topic-card--row glass-dark">
                <div className="topic-card__body">
                  <div className="topic-card__icon-wrap topic-card__icon-wrap--secondary">
                    <Icon name="lightbulb" className="text--on-secondary" />
                  </div>
                  <h3 className="topic-card__title">Strategic Implementation</h3>
                  <p className="topic-card__desc">
                    Real-world case studies on successful digital transformations.
                  </p>
                </div>
                <div className="topic-card__action">
                  <button className="btn btn--pill">View Case Studies</button>
                </div>
              </div> */}
            </div>
          </div>
        </motion.section>

        {/* ── STATS ────────────────────────────────────────── */}
        <motion.section className="stats section" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={stagger}>
          <div className="stats__blob stats__blob--tl" />
          <div className="stats__blob stats__blob--br" />
          <div className="container stats__row">
            {[
              { val: "70+", cls: "stats__val--secondary", label: "KSRCT Students" },
              { val: "2",   cls: "stats__val--primary",   label: "Expert Speaker" },
              { val: "3",   cls: "stats__val--tertiary",  label: "Core Modules" },
              { val: "100%", cls: "stats__val--clay",      label: "Industry Focused" },
            ].map(({ val, cls, label }) => (
              <motion.div key={label} className="stats__item" variants={fadeUp} transition={{ duration: 0.55 }}>
                <div className={`stats__val ${cls}`}>
                  <AnimatedNumber
                    value={val}
                    suffix={String(val).includes("+") ? "+" : String(val).includes("%") ? "%" : ""}
                  />
                </div>
                <p className="stats__label">{label}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── TIMELINE ─────────────────────────────────────── */}
        {/* <section className="timeline-sec section section--dark" id="timeline">
          <div className="timeline-container">
            <div className="section-header">
              <h2 className="section-header__title text--on-dark">Seminar Agenda</h2>
              <p className="section-header__sub text--tertiary-dim">A roadmap to digital mastery.</p>
            </div>

            <div className="timeline">
              <div className="timeline__line" />
              {[
                { time: "10:00 AM", title: "Inauguration", desc: "Opening address by KSRCT Principal and introduction of Co-founder Balaji G E." },
                { time: "10:30 AM", title: "Web Era Basics", desc: "Understanding the fundamental shift in consumer behavior online." },
                { time: "11:30 AM", title: "Business Models", desc: "Deep dive into Subscription, freemium, and e-commerce frameworks." },
                { time: "01:00 PM", title: "Q&A Session", desc: "Interactive problem solving with students regarding their project ideas." },
              ].map(({ time, title, desc }, i) => (
                <div key={time} className={`timeline__item ${i % 2 === 0 ? "timeline__item--right" : "timeline__item--left"}`}>
                  <div className="timeline__spacer" />
                  <div className="timeline__dot" />
                  <div className="timeline__panel-wrap">
                    <div className="glass-card timeline__panel">
                      <span className="timeline__time">{time}</span>
                      <h4 className="timeline__title">{title}</h4>
                      <p className="timeline__desc">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* ── SPEAKER HIGHLIGHT ─────────────────────────────── */}
        <motion.section className="support section" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={stagger}>
          <div className="container support__flex">
            <motion.div className="support__img-col" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="support__img-wrap">
                <img
                  src="/assets/images/founder/co-founder.png"
                  alt="Co-founder Balaji G E"
                  className="support__img"
                />
              </div>
            </motion.div>
            <motion.div className="support__body-col" variants={fadeUp} transition={{ duration: 0.7, delay: 0.08 }}>
              <div className="support__card">
                <span className="label-tag label-tag--primary">The Speaker</span>
                <h2 className="support__heading">
                  Industry Insights by <span className="text--primary">Balaji G E</span>
                </h2>
                <p className="support__para">
                  As the Co-founder, Balaji G E brings a wealth of experience in building successful
                  business models in the web era. His session at KSRCT focused on empowering students
                  to look beyond traditional marketing and embrace the strategic thinking required
                  to build scalable digital ventures.
                </p>
                <button className="btn btn--sec-container support__btn" onClick={() => window.location.href = "/about"}>
                  Connect With ethiroli
                  <Icon name="arrow_forward" />
                </button>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ── GALLERY ──────────────────────────────────────── */}
        <motion.section className="gallery-sec section" id="gallery" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-header__title">Seminar Highlights</h2>
              <p className="section-header__sub">Captured moments at KSRCT.</p>
            </div>
            <div className="masonry-grid">
              {[
                { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCwX-uSrW89XhUS_SOSVql0ul_KxcnmvNq2P-ZSedCT0FvK9Y5u9fE4G6FR7pxVPdolLWLvhjeNvp36T36lWTp9HMBEBhY4m-EG5rSIKI57vP6nBR8WMMeuLgR3PFCzGyvhbnwTG4JNVdgqtuTt3OVgGF8HLafhIxunOrfTZxuUL29ZazpAWfxlgS5EQMID-EVsmFO7yLqrW2EPJ4WqWxk8AUXXf4nzneJwz8QYChs2NN6g4OY9SoBPHHVTfAi34J1oZf36v2ikkWb", caption: "Interactive Session" },
                { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuChCi9L3xyyOwr3FablE_HmQtVFmlJmkgKzM9JINbXusNc1tdVF90zrzNx8tGB__c-KvVpixAEDEC2j6NYe2bp6hNzqzxpCwZ2sqAX4pf-Sbi_hazAdaR2IBhBFKnVnakZiFyw0_mHxoJ9hXJn2pSBsqWZ2RmdDcHgkj9K4MgiozQQASccSB_YYKH9BwgYOZJ374VowyIu1kKgslPj8M84-pHo6wvLh-SHgnHl41OVW-FeIaWTimz8DCEwbJfiYmXVJqKMjvgeSRBP0", caption: "KSRCT Audience" },
                { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbu54b-tENjprIB-aSF3zPnHp2PqBFV4L8j_iWaI2JB_e6VKIRpHdjTwGQJKK7zLrVBbAePnPsILGHAYWHpd7ZedBe41BU7UZ1ic2t3TEhErymHCQt11Hq7sattD44KSMrgPdTTWMej_RuaOcEB7IleR6vSF266OwSLHwDnNPFJ5EKygUFARuCPnfH0wFjb1uEqmhbpO2dBvX_d71VXV6sTMK-ZHai-h9WPxpIbmXxx5MctGHguCn-0afrgvkXxrSzGTBCZ9vbP936", caption: "Discussing Business Models" },
                { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgfdIy21M8i-Ul8iZ6yHEqrBpRnB0PULzJrNUQjaHQrKOjrNSVOxTxXXWKf1F3NzkdLuBw2QBf6mPDbXULREaVYF_9DQ8xMVnq8SjuXt8peJPODrSEnrV8eouhFR1GNzMB9FnxpZ-luvXYcuMQgJs2WyU6mj0UtjTj7t9Trmd5IxCqW49oucaGvhrjg1cmOt9D0EaamMp1WmXTiAgKm7QUVUr1fb9mAVyez_AaCJ5KAB4i-uYGc9k8YasQefOg0DYFJCcZBVJqXUnz", caption: "Q&A with Students" },
              ].map(({ src, caption }) => (
                <motion.div key={caption} className="masonry-item gallery-item" variants={fadeUp} transition={{ duration: 0.55 }}>
                  <img src={src} alt={caption} className="gallery-item__img" />
                  <div className="gallery-item__overlay">
                    <p className="gallery-item__caption">{caption}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── TESTIMONIALS ─────────────────────────────────── */}
        <motion.section className="testimonials section" id="testimonials" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-header__title">Student Voices</h2>
              <p className="section-header__sub">Feedback from the KSRCT community.</p>
            </div>
            <div className="testimonials__grid">
              {[
                { quote: "Balaji G E's session on business models was an eye-opener. It completely changed how I approach digital marketing strategies.", name: "Karthik R.", role: "Engineering Student", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPgiWcLvGYzG_mO1nhLFMZqU7kod1yrGMo6dhYVohA4cRBrJZMbkX4HhWXSn3chEuz6NiKW-c2LPep1Sdw4fd4z8r_kDvazc75DAi08uMEy_gtWCG5u4bM0CHavaKhOTBvaZ_J6b7ccA8v8Yfxf9rjVKg0vz3_OQhPEmJ49wafIzvrywoqJhLzE4oEghAGKl_tUgMajHv_cilD6iqgkMf7UMcl5sp6yOXNIaqh8P7gXq6cY9eXFe_AzMIBUONb5y8yBD-0GfI5KOSW" },
                { quote: "Learning about the web era economy from a Co-founder was invaluable. I now understand the importance of scalable business models.", name: "Sneha P.", role: "MBA Student", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuACwLu9-_L1IE01N9p_Izyk0yL7wb24PGIYSvzBYicc6IBA3oIPbxnElnSLCDej4onSahwbMqTQEkoZDSDJk0f1eRZNpuHjT0qGhuiFNeq0os7eTyJypwGeuUdu5ciKkZ4bfroUl53DBLMese3HppP_ZvuDAi4hEaM6Smjj0_VnumjxkG-6C58XaJEOtJO6sfAvUlxiNcqBqOm5vc2_IvZlz9eD_BPDu5CV6TTGxVv84psZmenLvj_LJB_JcfZst6LW-B_aNxKdgCqc" },
                { quote: "The practical insights into building successful online businesses were exactly what we needed. A highly motivating session at KSRCT.", name: "Arjun M.", role: "Final Year Student", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAARbEeDkAxMZNxpneVLWg_fLguEvUt0myabvMFOkFt1YwCw-yd9qH9NeGYvx2tgjJvXxThjgWFoAgzQrnsMhoAwYBxPsjMSXbsoUzoJdK8FQnoR8T4go16290xwFsHwD5KcGOitO6IqbHD1jhtXJ5M-9qLbJUJqytBguJuXB-CxKjM80b1LTHt31FFnDxibcoIues_2fp_oO9TKqE9bsDHsd-yFyFaDs4A31-baVLomhLsfK-nKRLBPXWBuPiO-D-qhuxrnFfWfxq_" },
              ].map(({ quote, name, role, avatar }) => (
                <motion.div key={name} className="testimonial-card" variants={fadeUp} transition={{ duration: 0.55 }}>
                  <StarRow />
                  <p className="testimonial-card__quote">"{quote}"</p>
                  <div className="testimonial-card__author">
                    <div className="testimonial-card__avatar">
                      <img src={avatar} alt={name} />
                    </div>
                    <div>
                      <h4 className="testimonial-card__name">{name}</h4>
                      <p className="testimonial-card__role">{role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── FINAL CTA ────────────────────────────────────── */}
        <motion.section className="cta section section--dark section--gradient-tri" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={stagger}>
          <div className="cta__glow" />
          <motion.div className="cta__inner" variants={fadeUp} transition={{ duration: 0.7 }}>
            <h2 className="cta__heading text--on-dark">Building the Future of Business</h2>
            <p className="cta__sub text--tertiary-dim">
              Join us at KSRCT to explore how digital marketing and innovative business models
              are reshaping the world. Led by industry visionary Balaji G E.
            </p>
            <div className="cta__actions">
              <button className="btn btn--container">Partner With Us</button>
              <button className="btn btn--glass btn--bordered">Upcoming Events</button>
            </div>
          </motion.div>
        </motion.section>

      </div>
    </>
  );
}
