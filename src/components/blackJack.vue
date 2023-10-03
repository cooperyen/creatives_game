<template>
  <h1>123</h1>
  {{ state.blackJack.banker }}
  <button @click="snatchBank()">bank</button>
</template>

<script>
export default {
  data() {
    return {
      player: null,
      gameRoom: null,
      banker: false,
    };
  },
  props: ['socket', 'state'],
  watch: {
    'state.blackJack': {
      handler(el) {
        console.log(el);
      },
      deep: true,
    },
  },
  methods: {
    snatchBank() {
      const data = {
        id: this.player,
        room: `blackjack/${this.gameRoom}`,
        bank: true,
      };
      this.socket.emit('bj', data);
    },
  },
  mounted() {
    if (this.state.activeGameRoom === null) this.$router.replace('/lobby');

    this.player = this.$store.state.userStore.userName;
    this.gameRoom = this.$store.state.userStore.userRoom;
  },
};
</script>
