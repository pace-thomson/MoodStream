<template>
  <section class="home">
    <div class="home-header">
      <h3 class="welcome-text">Welcome to</h3>
      <img src="../assets/images/moodstreamlogo/moodstream_logo.png" alt="Moodstream Logo" class="header-logo" />
      <p>Discover movies or shows that match your mood.</p>
    </div>
    <div class="home-mood-container">
      <h2>How are you feeling?</h2>
      <div class="input-container">
        <input :class="{ 'disabled-input': emojisOrPrompt == 'emojis' }" type="text" v-model="moodTranscript"
          placeholder="I'm feeling..." />
        <p v-if="userSentBadPrompt" class="bad-user-prompt">
          Could you please clarify your feelings or provide more context for what you feel like watching?
        </p>
      </div>
      <div class="emoji-container">
        <span v-for="emoji in emojis" :key="emoji" @click="selectEmoji(emoji)" :class="{
          'disabled-emoji': emojisOrPrompt == 'prompt',
          'emoji': emojisOrPrompt != 'prompt',
          'emoji-selected': mood.includes(emoji.name)
        }">
          <img :src="getImageUrl(emoji.fileName)" :alt="emoji.name" />
          <span class="emoji-label">{{ emoji.name.charAt(0).toUpperCase() + emoji.name.slice(1) }}</span>
        </span>
      </div>
      <div class="submit-button">
        <button @click="getRecommendations">Get Recommendations</button>
        <button v-if="recommendedShows != null" @click="homeState = 'recommendations'">
          See Last Recommendations
        </button>
      </div>
    </div>
    <div v-if="isLoading">
      <h1>I'M LOADING HEHE</h1>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue';
import { getShowsWithGenres, getShowsWithPrompt } from '../serverCaller.js'
import { SupabaseClient } from '@supabase/supabase-js';


const emojisOrPrompt = ref('either');
const mood = ref([]);
const moodTranscript = ref('');
const userSentBadPrompt = ref(false);
const isLoading = ref(false);

const props = defineProps({
  supabase: SupabaseClient,
  currentUserId: String,
  catalogs: Array,
  genres: Array
});

const homeState = defineModel('home-state');
const recommendedShows = defineModel('recommended-shows');

const emojis = ref([
  { name: 'happy', fileName: 'happy.png' },
  { name: 'sad', fileName: 'sad.png' },
  { name: 'tired', fileName: 'tired.png' },
  { name: 'loving', fileName: 'love.png' },
  { name: 'silly', fileName: 'silly.png' },
  { name: 'frightened', fileName: 'frightened.png' },
  { name: 'meh', fileName: 'neutral.png' },
  { name: 'sneaky', fileName: 'mysterious.png' },
  { name: 'amused', fileName: 'amused.png' },
  { name: 'stressed', fileName: 'stressed.png' },
  { name: 'crazy', fileName: 'crazy.png' },
  { name: 'angry', fileName: 'angry.png' }
]);

// const emojiGenres = {
//   happy: ['comedy', 'animation', 'family'],
//   sad: ['drama', 'crime'],
//   tired: ['family', 'animation', 'comedy'],
//   loving: ['romance', 'drama'],
//   silly: ['comedy', 'animation', 'adventure'],
//   frightened: ['horror', 'thriller', 'mystery'],
//   meh: ['action', 'drama', 'mystery', 'scifi'],
//   sneaky: ['mystery', 'thriller', 'crime'],
//   amused: ['comedy', 'animation'],
//   stressed: ['drama', 'history', 'scifi'],
//   crazy: ['action', 'adventure', 'fantasy', 'scifi', 'comedy'],
//   angry: ['action', 'thriller', 'crime', 'drama']
// };

const emojiGenres = {
  happy: ['family'],
  sad: ['drama'],
  tired: ['fantasy'],
  loving: ['romance'],
  silly: ['animation'],
  frightened: ['horror'],
  meh: ['action', 'comedy', 'thriller', 'scifi', 'romance', 'drama', 'adventure'],
  sneaky: ['mystery', 'thriller'],
  amused: ['comedy'],
  stressed: ['drama'],
  crazy: ['action', 'adventure'],
  angry: ['crime']
};


