<template>
  <div id="waitroom" v-show="$store.state.userStore.loading">
    <instructionsCompent
      :show="openInstruction"
      :game="$store.state.userStore.userRoom"
      @close="(n) => (openInstruction = n)"
    ></instructionsCompent>
    <!-- header -->
    <div class="header-container">
      <!-- back btn -->
      <div class="back-btn">
        <router-link to="/lobby" replace class="flex">
          <font-awesome-icon icon="fa-solid fa-chevron-left" />
          <p>LOBBY</p>
        </router-link>
      </div>

      <!-- instruction icon -->
      <div class="instruction_btn" v-if="instructions">
        <button class="btn" @click="openInstruction = true">
          <font-awesome-icon icon="fa-solid fa-circle-question" />
        </button>
      </div>

      <!-- room name -->
      <div class="room-box">
        <h2>
          {{ $store.state.instructions[userRoom]?.title.ch }}
        </h2>
      </div>
    </div>

    <!-- main container -->
    <div class="container">
      <!-- player's content -->
      <div class="player-container">
        <div class="player-box">
          <!-- self -->
          <div class="player-item self">
            <div class="layout-inner">
              <!-- name -->
              <div class="info_box">
                <p>
                  {{ selfPlayer != null ? selfPlayer.toUpperCase() : null }}
                </p>
              </div>

              <!-- icon -->
              <div class="icon_box">
                <div class="user_icon">
                  <img :src="$global_getImgUrl(userIcon, 'player')" alt="" />
                </div>
                <div class="bg_icon">
                  <img :src="$global_getImgUrl('plate', 'player')" alt="" />
                </div>
              </div>

              <!-- ready icon -->

              <readyIcon
                :host="roomHost === selfPlayer"
                :class="{ visible: !readyList[selfPlayer] }"
              ></readyIcon>
              <div v-show="readyToGo">
                {{ readyToGo }}
              </div>
            </div>
          </div>
          <!-- other -->
          <div class="player-item" v-for="i in otherPlayers" :key="i">
            <div class="layout-inner">
              <!-- name -->
              <div class="info_box">
                <p>{{ i.user_id.toUpperCase() }}</p>
              </div>
              <!-- icon -->
              <div class="icon_box">
                <div class="user_icon">
                  <img :src="$global_getImgUrl(i.icon, 'player')" alt="" />
                </div>
                <div class="bg_icon">
                  <img :src="$global_getImgUrl('plate', 'player')" alt="" />
                </div>
              </div>

              <!-- ready icon -->
              <readyIcon
                :host="roomHost === i.user_id"
                v-show="readyList[i.user_id]"
              ></readyIcon>
            </div>
          </div>

          <!-- empty -->
          <div
            class="player-item empty"
            v-for="i in otherPlayerSetroom"
            :key="i"
          >
            <!-- <div class="layout empty"></div> -->
            <div class="layout-inner">
              <div class="icon_box">
                <div class="empty_box">
                  <p>EMPTY</p>
                </div>
                <div class="bg_icon">
                  <img :src="$global_getImgUrl('plate', 'player')" alt="" />
                </div>
              </div>
            </div>
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

    <!-- side menu -->
    <div class="side_menu">
      <div class="items setting">
        <div class="inner">
          <div class="box" @click="role.open = true">
            <font-awesome-icon icon="fa-solid fa-gear" />
          </div>
        </div>
      </div>
    </div>

    <!-- change user role content -->
    <changeUserRoleHandler
      :isOpne="role.open"
      @close="(n) => (role.open = n)"
      @userIcon="(n) => (userIcon = n)"
    ></changeUserRoleHandler>
  </div>
  <backGroundAnimate></backGroundAnimate>
</template>

