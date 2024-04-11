<template>
  <div id="entry" class="full_container bg" v-if="!start">
    <div class="content">
      <!-- <div class="ani"></div> -->
      <div class="text">
        <div class="title"><h1>CREATIVES</h1></div>
        <div class="desc"><h3>interactive game</h3></div>
      </div>
      <button class="play_btn" @click="turnOn()">
        <span>開始</span><font-awesome-icon icon="fa-solid fa-circle-play" />
      </button>
    </div>
    <div id="animation">
      <div class="ani"></div>
    </div>
  </div>
  <!-- <div class="ball"></div> -->
</template>

<script setup>
import {
  ref,
  reactive,
  onBeforeMount,
  onMounted,
  watch,
  nextTick,
  onBeforeUnmount,
  computed,
} from 'vue';
import { useStore } from 'vuex';
import { router } from '@/../assets/router.js';
const store = useStore();
const start = computed(() => {
  return store.state.loopStore.entrys;
});
function turnOn() {
  store.state.loopStore.entrys = true;
}

onMounted(() => {
  ballA();
});

function ballA() {
  const oBallContainer = document.getElementById('animation');
  let oBall = document.querySelector('.ani');
  let children = null;
  let leftMax = document.documentElement.clientWidth - oBall.clientWidth;
  let topMax = document.documentElement.clientHeight - oBall.clientHeight;
  let lastChilde;

  window.addEventListener('resize', () => {
    leftMax = document.documentElement.clientWidth - oBall.clientWidth;
    topMax = document.documentElement.clientHeight - oBall.clientHeight;
  });
  let sss = true;
  let xxx = true;
  children = oBallContainer.children;
  let length = children.length;
  children[0].leftNum = 5;
  children[0].topNum = 5;
  let leftMaxC = 0;
  let topMaxC = 0;

  setInterval(() => {
    for (let i = 0; i < length; i++) {
      let left = sss
        ? Math.floor(Math.random(3) * 1000)
        : children[i].offsetLeft + children[i].leftNum;
      let top = sss
        ? Math.floor(Math.random(3) * 1000)
        : children[i].offsetTop + children[i].topNum;

      let trs = Array.from(children[i].classList).includes('anis');

      if (trs && left >= leftMaxC) {
        left = leftMaxC;
        children[i].leftNum = -children[i].leftNum;
        bgRandom(children[i]);
      }

      if (!trs && left >= leftMaxC) {
        left = leftMax;
        children[i].leftNum = -children[i].leftNum;
        if (length <= 8 && !xxx) {
          xxx = true;
          oBallContainer.insertAdjacentHTML(
            'beforeend',
            `<div class="anis"></div>`
          );

          children = oBallContainer.children;
          length = children.length;
          lastChilde = oBallContainer.lastChild;
          lastChilde.style.left = `${left + Math.floor(Math.random() * 5)}px`;
          lastChilde.style.top = `${top + Math.floor(Math.random() * 5)}px`;
          lastChilde.leftNum = lastChilde.topNum = length * Math.random();

          leftMaxC =
            document.documentElement.clientWidth - lastChilde.clientWidth;
          topMaxC =
            document.documentElement.clientHeight - lastChilde.clientHeight;
        }

        bgRandom(children[i]);
      }

      if (left <= 0) {
        left = 0;
        children[i].leftNum = -children[i].leftNum;
        if (!trs && length <= 8 && !xxx) {
          xxx = true;
          oBallContainer.insertAdjacentHTML(
            'beforeend',
            `<div class="anis"></div>`
          );

          children = oBallContainer.children;
          length = children.length;
          lastChilde = oBallContainer.lastChild;
          lastChilde.style.left = `${left + Math.floor(Math.random() * 5)}px`;
          lastChilde.style.top = `${top + Math.floor(Math.random() * 5)}px`;
          lastChilde.leftNum = lastChilde.topNum =
            length + Math.floor(Math.random() * 2);

          leftMaxC =
            document.documentElement.clientWidth - lastChilde.clientWidth;
          topMaxC =
            document.documentElement.clientHeight - lastChilde.clientHeight;
        }
        bgRandom(children[i]);
      }

      if (trs && top >= topMaxC) {
        top = topMaxC;
        children[i].topNum = -children[i].topNum;
        bgRandom(children[i]);
      }

      if (!trs && top >= topMax) {
        top = topMax;
        children[i].topNum = -children[i].topNum;
        bgRandom(children[i]);
      }

      if (top <= 0) {
        top = 0;
        children[i].topNum = -children[i].topNum;
        bgRandom(children[i]);
      }

      children[i].style.left = `${left}px`;
      children[i].style.top = `${top}px`;
      children[i].style.opacity = 1;
    }
    xxx = sss = false;
  }, 30);

  function bgRandom(obj) {
    let r = Math.floor(Math.random() * 128),
      g = Math.floor(Math.random() * 128),
      b = Math.floor(Math.random() * 128);
    obj.style.backgroundColor = `rgb(${r},${g},${b})`;
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/color.scss';
@import '@/scss/rwd.scss';
.ball {
  width: 80px;
  height: 80px;
  position: absolute;
  border-radius: 100%;
  background-color: #bd4f4f;
  z-index: 5;
}
#entry {
  left: 0;
  &.bg {
    background-color: rgb(240, 240, 240);
    z-index: 4;
  }
  .content {
    position: fixed;
    width: 100%;
    text-align: center;
    z-index: 6;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    @media (max-height: 750px) {
    }
    .text {
      margin-bottom: 25px;
      .title {
        font-size: clamp(1.2rem, 2.5rem, 5vw);
      }
    }
    .play_btn {
      font-weight: bold;
      cursor: pointer;
      color: rgb(48, 48, 48);
      border: 4px solid rgb(65, 65, 65);
      background-color: rgb(245, 245, 245);
      border-radius: 70px;
      padding: 15px 30px;
      font-size: clamp(1.2rem, 2.4rem, 10vw);
      box-shadow: 4px 6px 2px rgba(0, 0, 0, 0.2);

      svg {
        color: #bd4f4f;
      }
      span {
        margin-right: 10px;
      }
    }
  }
}

:deep(.anis) {
  width: 10px;
  height: 10px;
  border-radius: 100%;
  position: absolute;
}

:deep(.ani),
.ani {
  transition: background-color 2s;
  position: absolute;
  height: 65px;
  width: calc(371px / 5);
  --svg: url('./../../uis/loading.svg');
  // background-image: url('./../../uis/loading.svg');
  animation: load-ani 0.4s steps(5) infinite;
  background-size: cover;
  -webkit-mask: var(--svg);
  mask: var(--svg);
  background-color: rgb(107, 194, 70);
  color: transparent;
  z-index: 4;
  mask-size: cover;
  opacity: 0;
}

@keyframes load-ani {
  from {
    mask-position: 0;
  }
  to {
    mask-position: 371px;
  }
}
</style>
