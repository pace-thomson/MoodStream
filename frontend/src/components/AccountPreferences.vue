<template>
    <div class="account-preferences">
        <div class="catalog-preferences">
            <h2>Your Streaming Services</h2>
            <div v-for="catalog in catalogs" :key="catalog.name" class="catalog-buttons">
                <button @click="selectCatalog">
                    <img :src="catalog.logo" alt="Logo of {{ catalog.name }}" class="catalog-logo">
                </button>

            </div>
        </div>
    </div>
</template>

<script setup>

import { ref } from 'vue';

const props = defineProps({
    currentUserId: {
        type: String
    },
})

const catalogs = ref([
  {
    name: 'netflix',
    subscribed: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
  },
  {
    name: 'prime',
    subscribed: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg',
  },
  {
    name: 'disney',
    subscribed: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg',
  },
  {
    name: 'hbo',
    subscribed: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Max_Logo.svg',
  },
  {
    name: 'hulu',
    subscribed: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Hulu_Logo.svg',
  },
  {
    name: 'apple',
    subscribed: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_TV_Plus_Logo.svg',
  },
  {
    name: 'peacock',
    subscribed: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Peacock_Logo.svg',
  },
  {
    name: 'paramount',
    subscribed: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Paramount_Plus_Logo.svg',
  },
  {
    name: 'starz',
    subscribed: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Starz_2022.svg',
  },
  {
    name: 'mubi',
    subscribed: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/89/MUBI_logo.svg',
  },
  {
    name: 'britbox',
    subscribed: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/BritBox_logo_2022.svg',
  },
  {
    name: 'curiosity',
    subscribed: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Curiositystream_logo_2020.svg',
  },
  {
    name: 'plutotv',
    subscribed: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Pluto_TV_2020.svg',
  },
  {
    name: 'tubi',
    subscribed: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Tubi_logo.svg',
  },
  {
    name: 'discovery',
    subscribed: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Discovery_Plus_logo.svg',
  }
]);

</script>