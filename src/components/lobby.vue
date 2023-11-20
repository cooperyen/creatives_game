<template>
  <userNameBox :userName="userName">
    <p @click="$router.replace('/')">change ID</p>
  </userNameBox>

  <!-- content -->
  <transition name="content-ready">
    <div class="lobby-container" v-show="$store.state.userStore.loading">
      <div class="room-container flex">
        <!-- swiper game rooms -->
        <!-- <swiper-container
          init="false"
          :slides-per-view="1"
          :space-between="spaceBetween"
          pagination="ture"
          :breakpoints="breakpoints"
        >
          <swiper-slide class="room" v-for="i in gameRooms" :key="i">
            <div class="room-layout">
              <div class="room-content" @click="joinRoom(i)">
                <div class="img-box">
                  <img
                    :src="'./../../image/' + i + '.png'"
                    :alt="i"
                    loading="lazy"
                  />
                </div>
                <div class="content">
                  <div class="title">
                    <p>{{ chGameName[i] ? chGameName[i] : i }}</p>
                  </div>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper-container> -->

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
                <div class="bg">
                  <img :src="getRoomUrl(i)" :alt="i" loading="lazy" />
                </div>
                <div class="right">
                  <img :src="getRoomUrl(`${i}_icon`)" :alt="i" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- <div class="room-box exist" v-for="i in gameRooms" :key="i">
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
                <img :src="getRoomUrl(i)" :alt="i" loading="lazy" />
              </div>
            </div>
          </div>
        </div> -->

        <div class="room-box" v-for="i in unGameRooms" :key="i">
          <div class="room-layout">
            <div class="room-content">
              <div class="content flex">
                <div class="title">
                  <p>soon</p>
                </div>
              </div>
              <div class="img-box">
                <div class="bg" style="opacity: 0.4">
                  <img :src="getRoomUrl('unroom')" loading="lazy" />
                </div>
                <div class="right">
                  <img :src="getRoomUrl('unroom_icon')" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- current not in game or room players in lobby -->
      <div id="user" class="container pd-side current-users-container">
        <div class="title">
          <p>當前玩家</p>
        </div>
        <div class="content">
          <div>
            <ul>
              <li v-for="i in lobbyPlayerList" :key="i">
                {{ i.user_id }}
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
// Import Swiper styles
// import { register } from 'swiper/element/bundle';
// register();

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
      chGameName: {
        game01: { name: '心靈同步', ppl: '2-4' },
        game02: { name: '21點', ppl: '2-4' },
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
      return new URL(`/src/image/lobby/${name}.png`, import.meta.url).href;
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

            setTimeout(() => {
              this.$store.commit('updateLoading', true);
            }, 200);
          }

          // next run will return looby by "id_check" by backEnd after clearUserRoom;
          if (this.$store.state.loopStore.connectedTime >= 5)
            this.$store.commit('clearUserRoom');
        }, 2000)
      );

      function doCheck() {
        // make sure backEnd data same as frontEnd.
        const userData = JSON.parse(localStorage.getItem('userData'));
        that.socket.emit('id_check', {
          id: userData.userName,
          room: userData.userRoom,
        });

        if (that.state.gameRooms.state) return true;
        if (!that.state.gameRooms.state) return false;
      }
    },
    joinRoom(roomId) {
      if (roomId) {
        this.socket.emit('join', {
          room: roomId,
          id: this.userName,
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
        }, 1000)
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
        // Leave a player that room vlaue is null.
        this.lobbyPlayerList = Object.values(el).filter((vl) => {
          if (vl.room != null) return;
          return vl.user_id;
        });
      },
    },
    gameRooms(el) {
      this.unGameRooms = 8 - el.length;
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
    // this.swipierInit();
    this.socketConnectCheck();
  },

  beforeUnmount() {},
};
</script>

<style lang="scss">
@import '@/scss/lobby.scss';
</style>
