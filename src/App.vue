<template>
  <p>State: {{ connected }}</p>
  <p>socketId: {{ socketId }}</p>
  <p>{{ $store.state.userStore.userData }}</p>
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
};
</script>

<style lang="scss">
@import '@/scss/main.scss';
</style>
