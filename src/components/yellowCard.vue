<template>
  <userNameBox :userName="getUserName" class="name"></userNameBox>
  <h1>state.gameDataFirstLoad {{ state.gameDataFirstLoad }}</h1>
  <hr />
  <h1>{{ gameData.hp }}</h1>
  <h1 id="quest">{{ gameData.quest }}</h1>
  <div id="hand-card">
    <div class="flex">
      <div
        class="card item"
        v-for="(val, index) in gameData.selfHand"
        :key="index"
      >
        <div
          class="option"
          @click="gameData.chooseCard.includes(val) ? '' : chooseCard(val)"
        >
          {{ val }}
          <!-- <div v-show="gameData.chooseCard[index]">{{ index }}</div> -->
        </div>
      </div>
    </div>
  </div>
  <!-- <button @click="chooseCard">選牌</button> -->
  <button @click="used">出牌</button>
  <button @click="reChooseCard">re</button>
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
        questLength: 0,
        show: [],
        vote: [],
        chooseCard: [],
      },
    };
  },
  components: { userNameBox },
  props: ['socket', 'state'],
  watch: {
    'state.yellowCard': {
      handler(el) {
        this.gameDataLayout(el);
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
    checkQuestLength(el) {
      return [...el.matchAll('{}')].length;
    },
    reChooseCard() {
      this.questInnerHTML(this.gameData.quest);
      this.gameData.chooseCard = [];
    },
    questInnerHTML(el) {
      const target = document.getElementById('quest');
      target.innerHTML = el;
    },
    chooseCard(el) {
      let span,
        result = this.gameData.quest;

      if (this.gameData.chooseCard.length >= this.gameData.questLength) return;
      this.gameData.chooseCard.push(el);
      this.gameData.chooseCard.forEach((el) => {
        result = result.replace('{}', `<span style="color:red;">${el}</span>`);
      });

      this.questInnerHTML(result);
    },
    gameDataLayoutFirstLoad(el) {
      if (el === null || el === undefined) return;
      console.log(el);
      this.gameData.hp = el.hp;
      this.gameData.quest = el.quest;
      this.gameData.questLength = this.checkQuestLength(el.quest);
      this.gameData.selfHand = el[this.getUserName].hand;
    },
    gameDataLayout(el) {
      if (el === null || el === undefined) return;
      console.log(el);
    },
    updateUserRoom() {
      if (this.state.activeGameRoom != null)
        this.$store.commit('updateUserRoom', this.state.activeGameRoom);
    },
    used() {
      const used = this.gameData.selfHand[0];
      this.socket.emit('yc', {
        id: this.getUserName,
        room: this.getUserRoom,
        used: this.gameData.chooseCard,
      });
    },
  },
  mounted() {
    if (
      this.state.gameDataFirstLoad === null ||
      this.state.gameDataFirstLoad === undefined
    )
      this.$router.replace('/lobby');

    if (
      this.state.gameDataFirstLoad != undefined &&
      this.state.gameDataFirstLoad != null
    ) {
      this.$store.commit('updateLoading', true);
      this.gameDataLayoutFirstLoad(this.state.gameDataFirstLoad.page);
    }

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

<style lang="scss" scoped>
h1 {
  color: white;
}
#hand-card {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  .flex {
    flex-wrap: wrap;
  }
  .card.item {
    text-align: center;

    // flex: 1 1 auto;
    width: 33%;
    .option {
      border-radius: 2px;
      padding: 10px 0;
      margin: 5px 5px;
      background-color: rgb(240, 188, 66);
    }
  }
}
</style>
