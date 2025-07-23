<template>
  <section class="home">
    <div class="home-header">
      <h3 class="welcome-text">Welcome to</h3>
      <img src="../assets/images/moodstreamlogo/moodstream_logo.png" alt="Moodstream Logo" class="header-logo" />
      <p>Discover movies or shows that match your mood.</p>
    </div>
    <div class="home-mood-container">
      <h2>How are you feeling?</h2>
      <p>I'll recommend both movies and shows, unless you tell me what you'd prefer.</p>
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
      <!-- <h1>I'M LOADING HEHE</h1> -->
      <Popcorn :quote="currentQuote"/>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue';
import { getShowsWithGenres, getShowsWithPrompt } from '../serverCaller.js'
import { SupabaseClient } from '@supabase/supabase-js';
import Popcorn from '@/components/Popcorn.vue';


const emojisOrPrompt = ref('either');
const mood = ref([]);
const moodTranscript = ref('');
const currentQuote = ref(''); 
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
  const randomIndex = Math.floor(Math.random() * movieQuotes.length);
  currentQuote.value = movieQuotes[randomIndex];
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




const movieQuotes = [
    "You're gonna need a bigger boat.",
    "Frankly, my dear, I don't give a damn.",
    "I'm gonna make him an offer he can't refuse.",
    "Mama always said life was like a box of chocolates.",
    "Toto, I've a feeling we're not in Kansas anymore.",
    "Here's looking at you, kid.",
    "Hasta la vista, baby.",
    "I feel the need—the need for speed!",
    "Chewie, we're home.",
    "You don't understand! I coulda had class...",
    "Not my tempo.",
    "You've got to ask yourself one question: 'Do I feel lucky? Well, do ya, punk?'",
    "You had me at 'hello.'",
    "Go ahead, make my day.",
    "May the Force be with you.",
    "Fasten your seatbelts. It's going to be a bumpy night.",
    "You talkin' to me?",
    "What we've got here is failure to communicate.",
    "I love the smell of napalm in the morning.",
    "E.T. phone home.",
    "Rosebud.",
    "Made it, Ma! Top of the world!",
    "I'm as mad as hell... and I'm not gonna take this anymore!",
    "A census taker once tried to test me...",
    "Bond. James Bond.",
    "There's no place like home.",
    "Show me the money!",
    "You can't handle the truth!",
    "After all, tomorrow is another day!",
    "Round up the usual suspects.",
    "I'll have what she's having.",
    "I'll be back.",
    "Life is not the amount of breaths...",
    "Nobody puts Baby in a corner.",
    "That'll do, pig. That'll do.",
    "You're killin' me, Smalls!",
    "Talk to me, Goose.",
    "I'm king of the world!",
    "Carpe diem. Seize the day, boys.",
    "Elementary, my dear Watson.",
    "Badges? We ain't got no badges!",
    "They call me Mister Tibbs!",
    "I see dead people.",
    "Stella! Hey, Stella!",
    "Say 'hello' to my little friend!",
    "Greed, for lack of a better word, is good.",
    "Keep your friends close, but your enemies closer.",
    "I want to be alone.",
    "It's alive! It's alive!",
    "Houston, we have a problem.",
    "One morning I shot an elephant in my pajamas...",
    "La-dee-da, la-dee-da.",
    "Heeere's Johnny!",
    "Open the pod bay doors, please, HAL.",
    "Surely you can't be serious? I am serious... and don't call me Shirley.",
    "Yo, Adrian!",
    "Hello, gorgeous.",
    "Toga! Toga!",
    "Listen to them. Children of the night...",
    "My precious.",
    "Attica! Attica!",
    "Life is a banquet, and most poor suckers are starving to death!",
    "Oh what a day... what a lovely day!",
    "Look at me, I'm the captain now.",
    "Today, I consider myself the luckiest man on the face of the earth.",
    "If you build it, he will come.",
    "We rob banks.",
    "Plastics.",
    "We'll always have Paris.",
    "Why don't you come up sometime and see me?",
    "I'm walking here! I'm walking here!",
    "Gentlemen, you can't fight in here! This is the War Room!",
    "Mrs. Robinson, you're trying to seduce me.",
    "Get your stinking paws off me, you damned dirty ape!",
    "Oh, no, it wasn't the airplanes. 'Twas Beauty killed the Beast.",
    "Why so serious?",
    "This is Sparta!",
    "Avengers assemble!",
    "Good morning, Vietnam!",
    "You know how to whistle, don't you?",
    "We are not alone.",
    "You'll believe a man can fly.",
    "In space, no one can hear you scream.",
    "Who you gonna call?",
    "Be afraid. Be very afraid.",
    "Garbo talks!",
    "Love means never having to say you're sorry.",
    "It knows what scares you.",
    "Some houses are born bad.",
    "Just when you thought it was safe to go back in the water...",
    "You must become Caligari!",
    "Garbo laughs!",
    "There's no crying in baseball!",
    "What's in the box?",
    "I drink your milkshake!",
    "To infinity and beyond!",
    "I am your father.",
    "You shall not pass!",
    "This is the way.",
    "Not today, Satan!",
    "Wakanda forever!",
    "We're not in Kansas anymore.",
    "The first rule of Fight Club is: you do not talk about Fight Club.",
    "I'll never let go, Jack. I promise.",
    "I see you.",
    "I'm vengeance.",
    "I am Iron Man.",
    "I'm Batman.",
    "You're breathtaking!",
    "You either die a hero or live long enough to see yourself become the villain.",
    "Are you not entertained?",
    "That escalated quickly.",
    "I am serious. And don't call me Shirley.",
    "Freedom!",
    "To boldly go where no man has gone before.",
    "I'm having an old friend for dinner.",
    "No capes!",
    "You make me want to be a better man.",
    "I'm the dude, so that's what you call me.",
    "It’s not who I am underneath, but what I do that defines me.",
    "I ate his liver with some fava beans and a nice Chianti.",
    "I volunteer as tribute!",
    "We're gonna need a bigger boat.",
    "Leave the gun. Take the cannoli.",
    "Mother of mercy, is this the end of Rico?",
    "Forget it, Jake, it's Chinatown.",
    "I have always depended on the kindness of strangers.",
    "Soylent Green is people!",
    "Snap out of it!",
    "I'm the king of the world!",
    "I'm having an old friend for dinner.",
    "That rug really tied the room together.",
    "A boy's best friend is his mother.",
    "You can't handle the truth!",
    "You're tearing me apart, Lisa!",
    "You complete me.",
    "You talking to me?",
    "It’s alive!",
    "This is my boomstick!",
    "I wish I knew how to quit you.",
    "With great power comes great responsibility.",
    "I'm too old for this shit.",
    "I'm not bad. I'm just drawn that way.",
    "ET phone home.",
    "They're here!",
    "Here's looking at you, kid.",
    "Wax on, wax off.",
    "It's just a flesh wound.",
    "I'm your Huckleberry.",
    "Well, nobody's perfect.",
    "I feel like I'm taking crazy pills!",
    "I'm not even supposed to be here today.",
    "You had me at hello.",
    "I'm just a girl, standing in front of a boy, asking him to love her.",
    "Keep the change, ya filthy animal.",
    "I'm too pretty for God to let me die.",
    "So you're telling me there's a chance.",
    "60% of the time, it works every time.",
    "You're a wizard, Harry.",
    "I am Groot.",
    "I know.",
    "As if!",
    "You're a mean one, Mr. Grinch.",
    "Mischief managed.",
    "I got a jar of dirt!"
];



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
