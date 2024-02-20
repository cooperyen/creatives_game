<template>
  <userNameBox :userName="userName">
    <p @click="$router.replace('/')">change ID</p>
  </userNameBox>
  <backGroundAnimate></backGroundAnimate>
  <!-- content -->
  <transition name="content-ready">
    <div class="lobby-container" v-show="$store.state.userStore.loading">
      <div class="room-container flex">
        <div class="room-box exist" v-for="i in gameRooms" :key="i">
          <div class="room-layout">
            <div class="room-content" @click="joinRoom(i)">
              <div class="content flex">
                <div class="title">
                  <p>{{ getRoomDetail(i, 'name') }}</p>
                </div>
                <div class="players">
                  <p>{{ getRoomDetail(i, 'player') }}人</p>
                </div>
              </div>
              <div class="img-box">
                <div class="bg"></div>
                <div class="right">
                  <img :src="getRoomUrl(`${i}`)" :alt="i" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="room-box" v-for="i in unGameRooms" :key="i">
          <div class="room-layout">
            <div class="room-content">
              <div class="content flex">
                <div class="soon">
                  <p>coming</p>
                  <p>soon</p>
                </div>
              </div>
              <div class="img-box" style="opacity: 0.4">
                <div class="bg"></div>
                <div class="right">
                  <img :src="getRoomUrl('default_game')" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Players who are not currently in the game or in the room -->
      <div id="user" class="container pd-side current-users-container">
        <div class="title">
          <p>當前玩家</p>
        </div>
        <div class="content">
          <div>
            <ul>
              <li v-for="i in lobbyPlayerList" :key="i">
                <span>{{ i.user_id }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import userNameBox from '@/../src/components/layout/userNameBox.vue';

export default {
  setup() {
    const spaceBetween = 0;

    const breakpoints = {
      399: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    };

    return {
      spaceBetween,
      breakpoints,
    };
  },
  data() {
    return {
      userName: null,
      userRoom: null,
      gameRooms: null,
      unGameRooms: 0,
      lobbyPlayerList: null,
      isShowPage: false,
      chGameName: {
        game01: { name: '心靈同步', ppl: '2-4' },
        game02: { name: '21點', ppl: '2-4' },
        game03: { name: '黃牌', ppl: '2-4' },
      },
    };
  },
  components: { userNameBox },
  methods: {
    getRoomDetail(el, item = null) {
      if (item === null) return false;
      const data = this.chGameName[el];

      if (data === null || data === undefined) {
        if (item === 'name') return el;
        if (item === 'player') return 1;
      }

      if (data !== null || data != undefined) {
        if (item === 'name') return data.name;
        if (item === 'player') return data.ppl;
      }
    },
    getRoomUrl(name) {
      return new URL(`/src/image/game/${name}.svg`, import.meta.url).href;
    },
    swipierInit() {
      const swiperEl = document.querySelector('swiper-container');
      const params = {
        // array with CSS styles
        injectStyles: [
          `
          :host{
              --swiper-theme-color: rgb(198, 190, 149);
          }
          `,
        ],

        // // array with CSS urls
        // injectStylesUrls: ['path/to/one.css', 'path/to/two.css'],
      };

      Object.assign(swiperEl, params);

      swiperEl.initialize();
    },
    loadRoomData() {
      if (this.userName === null) return;

      const that = this;

      this.$store.commit(
        'loadRoomLoop',
        setInterval(() => {
          const result = doCheck();
          this.$store.commit('connectedTimePlus');
          if (result) {
            this.$store.commit('loadRoomLoopDelete');

            // display particular room with "chGameName".
            this.gameRooms = this.state.gameRooms.gameList.filter((x, y) => {
              if (this.chGameName[x] != undefined) return x;
            });

            // setTimeout(() => {
            this.$store.commit('updateLoading', true);
            // }, 20);
          }

          // next run will return looby by "id_check" by backEnd after clearUserRoom;
          if (this.$store.state.loopStore.connectedTime >= 5)
            this.$store.commit('clearUserRoom');
        }, 1000)
      );

      function doCheck() {
        // make sure backEnd data same as frontEnd.
        const userData = JSON.parse(localStorage.getItem('userData'));

        if (!that.state.gameRooms.state)
          that.socket.emit('id_check', {
            id: userData.userName,
            room: userData.userRoom,
            icon: userData.icon,
          });

        if (!that.state.gameRooms.state) return false;
        if (that.state.gameRooms.state) return true;
      }
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
    socketConnectCheck() {
      const that = this;

      this.$store.commit(
        'socketConnect',
        setInterval(() => {
          const result = doCheck(this);
          if (result) this.$store.commit('socketDelete');
        }, 100)
      );

      function doCheck() {
        if (that.state.connected) {
          that.loadRoomData();
          return true;
        } else return false;
      }
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
        if (el === null) return;
        // update user room before redirect.
        this.$store.commit('updateUserRoom', el.substring(el.indexOf('game')));
        this.$router.replace(el);
      },
      deep: true,
    },
    'state.lobbyPlayerList': {
      handler(el) {
        console.log(el);
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
    this.userName = userStore.userName;
    this.userRoom =
      userStore.userRoom === undefined ? null : userStore.userRoom;
  },
  mounted() {
    // this.swipierInit();\
    this.$store.state.userStore.loading = false;
    // console.log(this.$store.state.userStore.loading);
    this.socketConnectCheck();
  },

  beforeMount() {
    // this.$store.commit('backGorund', 'default');
  },
};
</script>

<style lang="scss">
@import '@/scss/lobby.scss';
</style>
