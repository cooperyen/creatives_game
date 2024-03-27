<template>
  <userNameBox :userName="userName" :userIcon="userIcon"></userNameBox>
  <backGroundAnimate></backGroundAnimate>
  <!-- content -->
  <transition name="content-ready">
    <div class="lobby-container" v-show="$store.state.userStore.loading">
      <!-- room content -->
      <div class="room-container pd_side" v-if="gameRoomsData != null">
        <!-- each room -->
        <template v-for="(x, y) in gameRoomsData" :key="y">
          <div class="page-room flex" v-show="y === slide.currentPage">
            <div class="room-box exist" v-for="room in x" :key="room">
              <!-- room -->
              <div class="room-layout">
                <div
                  class="room-content"
                  :class="{ active: room != 'soon' }"
                  @click="joinRoom(room)"
                >
                  <!-- content -->
                  <div class="content flex">
                    <div class="title" v-if="room != 'soon'">
                      <p>{{ getRoomDetail(room, 'name') }}</p>
                    </div>
                    <div class="soon" v-else>
                      <p>coming</p>
                      <p>soon</p>
                    </div>
                    <div class="players" v-if="room != 'soon'">
                      <p>{{ getRoomDetail(room, 'player') }}人</p>
                    </div>
                  </div>
                  <!-- content end -->
                  <!-- game pic -->
                  <div class="img-box">
                    <div class="bg"></div>
                    <div class="right">
                      <img
                        :src="
                          this.$global_getImgUrl(
                            `${room != 'soon' ? room : 'default_game'}`,
                            'game'
                          )
                        "
                        :alt="room"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <!-- game end -->
                </div>
              </div>
            </div>
          </div>
        </template>
        <!-- end -->

        <!-- pagination -->
        <div class="pagination" v-if="slide.pageSum > 1">
          <button
            @click="moveRoomPage(false)"
            :class="{ none: slide.currentPage === 0 }"
          >
            <font-awesome-icon icon="fa-solid fa-arrow-left-long" />
          </button>
          <button
            @click="moveRoomPage(true)"
            :class="{
              none: slide.currentPage === slide.pageSum - 1,
            }"
          >
            <font-awesome-icon icon="fa-solid fa-arrow-right-long" />
          </button>
        </div>
        <!-- end -->
      </div>
      <!-- end -->

      <!-- Players who are not currently in the game or in the room -->
      <div id="user" class="container pd_side current-users-container">
        <div class="title">
          <p>當前玩家</p>
        </div>
        <div class="content">
          <div>
            <ul>
              <!-- lobbyPlayerList -->
              <li v-for="i in lobbyPlayerList" :key="i">
                <span>{{ i.user_id }}</span>
                <!-- <span>{{ i }}</span> -->
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- end -->

      <!-- change user role content -->
      <changeUserRoleHandler
        :isOpne="role.open"
        @close="(n) => (role.open = n)"
        @userIcon="(n) => (userIcon = n)"
      ></changeUserRoleHandler>
      <!-- end -->
    </div>
  </transition>

  <!-- side menu -->
  <div class="side_menu flex">
    <div class="items setting">
      <div class="inner">
        <div class="box" @click="role.open = true">
          <font-awesome-icon icon="fa-solid fa-gear" />
        </div>
      </div>
    </div>
    <div class="items user_edit">
      <div class="inner">
        <div class="box" @click="answer.open = true">
          <font-awesome-icon icon="fa-solid fa-user-pen" />
        </div>
      </div>
    </div>
  </div>
  <!-- end -->

  <answerHandler
    :show="answer.open"
    @close="(n) => (answer.open = n)"
    @agree="$router.replace('./')"
  >
    {{ answer.text }}
  </answerHandler>
</template>

