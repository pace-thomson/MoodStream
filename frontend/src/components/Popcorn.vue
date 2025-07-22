<template>
  <div id="pop_corn_container" ref="containerRef"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const containerRef = ref(null)
const animationLength = 5

function createPopcorn() {
  if (!containerRef.value) return

  const p = document.createElement('div')
  p.className = 'dot'

  const scale = Math.random() * 35 + 25
  p.style.width = `${scale}px`
  p.style.height = `${scale}px`
  p.style.left = `${Math.random() * (window.innerWidth - 35)}px`
  p.style.top = `${Math.random() * (window.innerHeight * 0.5)}px`
  p.style.animation = `pop ${animationLength}s linear forwards`

  containerRef.value.appendChild(p)

  // Remove the popcorn after animation
  setTimeout(() => {
    if (p.parentNode) p.remove()
  }, animationLength * 1000)

  // Continue generating popcorn
  setTimeout(createPopcorn, 1000)
}

onMounted(() => {
  createPopcorn()
})
</script>

<style scoped>
#pop_corn_container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  pointer-events: none;
}

.dot {
  width: 35px;
  height: 35px;
  position: absolute;
  top: -50px;
  background: url(https://contentservice.mc.reyrey.net/image_v1.0.0/?id=c1627fe5-a7e7-5fb7-af61-374c65707e3c&637384707423276230);
  background-size: 100% 100%;
  filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.25));
}

@keyframes pop {
  0% {
    transform: scale(0.1);
  }
  3% {
    transform: scale(2);
  }
  6% {
    transform: scale(1);
  }
  100% {
    transform: scale(1) rotate(720deg);
    top: 105%;
  }
}
</style>



<!-- <template>
  <div class="pop_corn_container">

  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  const container = document.querySelector('#pop_corn_container')
  var animation_length = 5 //speed kernals fall

  function createPopcorn() {
    var p = document.createElement('div')
    p.className = 'dot'
    // pick random size between 25-60
    var scale = (Math.random()*35) + 25 
    p.style.width = scale + 'px'
    p.style.height = scale + 'px'
    p.style.left = Math.random()*(window.innerWidth - 35) + 'px'
    p.style.top = Math.random()*(window.innerHeight*.5) + 'px'
    p.style.animation = 'pop '+animation_length+'s linear forwards'
    container.appendChild(p)

    //remove excess kernals
    setTimeout(function(){
      var pop = document.querySelector('.dot')
      pop.remove()
    },1000*animation_length)

    //create kernal every second
    setTimeout(createPopcorn, 1000)
  }
  createPopcorn()
})

</script>

<style scoped>
#pop_corn_container {
  position:fixed;
  top:0;
  right:0;
  bottom:0;
  left:0;
  overflow:hidden;
  pointer-events:none;
}


.dot{
  width:35px;
  height:35px;
  position:absolute;
  top:-50px;
  background: url(https://contentservice.mc.reyrey.net/image_v1.0.0/?id=c1627fe5-a7e7-5fb7-af61-374c65707e3c&637384707423276230);
  background-size: 100% 100%;
  filter:drop-shadow(0px 0px 5px rgba(0,0,0,.25));
}

@keyframes pop {
  0% { transform:scale(.1); }
  3% { transform:scale(2); }
  6% { transform:scale(1); }
  100% { transform:scale(1) rotate(720deg); top:105%; }
}
  </style>
  
   -->