<template>
  <div>
    <div class="results-grid">
      <div 
        v-for="show in shows" 
        :key="show.imdbId" 
        class="result-card"
      >
        <div class="card-poster-container" @click="openModal(show)">
          <img 
            :src="getPosterUrl(show)" 
            :alt="show.title" 
            class="card-poster"
          >
        </div>
        
        <button v-if="currentPage === 'watchlist'" class="add-watchlist-button remove-button" @click="handleRemoveFromWatchlist(show)">-</button>
        <button v-else class="add-watchlist-button" @click="handleAddToWatchlist(show)">+</button>

        <div class="card-body" @click="openModal(show)">
          <div class="card-info-flex">
            <div class="card-text-content">
              <h3 class="card-title">{{ show.title }}</h3>
              <p v-if="show.showType=='movie'" class="card-year">{{ show.releaseYear}}</p>
              <p v-if="show.showType=='series'" class="card-year">{{ show.firstAirYear }} - {{ show.lastAirYear || 'Present' }}</p>
              <p class="card-genres">{{ formatGenres(show.genres) }}</p>
            </div>
            <a v-if="getPlayableLink(show)" :href="getPlayableLink(show)" @click.stop target="_blank" class="play-button">
              <div class="play-button-icon">&#9658;</div>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedShow" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-button" @click="closeModal">&times;</button>
        <div class="modal-header">
          <img 
            :src="getPosterUrl(selectedShow)" 
            :alt="selectedShow.title" 
            class="modal-poster"
          >
          <div class="modal-header-info">
            <button v-if="currentPage === 'watchlist'" class="add-watchlist-button remove-button modal-add-button" @click="handleRemoveFromWatchlist(selectedShow)">-</button>
            <button v-else class="add-watchlist-button modal-add-button" @click="handleAddToWatchlist(selectedShow)">+</button>
            
            <h1>{{ selectedShow.title }}</h1>
            
            <div class="modal-details-line">
              <span v-if="selectedShow.showType=='movie'" class="card-year">{{ selectedShow.releaseYear}}</span>
              <span v-if="selectedShow.showType=='series'" class="card-year">{{ selectedShow.firstAirYear }} - {{ selectedShow.lastAirYear || 'Present' }}</span>
              <span class="modal-genres-inline">{{ formatGenres(selectedShow.genres) }}</span>
            </div>

            <div class="modal-credits">
              <p v-if="selectedShow.directors && selectedShow.directors.length > 0">
                <strong>Director:</strong> {{ formatDirectors(selectedShow.directors) }}
              </p>
              <p v-if="selectedShow.cast && selectedShow.cast.length > 0">
                <strong>Cast: </strong> 
                <span v-for="(actor, index) in selectedShow.cast.slice(0, 4)" :key="index">
                  {{ actor }}<span v-if="index < selectedShow.cast.slice(0, 4).length - 1">, </span>
                </span>
              </p>
            </div>
          </div>
        </div>
        <div class="modal-body">
          <h2>Overview</h2>
          <p>{{ selectedShow.overview }}</p>
          <h2>Available On</h2>
          <div class="streaming-options">
            <div v-if="filteredStreamingOptions.length > 0">
              <a 
                v-for="(option, index) in filteredStreamingOptions" 
                :key="index"
                :href="option.link" 
                target="_blank"
                class="streaming-service-logo-link"
              >
                <img :src="getServiceLogo(option.service.id)" :alt="option.service.name" class="streaming-service-logo" />
              </a>
            </div>
            <div v-else>
              <p>No subscription or free streaming options found in your region.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, inject } from 'vue';
import { addShowToWatchlist, removeShowFromWatchlist } from '../supabase.js';

// --- Props ---
const props = defineProps({
  shows: {
    type: Array,
    required: true
  },
  catalogs: {
    type: Array,
    required: true
  },
  supabase: {
    type: Object,
    required: true
  },
  currentUserId: {
    type: String,
    required: true
  },
  currentPage: {
    type: String,
  }
});

// --- Emits ---
const emit = defineEmits(['show-removed']);

// --- State Management ---
const selectedShow = ref(null);
const showAlert = inject('showAlert');

