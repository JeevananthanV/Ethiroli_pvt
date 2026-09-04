<script setup>
const items = [
  "Search Engine Optimization (SEO)",
  "Pay-Per-Click Advertising (PPC)",
  "Content Marketing",
  "Email Marketing",
  "Web Design and Development",
  "Social Media Marketing (SMM)"
]
</script>

<template>
  <section class="et-services-marquee">
    <div class="et-marquee-track">
      <div 
        class="et-marquee-item" 
        v-for="(item, idx) in items" 
        :key="`orig-${idx}`"
      >
        {{ item }}
      </div>
      <!-- Clone for infinite scroll -->
      <div 
        class="et-marquee-item" 
        aria-hidden="true" 
        v-for="(item, idx) in items" 
        :key="`clone-${idx}`"
      >
        {{ item }}
      </div>
    </div>
  </section>
</template>
