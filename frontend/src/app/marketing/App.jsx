import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import ScrollToTopBtn from './components/shared/ScrollToTopBtn';
import WhatsAppBtn from './components/shared/WhatsAppBtn';
import PremiumMotionProvider from './components/shared/PremiumMotionProvider';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Career = lazy(() => import('./pages/Career'));
const Contact = lazy(() => import('./pages/Contact'));
const CareerApply = lazy(() => import('./components/career/CareerApply'));
const GlamersGathering = lazy(() => import('./components/projects/GlamersGathering'));
const JciDigitalSkills = lazy(() => import('./components/projects/JciDigitalSkills'));
const Ethiroliseminarksrct = lazy(() => import('./components/projects/Ethiroliseminarksrct'));
const Services = lazy(() => import('./pages/Services'));
const ProjectHome = lazy(() => import('./pages/project_home'));
const Ethiroliseminarjayarani = lazy(() => import('./components/projects/Ethiroliseminarjayarani'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Sitemap = lazy(() => import('./pages/Sitemap'));

const AppContent = ({ showLoader }) => {
  return (
    <>
      {showLoader ? (
        <div id="preloader" aria-live="polite" aria-busy="true">
          <p className="et-preloader-text">ETHIROLI</p>
          <div className="loading-animation">
            <div className="loading-animation-bar"></div>
          </div>
        </div>
      ) : null}
      <PremiumMotionProvider />
      <Navbar />
      <main>
        <Suspense fallback={
          <div id="preloader" aria-live="polite" aria-busy="true">
            <p className="et-preloader-text">ETHIROLI</p>
            <div className="loading-animation">
              <div className="loading-animation-bar"></div>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/career" element={<Career />} />
            <Route path="/career/apply" element={<CareerApply />} />
            <Route path="/contact_us" element={<Contact />} />
            <Route path="/projects" element={<ProjectHome />} />
            <Route path="/projects/glamers-gathering" element={<GlamersGathering />} />
            <Route path="/projects/jci-digital-skills" element={<JciDigitalSkills />} />
            <Route path="/projects/Ethiroliseminarjayarani" element={<Ethiroliseminarjayarani />} />
            <Route path="/projects/Ethiroliseminarksrct" element={<Ethiroliseminarksrct />} />
            <Route path="/services" element={<Services />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <ScrollToTopBtn />
      <WhatsAppBtn />
    </>
  );
};

function App() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      sessionStorage.setItem('et_loader_seen', 'true');
      setShowLoader(false);
    }, 100);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Router>
      <AppContent showLoader={showLoader} />
    </Router>
  );
}

export default App;
