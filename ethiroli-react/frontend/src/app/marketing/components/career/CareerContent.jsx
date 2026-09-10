import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CareerContent = () => {
  return (
    <>
      <section className="ab-section" id="openings">
        <div className="ab-container">
          <div className="ab-title-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Current  Openings
            </motion.h2>
          </div>

          <div className="ab-card-grid-two">
            <motion.article
              className="ab-card-premium"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3>Video Editor </h3>
              <p>
                <strong>Role Summary:</strong> Edit engaging short-form and long-form
                videos for social media, campaigns, and community storytelling.
              </p>
              <ul>
                <li>Edit reels, promotional clips, and event highlights.</li>
                <li>
                  Add transitions, subtitles, audio balancing, and basic motion
                  graphics.
                </li>
                <li>
                  Collaborate with content and design teams to maintain brand style.
                </li>
                <li>Deliver content on schedule with platform-ready formats.</li>
              </ul>
              <p>
                <strong>Skills Required:</strong> Adobe Premiere Pro or CapCut, basic
                After Effects knowledge, storytelling sense, and attention to detail.
              </p>
              <p>
                <strong>What You Gain:</strong> Portfolio projects, mentorship, and
                exposure to campaign production workflows.
              </p>
              <p>
                <strong>Launch Your Career Here:</strong> Gain hands-on internship experience that sets you apart. Build a standout portfolio, learn directly from expert mentors, and master real-world campaign workflows from day one.
              </p>
              <Link className="btn" to="/career/apply?role=Video%20Editor%20Intern">
                Apply Now
              </Link>
            </motion.article>

            <motion.article
              className="ab-card-premium"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3>Web Developer </h3>
              <p>
                <strong>Role Summary:</strong> Support website development, UI
                enhancements, and performance improvements for Ethiroli web
                platforms.
              </p>
              <ul>
                <li>
                  Build and maintain responsive pages using HTML, CSS, and
                  JavaScript.
                </li>
                <li>Implement reusable components and interactive UI sections.</li>
                <li>
                  Fix bugs, optimize loading speed, and test cross-device
                  compatibility.
                </li>
                <li>Work with designers to translate layouts into clean code.</li>
              </ul>
              <p>
                <strong>Skills Required:</strong> Strong HTML/CSS/JS fundamentals, Git
                basics, responsive design, and debugging ability.
              </p>
              <p>
                <strong>What You Gain:</strong> Hands-on development experience and
                production-ready work samples.
              </p>
              <p>
                <strong>Launch Your Career Here:</strong> Gain hands-on internship experience that sets you apart. Build a standout portfolio, learn directly from expert mentors, and master real-world campaign workflows from day one.
              </p>
              
              <Link className="btn" to="/career/apply?role=Web%20Developer%20Intern">
                Apply Now
              </Link>
            </motion.article>
          </div>

          <div style={{ marginTop: '24px' }}>
            <motion.article
              className="ab-card-premium"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3>Graphic Designer </h3>
              <p>
                <strong>Role Summary:</strong> Create visually strong digital assets
                for social media, branding, campaigns, and community initiatives.
              </p>
              <ul>
                <li>Design social creatives, banners, posters, and presentation visuals.</li>
                <li>Follow and extend brand guidelines across different media.</li>
                <li>Prepare final assets in required dimensions and formats.</li>
                <li>Collaborate with content and marketing teams for campaign concepts.</li>
              </ul>
              <p>
                <strong>Skills Required:</strong> Adobe Photoshop/Illustrator or Canva,
                typography and layout basics, creative thinking, and consistency.
              </p>
              <p>
                <strong>What You Gain:</strong> Real campaign design exposure, mentorship
                feedback, and portfolio-ready deliverables.
              </p>
              <p>
                <strong>Launch Your Career Here:</strong> Gain hands-on internship experience that sets you apart. Build a standout portfolio, learn directly from expert mentors, and master real-world campaign workflows from day one.
              </p>
              <Link className="btn" to="/career/apply?role=Graphic%20Designer%20Intern">
                Apply Now
              </Link>
            </motion.article>
          </div>
        </div>
      </section>

      <section className="ab-section ab-cta">
        <motion.div
          className="ab-container ab-cta-inner"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Ready To Apply?</h2>
          <p>
            Send your resume and portfolio to our team. We welcome learners with
            passion and commitment.
          </p>
          <div className="ab-cta-actions">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Link className="btn" to="/career/apply">Apply Now</Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Link className="ab-ghost-light" to="/contact_us">
                Contact Recruitment Team
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default CareerContent;
