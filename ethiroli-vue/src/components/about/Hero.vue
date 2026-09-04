<script setup>
import { ref, onMounted } from 'vue'

const isLoaded = ref(false)

onMounted(() => {
    setTimeout(() => {
        isLoaded.value = true
    }, 100)
})
</script>

<template>
    <header class="ab-hero" id="about-hero" style="background-image: url('/assets/images/banner/banner.png')" role="banner">
        <div class="ab-hero-content">
            <transition name="fade-down" appear>
                <h1 v-if="isLoaded">About Ethiroli</h1>
            </transition>
            <transition name="fade-up" appear>
                <p v-if="isLoaded" style="transition-delay: 0.2s">Empowering Voices. Inspiring Change.</p>
            </transition>
        </div>
    </header>
</template>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active,
.fade-down-enter-active,
.fade-down-leave-active {
  transition: all 0.6s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
