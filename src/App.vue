<template>
  <transition name="connect">
    <div id="connect" v-show="!loading">
      <div class="loading-box flex">
        <h2>Connecting</h2>
        <span>......</span>
      </div>
    </div>
  </transition>

  <router-view :socket="socket" :state="state" v-slot="{ Component }">
    <transition :name="$route.meta.transition || 'fade'">
      <div :key="$route.name">
        <component :is="Component" />
      </div>
    </transition>
  </router-view>
</template>

<script setup></script>

<script>
import { state, socket } from '@/../assets/socket';

export default {
  data() {
    return {
      socket,
      state,
      loading: false,
    };
  },

  computed: {
    connected() {
      return state.connected;
    },
    socketId() {
      return state.socketId;
    },
  },
  watch: {
    'state.connected': {
      handler(el) {
        this.connectedCheck();
      },
    },
  },
  methods: {
    connectedCheck() {
      const connected = this.state.connected;
      if (connected === undefined) return;

      setTimeout(() => {
        connected ? (this.loading = true) : (this.loading = false);
      }, 1000);
    },
  },
  mounted() {
    // history.pushState(null, null, location.href);
    window.onpopstate = function () {
      history.go(1);
    };
    this.connectedCheck();
  },
  created() {
    const userName = this.$store.state.userStore.userName;
    const userRoom = this.$store.state.userStore.userRoom;
    if (userName === null || userName === undefined) this.$router.push('/');
    if (this.$route.path === '/') return;
    // this.socket.emit('id_check', { id: userName, room: userRoom });
  },
};
</script>

<style lang="scss">
@import '@/scss/main.scss';
</style>
