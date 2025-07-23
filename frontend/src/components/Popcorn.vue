<template>
  <!-- 
    This container is a fixed overlay for the loading screen.
    It has a semi-transparent background and a loading message.
  -->
  <div class="loading-container">
    <!-- This div now displays the 'quote' prop instead of static text. -->
    <div class="loading-text">"{{ quote }}"</div>
    <!--
      We render a fixed number of kernels. CSS will handle their animation loop.
      The :style attribute assigns a unique animation delay and horizontal
      position to each kernel, creating a random effect.
    -->
    <div
      v-for="i in 10"
      :key="i"
      class="popcorn-kernel"
      :style="getKernelStyle()"
    ></div>
  </div>
</template>

<script setup>
/**
 * To use this component with dynamic quotes:
 * 1. In the parent component, create a ref to hold the current quote:
 * const currentQuote = ref('');
 * * 2. Before showing the loading screen, pick a random quote and update the ref:
 * const quotes = ["Quote 1", "Quote 2", ...];
 * currentQuote.value = quotes[Math.floor(Math.random() * quotes.length)];
 * * 3. Pass the quote as a prop in your template:
 * <PopcornAnimation v-if="isLoading" :quote="currentQuote" />
 */

// Define the props this component accepts.
// We expect a 'quote' of type String, and we provide a default value.
defineProps({
  quote: {
    type: String,
    default: 'Loading...'
  }
});

/**
 * Generates a unique style for each kernel.
 * This function provides a random horizontal starting position and a random
 * animation delay. This makes the looping animation look less repetitive.
 */
function getKernelStyle() {
  const left = Math.random() * 100; // Horizontal position in %
  const delay = Math.random() * 5;  // Animation delay in seconds
  return {
    left: `${left}vw`,
    animationDelay: `${delay}s`,
  };
}
</script>

<style scoped>
/*
  The main container for the loading screen. It covers the entire viewport,
  has a semi-transparent background, and uses z-index to sit on top of
  other page content. Remember to give your navbar a higher z-index (e.g., 1001)
  if you want it to be clickable.
*/
.loading-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  z-index: 999;
  background-color: rgba(55, 59, 62, 0.85); /* Dark background with opacity */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
}

.loading-text {
  color: white;
  font-size: 2rem;
  font-family: sans-serif;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

/*
  The base style for the popcorn kernels.
*/
.popcorn-kernel {
  width: 35px;
  height: 35px;
  position: absolute;
  top: -50px; /* Start above the screen */
  background: url(https://contentservice.mc.reyrey.net/image_v1.0.0/?id=c1627fe5-a7e7-5fb7-af61-374c65707e3c&637384707423276230);
  background-size: 100% 100%;
  filter: drop-shadow(0px 0px 5px rgba(0,0,0,.25));
  
  /* The animation is now set to loop infinitely. */
  animation: pop 5s linear infinite;
}

/*
  The keyframe animation remains the same, controlling the "pop" and fall.
  Because the animation is infinite, each kernel will repeat this cycle.
*/
@keyframes pop {
  0% { transform: scale(.1); top: -50px; }
  3% { transform: scale(2); }
  6% { transform: scale(1); }
  100% { transform: scale(1) rotate(720deg); top: 105%; }
}
</style>



<!-- <template>
  
  <div class="loading-container">
    <div class="loading-text">Movie Quote blah blah blah...</div>
   
    <div
      v-for="i in 10"
      :key="i"
      class="popcorn-kernel"
      :style="getKernelStyle()"
    ></div>
  </div>
</template>

<script setup>
/**
 * Generates a unique style for each kernel.
 * This function provides a random horizontal starting position and a random
 * animation delay. This makes the looping animation look less repetitive.
 */
function getKernelStyle() {
  const left = Math.random() * 100; // Horizontal position in %
  const delay = Math.random() * 5;  // Animation delay in seconds
  return {
    left: `${left}vw`,
    animationDelay: `${delay}s`,
  };
}
</script>

<style scoped>
/*
  The main container for the loading screen. It covers the entire viewport,
  has a semi-transparent background, and uses z-index to sit on top of
  other page content. Remember to give your navbar a higher z-index (e.g., 1001)
  if you want it to be clickable.
*/
.loading-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  z-index: 999;
  background-color: rgba(44, 62, 80, 0.85); /* Dark background with opacity */
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-text {
  color: white;
  font-size: 2rem;
  font-family: sans-serif;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

/*
  The base style for the popcorn kernels.
*/
.popcorn-kernel {
  width: 35px;
  height: 35px;
  position: absolute;
  top: -50px; /* Start above the screen */
  background: url(https://contentservice.mc.reyrey.net/image_v1.0.0/?id=c1627fe5-a7e7-5fb7-af61-374c65707e3c&637384707423276230);
  background-size: 100% 100%;
  filter: drop-shadow(0px 0px 5px rgba(0,0,0,.25));
  
  /* The animation is now set to loop infinitely. */
  animation: pop 5s linear infinite;
}

/*
  The keyframe animation remains the same, controlling the "pop" and fall.
  Because the animation is infinite, each kernel will repeat this cycle.
*/
@keyframes pop {
  0% { transform: scale(.1); top: -50px; }
  3% { transform: scale(2); }
  6% { transform: scale(1); }
  100% { transform: scale(1) rotate(720deg); top: 105%; }
}
</style>
 -->
