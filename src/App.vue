<template>
  <!-- <h1 style="color: white">{{ $store.state.userStore.loading }}</h1>
  <h1 style="color: white">{{ $store.state.loopStore.connectedTime }}</h1> -->
  <transition name="connect">
    <div id="connect" v-show="!$store.state.userStore.loading">
      <div class="loading-box flex">
        <h2>Connecting</h2>
        <span>......</span>
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

  <transferPageCountDown></transferPageCountDown>
</template>

<script setup></script>

<script>
import { state, socket } from '@/../assets/socket';
import loadingLoop from '@/../src/ui/loadingLoop.vue';
import transferPageCountDown from '@/../src/ui/transferPageCountDown.vue';
export default {
  data() {
    return {
      socket,
      state,
      loading: false,
      clickLoading: false,
    };
  },
  components: { loadingLoop, transferPageCountDown },
  watch: {
    $route(el) {
      this.$store.commit('socketDelete');
      this.$store.commit('loadRoomLoopDelete');
      this.$store.commit('updateLoading', false);
    },
    // 'state.connected': {
    //   handler(el) {
    //     // this.connectedCheck();
    //   },
    // },
  },

  methods: {
    loadingLoopFun(el) {
      this.clickLoading = el;
    },
    connectedCheck() {
      const connected = this.state.connected;
      if (connected === undefined) return;

      setTimeout(() => {
        connected ? (this.loading = true) : (this.loading = false);
      }, 1000);
    },
    cookieCheck() {
      const data = JSON.parse(localStorage.getItem('userData'));

      if (data === null)
        localStorage.setItem(
          'userData',
          JSON.stringify({ userName: null, userRoom: null })
        );
    },
  },
  mounted() {
    // history.pushState(null, null, location.href);
    window.onpopstate = function () {
      history.go(1);
    };
    // this.connectedCheck();
  },
  created() {
    this.cookieCheck();
    const userName = this.$store.state.userStore.userName;
    const userRoom = this.$store.state.userStore.userRoom;
    if (userName === null || userName === undefined || userRoom === undefined)
      this.$router.replace('/');
    if (this.$route.path === '/') return;
    // this.socket.emit('id_check', { id: userName, room: userRoom });
  },
};
</script>

<style lang="scss">
@import '@/scss/main.scss';
</style>
