<script setup>
import { ref, computed } from 'vue'

const testimonialsData = [
    {
        text: "Fast communication, excellent design quality, and reliable service. They understood our vision and turned it into something amazing.",
        name: "Tina Brown",
        role: "CEO, ethiroli",
        rating: "★★★★★",
        image: "https://picsum.photos/seed/tina/100/100"
    },
    {
        text: "The team at Nexella is incredibly professional. They delivered our digital marketing campaign ahead of schedule with results that exceeded our expectations.",
        name: "David Smith",
        role: "CEO, Nexella",
        rating: "★★★★★",
        image: "https://picsum.photos/seed/david/100/100"
    },
    {
        text: "Creative, responsive, and data-driven. Our conversion rates have doubled since we started working with them. Highly recommended!",
        name: "Sarah Jenkins",
        role: "Director, Solaris",
        rating: "★★★★☆",
        image: "https://picsum.photos/seed/sarah/100/100"
    }
]

const currentIndex = ref(0)
const slideDirection = ref('down')

const currentTestimonial = computed(() => testimonialsData[currentIndex.value])

const handleNext = () => {
    slideDirection.value = 'down'
    currentIndex.value = (currentIndex.value + 1) % testimonialsData.length
}

const handlePrev = () => {
    slideDirection.value = 'up'
    currentIndex.value = (currentIndex.value - 1 + testimonialsData.length) % testimonialsData.length
}
</script>

<template>
    <section class="testimonial-section" id="testimonialSection">
        <div class="testimonial-container">
            <div class="testimonial-header">
                <p class="testimonial-title"><span class="star-rotate">★</span> Our Testimonials</p>
                <p class="testimonial-stats">4.8 (5k+) Customer reviews</p>
            </div>

            <div class="testimonial-grid">
                <div class="testimonial-visual">
                    <div class="visual-badge glass-card">
                        <img src="/assets/images/banner/banner.png" alt="Happy Customers" />
                        <p>300+ Happy Customers</p>
                    </div>
                    <div class="glass-card" style="padding: 2rem; text-align: center;">
                        <div style="font-size: 3rem; font-weight: 700; color: var(--color-primary); line-height: 1;">4.8</div>
                        <div style="color: var(--color-text-muted);">Average Rating</div>
                    </div>
                </div>
                
                <div class="testimonial-content">
                    <h3 class="content-heading">What Our Happy clients say about us.</h3>
                    
                    <div class="testimonial-slider">
                        <div class="testimonial-card glass-card" style="overflow: hidden;">
                            <transition :name="`slide-${slideDirection}`" mode="out-in">
                                <div :key="currentIndex" class="card-content-wrapper">
                                    <div class="card-top">
                                        <div class="star-rating">{{ currentTestimonial.rating }}</div>
                                        <div class="quote-icon">“</div>
                                    </div>
                                    <blockquote class="testimonial-text">
                                        “{{ currentTestimonial.text }}”
                                    </blockquote>
                                    <div class="testimonial-footer">
                                        <div class="client-info">
                                            <img :src="currentTestimonial.image" alt="Client" class="client-avatar" />
                                            <div class="client-details">
                                                <div> 
                                                    <p class="client-name">{{ currentTestimonial.name }}</p>
                                                    <p class="client-role" v-html="currentTestimonial.role.replace(', ', ', <br/>')"></p>
                                                </div>
                                                <div class="slider-controls-inline">
                                                    <button class="control-btn" aria-label="Previous" @click="handlePrev">↑</button>
                                                    <button class="control-btn" aria-label="Next" @click="handleNext">↓</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </transition>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active,
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s ease;
}

.slide-down-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.slide-down-leave-to,
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