// --- Lifecycle Hook ---
onMounted(() => {
  updateCatalogSubscriptions();
});

const filteredStreamingOptions = computed(() => {
  if (!selectedShow.value || !selectedShow.value.streamingOptions.us) {
    return [];
  }
  const allowedTypes = ['subscription', 'free'];
  const preliminaryList = selectedShow.value.streamingOptions.us.filter(option => 
    allowedTypes.includes(option.type)
  );
  const uniqueOptions = preliminaryList.reduce((acc, currentOption) => {
    const serviceId = currentOption.service.id;
    const existingOption = acc.get(serviceId);
    const hasEnglishAudio = (opt) => opt.audios?.some(audio => audio.language === 'eng');
    if (!existingOption) {
      acc.set(serviceId, currentOption);
    } 
    else if (hasEnglishAudio(currentOption) && !hasEnglishAudio(existingOption)) {
      acc.set(serviceId, currentOption);
    }
    return acc;
  }, new Map());
  return Array.from(uniqueOptions.values());
});


// --- Logic ---
function updateCatalogSubscriptions() {
  if (!props.catalogs) return;
  full_catalog.value.forEach(catalog => catalog.subscribed = false);
  props.catalogs.forEach(userCatalogId => {
    const catalog = full_catalog.value.find(c => c.name === userCatalogId);
    if (catalog) {
      catalog.subscribed = true;
    }
  });
}

// --- Modal Functions ---
function openModal(show) {
  selectedShow.value = show;
}

function closeModal() {
  selectedShow.value = null;
}

// --- Card Interaction Functions ---
async function handleAddToWatchlist(show) {
  const { error } = await addShowToWatchlist(props.supabase, props.currentUserId, show);

  if (error) {
    if (error.message !== 'already_exists') {
      showAlert(`Could not add ${show.title} to watchlist.`);
    } else {
      showAlert(`${show.title} is already in your watchlist.`);
    }
  } else {
    showAlert(`${show.title} was added to your watchlist.`);
  }
}

async function handleRemoveFromWatchlist(show) {
  const { error } = await removeShowFromWatchlist(props.supabase, props.currentUserId, show.imdbId);
  if (error) {
    showAlert(`Could not remove ${show.title} from watchlist.`, 'error');
  } else {
    showAlert(`${show.title} was removed from your watchlist.`, 'success');
    emit('show-removed', show.imdbId);
    if (selectedShow.value && selectedShow.value.imdbId === show.imdbId) {
      closeModal();
    }
  }
}


// --- Helper Functions ---
function getPlayableLink(show) {
  if (!show.streamingOptions.us) {
    return null;
  }
  const playableOption = show.streamingOptions.us.find(option => {
    if (option.type === 'free') {
      return true;
    }
    if (option.type === 'subscription') {
      const serviceInfo = full_catalog.value.find(s => s.name === option.service.id);
      return serviceInfo && serviceInfo.subscribed;
    }
    return false;
  });
  return playableOption ? playableOption.link : null;
}

function getPosterUrl(show) {
  const poster = show?.imageSet?.horizontalPoster;
  if (poster) {
    return poster.w1440 || poster.w1080 || poster.w720 || poster.w480 || poster.w360;
  }
  return 'https://placehold.co/780x439/2d3748/ffffff?text=Poster+Not+Found';
}

function formatGenres(genres) {
  if (!genres || genres.length === 0) return '';
  return genres.map(g => g.name).join(' | ');
}

function formatDirectors(directors) {
  if (!directors || directors.length === 0) return '';
  return directors.join(', ');
}

function getServiceLogo(serviceId) {
  const catalog = full_catalog.value.find(c => c.name === serviceId);
  return catalog ? catalog.logo : 'https://placehold.co/100x40/ffffff/000000?text=Service';
}

