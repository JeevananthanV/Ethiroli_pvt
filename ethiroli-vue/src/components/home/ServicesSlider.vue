<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const servicesSet = [
    {
        id: 'branding',
        number: '01',
        title: 'Brand Identity',
        icon: '/assets/images/services/branding.png',
        thumb: '/assets/images/services/branding_thumb.png'
    },
    {
        id: 'video',
        number: '02',
        title: 'Video editing',
        icon: '/assets/images/services/video.png',
        thumb: '/assets/images/services/Video editing.png'
    },
    {
        id: 'seo',
        number: '03',
        title: 'Search Engine Optimization',
        icon: '/assets/images/services/seo.png',
        thumb: '/assets/images/services/seo_thumb.png'
    },
    {
        id: 'dev',
        number: '04',
        title: 'Web & Mobile Development',
        icon: '/assets/images/services/development.png',
        thumb: '/assets/images/services/development_thumb.png'
    },
    {
        id: 'lead',
        number: '05',
        title: 'Lead Generation',
        icon: '/assets/images/services/lead_generation.png',
        thumb: '/assets/images/services/lead_generation_thumb.png'
    }
]

const clonesCount = servicesSet.length
const slides = [...servicesSet, ...servicesSet, ...servicesSet]

const currentIndex = ref(clonesCount)
const isTransitioning = ref(true)
const visibleSlides = ref(3)

let autoPlayInterval = null

const updateVisibleSlides = () => {
    if (window.innerWidth <= 600) visibleSlides.value = 1
    else if (window.innerWidth <= 992) visibleSlides.value = 2
    else visibleSlides.value = 3
}

const startAutoPlay = () => {
    stopAutoPlay()
    autoPlayInterval = setInterval(() => {
        handleNext()
    }, 3000)
}

const stopAutoPlay = () => {
    if (autoPlayInterval) clearInterval(autoPlayInterval)
}

onMounted(() => {
    updateVisibleSlides()
    window.addEventListener('resize', updateVisibleSlides)
    startAutoPlay()
})

onUnmounted(() => {
    window.removeEventListener('resize', updateVisibleSlides)
    stopAutoPlay()
})

const handleNext = () => {
    if (currentIndex.value >= slides.length - visibleSlides.value) return
    isTransitioning.value = true
    currentIndex.value++
    startAutoPlay()
}

const handlePrev = () => {
    if (currentIndex.value <= 0) return
    isTransitioning.value = true
    currentIndex.value--
    startAutoPlay()
}

const handleTransitionEnd = () => {
    isTransitioning.value = false
    if (currentIndex.value <= clonesCount - 1) {
        currentIndex.value += clonesCount
    } else if (currentIndex.value >= clonesCount * 2) {
        currentIndex.value -= clonesCount
    }
}

const jumpToSlide = (index) => {
    isTransitioning.value = true
    currentIndex.value = clonesCount + index
    startAutoPlay()
}

const logicalIndex = computed(() => {
    return ((currentIndex.value - clonesCount) % clonesCount + clonesCount) % clonesCount
})

const trackStyle = computed(() => {
    return {
        transform: `translateX(calc(-${currentIndex.value} * (100% / ${visibleSlides.value})))`,
        transition: isTransitioning.value ? 'transform 0.55s cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
    }
})

const isCurrentSlide = (idx) => {
    const isOriginalSet = Math.floor(idx / clonesCount) === 1
    return isOriginalSet && (idx % clonesCount === logicalIndex.value)
}
</script>

<template>
    <section class="et-services-section" id="services">
        <div class="et-services-label">
            <p><span class="star-rotate">★</span>Ethiroli Services</p>
        </div>
        <div class="et-services-intro">
            <h3>We Deliver Powerful Digital Solutions That Drive Growth</h3> 
            <button>Ethiroli Services <i class="fas fa-arrow-right"></i></button>
        </div>

        <div class="et-services-slider-wrapper">
            <button class="et-services-nav et-services-nav-prev" aria-label="Previous Service" @click="handlePrev">
                <i class="fas fa-chevron-left"></i>
            </button>

            <div 
                class="et-services-slider" 
                :style="{ '--visible-slides': visibleSlides }"
            >
                <div 
                    class="et-services-track"
                    :style="trackStyle"
                    @transitionend="handleTransitionEnd"
                >
                    <div 
                        v-for="(service, idx) in slides" 
                        :key="`${service.id}-${idx}`"
                        class="et-services-slide"
                        :class="{ 'active': isCurrentSlide(idx) }"
                    >
                        <div class="et-glass-card">
                            <div class="media">
                                <img :src="service.icon" :alt="`${service.title} Icon`" />
                                <p class="desc">{{ service.number }}</p>
                            </div>
                            <div class="title">
                                <h3>{{ service.title }}</h3>
                                <div class="thumb-wrapper">
                                    <div><img :src="service.thumb" :alt="`${service.title} Thumb`" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button class="et-services-nav et-services-nav-next" aria-label="Next Service" @click="handleNext">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>

        <div class="et-services-dots">
            <button 
                v-for="(service, idx) in servicesSet" 
                :key="`dot-${idx}`"
                class="et-services-dot"
                :class="{ 'active': logicalIndex === idx }" 
                :aria-label="`Slide ${idx + 1}`"
                @click="jumpToSlide(idx)"
            ></button>
        </div>
    </section>
</template>
