import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const projects = [
  {
    title: 'Empowering Women with JCI & Digital Skills',
    description:
      'Certified digital training and workshops for women entrepreneurs, built to create practical career growth.',
    image: '/assets/images/founder/WhatsApp Image 2026-03-16 at 2.11.29 PM.jpeg',
    year: 2026,
    keywords: ['women', 'digital skills', 'training', 'workshop'],
    link: '/projects/jci-digital-skills',
    category: 'Training',
    recentScore: 3,
  },
  {
    title: 'Glamers Gathering',
    description:
      'A fashion and networking experience where creativity meets influence, supported by Eithiroli.',
    image: '/assets/images/banner/gals.png',
    year: 2026,
    keywords: ['fashion', 'networking', 'media', 'event'],
    link: '/projects/glamers-gathering',
    category: 'Event',
    recentScore: 2,
  },
  {
    title: 'Empowering Students',
    description:
      'A social media marketing seminar helping students learn visibility, branding, and digital confidence.',
    image: '/assets/images/banner/gals.png',
    year: 2026,
    keywords: ['students', 'social media', 'marketing', 'seminar'],
    link: '/projects/Ethiroliseminarjayarani',
    category: 'Seminar',
    recentScore: 1,
  },
  { 
  title: 'Digital Marketing in the Web Era', 
  description: 'A comprehensive webinar at KSRCT on building successful business models through digital strategy, brand visibility, and modern marketing channels.', 
  image: '/assets/images/banner/gals.png', 
  year: 2026, 
  keywords: ['ksrct', 'digital marketing', 'business models', 'webinar', 'branding'], 
  link: '/projects/Ethiroliseminarksrct', 
  category: 'Webinar', 
  recentScore: 2, 
}

];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: index * 0.12 },
  }),
};

const filterButtonVariants = {
  idle: { scale: 1 },
  active: { scale: 1.02 },
};

const ProjectHome = () => {
  const years = useMemo(
    () => [...new Set(projects.map((project) => project.year))].sort((a, b) => b - a),
    []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [sortMode, setSortMode] = useState('recent');

  const filteredProjects = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return [...projects]
      .filter((project) => {
        const matchesSearch =
          !term ||
          [project.title, project.description, ...(project.keywords || [])]
            .join(' ')
            .toLowerCase()
            .includes(term);
        const matchesYear = selectedYear === 'All' || project.year === Number(selectedYear);
        return matchesSearch && matchesYear;
      })
      .sort((a, b) => {
        if (sortMode === 'recent') return b.recentScore - a.recentScore || b.year - a.year;
        if (sortMode === 'oldest') return a.year - b.year;
        return a.title.localeCompare(b.title);
      });
  }, [searchTerm, selectedYear, sortMode]);

  return (
    <section className="et-projects-section project-home-page">
      <div className="project-home-hero">
        <motion.div
          className="et-projects-header project-home-header"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p>
            <span className="star-rotate">&#9733;</span> Our Projects
          </p>
          <h2>Projects That Created Real Impact</h2>
          <p className="et-projects-subtitle">
            Explore our latest work, search by keyword, filter by year, and sort by recent impact.
          </p>
        </motion.div>

        <motion.div
          className="project-home-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <label className="project-home-search">
            <span>Search</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects, keywords, or topics"
            />
          </label>

          <div className="project-home-filters">
            <div className="project-home-filter-group">
              <span>Year</span>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                <option value="All">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="project-home-filter-group">
              <span>Sort</span>
              <div className="project-home-sort-buttons">
                {['recent', 'oldest', 'title'].map((mode) => (
                  <motion.button
                    key={mode}
                    type="button"
                    className={sortMode === mode ? 'is-active' : ''}
                    onClick={() => setSortMode(mode)}
                    variants={filterButtonVariants}
                    animate={sortMode === mode ? 'active' : 'idle'}
                    whileTap={{ scale: 0.98 }}
                  >
                    {mode === 'recent' ? 'Recent' : mode === 'oldest' ? 'Oldest' : 'Title'}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="et-projects-grid project-home-grid">
        <AnimatePresence mode="popLayout">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <motion.article
                key={project.link}
                className="et-project-card"
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: 20 }}
                layout
              >
                <img src={project.image} alt={project.title} />
                <div className="et-project-card-content">
                  <div className="project-home-meta">
                    <span>{project.category}</span>
                    <span>{project.year}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <Link to={project.link} className="et-project-link">
                    Learn More <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </motion.article>
            ))
          ) : (
            <motion.div
              className="project-home-empty"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h3>No projects found</h3>
              <p>Try a different search term or clear the year filter.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProjectHome;
