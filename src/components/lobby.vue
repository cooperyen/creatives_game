<template>
  <userNameBox :userName="userName">
    <router-link to="/">change ID</router-link>
  </userNameBox>
  <div class="container pd-side room-box">
    <swiper-container
      :slides-per-view="2"
      :space-between="25"
      :pagination="{
        hideOnClick: true,
      }"
      :breakpoints="{
        768: {
          slidesPerView: 3,
        },
        1200: {
          slidesPerView: 4,
        },
      }"
      @progress="onProgress"
      @slidechange="onSlideChange"
    >
      <swiper-slide
        class="room"
        v-for="i in state.gameRooms"
        :key="i"
        @click="joinRoom(i)"
      >
        <div class="room-layout">
          <div class="room-content">
            <div class="img-box">
              <img :src="'./../../image/' + i + '.png'" :alt="i" />
            </div>
            <div class="content">
              <div class="title">
                <p>{{ i }}</p>
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
</template>
<style lang="scss" scoped>
@import '@/scss/loby.scss';
</style>

<script>
import userNameBox from '@/../src/components/layout/userNameBox.vue';
import { register } from 'swiper/element/bundle';
register();
export default {
  setup() {
    const spaceBetween = 10;
    const onProgress = (e) => {
      const [swiper, progress] = e.detail;
    };

    const onSlideChange = (e) => {
      console.log('slide changed');
    };

    return {
      spaceBetween,
      onProgress,
      onSlideChange,
    };
  },
  data() {
    return {
      userName: null,
      userRoom: null,
      gameRooms: null,
      lobbyPlayerList: null,
    };
  },
  components: { userNameBox },
  methods: {
    // getImageUrl(name) {
    //   // const path = new URL(`@/image/`, import.meta.url).href;
    //   // return `${path}/${name}.png`;
    //   const path = `${name}.png`;
    //   return new URL(`@/image/${path}`, import.meta.url).href;
    // },
    checkRoom() {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData.userRoom === null || userData.userRoom === undefined) return;
      if (userData.userRoom.indexOf('mind') === -1) return;
      this.$store.commit('clearUserRoom');
    },
    load() {
      if (this.userName === null) return;
      this.socket.emit('id_check', { id: this.userName, room: this.userRooms });
      this.checkRoom();
    },
    joinRoom(roomId) {
      if (roomId) {
        this.socket.emit('join', {
          room: roomId,
          id: this.userName,
        });
        this.$store.commit('updateUserRoom', roomId);
      } else {
        alert('未指定房間 ID');
      }
    },
  },
  watch: {
    'state.goUrl': {
      handler(el) {
        if (el === null || el.indexOf('waiting_room') === -1) return;
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
  mounted() {
    this.load();
  },
};
</script>
