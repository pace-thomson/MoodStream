<template>
    <div class="loader-wrapper" v-show="visible">
      <div class="container">
        <svg
          ref="popcornSvg"
          id="popcorn-svg"
          viewBox="0 0 26 32.3"
        >
          <defs>
            <!-- your <symbol> definitions go here -->
          </defs>
          <!-- your <g id="bucket"> and <g id="corns"> elements go here -->
        </svg>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { TimelineMax, TweenMax, CustomWiggle } from 'gsap/all'
  import { Physics2DPlugin } from 'gsap/Physics2DPlugin'
  gsap.registerPlugin(Physics2DPlugin, CustomWiggle)
  
  const popcornSvg = ref(null)
  const visible = ref(false)
  
  onMounted(() => {
    const svgEl = popcornSvg.value
    const bucket = svgEl.querySelector('#bucket')
    const corns = svgEl.querySelectorAll('use')
  
    visible.value = true
  
    const masterTl = new TimelineMax()
      .add(showUp(), 'start')
      .add(popCorn(), 'start+=0.5')
      .add(wiggle(), 'start+=1.5')
  
    function showUp() {
      const tl = new TimelineMax()
      tl.set(bucket, {
        transformOrigin: '100% 100%',
        y: -window.innerHeight,
        autoAlpha: 1,
        rotation: 30,
      })
      tl.to(bucket, 1.5, {
        y: 0,
        rotation: 0,
        ease: 'bounce.out',
      })
      return tl
    }
  
    function popCorn() {
      const tl = new TimelineMax()
      corns.forEach((corn) => {
        tl.to(
          corn,
          random(1, 15),
          {
            onStartParams: ['{self}'],
            onStart(self) {
              svgEl.appendChild(self.target)
            },
            scale: random(0.1, 15),
            physics2D: {
              velocity: random(100, 300),
              angle: random(230, 290),
              gravity: random(1000, 1200),
            },
          },
          Math.random() * random(1, 15)
        )
      })
      return tl
    }
  
    function wiggle() {
      return TweenMax.to(bucket, 1, {
        transformOrigin: '50% 100%',
        scaleX: 1.02,
        scaleY: 0.98,
        y: 1,
        rotation: 0.5,
        yoyo: true,
        repeat: 12,
        ease: CustomWiggle.create('wiggle', {
          type: 'easeOut',
          wiggles: 7,
        }),
      })
    }
  
    function random(min, max) {
      return min + Math.random() * (max - min)
    }
  })
  </script>
  
  <style scoped>
  .loader-wrapper {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .container {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    filter: drop-shadow(0px 1px 5px rgba(10, 10, 10, 0.5));
  }
  
  #popcorn-svg {
    width: 100%;
    height: 100%;
    visibility: hidden;
  }
  </style>
  
  