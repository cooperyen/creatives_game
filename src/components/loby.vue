<template>
  <div class="user-container">
    <h2 id="userid" style="text-align: right">勇者 : {{ state.userName }}</h2>
  </div>
  <div id="buttons" class="container pd-side room-box flex">
    <div class="room" v-for="i in state.lobbyRooms" :key="i">
      {{ i }}
      <div class="img-box">
        <img
          :src="'http://198.211.33.236:88/pic/' + i + '.jpg'"
          alt="{{ i }}"
        />
      </div>
      <div class="content flex">
        <div class="title flex">
          <p>room : {{ i }}</p>
        </div>
        <div class="room-btn">
          <button onclick="joinRoom('{{ i }}')">加入遊戲</button>
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
      userName: '',
      gameRooms: '0',
    };
  },
  methods: {},
  props: ['socket', 'state'],
  mounted() {
    this.socket.emit('lobby');
    this.socket.emit('updatepage', { message: 'lobby', ownid: '123' });
  },
};
</script>
