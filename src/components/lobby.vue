<template>
  <userNameBox :userName="userName">
    <p @click="$router.replace('/')">change ID</p>
  </userNameBox>

  <!-- <button @click="$emit('loadingLoop', true)">123</button> -->

  <transition name="content-ready">
    <div v-show="showPage">
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
  <div class="connected" v-show="connectedTime != 0">
    <div>connecting : {{ connectedTime }}</div>
  </div>
</template>

<script>
import userNameBox from '@/../src/components/layout/userNameBox.vue';
import { register } from 'swiper/element/bundle';
// Import Swiper styles

register();

export default {
  emits: ['loadingLoop'],
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
      connectedTime: 0,
      userName: null,
      userRoom: null,
      gameRooms: null,
      lobbyPlayerList: null,
      showPage: false,
      chGameName: { game01: '心靈同步', game02: '21點' },
    };
  },
  components: { userNameBox },
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

      const state =
        userData.userRoom === null || userData.userRoom === undefined;

      if (state) this.doIdCheck();
    },
    load() {
      if (this.userName === null) return;
      this.$store.commit('clearUserRoom');

      const conetectLoop = setInterval(() => {
        const result = doCheck(this);
        this.connectedTime += 1;
        if (result) {
          this.connectedTime = 0;
          clearInterval(conetectLoop);
          this.gameRooms = this.state.gameRooms.gameList;
          this.$store.state.userStore.loading = true;
          setTimeout(() => {
            this.showPage = true;
          }, 500);
        }
      }, 2000);

      function doCheck(el) {
        // make sure backEnd data same as frontEnd.
        el.checkRoom();

        if (el.state.gameRooms.state) return true;
        if (!el.state.gameRooms.state) return false;
      }
    },
    joinRoom(roomId) {
      if (roomId) {
        // this.$emit('loadingLoop', true);
        this.socket.emit('join', {
          room: roomId,
          id: this.userName,
        });
      } else {
        alert('未指定房間 ID');
      }
    },
  },
  watch: {
    'state.goUrl': {
      handler(el) {
        if (el === null || el.indexOf('waiting_room') === -1) return;
        this.$store.commit('updateUserRoom', el.substring(el.indexOf('game')));
        this.$router.push(el);
      },
      // deep: true,
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
  beforeMount() {
    // this.checkRoom();
    // if (this.state.connected === true) this.load();
  },
  mounted() {
    this.swipierInit();

    const conetectLoop = setInterval(() => {
      const result = doCheck(this);
      if (result) clearInterval(conetectLoop);
    }, 500);

    function doCheck(el) {
      if (el.state.connected) {
        el.load();
        return true;
      } else return false;
    }
  },

  beforeUnmount() {
    this.$store.state.userStore.loading = false;
    this.showPage = false;
  },
};
</script>

<style lang="scss">
@import '@/scss/loby.scss';
</style>
