<template>
  <userNameBox :userName="userName">
    <p @click="$router.replace('/')">change ID</p>
  </userNameBox>

  <!-- content -->
  <transition name="content-ready">
    <div v-show="$store.state.userStore.loading">
      <!-- swiper game rooms -->
      <div class="container pd-side room-box">
        <swiper-container
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
        </swiper-container>
      </div>

      <!-- current players in lobby -->
      <div id="user" class="container pd-side current-users">
        <div class="content">
          <div class="title">
            <p>當前玩家</p>
          </div>
          <div>
            <ul>
              <li v-for="i in lobbyPlayerList" :key="i">
                {{ i }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <transferPageCountDown></transferPageCountDown>
</template>

<script>
import transferPageCountDown from '@/../src/ui/transferPageCountDown.vue';
import userNameBox from '@/../src/components/layout/userNameBox.vue';
import { register } from 'swiper/element/bundle';
// Import Swiper styles

register();

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
      conetectLoop: null,
      loadLoop: null,
      connectedTime: 0,
      userName: null,
      userRoom: null,
      gameRooms: null,
      lobbyPlayerList: null,
      chGameName: { game01: '心靈同步', game02: '21點' },
    };
  },
  components: { userNameBox, transferPageCountDown },
  methods: {
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
    doIdCheck() {
      this.socket.emit('id_check', {
        id: this.userName,
        room: this.userRooms,
      });
    },
    checkRoom() {
      const userData = JSON.parse(localStorage.getItem('userData'));
      // if (userData.userRoom != null && userData.userRoom.indexOf('game') != -1)
      //   this.$store.commit('clearUserRoom');
      // const state = userData.userRoom === null ? true : false;
      // console.log(state);
      // if (state) this.doIdCheck();
      this.socket.emit('id_check', {
        id: userData.userName,
        room: userData.userRoom,
      });
    },
    load() {
      if (this.userName === null) return;

      const that = this;

      this.loadLoop = setInterval(() => {
        const result = doCheck();
        this.$store.commit('connectedTimePlus');
        this.$store.state.userStore.connectedTime += 1;
        if (result) {
          this.$store.state.userStore.connectedTime = 0;
          clearInterval(this.loadLoop);
          this.gameRooms = this.state.gameRooms.gameList.filter((x, y) => {
            if (this.chGameName[x] != undefined) return x;
          });
          setTimeout(() => {
            this.$store.state.userStore.loading = true;
          }, 500);
        }
        if (this.$store.state.userStore.connectedTime >= 5) {
          this.$store.commit('clearUserRoom');
        }
      }, 2000);

      function doCheck() {
        // make sure backEnd data same as frontEnd.
        that.checkRoom();

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
    loadCheck() {
      const that = this;
      this.conetectLoop = setInterval(() => {
        const result = doCheck(this);
        if (result) clearInterval(this.conetectLoop);
      }, 1000);

      function doCheck() {
        if (that.state.connected) {
          that.load();
          return true;
        } else return false;
      }
    },
  },
  watch: {
    'state.goUrl': {
      handler(el) {
        if (el === null) return;
        this.$store.commit('updateUserRoom', el.substring(el.indexOf('game')));
        this.$router.replace(el);
      },
      deep: true,
    },
    'state.lobbyPlayerList': {
      handler(el) {
        this.lobbyPlayerList = Object.values(el).map((vl) => {
          if (vl.room != null) return;
          return vl.user_id;
        });
      },
    },
  },
  props: ['socket', 'state'],
  created() {
    const userStore = this.$store.state.userStore;
    this.userName = userStore.userName;
    this.userRoom =
      userStore.userRoom === undefined ? null : userStore.userRoom;
  },
  beforeMount() {},
  mounted() {
    this.swipierInit();
    this.loadCheck();
  },

  beforeUnmount() {
    clearInterval(this.conetectLoop);
    clearInterval(this.loadLoop);
    this.$store.state.userStore.loading = false;
  },
};
</script>

<style lang="scss">
@import '@/scss/loby.scss';
</style>