<script>
import changeUserRoleHandler from '@/../src/components/global/changeUserRoleHandler.vue';
import leaveGameHadnler from '@/../src/components/global/leaveGameHadnler.vue';
export default {
  data() {
    return {
      roomHost: null,
      otherPlayers: null,
      otherPlayerSetroom: 3,
      selfPlayer: null,
      eachPlayer: null,
      userRoom: null,
      userIcon: null,
      start: false,
      readyList: [],
      playerList: null,
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
      openInstruction: false,
    };
  },
  components: { changeUserRoleHandler, leaveGameHadnler },
  computed: {
    game() {
      return this.$store.state.userStore.userRoom;
    },
    instructions() {
      return this.$store.state.instructions[this.game]?.content?.ch
        ? true
        : false;
    },
  },
  watch: {
    'state.loginError': {
      handler(el) {
        if (this.state.activeGameRoom != 'fail') return;
        this.$router.replace(`/${el}`);
      },
    },
    'state.updateCurrentPlayers': {
      handler(el) {
        this.playerList = el.room_data[this.userRoom]['player'];
        this.countPlayers(el);
        const ready = el.room_data[this.userRoom]['ready'];
        this.readyList = ready.reduce((key, val, index) => {
          key[val] = val;
          return key;
        }, {});
      },
      deep: true,
    },

    'state.currentPlayers': {
      handler(el) {
        this.playerList = el.page[this.userRoom]['player'];
        this.roomHost = el.page[this.userRoom]['ready'][0];
        this.currentPlayers(el);
        this.countPlayers(el);
      },
      deep: true,
    },
    'state.goUrl': {
      handler(el) {
        if (this.state.activeGameRoom != null) {
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
        this.roomHost = Object.keys(el)[0] || null;
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
    eachPlayers(el) {
      this.eachPlayer = el;
    },
    currentPlayers(el) {
      // no data than return.
      if (el.page === undefined || el.page === null) return;

      const page = el.page;

      const userRoomURL = this.$store.state.userStore.userRoom;
      const userRoom = userRoomURL.substring(userRoomURL.indexOf('/') + 1);

      if (userRoom === null) return;

      const ready = page[userRoom]['ready'].indexOf(this.selfPlayer);
      const playerList = page[userRoom]['player'];

      // room players without self.
      if (ready === -1) this.readyGameUI(false);
      if (ready === -1 && this.playerList.length >= 2) this.readyGameUI(true);
    },

    countPlayers(el) {
      const players = el.user_sids;
      const otherPlayers = this.playerList
        .map((el) => {
          if (el != this.selfPlayer) {
            players[el].user_id = el;
            return players[el];
          }
        })
        .filter((x) => {
          return x != null;
        });
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
        'loopHandler',
        setInterval(() => {
          const result = doCheck();
          this.$store.commit('loopTimePlus');

          if (result) {
            this.$store.commit('loopHandlerDelete');
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
    if (
      !this.$store.state.instructions[this.$route.params.room] ||
      !this.$store.state.instructions[this.$route.params.room].state
    )
      this.$router.replace('/lobby');

    if (this.selfPlayer === null || this.selfPlayer === undefined)
      this.$router.replace('/');
    if (
      (this.selfPlayer != null && this.userRoom === null) ||
      (this.selfPlayer != undefined && this.userRoom === undefined)
    )
      this.$router.replace('/lobby');

    this.loadCheck();
  },
  created() {
    this.selfPlayer = this.$store.state.userStore.userName;
    this.userRoom = this.$store.state.userStore.userRoom;
    this.userIcon = this.$store.state.userStore.icon;
  },
  beforeUnmount() {
    this.$store.commit('loopHandlerDelete');
    this.$store.commit('clearUserRoom');
    clearTimeout(this.countDownFun);
    clearTimeout(this.countDownStart);

    const whoIsLeave = { room: this.userRoom, id: this.selfPlayer };
    this.socket.emit('readyLeave', whoIsLeave);
  },
};
</script>

<style scoped>
@import '@/scss/waitRoom.scss';
</style>
