<template>
  <section class="home">
    <div class="home-header">
      <h1>moodstream</h1>
      <p>Discover movies or shows that match your mood.</p>
    </div>
    <div class="home-mood-container">
      <h2>How are you feeling?</h2>
      <div class="input-container">
        <input type="text" v-model="moodTranscript" placeholder="I'm feeling..." />
      </div>
      <div class="emoji-container">
        <span class="emoji" v-for="emoji in emojis" :key="emoji" @click="selectEmoji(emoji)">
          <img :src="getImageUrl(emoji.fileName)" :alt="emoji.name" />
        </span>
      </div>
      <div class="submit-button">
        <button @click="getRecommenddations">Get Recommendations</button>
      </div>


    </div>
  </section>


</template>

<script setup>
import { ref } from 'vue';


let currentPage = defineModel();

console.log('current page', currentPage);


const emojis = ref([
  { name: 'happy', fileName: 'happy.png' },
  { name: 'sad', fileName: 'sad.png' },
  { name: 'tired', fileName: 'tired.png' },
  { name: 'love', fileName: 'love.png' },
  { name: 'neutral', fileName: 'neutral.png' }
]);

const emojiGenres = {
  happy: ['comedy', 'animation', 'family'],
  sad: ['drama', 'crime', 'reality', 'horror'],
  tired: ['documentary', 'history', 'family'],
  love: ['romance'],
  neutral: ['action', 'adventure', 'fantasy', 'mystery', 'thriller', 'science fiction', 'comedy']
};

const mood = ref([]);
const autoPrompt = ref([]);
const moodTranscript = ref('');
console.log('moodTranscript', moodTranscript);


function selectEmoji(emoji) {
  mood.value.push(emoji.name);
  autoPrompt.value.push(emojiGenres[emoji.name]);
  console.log('Mood selected:', mood.value);
  console.log('Auto prompt:', autoPrompt.value);
}

function getImageUrl(fileName) {
  return new URL(`../assets/images/${fileName}`, import.meta.url).href;
}
</script>

<style scoped>
/* Scoped styles ensure these only apply to the Home.vue component */
.home {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.home-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2.5rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.home-header h1 {
  font-size: 3rem;
  font-weight: 700;
  color: #2c3e50; /* Match navbar color */
  margin: 0;
}

.home-header p {
  font-size: 1.25rem;
  color: #7f8c8d;
  margin-top: 0.5rem;
}

/* --- Mood Selection Area --- */
.home-mood-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.home-mood-container h2 {
    font-size: 1.75rem;
    color: #34495e;
    margin-bottom: 1.5rem;
}

.input-container input {
    width: 100%;
    padding: 1rem;
    font-size: 1.1rem;
    border: 2px solid #dfe4ea;
    border-radius: 8px;
    box-sizing: border-box; /* Important for padding */
    transition: border-color 0.3s;
}

.input-container input:focus {
    outline: none;
    border-color: #42b983;
}

.emoji-container {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
}

.emoji img {
  height: 60px; /* Slightly larger */
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.emoji img:hover {
    transform: scale(1.2);
}

.submit-button {
    margin-top: 2.5rem;
}

.submit-button button {
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
    font-weight: bold;
    color: white;
    background-color: #42b983;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.submit-button button:hover {
    background-color: #3aa873;
}
</style>
