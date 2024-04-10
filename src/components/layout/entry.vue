<template>
  <div id="entry" class="full_container bg" v-if="!start">
    <div class="content">
      <div class="ani"></div>
      <button class="play_btn" @click="turnOn()">
        <span>開始</span><font-awesome-icon icon="fa-solid fa-circle-play" />
      </button>
    </div>
  </div>
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
</script>

<style lang="scss" scoped>
@import '@/scss/color.scss';
#entry {
  left: 0;
  &.bg {
    background-color: #d9d5d2;
  }
  .content {
    position: fixed;
    top: 200px;
    width: 100%;
    text-align: center;
    @media (max-height: 750px) {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .play_btn {
      font-weight: bold;
      cursor: pointer;
      color: rgb(48, 48, 48);
      border: 4px solid rgb(65, 65, 65);
      // background-color: rgba(0, 0, 0, 0.1);
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
    .ani {
      margin-top: 50px;
      position: relative;
      height: 65px;
      width: calc(371px / 5);
      background-image: url('./../../uis/loading.png');
      animation: load-ani 0.4s steps(5) infinite;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(1.2);
    }
  }
}

@keyframes load-ani {
  from {
    background-position: 0;
  }
  to {
    background-position: 371px;
  }
}
</style>
