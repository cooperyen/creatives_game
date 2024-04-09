<template>
  <metainfo>
    <template v-slot:title="{ content }">{{
      content ? `${content} | CREATIVES` : `CREATIVES`
    }}</template>
  </metainfo>

  <connectTransition></connectTransition>

  <!-- content -->
  <router-view
    v-show="store.state.loopStore.connected"
    :socket="socket"
    :state="state"
    v-slot="{ Component }"
  >
    <transition :name="$route.meta.transition || 'fade'">
      <div :key="$route.fullpath">
        <component :is="Component" />
      </div>
    </transition>
  </router-view>

  <!-- copyright -->
  <copyright></copyright>
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
} from 'vue';
import { useStore } from 'vuex';
import { useMeta } from 'vue-meta';
import { state, socket } from '@/../assets/socket';
import { router } from '@/../assets/router.js';
import connectTransition from '@/../src/components/layout/connectTransition.vue';
import copyright from '@/../src/components/layout/copyright.vue';
import { useRouter } from 'vue-router';
const { currentRoute } = useRouter();
const store = useStore();

// meta
useMeta({
  title: '',
  meta: [
    {
      name: 'description',
      content:
        '我們是兩個喜歡桌遊的玩家，希望透過線上版本也可以同時讓不常見面的朋友也可以一同遊玩。',
    },
  ],
  htmlAttrs: { lang: 'zh-tw' },
});

watch(currentRoute, () => {
  store.commit('updateLoading', false);
});

// load with check cookie.
cookieCheck();
function cookieCheck() {
  const data = JSON.parse(localStorage.getItem('userData'));
  if (data === null) store.commit('createDefaultData');
  store.commit('authCheck');
}
</script>

<style lang="scss">
@import '@/scss/main.scss';
</style>
