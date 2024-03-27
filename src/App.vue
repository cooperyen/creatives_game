<template>
  <transition name="connect">
    <div
      id="connect"
      v-if="!$store.state.userStore.loading && $route.name != 'not-found'"
    >
      <div class="loading-box active" v-if="state.connected != false">
        <div class="flex">
          <h2>Connecting</h2>
          <span>......</span>
        </div>
        <div><p>shouldn't take too long.</p></div>
        <div class="ani"></div>
      </div>
      <div class="loading-box" v-if="connectedCheck()">
        <div class="flex">
          <h2>Connecting to service FAIL</h2>
        </div>
        <div><p>please reload page and try again!</p></div>
      </div>
    </div>
  </transition>

  <loadingLoop v-show="clickLoading"></loadingLoop>

  <!-- content -->
  <router-view :socket="socket" :state="state" v-slot="{ Component }">
    <transition :name="$route.meta.transition || 'fade'">
      <div :key="$route.name">
        <component :is="Component" />
      </div>
    </transition>
  </router-view>

  <copyright></copyright>
  <transferPageCountDown></transferPageCountDown>
</template>

<script setup>
import { state, socket } from '@/../assets/socket';
</script>

<script>
import loadingLoop from '@/../src/components/global/loadingLoop.vue';
import transferPageCountDown from '@/../src/components/global/transferPageCountDown.vue';
import copyright from '@/../src/components/layout/copyright.vue';
export default {
  data() {
    return {
      dsds: false,
      socket,
      state,
      loading: false,
      clickLoading: false,
      sockets: null,
    };
  },
  components: { loadingLoop, transferPageCountDown, copyright },
  watch: {
    $route() {
      this.$store.commit('loopHandlerDelete');
      this.$store.commit('loadRoomLoopDelete');
      this.$store.commit('updateLoading', false);
    },
  },
  computed: {
    connected() {
      return state.connected;
    },
  },
  methods: {
    loadingLoopFun(el) {
      this.clickLoading = el;
    },
    connectedCheck() {
      const connected = this.state.connected;
      if (connected === undefined) return false;
      if (connected === false && connected != null) return true;
    },
    async cookieCheck() {
      const data = JSON.parse(localStorage.getItem('userData'));

      if (data === null) this.$store.commit('createDefaultData');

      const auth = await this.$store.commit('authCheck');
    },
  },
  created() {
    this.cookieCheck();
  },
};
</script>

<style lang="scss">
@import '@/scss/main.scss';
</style>
