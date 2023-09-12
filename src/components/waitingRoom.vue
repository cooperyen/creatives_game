<template>
  <div class="container">
    <div>
      <h2>目前的玩家</h2>
      <div id="player_list">
        <ul v-for="i in players" :key="i">
          <li>{{ i }}</li>
        </ul>
      </div>
    </div>
    <div class="leader-container">
      <h1>{{ leader }}</h1>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      players: null,
      leader: '',
    };
  },
  props: ['socket', 'state'],
  watch: {
    'state.currentPlayers': {
      handler(el) {
        const userRoom = this.$store.state.userStore.userRoom;
        console.log('el', el);
        this.players = el[userRoom].player;
      },
      deep: true,
    },
  },
  methods: {},
  mounted() {
    const userName = this.$store.state.userStore.userName;
    const userRoom = this.$store.state.userStore.userRoom;

    this.leader = userName;
    console.log(userName, userRoom);

    this.socket.emit('id_check', { id: userName, room: userRoom });
  },
};
</script>
