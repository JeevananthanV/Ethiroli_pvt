<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const scrolled = ref(false)
const hidden = ref(false)
const menuOpen = ref(false)
let lastScrollY = 0

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const handleScroll = () => {
  const currentScrollY = window.scrollY

  scrolled.value = currentScrollY > 50
  
  if (currentScrollY > lastScrollY && currentScrollY > 200) {
    hidden.value = true
  } else {
    hidden.value = false
  }

  lastScrollY = currentScrollY
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(() => route.fullPath, () => {
  menuOpen.value = false
})
</script>

<template>
  <nav 
    class="main-nav" 
    :class="{ 'scrolled': scrolled }" 
    :style="{ transform: hidden ? 'translateY(-100%)' : 'translateY(0)' }"
  >
    <div class="nav-container">
      <router-link to="/" class="logo">
        <img src="/assets/images/ethiroli_logo.png" alt="Ethiroli Logo" />
      </router-link>
      <ul class="nav-links">
        <li><router-link to="/">Home</router-link></li>
        <li><a href="/#services">Services</a></li>
        <li><router-link to="/about" active-class="active">About Us</router-link></li>
        <li><router-link to="/career" active-class="active">Career</router-link></li>
        <li><router-link to="/contact_us" active-class="active">Contact</router-link></li>
      </ul>
      <div class="nav-actions">
        <router-link to="/contact_us" class="btn">Get in Touch</router-link>
        <button 
          class="hamburger" 
          :class="{ 'open': menuOpen }" 
          aria-label="Menu" 
          :aria-expanded="menuOpen"
          @click="toggleMenu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
    
    <div class="mobile-menu" :class="{ 'active': menuOpen }">
      <ul>
        <li><router-link to="/" class="mobile-link">Home</router-link></li>
        <li><a href="/#services" class="mobile-link" @click="menuOpen = false">Services</a></li>
        <li><router-link to="/about" class="mobile-link">About Us</router-link></li>
        <li><router-link to="/career" class="mobile-link">Career</router-link></li>
        <li><router-link to="/contact_us" class="mobile-link">Contact</router-link></li>
      </ul>
      <router-link to="/contact_us" class="btn" @click="menuOpen = false">Get in Touch</router-link>
    </div>
  </nav>
</template>