<script>
import userNameBox from '@/../src/components/layout/userNameBox.vue';
import changeUserRoleHandler from '@/../src/components/global/changeUserRoleHandler.vue';
export default {
  data() {
    return {
      handler: {
        connected: null,
        time: 0,
      },
      answer: { open: false, text: '即將返回首頁, 確定?' },
      slide: {
        pageSum: 1,
        currentPage: 0,
        breakpoints: {
          400: {
            pageSum: 2,
          },
          1141: {
            pageSum: 1,
          },
        },
      },
      userName: null,
      userRoom: null,
      userIcon: null,
      gameRooms: [],
      gameRoomsData: null,
      unGameRooms: 0,
      lobbyPlayerList: null,
      isShowPage: false,
      chGameName: {
        game01: { name: '心靈同步', ppl: '2-4' },
        game02: { name: '21點', ppl: '2-4' },
        game03: { name: '黃牌', ppl: '2-4' },
      },
      role: {
        open: false,
        icon: null,
      },
    };
  },
  components: { userNameBox, changeUserRoleHandler },
  methods: {
    getRoomDetail(el, item = null) {
      if (item === null) return false;
      const data = this.$store.state.instructions[el];

      if (data === null || data === undefined) {
        if (item === 'name') return el;
        if (item === 'player') return 1;
      }

      if (data !== null || data != undefined) {
        if (item === 'name') return data.title.ch;
        if (item === 'player') return data.ppl;
      }
    },
    moveRoomPage(boolean = true) {
      if (boolean) {
        if (this.gameRoomsData.length <= this.slide.currentPage + 1) return;
        if (this.slide.currentPage < this.slide.pageSum - 1)
          this.slide.currentPage += 1;
      }
      if (!boolean) {
        if (this.slide.currentPage <= 0) return;
        this.slide.currentPage -= 1;
      }
    },
    sliceGameRoom() {
      let sum = this.gameRooms.length / this.slide.pageSum;
      if (sum <= 4) sum = 4;

      let y = [];

      for (let i = 0; i < this.gameRooms.length; i += sum) {
        y.push(this.gameRooms.slice(i, i + sum));
      }

      this.gameRoomsData = y;
    },
    getRoomUrl(name) {
      return new URL(`/src/image/game/${name}.svg`, import.meta.url).href;
    },
    joinRoom(roomId) {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (roomId) {
        this.socket.emit('join', {
          room: roomId,
          id: this.userName,
          icon: userData.icon,
        });
      } else {
        alert('未指定房間 ID');
      }
    },
    loadRoomData() {
      const that = this;

      this.$store.commit(
        'loopHandler',
        setInterval(() => {
          const result = doCheck();
          this.$store.commit('loopTimePlus');
          if (result) {
            this.$store.commit('loopHandlerDelete');

            // display particular room with "chGameName".
            this.gameRooms = this.state.gameRooms.gameList.filter((x, y) => {
              if (this.chGameName[x] != undefined) return x;
            });

            if (this.gameRooms.length <= 6) {
              const sum = 8 - this.gameRooms.length;
              for (let i = 0; i < sum; i++) {
                this.gameRooms.push('soon');
              }
            }

            this.sliceGameRoom();
            this.$store.commit('updateLoading', true);
          }

          if (this.$store.state.loopStore.tryTime >= 20) {
            this.$store.commit('loopHandlerDelete');
            this.$store.commit('clearUserRoom');
            this.state.connected = false;
          }
        }, 1000)
      );

      function doCheck() {
        // make sure backEnd data same as frontEnd.
        const userData = JSON.parse(localStorage.getItem('userData'));

        if (!that.state.gameRooms.state) {
          that.socket.emit('id_check', {
            id: userData.userName,
            room: userData.userRoom,
            icon: userData.icon,
          });
          return false;
        }

        if (that.state.gameRooms.state) {
          return true;
        }
      }
    },
    socketConnectCheck() {
      this.$store.commit(
        'loopHandler',
        setInterval(() => {
          this.$store.commit('loopTimePlus');
          if (this.state.connected) {
            this.$store.commit('loopHandlerDelete');
            this.loadRoomData();
          }

          if (
            !this.state.connected &
            (this.$store.state.loopStore.tryTime >= 10)
          ) {
            this.$store.commit('loopHandlerDelete');
          }
        }, 1000)
      );
    },
    onResize() {
      const width = window.innerWidth;
      const breakpoints = Object.keys(this.slide.breakpoints);
      let pageSum = 1;
      for (let i = 0; i < breakpoints.length; i++) {
        if (width <= breakpoints[i] && width <= breakpoints[i + 1]) {
          pageSum = this.slide.breakpoints[breakpoints[i]].pageSum;
        }

        if (width > breakpoints[breakpoints.length - 1]) {
          pageSum = this.slide.breakpoints[breakpoints[i]].pageSum;
          this.slide.currentPage = 0;
        }
      }

      this.slide.pageSum = pageSum;

      this.$nextTick(() => {
        this.sliceGameRoom();
      });
    },
  },
  watch: {
    'state.userStore.loading': {
      handler(el) {
        setTimeout(() => {
          this.isShowPage = el;
        }, 100);
      },
    },
    'state.goUrl': {
      handler(el) {
        if (el === null || el === 'lobby') return;
        // update user room before redirect.
        this.$store.commit('updateUserRoom', el.substring(el.indexOf('game')));
        this.$router.replace(el);
      },
      deep: true,
    },
    'state.lobbyPlayerList': {
      handler(el) {
        // Leave a player that room vlaue is null.
        this.lobbyPlayerList = Object.values(el).filter((vl) => {
          if (vl.room != null) return;
          return vl.user_id;
        });
      },
    },
    gameRooms(el) {
      this.unGameRooms = 6 - el.length;
    },
  },
  props: ['socket', 'state'],
  created() {
    const userStore = this.$store.state.userStore;

    if (userStore.userName != null) {
      this.userName = userStore.userName;
      this.userRoom =
        userStore.userRoom === undefined ? null : userStore.userRoom;
      this.userIcon = userStore.icon;
      this.onResize();
    } else {
      this.$router.replace('/');
    }
  },
  mounted() {
    this.$store.state.userStore.loading = false;
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    });
    this.socketConnectCheck();
  },

  beforeUnmount() {
    this.$store.commit('loopHandlerDelete');
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/lobby.scss';
</style>
