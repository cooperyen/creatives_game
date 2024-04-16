<template>
  <transition name="connect">
    <div
      id="connect"
      v-if="
        !store.state.userStore.loading &&
        router.name != 'not-found' &&
        store.state.loopStore.entrys
      "
    >
      <div class="loading-box active" v-if="!connectedCheck()">
        <div class="flex">
          <h2>連線中</h2>
          <span>......</span>
        </div>
        <div><p>通常不會太久</p></div>
        <div class="ani"></div>
      </div>
      <div class="loading-box" v-else>
        <div class="flex">
          <h2>連線失敗</h2>
        </div>
        <div><p>請稍後重新整理頁面嘗試連線</p></div>
      </div>

      <transferPageCountDown :state="state"></transferPageCountDown>
    </div>
  </transition>
</template>

<script setup>
import transferPageCountDown from '@/components/global/transferPageCountDown.vue';
import { useStore } from 'vuex';
import { router } from '@/assets/router.js';
import { state, socket } from '@/assets/socket';
// const props = defineProps(['state']);
const store = useStore();

function connectedCheck() {
  const connected = state.connected;
  if (connected === undefined) return false;
  if (connected === false && connected != null) return true;
  if (connected === 'fail') return true;
}
</script>
