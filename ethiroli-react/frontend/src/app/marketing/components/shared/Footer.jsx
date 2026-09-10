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
                        Ethiroli is a dynamic creative digital marketing team dedicated to empowering businesses.
                    </p>
                    <div className="et-footer-social">
                        {/* <a href="https://www.facebook.com/share/1JLC1QPANR/" className="et-social-icon" title="Facebook"><i className="fa-brands fa-facebook-f"></i></a> */}
                        <a href="https://www.instagram.com/_ethiroli_?igsh=MXQ1MTZuaXlhaGVyaA==" className="et-social-icon" title="Instagram"><i className="fa-brands fa-instagram"></i></a>
                        <a href="https://www.linkedin.com/company/ethiroli-pvt-ltd/" className="et-social-icon" title="LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
                        <a href="https://wa.me/916380049042?text=Hello%20Ethiroli!%20I%20would%20like%20to%20inquire%20about%20your%20services." className="et-social-icon" title="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
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
                        <li><a href="/services">Our Services</a><span className="et-arrow">→</span></li>
                        <li><Link to="/about#team">Our Team</Link><span className="et-arrow">→</span></li>
                        <li><Link to="/contact_us">Support</Link><span className="et-arrow">→</span></li>
                        {/* <li><Link to="/privacy-policy">Privacy Policy</Link><span className="et-arrow">→</span></li> */}
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
                </div>
            </div>

            <div className="et-footer-bottom">
                <p>&copy; Copyright {currentYear}. All Rights Reserved</p>
                {/* <div className="et-footer-bottom-links"> */}
                    {/* <a href="#">Privacy and Policy</a>
                    <a href="#">Sitemap</a>
                    <a href="#">FAQs</a> */}
                {/* </div> */}
            </div>
        </footer>
    );
};

export default Footer;
