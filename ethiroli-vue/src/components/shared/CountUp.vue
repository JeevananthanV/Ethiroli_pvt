<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  target: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 1200
  }
})

const count = ref(0)
const hasAnimated = ref(false)
const elementRef = ref(null)

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    const [entry] = entries
    if (entry.isIntersecting && !hasAnimated.value) {
      hasAnimated.value = true
    }
  }, { threshold: 0.35 })

  if (elementRef.value) observer.observe(elementRef.value)

  onUnmounted(() => observer.disconnect())
})

watch(hasAnimated, (newValue) => {
  if (!newValue) return

  let startTime = null
  const tick = (now) => {
    if (!startTime) startTime = now
    const elapsed = now - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3) 
    const value = Math.round(props.target * eased)
    count.value = value

    if (progress < 1) {
      requestAnimationFrame(tick)
    }
  }
  requestAnimationFrame(tick)
})
</script>

<template>
  <span ref="elementRef">{{ count }}</span>
</template>
