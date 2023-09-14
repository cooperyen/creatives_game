<template>
  <div class="back-container">
    <div class="back-btn">
      <router-link to="/lobby" class="flex">
        <font-awesome-icon icon="fa-solid fa-chevron-left" />
        <p>to looby</p>
      </router-link>
    </div>
    <div class="room-box">
      <h2>
        {{ userRoom }}
      </h2>
    </div>
  </div>
  <div class="container">
    <!-- otherPlayers -->
    <div class="flex player-container">
      <!-- player -->
      <div class="player-box">
        <div class="player-item" v-for="i in otherPlayers" :key="i">
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
        <div class="player-item empty" v-for="i in otherPlayerSetroom" :key="i">
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
              {{ selfPlayer }}
            </p>
          </div>
          <readyIcon v-show="isReady"></readyIcon>
        </div>
      </div>
    </div>

    <!-- buttons -->
    <div class="active-container">
      <div class="ready">
        <p id="ready" v-if="!isReady" @click="ready('ready', selfPlayer)">
          ready
        </p>
        <p id="ready" v-else @click="ready('unready', selfPlayer)">cancel</p>
      </div>

      <p id="start" v-show="start">出發囉!!</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      oneself: null,
      otherPlayers: null,
      otherPlayerSetroom: 3,
      selfPlayer: null,
      userRoom: null,
      start: false,
      readyList: [],
      isReady: false,
    };
  },
  watch: {
    readyList: {
      handler(e) {
        console.log('sddda', e);
        const readyLength = e.length;
        readyLength >= 1 && readyLength === this.otherPlayers.length
          ? (this.start = true)
          : (this.start = false);

        console.log(this.otherPlayers);
      },
      deep: true,
    },
    'state.currentPlayers': {
      handler(el) {
        this.adsdd(el);
      },
    },
  },
  props: ['socket', 'state'],
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
    adsdd(el) {
      console.log('currentPlayerssdasd', el);
      if (el === undefined) return;
      const userRoom = this.$store.state.userStore.userRoom;
      console.log(userRoom);
      const otherPlayers = el[userRoom].player.filter((el) => {
        return el != this.selfPlayer;
      });
      console.log('otherPlayers', el[userRoom].player);
      this.otherPlayers = otherPlayers;
      this.otherPlayerSetroom = 3 - otherPlayers.length;
    },
  },
  mounted() {
    // this.adsdd(this.state.currentPlayers);
    const LocalStorageData = JSON.parse(localStorage.getItem('userData'));
    const userName = LocalStorageData.userName;
    const userRoom = LocalStorageData.userRoom;

    if (userRoom === null || userRoom === undefined)
      this.$router.push('/lobby');
    console.log(userRoom);

    this.userRoom = userRoom;
    this.selfPlayer = userName;

    this.socket.emit('id_check', { id: userName, room: userRoom });
  },
};
</script>

<style scoped>
@import '@/scss/waitRoom.scss';
</style>
