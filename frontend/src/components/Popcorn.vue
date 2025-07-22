<template>
  <!-- 
    This container is a fixed overlay, covering the entire screen.
    The z-index makes it sit on top of other content.
  -->
  <div class="popcorn-container">
    <!--
      The v-for directive still renders a div for each popcorn object.
      The style binding now only sets the 'left' and 'animation' properties,
      as the rest is handled by the CSS classes.
    -->
    <div
      v-for="popcorn in popcorns"
      :key="popcorn.id"
      class="popcorn-kernel"
      :style="popcorn.style"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// A reactive array to hold all the popcorn objects currently on screen.
const popcorns = ref([]);

// A counter to ensure each popcorn has a unique ID for the :key attribute.
let popcornIdCounter = 0;

// To store the interval ID, so we can clear it later to prevent memory leaks.
let popcornInterval = null;

// The duration of the animation in seconds.
const ANIMATION_DURATION_S = 5;

/**
 * Creates a single popcorn kernel object and adds it to our reactive array.
 */
function createPopcorn() {
  const id = popcornIdCounter++;
  
  // Generate a random horizontal position for the new kernel.
  // The kernel width is now fixed at 35px by the CSS.
  const left = Math.random() * (window.innerWidth - 35);

  // Create the new popcorn object. Note that width, height, and top are
  // now controlled by the CSS classes and @keyframes.
  const newPopcorn = {
    id: id,
    style: {
      left: `${left}px`,
      // The animation property is still set dynamically to control the duration.
      animation: `pop ${ANIMATION_DURATION_S}s linear forwards`,
    },
  };

  // Add the new object to our array. Vue will automatically render a new div.
  popcorns.value.push(newPopcorn);

  // Set a timeout to remove this specific popcorn kernel from the array
  // after its animation is complete.
  setTimeout(() => {
    popcorns.value = popcorns.value.filter(p => p.id !== id);
  }, ANIMATION_DURATION_S * 1000);
}

// onMounted is a Vue lifecycle hook that runs after the component is added to the DOM.
onMounted(() => {
  // Create a new popcorn kernel every second.
  popcornInterval = setInterval(createPopcorn, 1000);
});

// onUnmounted is a lifecycle hook that runs just before the component is removed.
onUnmounted(() => {
  clearInterval(popcornInterval);
});
</script>

<style scoped>
/*
  The container is now a fixed overlay that covers the entire viewport.
  It blocks mouse events to the content behind it. For a navbar to be
  clickable, it must have a higher z-index (e.g., z-index: 1000).
*/
.popcorn-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  z-index: 999; /* Sits on top of content, blocking clicks. */
}

/*
  The kernel style is updated to use the background image and filter
  you provided. Its initial vertical position is off-screen at the top.
*/
.popcorn-kernel {
  width: 35px;
  height: 35px;
  position: absolute;
  top: -50px; /* Start above the screen */
  background: url(https://contentservice.mc.reyrey.net/image_v1.0.0/?id=c1627fe5-a7e7-5fb7-af61-374c65707e3c&637384707423276230);
  background-size: 100% 100%;
  filter: drop-shadow(0px 0px 5px rgba(0,0,0,.25));
}

/*
  This is the new keyframe animation you provided.
  It controls the scaling, rotation, and vertical movement of the kernel.
*/
@keyframes pop {
  0% { transform: scale(.1); }
  3% { transform: scale(2); }
  6% { transform: scale(1); }
  100% { transform: scale(1) rotate(720deg); top: 105%; }
}
</style>
