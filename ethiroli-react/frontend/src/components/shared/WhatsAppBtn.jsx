import React from 'react';

const WhatsAppBtn = () => {
    return (
        <a
            href="https://wa.me/916380049042?text=Hello%20Ethiroli!%20I%20would%20like%20to%20inquire%20about%20your%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-floating-btn"
            aria-label="Chat with us on WhatsApp"
        >
            <i className="fab fa-whatsapp"></i>
            <span className="tooltip">Chat with us</span>
        </a>
    );
};

export default WhatsAppBtn;
