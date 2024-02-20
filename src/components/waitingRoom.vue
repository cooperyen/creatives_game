<template>
  <div v-show="$store.state.userStore.loading">
    <!-- back to lobby -->
    <div class="back-container">
      <div class="back-btn">
        <router-link to="/lobby" replace class="flex">
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

    <!-- main container -->
    <div class="container">
      <!-- player's content -->
      <div class="flex player-container">
        <!-- otherPlayers -->
        <div class="player-box">
          <div class="player-item" v-for="i in otherPlayers" :key="i">
            <div class="layout-inner flex">
              <!-- icon -->
              <div class="icon-box">
                <img :src="getImgUrl(i.icon)" alt="" />
              </div>

              <!-- name -->
              <div class="name-box flex">
                <p>{{ i.user_id }}</p>
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
              <img :src="getImgUrl(userIcon)" alt="" />
            </div>
            <div class="name-box">
              <p>
                {{ selfPlayer }}
              </p>
            </div>
            <!-- change user role -->
            <div class="setting" @click="role.open = true">
              <font-awesome-icon icon="fa-solid fa-gear" />
            </div>
            <readyIcon v-show="readyList[selfPlayer]"></readyIcon>
          </div>
        </div>
      </div>
    </div>
    <!-- active -->
    <div class="active-container" v-show="!readyToGo">
      <!-- time count down -->
      <div class="count-down" :class="{ visible: !isShowCountDown }">
        請準備遊戲，<span>{{ time }}</span> 秒後反回大廳
        {{ isShowCountDown }}
      </div>
      <!-- do ready-->
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

    <!-- room leader start game -->
    <div class="start-game" v-if="readyToGo">
      <div class="start-layout">
        <div class="content">
          <h2>開始遊戲，{{ time }} 秒後返回遊戲廳</h2>
          <button @click="startGame()">出發囉!!</button>
        </div>
      </div>
    </div>

    <!-- change user role content -->
    <div class="change_user_role" v-if="role.open">
      {{ $store.state.gameData.playerIcon }}
      <div class="content">
        <div class="role">
          <img
            :src="
              getImgUrl(
                role.userSelectIcon === null
                  ? role.userDefault
                  : role.userSelectIcon
              )
            "
            alt=""
          />
        </div>
        <hr />
        <div class="roles flex flex-wrap">
          <div
            v-for="i in $store.state.gameData.playerIcon"
            :key="i"
            class="img_content"
            @click="role.userSelectIcon = i"
          >
            <div class="icon_box">
              <img :src="getImgUrl(i)" alt="" />
            </div>
          </div>
          <div
            v-for="i in $store.state.gameData.playerIcon"
            :key="i"
            class="img_content"
            @click="role.userSelectIcon = i"
          >
            <div class="icon_box">
              <img :src="getImgUrl(i)" alt="" />
            </div>
          </div>
          <div
            v-for="i in $store.state.gameData.playerIcon"
            :key="i"
            class="img_content"
            @click="role.userSelectIcon = i"
          >
            <div class="icon_box">
              <img :src="getImgUrl(i)" alt="" />
            </div>
          </div>
        </div>
        <hr />
        <div class="btn">
          <button class="agree" @click="setUserRole()">agree</button>
          <button class="cencel" @click="role.open = false">cancel</button>
        </div>
      </div>
    </div>
  </div>
  <backGroundAnimate></backGroundAnimate>
</template>

<script>
export default {
  data() {
    return {
      otherPlayers: null,
      otherPlayerSetroom: 3,
      selfPlayer: null,
      eachPlayer: null,
      userRoom: null,
      userIcon: null,
      start: false,
      readyList: [],
      isReady: false,
      time: 60,
      isCountDown: false,
      countDownFun: null,
      isShowCountDown: false,
      readyToGo: false,
      role: {
        open: false,
        userSelectIcon: null,
        userDefault: null,
      },
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
    'state.eachPlayers': {
      handler(el) {
        // console.log(el);
        // this.eachPlayer = el;
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
    setUserRole() {
      this.role.userDefault = this.role.userSelectIcon;
      this.userIcon = this.role.userSelectIcon;
      this.$store.commit('updateUserIcon', this.role.userSelectIcon);
      this.role.open = false;
    },
    getImgUrl(name) {
      if (name === null) return;
      return new URL(`/src/image/player_icon/${name}.svg`, import.meta.url)
        .href;
    },
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
    eachPlayers(el) {
      this.eachPlayer = el;
    },
    currentPlayers(el) {
      // no data than return.
      const players = el.user_sids;
      if (el.page === undefined || el.page === null) return;

      const page = el.page;

      const userRoomURL = this.$store.state.userStore.userRoom;
      const userRoom = userRoomURL.substring(userRoomURL.indexOf('/') + 1);

      if (userRoom === null) return;

      const ready = page[userRoom]['ready'].indexOf(this.selfPlayer);
      const playerList = page[userRoom]['player'];

      console.log(page[userRoom], 'page[userRoom]');
      // room players without self.
      const otherPlayers = playerList
        .map((el) => {
          console.log(players, 'el');
          if (el != this.selfPlayer) {
            players[el].user_id = el;
            return players[el];
          }
        })
        .filter((x) => {
          return x != null;
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
            icon: that.userIcon,
          });
          return false;
        }
      }
    },
  },
  mounted() {
    if (this.userRoom === null || this.userRoom === undefined)
      this.$router.replace('/lobby');

    this.loadCheck();
  },
  created() {
    const localStorageData = JSON.parse(localStorage.getItem('userData'));
    this.selfPlayer = localStorageData.userName;
    this.userRoom = localStorageData.userRoom;
    this.userIcon = localStorageData.icon;
    this.role.userDefault = this.userIcon;
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
