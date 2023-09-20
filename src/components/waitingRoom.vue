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
    <!-- player's content -->
    <div class="flex player-container">
      <!-- otherPlayers -->
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
              <p>{{ i }}</p>
            </div>
            <!-- ready icon -->
            <readyIcon v-show="readyList[i]"></readyIcon>
          </div>
        </div>
        <!-- empty -->
        <div class="player-item empty" v-for="i in otherPlayerSetroom" :key="i">
          <div class="layout empty"></div>
        </div>
      </div>

      <!-- self -->
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
          {{ readyList.fdsfd }}
          <readyIcon v-show="readyList[selfPlayer]"></readyIcon>
        </div>
      </div>
    </div>

    <!-- buttons -->
    <div class="active-container">
      <div class="ready">
        <p
          id="ready"
          v-if="!readyList[selfPlayer]"
          @click="ready('ready', selfPlayer)"
        >
          ready
        </p>
        <p id="ready" v-else @click="ready('unready', selfPlayer)">cancel</p>
      </div>

      <button id="start" @click="startGame()">出發囉!!</button>
      {{ time }}
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
      time: 5,
      isCountDown: false,
      countDownFun: null,
    };
  },
  watch: {
    'state.currentPlayers': {
      handler(el) {
        this.currentPlayers(el);
      },
    },
    'state.goUrl': {
      handler(el) {
        if (el === null) return;
        this.$router.replace(`/${el}`);
      },
      deep: true,
    },
    'state.gameOne.readyList': {
      handler(el) {
        console.log(el);
        this.readyList = el;
      },
    },
    isCountDown(el) {
      if (el) this.countDown();
      else {
        clearTimeout(this.countDownFun);
        this.time = 5;
      }
    },
  },
  props: ['socket', 'state'],
  methods: {
    startGame() {
      this.socket.emit('lunch_mind', this.userRoom);
    },
    ready(state, id) {
      if (state === 'ready') {
        const who_is_ready = { room: this.userRoom, id, state };
        this.socket.emit('ready', who_is_ready);
      }

      if (state === 'unready') {
        const who_is_ready = { room: this.userRoom, id, state };
        this.socket.emit('ready', who_is_ready);
      }
    },
    currentPlayers(el) {
      if (el === undefined) return;
      const userRoom = this.$store.state.userStore.userRoom;
      const otherPlayers = el[userRoom].player.filter((el) => {
        return el != this.selfPlayer;
      });

      if (el[userRoom].player.length > 1) this.isCountDown = true;
      else this.isCountDown = false;
      this.otherPlayers = otherPlayers;
      this.otherPlayerSetroom = 3 - otherPlayers.length;
    },

    countDown() {
      this.time -= 1;
      console.log(this.time);
      if (this.time <= 0) {
        this.$router.replace('/lobby');
      }
      if (this.time != 0) {
        this.countDownFun = setTimeout(() => {
          this.countDown();
        }, 1000);
      }
    },
  },
  mounted() {
    // this.adsdd(this.state.currentPlayers);
    const LocalStorageData = JSON.parse(localStorage.getItem('userData'));
    const userName = LocalStorageData.userName;
    const userRoom = LocalStorageData.userRoom;

    if (userRoom === null || userRoom === undefined)
      this.$router.push('/lobby');

    this.userRoom = userRoom;
    this.selfPlayer = userName;

    this.socket.emit('id_check', { id: userName, room: userRoom });
  },
  onBeforeRouteLeave(to, from, next) {
    console.log(to, from, next);
    clearTimeout(this.countDownFun);
    this.$store.commit('clearUserRoom');
  },
};
</script>

<style scoped>
@import '@/scss/waitRoom.scss';
</style>
