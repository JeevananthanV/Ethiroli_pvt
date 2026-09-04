<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isVisibleTitle = ref(false)
const isVisibleVision = ref(false)
const isVisibleMission = ref(false)

const titleRef = ref(null)
const visionRef = ref(null)
const missionRef = ref(null)

onMounted(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target === titleRef.value) isVisibleTitle.value = true
                if (entry.target === visionRef.value) isVisibleVision.value = true
                if (entry.target === missionRef.value) isVisibleMission.value = true
            }
        })
    }, { threshold: 0.2 })

    if (titleRef.value) observer.observe(titleRef.value)
    if (visionRef.value) observer.observe(visionRef.value)
    if (missionRef.value) observer.observe(missionRef.value)

    onUnmounted(() => observer.disconnect())
})
</script>

<template>
    <section class="ab-section ab-vision-mission" id="vision-mission" aria-labelledby="vision-mission-title">
        <div class="ab-container">
            <div class="ab-title-center">
                <span class="subtitle">Our Purpose</span>
                <h2 
                    id="vision-mission-title"
                    class="scroll-reveal-up"
                    :class="{ 'is-revealed': isVisibleTitle }"
                    ref="titleRef"
                >
                    Vision & Mission
                </h2>
            </div>
            <div class="ab-card-grid-two">
                
                <article 
                    class="vm-card vision scroll-reveal-left"
                    :class="{ 'is-revealed': isVisibleVision }"
                    ref="visionRef"
                >
                    <div class="vm-icon">
                        <i class="fa-solid fa-bullseye"></i>
                    </div>
                    <h3>Our Vision</h3>
                    <blockquote class="vm-quote">
                        "To become the leading women-centered digital growth company in Tamil Nadu."
                    </blockquote>
                    <p class="vm-text">
                        To build a women-led digital ecosystem that empowers communities through skills, opportunities, and impactful business growth.
                    </p>
                </article>
                
                <article 
                    class="vm-card mission scroll-reveal-right"
                    :class="{ 'is-revealed': isVisibleMission }"
                    ref="missionRef"
                >
                    <div class="vm-icon">
                        <i class="fa-solid fa-rocket"></i>
                    </div>
                    <h3>Our Mission</h3>
                    <div class="vm-tagline">
                        <span class="tag-pill">Skill women.</span>
                        <span class="tag-pill">Build community.</span>
                        <span class="tag-pill">Deliver growth.</span>
                    </div>
                    <p class="vm-text">
                        To empower women through digital skill training, real-world internships, and business opportunities while delivering measurable marketing growth to brands.
                    </p>
                </article>
                
            </div>
        </div>
    </section>
</template>

<style scoped>
.scroll-reveal-up {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease;
}
.scroll-reveal-left {
    opacity: 0;
    transform: translateX(-30px);
    transition: all 0.6s ease;
}
.scroll-reveal-right {
    opacity: 0;
    transform: translateX(30px);
    transition: all 0.6s ease;
    transition-delay: 0.2s;
}
.is-revealed {
    opacity: 1;
    transform: translateY(0) translateX(0);
}
</style>
