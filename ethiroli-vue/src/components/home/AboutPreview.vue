<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isVisibleImage = ref(false)
const isVisibleContent = ref(false)
const imageRef = ref(null)
const contentRef = ref(null)

onMounted(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target === imageRef.value) isVisibleImage.value = true
                if (entry.target === contentRef.value) isVisibleContent.value = true
            }
        })
    }, { threshold: 0.2 })

    if (imageRef.value) observer.observe(imageRef.value)
    if (contentRef.value) observer.observe(contentRef.value)

    onUnmounted(() => observer.disconnect())
})
</script>

<template>
    <section id="about-section" class="et-about-section">
        <div class="et-container">
            <div 
                class="et-about-media scroll-reveal-left"
                :class="{ 'is-revealed': isVisibleImage }"
                ref="imageRef"
            >
                <div class="et-about-images-wrapper">
                    <img 
                        src="/assets/images/banner/banner.png"
                        alt="Team Member 1"
                        class="et-about-img img-main" 
                    />
                    <img 
                        src="/assets/images/banner/banner.png"
                        alt="Team Member 2"
                        class="et-about-img img-overlay" 
                    />
                    <a 
                        href="https://www.instagram.com/_ethiroli_"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="et-about-play-btn"
                    >
                        <span>▶</span>
                    </a>
                </div>
            </div>

            <div 
                class="et-about-content scroll-reveal-right"
                :class="{ 'is-revealed': isVisibleContent }"
                ref="contentRef"
            >
                <div class="et-about-heading">
                    <p class="section-tag"><span class="star-rotate">★</span> About Our Company</p>
                    <h2>Empowering Women-Led Businesses Through Innovation</h2>
                </div>
                <p class="et-about-desc">
                    At Ethiroli, we create transformative digital experiences that empower women entrepreneurs and strengthen women-led businesses. Our purpose-driven solutions are visually compelling and strategically designed for measurable growth and long-term success.
                </p>
                <ul class="et-about-features">
                    <li>✔ Powerful branding & marketing solutions</li>
                    <li>✔ Empowering women through sustainable growth</li>
                </ul>
                <div class="et-about-company-info">
                    <img src="/assets/images/ethiroli_logo.png" alt="Ethiroli Logo" />
                    <h3>Built by Women to Empower Women<br/></h3>
                </div>
                <button class="et-btn">
                    More About Us →
                </button>
            </div>
        </div>
    </section>
</template>

<style scoped>
.scroll-reveal-left {
    opacity: 0;
    transform: translateX(-50px);
    transition: all 0.8s ease;
}
.scroll-reveal-right {
    opacity: 0;
    transform: translateX(50px);
    transition: all 0.8s ease;
}
.is-revealed {
    opacity: 1;
    transform: translateX(0);
}
</style>
