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
          <!-- <div class="layout"></div> -->
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
          <!-- <div class="layout empty"></div> -->
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
          <readyIcon v-show="readyList[selfPlayer]"></readyIcon>
        </div>
      </div>
    </div>

    <!-- buttons -->
    <div class="active-container" v-if="!readyToGo">
      <div class="count-down" v-show="isShowCountDown">
        請準備遊戲，{{ time }} 秒後反回大廳
      </div>
      <div class="ready-box">
        <div class="ready-content">
          <div
            class="ready-btn"
            :class="{ ready: !readyList[selfPlayer] }"
            v-if="!readyList[selfPlayer]"
          >
            <p @click="ready('ready', selfPlayer)">ready</p>
          </div>
          <div
            v-else
            class="ready-btn"
            :class="{ cancel: readyList[selfPlayer] }"
          >
            <p @click="ready('unready', selfPlayer)">cancel</p>
          </div>
        </div>
      </div>
    </div>

    <div class="start-game" v-if="readyToGo">
      <div class="start-layout">
        <div class="content">
          <h2>開始遊戲，{{ time }} 秒後返回遊戲廳</h2>
          <button @click="startGame()">出發囉!!</button>
        </div>
      </div>
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
      time: 60,
      isCountDown: false,
      countDownFun: null,
      isShowCountDown: false,
      readyToGo: false,
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
        clearTimeout(this.countDownFun);
        this.$router.replace(`/${el}`);
      },
      deep: true,
    },
    'state.gameOne.readyToGo': {
      handler(el) {
        if (typeof el != 'boolean') return;
        this.readyToGo = el;
      },
      deep: true,
    },
    'state.gameOne.readyList': {
      handler(el) {
        if (el[this.selfPlayer] != undefined || el[this.selfPlayer] != null) {
          this.isShowCountDown = false;
          this.isCountDown = false;
        } else {
          this.isShowCountDown = true;
          this.isCountDown = true;
        }
        this.readyList = el;
      },
    },
    isCountDown(el) {
      if (el) this.countDown();
      else {
        clearTimeout(this.countDownFun);
        this.time = 60;
      }
    },
    readyToGo(el) {
      if (el === true) this.countDownStart();
      if (el != false) return;
      clearTimeout(this.countDownFun);
      this.time = 60;
    },
  },
  props: ['socket', 'state'],
  methods: {
    startGame() {
      this.socket.emit('lunch_mind', this.userRoom);
    },
    ready(state, id) {
      this.readyToGo = false;
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

      if (el[userRoom].player.length > 1) {
        this.isCountDown = true;
        this.isShowCountDown = true;
      } else this.isCountDown = false;
      this.otherPlayers = otherPlayers;
      this.otherPlayerSetroom = 3 - otherPlayers.length;
    },

    countDown() {
      this.time -= 1;
      if (this.time <= 0) {
        this.$router.replace('/lobby');
      }
      if (this.time != 0) {
        this.countDownFun = setTimeout(() => {
          this.countDown();
        }, 1000);
      }
    },

    countDownStart() {
      console.log('countDownStart', this.time);
      this.time -= 1;
      if (this.time <= 0) {
        this.readyToGo = false;
        this.ready('unready', this.selfPlayer);
      }
      if (this.time != 0) {
        this.countDownFun = setTimeout(() => {
          this.countDownStart();
        }, 1000);
      }
    },
  },
  mounted() {
    // this.$store.commit('clearUserRoom');
    const LocalStorageData = JSON.parse(localStorage.getItem('userData'));
    const userName = LocalStorageData.userName;
    const userRoom = LocalStorageData.userRoom;

    if (userRoom === null || userRoom === undefined)
      this.$router.push('/lobby');

    this.userRoom = userRoom;
    this.selfPlayer = userName;

    this.socket.emit('id_check', { id: userName, room: userRoom });
  },
  unmount() {
    clearTimeout(this.countDownFun);
    clearTimeout(this.countDownStart);
    this.$store.commit('clearUserRoom');
  },
};
</script>

<style scoped>
@import '@/scss/waitRoom.scss';
</style>
