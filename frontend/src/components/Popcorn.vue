<template>
    <div class="container">
      <svg id="popcorn-svg" viewBox="0 0 1280 300" xmlns="http://www.w3.org/2000/svg">
        <g id="all">
          <g id="bucket">
            <path fill="#ee3e54" d="M360,260c0,0-15.3-101.6-15.3-124.7h-50.9c0,23.1-15.3,124.7-15.3,124.7H360z"/>
            <path fill="#e9e9e9" d="M351.6,260c0,0-12.2-101.6-12.2-124.7h-40.8c0,23.1-12.2,124.7-12.2,124.7H351.6z"/>
            <g fill="#ee3e54">
              <rect x="293.3" y="135.3" width="9.7" height="124.7"/>
              <rect x="310.4" y="135.3" width="9.7" height="124.7"/>
              <rect x="327.4" y="135.3" width="9.7" height="124.7"/>
              <rect x="344.5" y="135.3" width="9.7" height="124.7"/>
            </g>
          </g>
  
          <!-- Kernel elements using <use> for animation targets -->
          <use href="#kernelShape" x="290" y="100" />
          <use href="#kernelShape" x="315" y="110" />
          <use href="#kernelShape" x="335" y="105" />
  
          <!-- Define kernel shape -->
          <defs>
            <circle id="kernelShape" r="12" fill="#fff8d8" />
          </defs>
        </g>
      </svg>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import { gsap } from 'gsap'
  import { CustomWiggle } from 'gsap/CustomWiggle'
  import { Physics2DPlugin } from 'gsap/Physics2DPlugin'
  
  gsap.registerPlugin(CustomWiggle, Physics2DPlugin)
  
  function random(min, max) {
    return min + Math.random() * (max - min)
  }
  
  onMounted(() => {
    const popcornBucket = document.querySelector('#popcorn-svg')
    const corns = document.querySelectorAll('#popcorn-svg use')
  
    const masterTl = gsap.timeline()
      .add(showUp(), 'start')
      .add(popCorn(), 'start+=0.5')
      .add(wiggle(), 'start+=1.5')
  
    function showUp() {
      return gsap.timeline()
        .set(popcornBucket, {
          transformOrigin: '100% 100%',
          y: -window.innerHeight,
          autoAlpha: 1,
          rotation: 30
        })
        .to(popcornBucket, {
          duration: 1.5,
          y: 0,
          rotation: 0,
          ease: 'bounce.out'
        })
    }
  
    function popCorn() {
      const tl = gsap.timeline()
      corns.forEach(corn => {
        tl.to(corn, {
          duration: random(1, 2),
          scale: random(0.8, 1.5),
          physics2D: {
            velocity: random(200, 300),
            angle: random(230, 290),
            gravity: random(1000, 1200)
          },
          onStart: function () {
            corn.parentNode?.appendChild(corn) // move to top of SVG stacking order
          }
        }, Math.random() * random(0.2, 0.8))
      })
      return tl
    }
  
    function wiggle() {
      return gsap.to(popcornBucket, {
        duration: 1,
        transformOrigin: '50% 100%',
        scaleX: 1.02,
        scaleY: 0.98,
        y: 1,
        rotation: 0.5,
        repeat: 12,
        yoyo: true,
        ease: 'wiggle'
      })
    }
  })
  </script>
  
  <style scoped>
  /* .container {
    position: absolute;
    bottom: 1%;
    left: 0;
    right: 0;
    height: 40vh;
  } */

  .container {
  width: 300px;
  height: 300px;
  margin: 0 auto;
  background-color: rgba(0, 0, 0, 0.7); /* semi-transparent black */
  border-radius: 50%;                  /* makes it circular */
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
  
  #popcorn-svg {
    width: 100%;
    height: 100%;
    overflow: visible;
    visibility: hidden;
    filter: drop-shadow(0px 1px 5px rgba(10, 10, 10, 0.5));
  }
  </style>
  