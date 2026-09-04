<script setup>
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="et-footer-dark">
    <div class="et-footer-container">
      <div class="et-footer-col et-footer-about">
        <div class="et-footer-logo">
          <img src="/assets/images/ethiroli_logo.png" alt="Ethiroli logo" />
        </div>
        <p>
          Ethiroli is a dynamic creative digital marketing team dedicated to empowering businesses.
        </p>
        <div class="et-footer-social">
          <a href="#" class="et-social-icon" title="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="#" class="et-social-icon" title="Instagram"><i class="fa-brands fa-instagram"></i></a>
          <a href="#" class="et-social-icon" title="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
          <a href="#" class="et-social-icon" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
        </div>
      </div>

      <div class="et-footer-col">
        <h4 class="et-footer-title">Company</h4>
        <ul class="et-footer-links">
          <li><router-link to="/about">About Us</router-link><span class="et-arrow">-></span></li>
          <li><router-link to="/career">Career</router-link><span class="et-arrow">-></span></li>
          <li><router-link to="/contact_us">Contact Us</router-link><span class="et-arrow">-></span></li>
        </ul>
      </div>

      <div class="et-footer-col">
        <h4 class="et-footer-title">Useful Links</h4>
        <ul class="et-footer-links">
          <li><a href="/#services">Our Services</a><span class="et-arrow">-></span></li>
          <li><router-link to="/about#team">Our Team</router-link><span class="et-arrow">-></span></li>
          <li><router-link to="/contact_us">Support</router-link><span class="et-arrow">-></span></li>
        </ul>
      </div>

      <div class="et-footer-col et-footer-contact">
        <h4 class="et-footer-title">Contact Us</h4>
        <div>
          <p><strong>Our Address</strong></p>
          <p>1st Floor Gopala Krishnan complex guagi, Salem, India 636005</p>
        </div>
        <div>
          <p><strong>Phone Number</strong></p>
          <p>+91 63800 49042</p>
        </div>
        <div>
          <p><strong>Send E-Mail</strong></p>
          <p>ethiroli.net@gmail.com</p>
        </div>
      </div>
    </div>

    <div class="et-footer-bottom">
      <p>&copy; Copyright {{ currentYear }}. All Rights Reserved</p>
      <div class="et-footer-bottom-links">
        <a href="#">Privacy and Policy</a>
        <a href="#">Sitemap</a>
        <a href="#">FAQs</a>
      </div>
    </div>
  </footer>
</template>
