<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isVisibleRow = ref(false)
const rowRef = ref(null)

onMounted(() => {
    const observer = new IntersectionObserver((entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
            isVisibleRow.value = true
        }
    }, { threshold: 0.2 })

    if (rowRef.value) observer.observe(rowRef.value)
    onUnmounted(() => observer.disconnect())
})
</script>

<template>
    <section class="et-projects-section" id="projects">
        <div class="et-projects-header">
            <p><span class="star-rotate">&#9733;</span> Our Projects</p>
            <h2>Projects That Created Real Impact</h2>
            <p class="et-projects-subtitle">
                We have successfully completed a variety of projects that made a measurable impact on our clients' growth.
            </p>
        </div>

        <div class="et-projects-grid" ref="rowRef">
            <article 
                class="et-project-card scroll-reveal-up"
                :class="{ 'is-revealed': isVisibleRow }"
            >
                <img src="/assets/images/founder/WhatsApp Image 2026-03-16 at 2.11.29 PM.jpeg" alt="Workshops and training sessions" />
                <div class="et-project-card-content">
                    <h3>Women Entrepreneur Workshops</h3>
                    <p>Workshops and training sessions tailored to women entrepreneurs.</p>
                    <a href="#" class="et-project-link">Learn More <i class="fas fa-arrow-right"></i></a>
                </div>
            </article>

            <article 
                class="et-project-card scroll-reveal-up delay-1"
                :class="{ 'is-revealed': isVisibleRow }"
            >
                <img src="/assets/images/banner/gals.png" alt="Networking events and mentorship programs" />
                <div class="et-project-card-content">
                    <h3>Mentorship and Networking</h3>
                    <p>Networking events and mentorship programs that foster collaboration and growth.</p>
                    <a href="#" class="et-project-link">Learn More <i class="fas fa-arrow-right"></i></a>
                </div>
            </article>
        </div>
    </section>
</template>

<style scoped>
.scroll-reveal-up {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
}
.delay-1 {
    transition-delay: 0.2s;
}
.is-revealed {
    opacity: 1;
    transform: translateY(0);
}
</style>
