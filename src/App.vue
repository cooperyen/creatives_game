<template>
  <!-- <p>State: {{ connected }}</p>
  <p>socketId: {{ socketId }}</p>
  <p>{{ $store.state.userStore.userData }}</p> -->
  <!-- {{ state.userName }} -->
  <RouterView :socket="socket" :state="state" />
</template>

<script setup></script>

<script>
import { state, socket } from '@/../assets/socket';

export default {
  data() {
    return {
      socket,
      state,
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
  methods: {},
  mounted() {},
  created() {
    const userName = this.$store.state.userStore.userName;
    const userRoom = this.$store.state.userStore.userRoom;
    // socket.emit('inits', { userName });
    if (userName === null) this.$router.push('/');

    console.log('id_check');
    socket.emit('id_check', { id: userName, room: userRoom });
  },
};
</script>

<style lang="scss">
@import '@/scss/main.scss';
</style>
