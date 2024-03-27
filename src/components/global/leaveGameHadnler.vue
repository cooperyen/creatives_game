<template>
  <div id="leave_game">
    <div class="text" @click="open = true">
      <font-awesome-icon icon="fa-solid fa-chevron-left" />
      <p>LEAVE</p>
    </div>
    <div class="bg" v-if="open"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      open: false,
    };
  },
  props: ['socket'],
  methods: {
    leaveGame() {
      this.$store.commit('clearUserRoom');

      const localStorageData = JSON.parse(localStorage.getItem('userData'));
      const data = {
        id: this.$store.state.userStore.userName,
        room: null,
        icon: this.$store.state.userStore.icon,
      };

      console.log({
        id: this.$store.state.userStore.userName,
        room: null,
        icon: this.$store.state.userStore.icon,
      });
      // this.socket.emit('id_check', data);
    },
  },
  mounted() {
    console.log('object');
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/color.scss';
#leave_game {
  .bg {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
    background-color: $bg_pevent;
  }
}
</style>
