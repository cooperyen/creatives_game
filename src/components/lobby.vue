<template>
  <div class="user-container">
    <div class="content">
      <h2 id="userid" style="text-align: right">勇者 : {{ userName }}</h2>
    </div>
  </div>
  <div id="buttons" class="container pd-side room-box flex">
    <div
      class="room"
      v-for="i in state.gameRooms"
      :key="i"
      @click="joinRoom(i)"
    >
      <div class="room-content">
        <div class="img-box">
          <img :src="'./src/image/' + i + '.png'" :alt="i" />
        </div>
        <div class="content">
          <div class="title">
            <p>{{ i }}</p>
          </div>
        </div>
      </div>
    </div>
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
export default {
  data() {
    return {
      userName: null,
      userRoom: null,
      gameRooms: null,
      lobbyPlayerList: null,
    };
  },
  methods: {
    checkRoom() {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData.userRoom === null || userData.userRoom === undefined) return;
      if (userData.userRoom.indexOf('game') === -1) return;
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
        if (el === 'loby') return;
        this.$router.push(el);
      },
      // deep: true,
    },
    'state.lobbyPlayerList': {
      handler(el) {
        console.log('el', el);
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