watch(moodTranscript, (newTranscript, oldTranscript) => {
  if (newTranscript != '') {
    emojisOrPrompt.value = 'prompt'
  } else {
    emojisOrPrompt.value = 'either'
  }
})


function selectEmoji(emoji) {
  if (emojisOrPrompt.value == 'prompt') {
    return;
  } else if (mood.value.includes(emoji.name)) {
    mood.value = mood.value.filter(item => item !== emoji.name);
    if (mood.value.length == 0) emojisOrPrompt.value = 'either';
  } else {
    emojisOrPrompt.value = 'emojis';
    mood.value.push(emoji.name);
  }
}

function getImageUrl(fileName) {
  return new URL(`../assets/images/${fileName}`, import.meta.url).href;
}

async function getRecommendations() {
  userSentBadPrompt.value = false;
  isLoading.value = true;

  let showss;
  console.log("emojisOrPrompt.value", emojisOrPrompt.value);
  if (emojisOrPrompt.value == 'prompt') {
    showss = await getShowsWithPrompt(moodTranscript.value, props.catalogs);
  } else if (emojisOrPrompt.value == 'emojis') {
    const genres = getGenreListFromMoods();
    showss = await getShowsWithGenres(genres, props.catalogs);
  }
  if (showss == null) {
    userSentBadPrompt.value = true;
    isLoading.value = false;
    return;
  }
  console.log("showss", showss);
  isLoading.value = false;
  recommendedShows.value = showss;
  homeState.value = 'recommendations';
}

function getGenreListFromMoods() {
  let genreArray = [];
  console.log("genreArray:", genreArray);
  for (let i = 0; i < mood.value.length; i++) {
    let moodGenres = emojiGenres[mood.value[i]];
    genreArray = genreArray.concat(moodGenres);
  }
  let newArray = [];
  for (let i = 0; i < genreArray.length; i++) {
    if (!newArray.includes(genreArray[i])) {
      newArray.push(genreArray[i]);
    }
  }
  console.log("new genreArray:", newArray);
  return newArray;
}
</script>

<style scoped>
/* Scoped styles ensure these only apply to the Home.vue component */

