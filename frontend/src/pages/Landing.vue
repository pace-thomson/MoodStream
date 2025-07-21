<template>
    <div class="landing-container">
      <a href="#" @click.prevent="$emit('go-to-login')" class="top-right-login">Log In</a>
  
      <div class="hero-section">
        <img src="../assets/images/moodstreamlogo/moodstream_logo.png" alt="Moodstream Logo" class="hero-logo" />
        <h1 class="tagline">Don't know what to watch? Tell us how you feel.</h1>
        <p class="description">
          Moodstream helps you discover the perfect movie or TV show based on your current mood. Stop scrolling endlessly and start watching something you'll actually enjoy.
        </p>
        
        <button @click="$emit('go-to-register')" class="cta-button-large">Get Started</button>
  
        <p class="sub-text">
          Already have an account? <a href="#" @click.prevent="$emit('go-to-login')">Log In</a>
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  // Emits are already correctly set up to navigate
  defineEmits(['go-to-login', 'go-to-register']);
  </script>
  
  <style scoped>
  /* Add this @keyframes rule at the top of your <style> block */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Add animation properties to the hero elements */
.hero-logo, .tagline, .description, .button-group {
  /* Apply the animation */
  animation: fadeInUp 0.8s ease-out forwards;
  /* Start with the element hidden */
  opacity: 0;
}

/* Add delays to make them appear one after another */
.tagline {
  animation-delay: 0.2s;
}
.description {
  animation-delay: 0.4s;
}
.button-group {
  animation-delay: 0.6s;
}
.landing-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #1a202c;
  text-align: center;
  padding: 2rem;
  box-sizing: border-box;
  position: relative;
}

/* --- MODIFIED: This class is now styled like a button --- */
.top-right-login {
  position: absolute;
  top: 2rem;
  right: 2rem;
  
  /* Button Styles */
  padding: 0.5rem 1.25rem;
  font-size: 0.9rem;
  font-weight: bold;
  color: #e2e8f0;
  background-color: transparent;
  border: 2px solid #4a5568;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.top-right-login:hover {
  background-color: #4a5568;
  color: #ffffff;
}
/* --- End of modification --- */

.hero-section {
  max-width: 650px;
}
.hero-logo {
  max-width: 400px;
  width: 100%;
  height: auto;
  margin-bottom: 2rem;
}
.tagline {
  font-size: 2.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 1rem 0;
  line-height: 1.2;
}
.description {
  font-size: 1.1rem;
  color: #a0aec0;
  line-height: 1.6;
  margin: 0 0 2.5rem 0;
}
.cta-button-large {
  width: 100%;
  max-width: 400px;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  background-color: #735CD1;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.cta-button-large:hover {
  background-color: #624FAD;
}
.sub-text {
  margin-top: 1.5rem;
  color: #a0aec0;
  font-size: 0.9rem;
}
.sub-text a {
  font-weight: 500;
  color: #e2e8f0;
  text-decoration: underline;
}
.sub-text a:hover {
  color: #735CD1;
}
</style>