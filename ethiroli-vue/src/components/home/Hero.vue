<script setup>
// For Intersection Observer-based enter animations (scroll reveals)
import { ref, onMounted, onUnmounted } from 'vue'

const isVisibleP = ref(false)
const isVisibleH1 = ref(false)

onMounted(() => {
    // Slight delay for load-in effect matching Framer Motion's initial mount
    setTimeout(() => {
        isVisibleP.value = true
    }, 500)
    
    setTimeout(() => {
        isVisibleH1.value = true
    }, 1000)
})
</script>

<template>
    <header>
        <div class="et-hero-section">
            <video 
                autoplay 
                muted 
                loop 
                playsinline 
                poster="/assets/images/banner/banner.png" 
                class="bg-video"
            >
                <source src="/assets/images/ethiroli.mp4" type="video/mp4" />
            </video>
            <div class="video-overlay"></div>
            <div class="video-content">
                <transition name="fade-up">
                    <p v-show="isVisibleP">BRANDING</p>
                </transition>
                <transition name="fade-up">
                    <h1 v-show="isVisibleH1">MARKETING</h1>
                </transition>
            </div>
        </div>
    </header>
</template>

<style scoped>
/* Scoped transitions mapping to native enter-from states */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 1s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
