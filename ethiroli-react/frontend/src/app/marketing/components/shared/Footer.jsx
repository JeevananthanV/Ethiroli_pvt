import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="et-footer-dark">
            <div className="et-footer-container">
                <div className="et-footer-col et-footer-about">
                    <div className="et-footer-logo">
                        <img src="/assets/images/ethiroli_logo.png" alt="Ethiroli logo" />
                    </div>
                    <p>
                        Ethiroli is a dynamic creative digital marketing team dedicated to empowering businesses.                    </p>
                    <div className="et-footer-social">
                        <a href="https://www.instagram.com/_ethiroli_?igsh=MXQ1MTZuaXlhaGVyaA==" className="et-social-icon" title="Instagram" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-instagram"></i></a>
                        <a href="https://www.linkedin.com/company/ethiroli-pvt-ltd/" className="et-social-icon" title="LinkedIn" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin-in"></i></a>
                        <a href="https://wa.me/916380049042?text=Hello%20Ethiroli!%20I%20would%20like%20to%20inquire%20about%20your%20services." className="et-social-icon" title="WhatsApp" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-whatsapp"></i></a>
                    </div>
                </div>

                <div className="et-footer-col">
                    <h4 className="et-footer-title">Company</h4>
                    <ul className="et-footer-links">
                        <li><Link to="/about">About Us</Link><span className="et-arrow">→</span></li>
                        <li><Link to="/career">Career</Link><span className="et-arrow"><i>→</i></span></li>
                        <li><Link to="/contact_us">Contact Us</Link><span className="et-arrow">→</span></li>
                        <li><Link to="/projects">Projects</Link><span className="et-arrow">→</span></li>
                    </ul>
                </div>

                <div className="et-footer-col">
                    <h4 className="et-footer-title">Useful Links</h4>
                    <ul className="et-footer-links">
                        <li><Link to="/services">Our Services</Link><span className="et-arrow">→</span></li>
                        <li><Link to="/about#team">Our Team</Link><span className="et-arrow">→</span></li>
                        <li><Link to="/privacy-policy">Privacy Policy</Link><span className="et-arrow">→</span></li>
                        <li><Link to="/terms-of-service">Terms of Service</Link><span className="et-arrow">→</span></li>
                        <li><Link to="/sitemap">Sitemap</Link><span className="et-arrow">→</span></li>
                    </ul>
                </div>

                <div className="et-footer-col et-footer-contact">
                    <h4 className="et-footer-title">Contact Us</h4>
                    <div>
                        <p><strong>Our Address</strong></p>
                        <p>1st Floor Gopala Krishnan complex guagi, Salem, India 636005</p>
                    </div>
                    <div>
                        <p><strong>Phone Number</strong></p>
                        <p><a href="tel:+916380049042">+91 63800 49042</a></p>
                    </div>
                    <div>
                        <p><strong>Send E-Mail</strong></p>
                        <p><a href="mailto:ethiroli.net@gmail.com">ethiroli.net@gmail.com</a></p>
                    </div>
                    <div>
                        <p><strong>Website</strong></p>
                        <p><a href="https://ethiroli.net" target="_blank" rel="noopener noreferrer">ethiroli.net</a></p>
                    </div>
                </div>
            </div>

            <div className="et-footer-bottom">
                <p>&copy; {currentYear} <a href="https://ethiroli.net" style={{ color: 'inherit', textDecoration: 'none' }}>ethiroli.net</a>. All Rights Reserved. Premier Branding & Marketing Agency.</p>
                <div className="et-footer-bottom-links" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
                    <Link to="/privacy-policy">Privacy Policy</Link>
                    <Link to="/terms-of-service">Terms of Service</Link>
                    <Link to="/sitemap">Sitemap</Link>
                    <Link to="/contact_us#faq">FAQs</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