// --- Data Definitions ---
const full_catalog = ref([
    { name: 'netflix', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
    { name: 'prime', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg' },
    { name: 'disney', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg' },
    { name: 'hbo', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/8/81/HBO_Max_Logo_%28October_2019%29.svg' },
    { name: 'hulu', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Hulu_logo_%282014%29.svg' },
    { name: 'apple', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg' },
    { name: 'peacock', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/NBCUniversal_Peacock_Logo.svg' },
    { name: 'paramount', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Paramount%2B_logo.svg' },
    { name: 'starz', subscribed: false, logo: 'https://res.cloudinary.com/ybmedia/image/upload/c_crop,h_900,w_1600,x_0,y_0/c_fill,f_auto,h_1215,q_auto,w_2160/v1/m/7/b/7b5bafc2ddb956533bca95e70d7accb6f854c38e/starz-review-2023-everything-know-before.jpg' },
    { name: 'mubi', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/MUBI_Logo_Standard_Black.png' },
    { name: 'britbox', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Britbox_2022_%28UK%29.svg' },
    { name: 'curiosity', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Curiosity_Channel_Logo_2023.svg' },
    { name: 'plutotv', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Pluto_TV_logo_2020.svg' },
    { name: 'tubi', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Tubi_logo.svg' },
    { name: 'discovery', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/2019_Discovery_logo.svg' }
]);
</script>

<style scoped>
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
.result-card {
  background-color: #2d3748;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  position: relative;
}
.card-poster-container {
  position: relative;
  cursor: pointer;
}
.card-poster {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
  background-color: #1a202c;
}
.add-watchlist-button {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background-color: rgba(45, 55, 72, 0.8);
  color: #e2e8f0;
  border: 1px solid #718096;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 1.5rem;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  z-index: 5;
  transition: background-color 0.2s, transform 0.2s;
}
.add-watchlist-button:hover {
  background-color: #735CD1;
  transform: scale(1.1);
}
remove-button:hover {
  background-color: #c0392b; /* Red for remove */
  border-color: #c0392b;
}

.modal-add-button {
  top: 1.5rem;
  right: 2rem;
}
.card-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  cursor: pointer;
}
.card-info-flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.card-text-content {
  min-width: 0;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
}
.card-year {
  font-size: 0.9rem;
  color: #a0aec0;
  margin: 0;
}
.card-genres {
  font-size: 0.85rem;
  color: #718096;
  margin-top: 0.5rem;
  margin-bottom: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.play-button {
  background-color: #4a5568;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
  transition: background-color 0.2s;
}
.play-button:hover {
  background-color: #735CD1;
}
.play-button-icon {
  color: white;
  font-size: 1.5rem;
  line-height: 1;
  margin-left: 4px;
}

/* --- Modal Styles --- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-content {
  background-color: #2d3748;
  padding: 0;
  border-radius: 12px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}
.close-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #e2e8f0;
  background-color: rgba(0,0,0,0.5);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  cursor: pointer;
  z-index: 10;
}
.modal-header {
  margin-bottom: 0;
}
.modal-poster {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  display: block;
}
.modal-header-info {
  /* This is the first new style: it makes this div a positioning container */
  position: relative;
  padding: 1.5rem 2rem;
}
.modal-header-info h1 {
  font-size: 2.5rem;
  color: #e2e8f0;
  margin: 0 0 0.5rem 0;
}

.modal-details-line {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #a0aec0;
  font-size: 1rem;
  margin-bottom: 1rem;
}
.modal-genres-inline {
  color: #718096;
}
.modal-credits {
  font-size: 0.9rem;
  color: #a0aec0;
  line-height: 1.5;
}
.modal-credits p {
  margin: 0.25rem 0;
}
.modal-credits strong {
  color: #e2e8f0;
}

/* This is the second new style: it positions the button in the top right */
.modal-add-button {
  top: 1.5rem;
  right: 2rem;
}

.modal-body {
  padding: 0 2rem 2rem 2rem;
}
.modal-body h2 {
  color: #e2e8f0;
  border-bottom: 2px solid #4a5568;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}
.modal-body p {
  color: #a0aec0;
}
.streaming-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}
.streaming-service-logo-link {
  display: inline-block;
  background-color: rgb(255, 255, 255);
  padding: 0.5rem 1rem;
  margin: 8px;
  border-radius: 8px;
  transition: transform 0.2s ease-in-out;
}
.streaming-service-logo-link:hover {
  /* background-color: #d7d0f2; */
  transform: scale(1.15);
}
.streaming-service-logo {
  height: 30px;
  width: auto;
  max-width: 80px;
  opacity: 0.9;
}
</style>