.home-header {
  text-align: center;
  /*margin-bottom: 3rem;*/
  padding: 2.5rem;
  background-color: #2d3748;
  /* Dark card background */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.welcome-text {
  font-size: 1.5rem;
  font-weight: 500;
  color: #a0aec0;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 8px;
}

/* Style for the logo image */
.header-logo {
  display: block;
  /* This is necessary for margin:auto to work */
  margin-left: auto;
  margin-right: auto;
  max-width: 380px;
  /* Control the size of the logo */
  width: 100%;
  height: auto;
  margin-bottom: 1rem;
}

.home-header p {
  font-size: 1.25rem;
  color: #a0aec0;
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
  /*color: #34495e;*/
  margin-bottom: 1.5rem;
}



.input-container input {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  border: 2px solid #dfe4ea;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-sizing: border-box;
  /* Important for padding */
  transition: border-color 0.3s;
}

.input-container input:focus {
  outline: none;
  border-color: #735CD1;
  ;
}

.disabled-input {
  pointer-events: none;
}

.bad-user-prompt {
  background-color: #c534347b;
  border-left: 6px solid #b12626;
  padding: 4px;
  color: white;
}


.emoji-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.emoji {
  position: relative;
  display: inline-block; 
}


.emoji-label {
  
  position: absolute;
  bottom: 115%;
  left: 50%;
  transform: translateX(-50%);

  background-color: #2d3748;
  color: #e2e8f0;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap; 
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
  
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
}
.emoji:hover .emoji-label {
  opacity: 1;
  visibility: visible;
}

.emoji img {
  height: 60px;
  /* Slightly larger */
  cursor: pointer;
}

.emoji-selected {
  transform: scale(1.2);
  transition: transform 0.1s ease-in-out;
}

.disabled-emoji img {
  filter: grayscale(80%);
  transition: none;
  height: 60px;
}

.disabled-emoji img:hover {
  transform: none;
}

.disabled-emoji:hover {
  transform: none;
}

.submit-button {
  margin-top: 2.5rem;
}

.submit-button button {
  padding: 1rem 2.5rem;
  margin: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  background-color: #735CD1;
  /* Purple accent */
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button button:hover {
  background-color: #624FAD;
  /* Darker purple */
}
</style>

<!-- /* .home-mood-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.home-mood-container h2 {
  font-size: 1.75rem;
  color: #cbd5e0;
  margin-bottom: 1.5rem;
}

.input-container input {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  background-color: #1a202c;
  border: 2px solid #4a5568;
  color: #e2e8f0;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.input-container input:focus {
  outline: none;
  border-color: #42b983;
}

.disabled-input {
  pointer-events: none;
  opacity: 0.5;
}

.emoji-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.emoji img {
  height: 60px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.emoji:hover img {
  transform: scale(1.1);
}

.emoji-selected img {
  transform: scale(1.2);
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(66, 185, 131, 0.7);
}

.disabled-emoji img {
  filter: grayscale(80%) opacity(50%);
  cursor: not-allowed;
}

.disabled-emoji:hover img {
  transform: none;
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
} */ -->

<!-- <style scoped>
/* Scoped styles ensure these only apply to the Home.vue component  LIGHT THEME */
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
  color: #2c3e50;
  /* Match navbar color */
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
  box-sizing: border-box;
  /* Important for padding */
  transition: border-color 0.3s;
}

.input-container input:focus {
  outline: none;
  border-color: #42b983;
}

.disabled-input {
  pointer-events: none;
}


.emoji-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.emoji img {
  height: 60px;
  /* Slightly larger */
  cursor: pointer;
}

.emoji-selected {
  transform: scale(1.2);
  transition: transform 0.1s ease-in-out;
}

.disabled-emoji img {
  filter: grayscale(80%);
  transition: none;
  height: 60px;
}

.disabled-emoji img:hover {
  transform: none;
}

.disabled-emoji:hover {
  transform: none;
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
</style> -->

<!-- /* .home-mood-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.home-mood-container h2 {
  font-size: 1.75rem;
  color: #cbd5e0;
  margin-bottom: 1.5rem;
}

.input-container input {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  background-color: #1a202c;
  border: 2px solid #4a5568;
  color: #e2e8f0;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.input-container input:focus {
  outline: none;
  border-color: #42b983;
}

.disabled-input {
  pointer-events: none;
  opacity: 0.5;
}

.emoji-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.emoji img {
  height: 60px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.emoji:hover img {
  transform: scale(1.1);
}

.emoji-selected img {
  transform: scale(1.2);
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(66, 185, 131, 0.7);
}

.disabled-emoji img {
  filter: grayscale(80%) opacity(50%);
  cursor: not-allowed;
}

.disabled-emoji:hover img {
  transform: none;
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
} */ -->

<!-- <style scoped>
/* Scoped styles ensure these only apply to the Home.vue component  LIGHT THEME */
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
  color: #2c3e50;
  /* Match navbar color */
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
  box-sizing: border-box;
  /* Important for padding */
  transition: border-color 0.3s;
}

.input-container input:focus {
  outline: none;
  border-color: #42b983;
}

.disabled-input {
  pointer-events: none;
}


.emoji-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.emoji img {
  height: 60px;
  /* Slightly larger */
  cursor: pointer;
}

.emoji-selected {
  transform: scale(1.2);
  transition: transform 0.1s ease-in-out;
}

.disabled-emoji img {
  filter: grayscale(80%);
  transition: none;
  height: 60px;
}

.disabled-emoji img:hover {
  transform: none;
}

.disabled-emoji:hover {
  transform: none;
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
</style> -->
