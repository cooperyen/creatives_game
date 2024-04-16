<template>
  <div id="copyright" v-if="showCopyright">
    <p>©{{ time }} CREATIVES TEAM.</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { router } from '@/assets/router.js';
const time = new Date().getFullYear();

const showCopyright = computed(() => {
  let res = true;
  switch (router.currentRoute.value.name) {
    case 'yellowCard':
    case 'game':
      res = false;
      break;
  }
  return res;
});
</script>

<style lang="scss" scoped>
@import '@/scss/rwd.scss';
#copyright {
  position: fixed;
  left: 50%;
  bottom: 15px;
  transform: translate(-50%, -50%);
  font-size: 0.9rem;
  color: rgb(157 166 187);
  width: auto;
  text-align: center;
  z-index: 5;
  white-space: nowrap;
  @include L {
    bottom: 2px;
    font-size: 0.7rem;
  }
  @include sm {
    bottom: 0px;
    font-size: 0.5rem;
  }
}
</style>
