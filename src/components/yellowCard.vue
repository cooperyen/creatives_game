<template>
  <userNameBox :userName="getUserName" class="name"></userNameBox>
  <h1>state.gameDataFirstLoad {{ state.gameDataFirstLoad }}</h1>
  <h1>{{ gameData.hp }}</h1>
  <h1>{{ gameData.quest }}</h1>
  <h1>{{ gameData.selfHand }}</h1>
  <button @click="used">出牌</button>
</template>

<script>
import userNameBox from '@/../src/components/layout/userNameBox.vue';
export default {
  data() {
    return {
      gameRoom: null,
      ownself: null,
      gameData: {
        selfHand: null,
        hp: [],
        player: null,
        quest: null,
        show: [],
        vote: [],
      },
    };
  },
  components: { userNameBox },
  props: ['socket', 'state'],
  watch: {
    'state.gameDataFirstLoad': {
      handler(el) {
        console.log(el);
      },
      deep: true,
    },
  },
  computed: {
    getUserName() {
      return this.$store.state.userStore.userName;
    },
    getUserRoom() {
      return this.$store.state.userStore.userRoom;
    },
  },
  created() {
    this.ownself = this.getUserName;
    this.gameRoom = this.getUserRoom;
  },
  methods: {
    gameDataLayout(el) {
      if (el === null || el === undefined) return;

      this.gameData.hp = el.hp;
      this.gameData.quest = el.quest;
      this.gameData.selfHand = el[this.getUserName].hand;
    },
    updateUserRoom() {
      if (this.state.activeGameRoom != null)
        this.$store.commit('updateUserRoom', this.state.activeGameRoom);
    },
    used() {
      console.log('object');
      const used = this.gameData.selfHand[0];
      this.socket.emit('yc', {
        id: this.getUserName,
        room: this.getUserRoom,
        used: [used],
      });
    },
  },
  mounted() {
    console.log(this.state.gameDataFirstLoad.page);
    this.gameDataLayout(this.state.gameDataFirstLoad.page);
    this.updateUserRoom();
    // this.socket.emit('id_check', {
    //   id: this.getUserName,
    //   room: this.getUserRoom,
    // });
    // this.$store.commit('updateUserRoom', this.gameRoom);
    // this.socket.emit('id_check', {
    //   id: this.$store.state.userStore.userName,
    //   room: this.$store.state.userStore.userRoom,
    // });
  },
};
</script>

<style scoped>
h1 {
  color: white;
}
</style>
