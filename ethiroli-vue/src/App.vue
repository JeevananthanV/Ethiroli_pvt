<script setup>
import Navbar from './components/shared/Navbar.vue'
import Footer from './components/shared/Footer.vue'
import ScrollToTopBtn from './components/shared/ScrollToTopBtn.vue'
import WhatsAppBtn from './components/shared/WhatsAppBtn.vue'
</script>

<template>
  <Navbar />
  <main>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <Footer />
  <ScrollToTopBtn />
  <WhatsAppBtn />
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
