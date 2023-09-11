<template>
  <div class="user-container">
    <h2 id="userid" style="text-align: right">勇者 : {{ userName }}</h2>
  </div>
  <div id="buttons" class="container pd-side room-box flex">
    <div
      class="room"
      v-for="i in state.lobbyRooms"
      :key="i"
      @click="joinRoom(i)"
    >
      <div class="room-content">
        <div class="img-box">
          <img
            :src="'http://198.211.33.236:88/pic/' + i + '.jpg'"
            alt="{{ i }}"
          />
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
      <!-- <ul class="pd-side">
        {% for i in sid%}
        <li>{{ i }}</li>
        {% endfor %}
      </ul> -->
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
      gameRooms: '0',
    };
  },
  methods: {
    load() {
      if (this.userName === null) return;
      // this.socket.emit('id_check',{'id':this.userName,'room':XXX})
      this.socket.emit('lobby', this.userName);
      this.socket.emit('updatepage', {
        message: 'lobby',
        ownid: this.userName,
      });
    },
    joinRoom(roomId) {
      if (roomId) {
        console.log({
          room: roomId,
          id: this.userName,
        });

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
