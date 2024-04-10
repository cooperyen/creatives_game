<template>
  {{ start }}
  <div v-if="!start">
    <button @click="turnOn()">開始!</button>
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
</style>
