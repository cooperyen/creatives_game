<template>
  <div v-show="$store.state.userStore.loading">
    <div class="back-container">
      <div class="back-btn">
        <router-link to="/lobby" class="flex">
          <font-awesome-icon icon="fa-solid fa-chevron-left" />
          <p>to looby</p>
        </router-link>
      </div>
      <div class="room-box">
        <h2>
          {{ $store.state.gameData.chGameName[userRoom]?.name }}
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
          <div
            class="player-item empty"
            v-for="i in otherPlayerSetroom"
            :key="i"
          >
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
    </div>
    <!-- buttons -->

    <div class="active-container" v-show="!readyToGo">
      <!-- <transition name="move-up"> -->
      <div class="count-down" :class="{ visible: !isShowCountDown }">
        請準備遊戲，<span>{{ time }}</span> 秒後反回大廳
        {{ isShowCountDown }}
      </div>
      <!-- </transition> -->
      <div class="ready-container">
        <div class="ready-box">
          <div class="ready-content">
            <div
              class="ready-btn"
              :class="{
                ready: !readyList[selfPlayer],
                cancel: readyList[selfPlayer],
              }"
            >
              <p
                @click="
                  ready(readyList[selfPlayer] ? 'unready' : 'ready', selfPlayer)
                "
              >
                {{ readyList[selfPlayer] ? 'cancel' : 'ready' }}
              </p>
            </div>
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
  components: {},
  watch: {
    'state.loginError': {
      handler(el) {
        if (this.state.activeGameRoom != 'fail') return;
        this.$router.replace(`/${el}`);
      },
    },
    'state.currentPlayers': {
      handler(el) {
        this.currentPlayers(el);
      },
      deep: true,
    },
    'state.goUrl': {
      handler(el) {
        if (this.state.activeGameRoom != null) {
          // this.$store.commit('updateUserRoom', el);
          this.$store.state.userStore.userRoom = el;
        }

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
        const selfPlayeReady =
          el[this.selfPlayer] != undefined || el[this.selfPlayer] != null;

        if (selfPlayeReady) this.readyGameUI(false);

        if (!selfPlayeReady) {
          if (this.otherPlayers.length === 0) this.readyGameUI(false);
          if (this.otherPlayers.length != 0) this.readyGameUI(true);
        }
        this.readyList = el;
      },
    },
    isCountDown(el) {
      if (el) this.countDown();
      else {
        clearTimeout(this.countDownFun);
        this.isShowCountDown = false;
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
  emits: ['loadingLoop'],
  props: ['socket', 'state'],
  methods: {
    readyGameUI(boolean) {
      if (boolean) {
        this.isShowCountDown = true;
        this.isCountDown = true;
      }

      if (!boolean) {
        this.isShowCountDown = false;
        this.isCountDown = false;
        this.readyToGo = false;
        this.readyList = [];
      }
    },
    startGame() {
      const that = this;
      switch (this.userRoom) {
        case 'game01':
          toGame('lunch_mind');
          break;
        case 'game02':
          toGame('lunch_bj');
          break;
        case 'game03':
          toGame('lunch_yc');
          break;
        default:
          alert('no game');
      }

      function toGame(game) {
        that.socket.emit(game, that.userRoom);
      }
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
      // no data than return.
      if (el === undefined || el === null) return;

      const userRoomURL = this.$store.state.userStore.userRoom;
      const userRoom = userRoomURL.substring(userRoomURL.indexOf('/') + 1);

      if (userRoom === null) return;

      const ready = el[userRoom]['ready'].indexOf(this.selfPlayer);
      const playerList = el[userRoom]['player'];

      // room players without self.
      const otherPlayers = playerList.filter((el) => {
        return el != this.selfPlayer;
      });

      if (ready === -1) this.readyGameUI(false);
      if (ready === -1 && playerList.length >= 2) this.readyGameUI(true);

      this.otherPlayers = otherPlayers;
      this.otherPlayerSetroom = 3 - otherPlayers.length;
    },

    countDown() {
      clearTimeout(this.countDownFun);
      this.time -= 1;
      if (this.time <= 0) {
        this.$router.replace('/lobby');
      }
      if (this.time > 0) {
        this.countDownFun = setTimeout(() => {
          this.countDown();
        }, 1000);
      }
    },

    countDownStart() {
      this.time -= 1;
      if (this.time <= 0) {
        this.readyToGo = false;
        this.ready('unready', this.selfPlayer);
      }
      if (this.time > 0) {
        this.countDownFun = setTimeout(() => {
          this.countDownStart();
        }, 1000);
      }
    },
    loadCheck() {
      const that = this;
      this.$store.commit(
        'socketConnect',
        setInterval(() => {
          const result = doCheck();
          this.$store.commit('connectedTimePlus');

          if (result) {
            this.$store.commit('socketDelete');
            this.$store.commit('updateLoading', true);
          }

          if (this.$store.state.loopStore.connectedTime >= 10)
            this.$router.replace('/lobby');
        }, 1000)
      );

      function doCheck() {
        // make sure backEnd data same as frontEnd.

        if (that.otherPlayers != null) return true;
        if (that.otherPlayers === null) {
          that.socket.emit('id_check', {
            id: that.selfPlayer,
            room: that.userRoom,
          });
          return false;
        }
      }
    },
  },
  mounted() {
    const LocalStorageData = JSON.parse(localStorage.getItem('userData'));
    const userName = LocalStorageData.userName;
    const userRoom = LocalStorageData.userRoom;

    this.userRoom = userRoom;
    this.selfPlayer = userName;

    if (userRoom === null || userRoom === undefined)
      this.$router.replace('/lobby');

    this.loadCheck();
  },
  beforeUnmount() {
    clearTimeout(this.countDownFun);
    clearTimeout(this.countDownStart);
    this.$store.commit('clearUserRoom');
  },
};
</script>

<style scoped>
@import '@/scss/waitRoom.scss';
</style>
