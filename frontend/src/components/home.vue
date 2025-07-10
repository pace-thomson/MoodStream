import {ref } from 'vue';


<template>
    <section class="home">
        <div class="home-header">
            <h1>Moodstream</h1>
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


        </div>
    </section>


</template>

<script setup>
import { ref } from 'vue';

const moodTranscript = ref('');

const emojis = ref([
  { name: 'happy', fileName: 'happy.png' },
  { name: 'sad', fileName: 'sad.png' },
  { name: 'tired', fileName: 'tired.png' },
  { name: 'love', fileName: 'love.png' },
  { name: 'neutral', fileName: 'neutral.png' }
]);

function getImageUrl(fileName) {
  return new URL(`./assets/images/${fileName}`, import.meta.url).href;
}
</script>
        