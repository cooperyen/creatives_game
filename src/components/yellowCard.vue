<template>
  <h1>{{ this.playerMove.pickCard.length }}</h1>
  <h1>{{ this.gameData.questLength }}</h1>
  <userNameBox :userName="getUserName" class="name"></userNameBox>
  <!-- <h1>state.gameDataFirstLoad {{ state.gameDataFirstLoad }}</h1> -->
  <hr />
  <div id="vote">
    <div v-show="playerMove.currentStep === 'vote'">
      <template v-for="(val, index) in gameData.tableCard" :key="index">
        <div
          class="item"
          :class="{ check: playerMove.voteNumber === index }"
          @click="playerMove.voteNumber = index"
        >
          <p>{{ val }}</p>
          {{ playerMove.voteNumber }}
        </div>
      </template>
    </div>
    <div>
      <div v-show="playerMove.currentStep === 'vote'">
        <button @click="vote()" :disabled="playerMove.voteNumber === false">
          vote
        </button>
      </div>
      <div v-show="playerMove.currentStep === 'drop'">
        <button @click="drop()">drop</button>
      </div>
    </div>
  </div>
  <h1>{{ gameData.hp }}</h1>
  <h1 id="quest">{{ gameData.quest }}</h1>
  <div id="hand-card" v-show="playerMove.currentStep === 'used'">
    <div class="flex">
      <div
        class="card item"
        v-for="(val, index) in gameData.selfHand"
        :key="index"
      >
        <div
          class="option"
          @click="playerMove.pickCard.includes(val) ? '' : pickCard(val)"
        >
          {{ val }}
          <template
            v-for="(pickCard, cardIndex) in playerMove.pickCard"
            :key="cardIndex"
          >
            <div class="num" v-if="val === pickCard">
              {{ cardIndex + 1 }}
            </div>
          </template>
        </div>
      </div>
    </div>
    <button
      @click="used"
      :disabled="playerMove.pickCard.length != gameData.questLength"
    >
      出牌
    </button>
    <button @click="repickCard">re</button>
  </div>
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
        tableCard: [],
        ownself: [],
      },
      playerMove: {
        currentStep: null,
        voteNumber: false,
        pickCard: [],
        pickCardclickQueue: 0,
        sendUsed: false,
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
    drop() {
      this.socket.emit('yc', {
        id: this.getUserName,
        room: this.getUserRoom,
        drop: [
          this.gameData.selfHand[0],
          this.gameData.selfHand[1],
          this.gameData.selfHand[2],
        ],
      });

      this.playerMove.currentStep = 'used';
      this.playerMove.pickCard = [];
    },
    vote() {
      this.socket.emit('yc', {
        id: this.getUserName,
        room: this.getUserRoom,
        vote: this.gameData.tableCard[this.playerMove.voteNumber],
      });
      this.playerMove.currentStep = 'drop';
    },
    checkQuestLength(el) {
      return [...el.matchAll('{}')].length;
    },
    repickCard() {
      this.questInnerHTML(this.gameData.quest);
      this.playerMove.pickCard = [];
      this.playerMove.pickCardclickQueue = 0;
    },
    questInnerHTML(el) {
      const target = document.getElementById('quest');
      target.innerHTML = el;
    },
    pickCard(el) {
      console.log(el);
      let span,
        result = this.gameData.quest;

      if (this.playerMove.pickCard.length >= this.gameData.questLength) return;
      this.playerMove.pickCardclickQueue += 1;
      this.playerMove.pickCard.push(el);
      this.playerMove.pickCard.forEach((el) => {
        result = result.replace('__', `<span style="color:red;">${el}</span>`);
      });

      this.questInnerHTML(result);
    },
    gameDataLayoutFirstLoad(el) {
      if (el === null || el === undefined) return;
      this.playerMove.currentStep = 'used';
      this.gameData.hp = el.hp;
      this.gameData.quest = el.quest.replace(/{}/g, '__');
      this.gameData.questLength = this.checkQuestLength(el.quest);
      this.gameData.selfHand = el[this.getUserName].hand;
    },
    // receive each data from bkend after first in game.
    gameDataLayout(el) {
      console.log('gameDataLayout', el);
      if (el === null || el === undefined) return;
      this.gameData.tableCard = el['檯面上'];
      this.gameData.ownself = el['我的資訊'];
      this.gameData.quest = el['題目'].replace(/{}/g, '__');
      this.gameData.questLength = this.checkQuestLength(el['題目']);
      this.gameData.selfHand = this.gameData.ownself['手牌'];
    },
    updateUserRoom() {
      if (this.state.activeGameRoom != null)
        this.$store.commit('updateUserRoom', this.state.activeGameRoom);
    },
    used() {
      if (this.playerMove.pickCard.length != this.gameData.questLength) return;

      this.socket.emit('yc', {
        id: this.getUserName,
        room: this.getUserRoom,
        used: this.playerMove.pickCard,
      });
      this.playerMove.sendUsed = true;
      this.playerMove.currentStep = 'vote';
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
#vote {
  margin: 0 auto;
  width: 100%;
  max-width: 500px;
  // color: white;
  .item {
    padding: 5px 15px;
    background-color: white;
    margin-bottom: 5px;
    font-size: 1.2rem;
  }
  .check {
    background-color: green;
  }
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
      position: relative;

      .num {
        display: flex;
        width: 30px;
        height: 30px;
        background-color: rgb(70, 183, 106);
        border-radius: 100%;
        position: absolute;
        right: -5px;
        top: -5px;
        align-items: center;
        justify-content: center;
        line-height: 0;
      }
    }
  }
}
</style>
