<template>
  <transition name="connect">
    <div id="connect" v-if="!$store.state.userStore.loading">
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
import loadingLoop from '@/../src/ui/loadingLoop.vue';
import transferPageCountDown from '@/../src/ui/transferPageCountDown.vue';
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
    $route(el) {
      this.$store.commit('socketDelete');
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
    cookieCheck() {
      const data = JSON.parse(localStorage.getItem('userData'));

      if (data === null) this.$store.commit('createDefaultData');

      this.$store.commit('authCheck');
    },
  },
  mounted() {},
  created() {
    this.cookieCheck();
    const userName = this.$store.state.userStore.userName;
    const userRoom = this.$store.state.userStore.userRoom;
    if (userName === null || userName === undefined || userRoom === undefined)
      this.$router.replace('/');
    if (this.$route.path === '/') return;
    // this.socket.emit('id_check', { id: userName, room: userRoom });
  },
  beforeUnmount() {
    // this.socket.off();
  },
};
</script>

<style lang="scss">
@import '@/scss/main.scss';
</style>
