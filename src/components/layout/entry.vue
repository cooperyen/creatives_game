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
import { router } from '@/assets/router.js';
const store = useStore();
const props = defineProps(['keys']);

const start = computed(() => {
  if (props.keys === 'not-found') router.replace('/');
  return store.state.loopStore.entrys;
});
function turnOn() {
  store.state.loopStore.entrys = true;
}

onMounted(() => {
  splitAnimation();
});

function splitAnimation() {
  const oBallContainer = document.getElementById('animation');
  let oBall = document.querySelector('.ani');
  let leftMax = document.documentElement.clientWidth - oBall.clientWidth;
  let topMax = document.documentElement.clientHeight - oBall.clientHeight;
  let children = oBallContainer.children;
  children[0].leftNum = 5;
  children[0].topNum = 5;
  let lastChilde;
  let firstLoad = true;
  let addTimeGap = true;
  let length = children.length;
  let leftMaxChild = 0;
  let topMaxChild = 0;
  let left = 0;
  let top = 0;
  const childNumHandler = {
    large: 30,
    small: 20,
  };
  let childNum =
    window.innerWidth < 1200 ? childNumHandler.small : childNumHandler.large;

  window.addEventListener('resize', () => {
    childNum =
      window.innerWidth < 1200 ? childNumHandler.small : childNumHandler.large;
    const width = document.documentElement.clientWidth;
    const Height = document.documentElement.clientHeight;
    leftMax = width - oBall.clientWidth;
    topMax = Height - oBall.clientHeight;
    leftMaxChild = width - lastChilde.clientWidth;
    topMaxChild = Height - lastChilde.clientHeight;
    document.querySelectorAll('.anis').forEach((e) => e.remove());
  });

  setInterval(() => {
    for (let i = 0; i < length; i++) {
      let isMain = Array.from(children[i].classList).includes('anis');

      if (isMain) {
        left = firstLoad
          ? Math.floor(Math.random(3) * 1000 + 1)
          : children[i].offsetLeft + children[i].leftNum;
        top = firstLoad
          ? Math.floor(Math.random(3) * 1000 + 1)
          : children[i].offsetTop + children[i].topNum;

        if (left >= leftMaxChild) {
          left = leftMaxChild;
          children[i].leftNum = -children[i].leftNum;
          bgRandom(children[i]);
        }

        if (top >= topMaxChild) {
          top = topMaxChild;
          children[i].topNum = -children[i].topNum;
          bgRandom(children[i]);
        }
      }

      if (!isMain) {
        left = firstLoad
          ? Math.floor(Math.random(3) * 1000)
          : children[i].offsetLeft + children[i].leftNum;
        top = firstLoad
          ? Math.floor(Math.random(3) * 1000)
          : children[i].offsetTop + children[i].topNum;

        if (top >= topMax) {
          top = topMax;
          children[i].topNum = -children[i].topNum;
          if (length <= childNum && !addTimeGap) {
            addTimeGap = true;
            addChildVertical(true);
          }
          bgRandom(children[i]);
        }

        if (left >= leftMax) {
          left = leftMax;
          children[i].leftNum = -children[i].leftNum;
          if (length <= childNum && !addTimeGap) {
            addTimeGap = true;
            addChildHorizontal(true);
          }

          bgRandom(children[i]);
        }
      }

      if (left <= 0) {
        left = 0;
        children[i].leftNum = -children[i].leftNum;
        if (!isMain && length <= childNum && !addTimeGap) {
          addTimeGap = true;
          addChildHorizontal();
        }
        bgRandom(children[i]);
      }

      if (top <= 0) {
        top = 0;
        children[i].topNum = -children[i].topNum;
        bgRandom(children[i]);
        if (length <= childNum && !addTimeGap) {
          addTimeGap = true;

          addChildVertical(false);
        }
      }

      children[i].style.left = `${left}px`;
      children[i].style.top = `${top}px`;
      children[i].style.opacity = 1;
      addTimeGap = firstLoad = false;
      children = oBallContainer.children;
      length = children.length;
    }

    function addChildHorizontal(position = false) {
      oBallContainer.insertAdjacentHTML(
        'beforeend',
        `<div class="anis"></div>`
      );

      children = oBallContainer.children;
      length = children.length;
      lastChilde = oBallContainer.lastChild;
      leftMaxChild =
        document.documentElement.clientWidth - lastChilde.clientWidth;
      topMaxChild =
        document.documentElement.clientHeight - lastChilde.clientHeight;

      lastChilde.style.left = `${position ? leftMaxChild : 0}px`;
      lastChilde.style.top = `${top + Math.floor(Math.random() * 5) + 1}px`;
      lastChilde.leftNum = lastChilde.topNum =
        Math.floor(Math.random() * 5) + 1;

      bgRandom(lastChilde);
    }

    function addChildVertical(position = false) {
      oBallContainer.insertAdjacentHTML(
        'beforeend',
        `<div class="anis"></div>`
      );

      children = oBallContainer.children;
      length = children.length;
      lastChilde = oBallContainer.lastChild;
      leftMaxChild =
        document.documentElement.clientWidth - lastChilde.clientWidth;
      topMaxChild =
        document.documentElement.clientHeight - lastChilde.clientHeight;

      lastChilde.style.left = `${left + Math.floor(Math.random() * 5) + 1}px`;
      lastChilde.style.top = `${position ? topMaxChild : -top}px`;
      lastChilde.leftNum = lastChilde.topNum =
        Math.floor(Math.random() * 5) + 1;

      bgRandom(lastChilde);
    }
  }, 30);

  function bgRandom(obj) {
    let r = Math.floor(Math.random() * 255),
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
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    @media (max-height: 500px) {
      top: 50%;
    }
    @include sm {
      top: 40%;
    }
    .text {
      margin-bottom: 25px;
      color: $titlColor;
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
        color: #d7b841;
        filter: drop-shadow(2px 1px 0px rgba(0, 0, 0, 0.3));
        animation: svgs 1.3s ease-in-out infinite;
      }
      span {
        margin-right: 10px;
      }
    }
  }
}

@keyframes svgs {
  0% {
    transform: scale(0.9);
  }
  40% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.9);
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
  --svg: url('./../../image/loading.svg');
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
