import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ProjectsPreview = () => {
  return (
    <section className="et-projects-section" id="projects">
      <div className="et-projects-header">
        <p>
          <span className="star-rotate">&#9733;</span> Our Projects
        </p>
        <h2>Projects That Created Real Impact</h2>
        <p className="et-projects-subtitle">
          We have successfully completed a variety of projects that made a
          measurable impact on our clients' growth.
        </p>
      </div>

      <div className="et-projects-grid">
        <motion.article
          className="et-project-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="/assets/images/founder/WhatsApp Image 2026-03-16 at 2.11.29 PM.jpeg"
            alt="Workshops and training sessions"
          />
          <div className="et-project-card-content">
            <h3>Empowering Women with JCI & Digital Skills</h3>
            <p>
              In partnership with JCI, we provide certified digital training and
              workshops for women entrepreneurs.
            </p>
            <Link to="/projects/jci-digital-skills" className="et-project-link">
              Learn More <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </motion.article>
        
        <motion.article
          className="et-project-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img
            src="/assets/images/banner/gals.png"
            alt="Networking events and mentorship programs"
          />
          <div className="et-project-card-content">
            <h3>Glamers Gathering</h3>
            <p>
              Where glamour meets technology, supported by Eithiroli.</p>
            <Link to="/projects/glamers-gathering" className="et-project-link">
              Learn More <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </motion.article>

        <motion.article
          className="et-project-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img
            src="/assets/images/banner/gals.png"
            alt="Networking events and mentorship programs"
          />
          <div className="et-project-card-content">
            <h3>Empowering Students</h3>
            <p>
              Empowering Students Through Social Media Marketing by Eithiroli.</p>
            <Link to="/projects/Ethiroliseminarjayarani" className="et-project-link">
              Learn More <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </motion.article>
        
        <Link to="/projects" className="btn et-btn-view-all">
          View All Projects
        </Link>
      </div>
    </section>
  );
};

export default ProjectsPreview;
