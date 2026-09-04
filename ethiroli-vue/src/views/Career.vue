<script setup>
</script>

<template>
  <div class="career-page">
    <section class="ab-hero" style="background-image: url('/assets/images/banner/banner.png'); padding: 120px 20px 60px; text-align: center; background-color: var(--color-primary); color: #fff;">
      <div class="ab-hero-content">
        <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: #fff;">Careers At Ethiroli</h1>
        <p style="font-size: 1.1rem; max-width: 600px; margin: 0 auto; color: #f1ece6;">Build real-world experience with meaningful internship opportunities.</p>
      </div>
    </section>

    <section class="ab-section" id="openings" style="padding: 60px 8%;">
      <div class="ab-container" style="max-width: 1200px; margin: 0 auto;">
        <div class="ab-title-center" style="text-align: center; margin-bottom: 40px;">
          <h2 style="font-size: 2rem;">Current Openings</h2>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px;">
          <article class="ab-card-premium" style="background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            <h3 style="font-size: 1.4rem; margin-bottom: 12px; color: var(--color-accent);">Video Editor Intern</h3>
            <p style="margin-bottom: 12px;"><strong>Role Summary:</strong> Edit engaging short-form and long-form videos for social media, campaigns, and storytelling.</p>
            <p style="margin-bottom: 12px;"><strong>Skills Required:</strong> Premiere Pro, CapCut, basic After Effects, storytelling.</p>
            <p style="margin-bottom: 20px;"><strong>What You Gain:</strong> Portfolio projects, direct mentorship, and real-world production experience.</p>
            <router-link class="btn" to="/contact_us">Apply Now</router-link>
          </article>

          <article class="ab-card-premium" style="background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            <h3 style="font-size: 1.4rem; margin-bottom: 12px; color: var(--color-accent);">Web Developer Intern</h3>
            <p style="margin-bottom: 12px;"><strong>Role Summary:</strong> Build interactive web pages, UI components, and maintain responsive layouts.</p>
            <p style="margin-bottom: 12px;"><strong>Skills Required:</strong> HTML, CSS/Tailwind, JavaScript, Vue/React basics.</p>
            <p style="margin-bottom: 20px;"><strong>What You Gain:</strong> Live client projects, architecture guidance, and team collaboration.</p>
            <router-link class="btn" to="/contact_us">Apply Now</router-link>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>
