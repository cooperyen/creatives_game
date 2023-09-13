<template>
  <div class="container">
    <!-- players -->
    <div class="flex player-container">
      <!-- player -->
      <div class="player-box">
        <div class="player-item" v-for="i in players" :key="i">
          <div class="layout"></div>
          <div class="layout-inner flex">
            <!-- icon -->
            <div class="icon-box">
              <img src="./../image/user.png" alt="" />
            </div>
            <!-- name -->
            <div class="name-box flex">
              <p>{{ i + 'fsdfdsfdsfdsfdsfdsfdsfddssfsdfsd' }}</p>
            </div>
            <!-- ready icon -->
            <readyIcon v-show="isReady"></readyIcon>
          </div>
        </div>
        <!-- empty -->
        <div
          class="player-item empty"
          v-for="i in currentPlayersNumber"
          :key="i"
        >
          <div class="layout empty"></div>
        </div>
      </div>

      <!-- leader -->
      <div class="leader-box">
        <div class="leader-item">
          <div class="icon-box">
            <img src="./../image/user.png" alt="" />
          </div>
          <div class="name-box">
            <p>
              {{ leader }}
            </p>
          </div>
          <readyIcon v-show="isReady"></readyIcon>
        </div>
      </div>
    </div>

    <!-- buttons -->
    <div>
      <div>
        <button id="ready" v-if="!isReady" @click="ready('ready', leader)">
          準備
        </button>
        <button id="ready" v-else @click="ready('unready', leader)">
          取消
        </button>
      </div>

      <button id="start" v-show="start">出發囉!!</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      oneself: null,
      players: null,
      currentPlayersNumber: null,
      leader: null,
      userRoom: null,
      start: false,
      readyList: [],
      isReady: false,
    };
  },
  props: ['socket', 'state'],
  watch: {
    readyList: {
      handler(e) {
        const readyLength = e.length;
        readyLength >= 1 && readyLength === this.players.length
          ? (this.start = true)
          : (this.start = false);

        console.log(this.players);
      },
      deep: true,
    },
    'state.currentPlayers': {
      handler(el) {
        if (el === undefined) return;
        const userRoom = this.$store.state.userStore.userRoom;
        const players = el[userRoom].player.filter((el) => {
          return el != this.leader;
        });
        this.players = players;
        this.currentPlayersNumber = 3 - players.length;
      },
      deep: true,
    },
  },
  methods: {
    ready(state, id) {
      if (state === 'ready' && this.readyList.indexOf(id) === -1) {
        this.readyList.push(id);
        this.isReady = true;
      }

      if (state === 'unready') {
        this.readyList.splice(this.readyList.indexOf(id));
        this.isReady = false;
      }

      // console.log(this.readyList);
      // const data = { room: this.userRoom, id };
      // this.socket.emit('ready', data);
    },
  },
  mounted() {
    const userName = this.$store.state.userStore.userName;
    const userRoom = this.$store.state.userStore.userRoom;

    this.userRoom = userRoom;
    this.leader = userName;

    this.socket.emit('id_check', { id: userName, room: userRoom });

    this.socket.on('re_ready', function (data) {
      console.log(data);
    });
  },
};
</script>

<style scoped>
@import '@/scss/waitRoom.scss';
</style>
