<script setup>
// import { defineProps } from 'vue';

// const props = defineProps({
//   email: {
//     type: String,
//     default: ""
//   },
//   password: {
//     type: String,
//     default: ""
//   },
// });

import { ref } from 'vue';

const email = ref('');
const password = ref('');
</script>

<template>
<div>
    <h1>Moodstream</h1>
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
    <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
    </div>
    <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
    </div>
    <button type="submit">Login</button>
    </form>
    <p>
    Don't have an account?
    <button @click="navigateTo('register')">Register here</button>
    </p>
</div>
</template>

<style>

</style>