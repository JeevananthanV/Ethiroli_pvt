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
    <section class="ab-section ab-intro" id="about-introduction" aria-labelledby="intro-title">
        <div class="ab-container ab-two-col">
            <figure 
                class="ab-image-wrap scroll-reveal-left"
                :class="{ 'is-revealed': isVisibleImage }"
                ref="imageRef"
            >
                <img class="ab-floating-image" src="/assets/images/banner/banner.png" alt="Women collaborating on digital strategy and branding" loading="lazy" />
            </figure>

            <div 
                class="ab-copy scroll-reveal-right"
                :class="{ 'is-revealed': isVisibleContent }"
                ref="contentRef"
            >
                <p class="ab-label">Who We Are</p>
                <h2 id="intro-title">A Women-Led Digital Ecosystem Driving Growth & Impact</h2>
                <p>
                    Eithiroli is a women-led digital growth platform dedicated to empowering women with practical digital skills, real-world internship experience, and business opportunities. 
                    We combine structured training with measurable marketing strategies to help women build independent careers while delivering real growth for brands.
                </p>
            </div>
        </div>
    </section>
</template>

<style scoped>
.scroll-reveal-left {
    opacity: 0;
    transform: translateX(-30px);
    transition: all 0.6s ease;
}
.scroll-reveal-right {
    opacity: 0;
    transform: translateX(30px);
    transition: all 0.6s ease;
}
.is-revealed {
    opacity: 1;
    transform: translateX(0);
}
</style>
