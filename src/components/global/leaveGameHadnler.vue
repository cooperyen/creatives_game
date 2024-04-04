<template>
  <div id="leave_game">
    <div class="text" @click="openHandler(true)">
      <font-awesome-icon icon="fa-regular fa-circle-left" />
    </div>
    <div class="bg" v-if="open">
      <div class="content">
        <answerHandler
          :show="open"
          @close="(n) => openHandler(n)"
          @agree="leaveGame()"
        >
          <p>離開後就無法返回當前遊戲, 你確定要離開?</p>
        </answerHandler>
      </div>
    </div>
  </div>
</template>

<script>
import answerBtn from './answerBtn.vue';
export default {
  components: { answerBtn },
  data() {
    return {
      open: false,
    };
  },
  props: ['socket', 'state', 'game'],
  watch: {},
  methods: {
    openHandler(el) {
      this.open = el;
      this.$emit('open', el);
    },
    leaveGame() {
      const data = {
        game: this.game,
        id: this.$store.state.userStore.userName,
        room: this.$store.state.userStore.userRoom,
        icon: this.$store.state.userStore.icon,
      };

      this.socket.emit('gamesLeave', data);
      this.$store.commit('clearUserRoom');
      this.$router.replace('/lobby');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/color.scss';
#leave_game {
  position: absolute;
  width: auto;
  left: 15px;
  z-index: 9999;
  .bg {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
    background-color: $bg_pevent;
    .content {
      height: 50px;
    }
  }
  .text {
    font-size: 1.5rem;
    cursor: pointer;
  }
}
</style>
