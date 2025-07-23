<template>
    <!-- The overlay that covers the screen -->
    <div class="alert-overlay">
      <!-- 
        The main alert box. We add a class based on the 'type' prop 
        for different styling (e.g., success, error).
      -->
      <div class="alert-box" :class="`alert-${type}`">
        <div class="alert-content">
          <p>{{ message }}</p>
        </div>
        <button class="alert-close-button" @click="$emit('close')">OK</button>
      </div>
    </div>
  </template>
  
  <script setup>
  // This component receives the message and type as props, and emits a 'close' event.
  defineProps({
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info' // Can be 'info', 'success', or 'error'
    }
  });
  
  defineEmits(['close']);
  </script>
  
  <style scoped>
  .alert-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999; /* Ensure it's on top of everything */
  }
  
  .alert-box {
    background-color: #2d3748;
    color: #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    width: 90%;
    max-width: 400px;
    padding: 1.5rem;
    text-align: center;
    /*border-top: 5px solid #718096;  Default 'info' border */
    transform: scale(0.95);
    animation: pop-in 0.2s ease-out forwards;
  }
  
  @keyframes pop-in {
    to {
      transform: scale(1);
    }
  }
  
  /* Style for success alerts */
  .alert-box.alert-success {
    border-top-color: #48bb78; /* Green */
  }
  
  /* Style for error alerts */
  .alert-box.alert-error {
    border-top-color: #f56565; /* Red */
  }
  
  .alert-content p {
    font-size: 1.1rem;
    margin: 0 0 1.5rem 0;
    line-height: 1.6;
  }
  
  .alert-close-button {
    padding: 0.75rem 2rem;
    font-size: 1rem;
    font-weight: bold;
    color: white;
    background-color: #735CD1;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .alert-close-button:hover {
    background-color: #624FAD;
  }
  </style>
  