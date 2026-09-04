<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)

const handleScroll = () => {
    isVisible.value = window.scrollY > 150
}

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
    <button 
        id="scrollToTopBtn" 
        class="scroll-to-top" 
        :class="{ 'show': isVisible }"
        aria-label="Scroll to Top"
        @click="scrollToTop"
    >
        <i class="fas fa-chevron-up"></i>
    </button>
</template>
