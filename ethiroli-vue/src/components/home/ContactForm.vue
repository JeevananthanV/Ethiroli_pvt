<script setup>
const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic
    console.log("Form submitted")
}
</script>

<template>
    <section class="et-consultation-section" style="background-image: url('/assets/images/banner/banner.png')">
        <div class="et-consultation-form-wrapper">
            <h1>Free Consultation</h1>
            <p>We’ve been doing this for a while now and great news for deliver results that matter.</p>
            <form class="et-consultation-form" id="contactForm" @submit="handleSubmit">
                <input type="text" placeholder="Your Name *" required aria-label="Your Name" />
                <input type="tel" placeholder="Phone No" aria-label="Phone Number" />
                <input type="email" placeholder="Enter E-Mail *" required aria-label="Email Address" />
                <input type="text" placeholder="Subject *" required aria-label="Subject" />
                <textarea placeholder="Write Message..." required aria-label="Message"></textarea>
                <button type="submit">SUBMIT NOW</button>
            </form>
        </div>
        
        <div class="contact-info">
            <p><span class="star-rotate">★</span> Contact Us</p>
            <div class="h1-wrapper">
                <h1>Let’s Make Your Website Work Smarter — Contact for Marketing Help<br/></h1>
            </div>
            <div class="contact-item">
                <a href="mailto:ethiroli.net@gmail.com">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    ethiroli.net@gmail.com
                </a>
                <a href="tel:+916380049042">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    +91 63800 49042
                </a>
            </div>
            <button>All Blog Post</button>
        </div>
    </section>
</template>
