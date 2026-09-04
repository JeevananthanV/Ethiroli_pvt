<script setup>
import CountUp from '../shared/CountUp.vue'
</script>

<template>
  <section class="et-activities-section" id="activities">
    <div class="et-activities-header">
      <p><span class="star-rotate">&#9733;</span> Our Activities</p>
      <h2>Empowering Through Action</h2>
      <p class="et-activities-subtitle">
        We are committed to empowering women entrepreneurs through focused programs, practical support, and measurable outcomes.
      </p>
    </div>

    <div class="et-activities-impact-grid">
      <article class="et-impact-card">
        <p class="et-impact-value"><CountUp :target="10" />+</p>
        <p class="et-impact-label">Women Trained</p>
      </article>
      <article class="et-impact-card">
        <p class="et-impact-value"><CountUp :target="10" />+</p>
        <p class="et-impact-label">Projects Completed</p>
      </article>
      <article class="et-impact-card">
        <p class="et-impact-value"><CountUp :target="50" /> hrs</p>
        <p class="et-impact-label">Hours Worked</p>
      </article>
      <article class="et-impact-card">
        <p class="et-impact-value"><CountUp :target="10" />+</p>
        <p class="et-impact-label">Internships Enabled</p>
      </article>
    </div>
  </section>
</template>
