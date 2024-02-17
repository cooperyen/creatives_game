<template>
  <userNameBox :userName="getUserName" class="name"></userNameBox>
  <!-- <h1>{{ this.playerMove.pickCard.length }}</h1>
  <h1>{{ this.gameData.questLength }}</h1>

  <h1>{{ gameData.tableCard }} {{ gameData.player }}</h1>
  <h1>{{ ownself }}</h1> -->
  <h1>{{ timer.time }}</h1>
  <h1>{{ playerMove.currentStep }}</h1>
  <h1>used {{ playerMove.usedOpen }}</h1>
  <h1>vote {{ playerMove.voteOpen }}</h1>
  <h1>drop {{ playerMove.dropOpen }}</h1>
  <hr />
  <section id="player_list">
    <div class="title">
      <p>黃牌</p>
    </div>
    <div class="items">
      <div v-for="i in gameData.yellowCard" :key="i" class="item">
        <p>{{ Object.keys(i)[0] }} : {{ Object.values(i)[0] }}</p>
      </div>
    </div>
  </section>

  <!-- vote -->
  <div id="vote" v-if="playerMove.currentStep === 'vote'">
    <div v-if="playerMove.voteOpen">
      <template v-for="(val, index) in gameData.tableCard" :key="index">
        <div
          class="item"
          :class="[playerMove.voteNumber === index ? 'check' : 'default']"
          @click="playerMove.voteNumber = index"
        >
          <p>{{ val }}</p>
        </div>
      </template>
      <div class="btn-box">
        <button
          class="btn"
          :class="{ selected: playerMove.voteNumber != null }"
          @click="vote()"
          :disabled="playerMove.voteNumber === null"
        >
          投票
        </button>
      </div>
    </div>
  </div>

  <!-- drop -->
  <div id="drop" v-if="playerMove.currentStep === 'drop'">
    <div v-if="playerMove.dropOpen">
      <div class="conetnt flex">
        <div
          class="card item"
          v-for="(val, index) in gameData.selfHand"
          :key="index"
        >
          <div
            class="option"
            @click="
              playerMove.pickCard.includes(val)
                ? pickDropCardRemove(val)
                : pickDropCard(val)
            "
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

      <div class="btn-box flex">
        <button class="btn" @click="drop()">
          棄牌{{ this.playerMove.pickCard }}
        </button>
        <button
          class="btn"
          @click="repickCard"
          :disabled="playerMove.pickCard.length === 0"
        >
          取消
        </button>
      </div>
    </div>
  </div>

  <!-- used -->
  <!-- hand card -->
  <handCardHandler
    :isShow="playerMove.currentStep"
    :isOpen="playerMove.usedOpen"
    :gameData="gameData"
    :playerMove="playerMove"
    @pickUsedCard="pickUsedCard"
    @pickUsedCardRemove="pickUsedCardRemove"
    @used="used"
    @rePickUsedCard="rePickUsedCard"
  ></handCardHandler>
  <!--
  <div id="hand-card" v-show="playerMove.currentStep === 'used'">
    <div v-if="playerMove.usedOpen">

      <div id="quest">
        <p>{{ gameData.quest }}</p>
      </div>

      <div class="conetnt flex">
        <div
          class="card item"
          v-for="(val, index) in gameData.selfHand"
          :key="index"
        >
          <div
            class="option"
            :class="{ selected: playerMove.pickCard.includes(val) }"
            @click="
              playerMove.pickCard.includes(val)
                ? pickUsedCardRemove(val)
                : pickUsedCard(val)
            "
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

      <div class="btn-box flex">
        <button
          class="btn"
          :class="{
            selected: playerMove.pickCard.length === gameData.questLength,
          }"
          @click="used"
          :disabled="playerMove.pickCard.length != gameData.questLength"
        >
          出牌
        </button>
        <button
          class="btn"
          @click="rePickUsedCard"
          :disabled="playerMove.pickCard.length === 0"
        >
          取消
        </button>
      </div>
    </div>
  </div>
-->

  <section id="await">
    <div
      class="await"
      v-if="!playerMove.voteOpen && playerMove.currentStep === 'vote'"
    >
      <div class="content" v-html="wait.quest"></div>
      <div class="text">
        <p>等待其他人出牌<span></span></p>
      </div>
    </div>
    <div
      class="await"
      v-else-if="!playerMove.usedOpen && playerMove.currentStep === 'used'"
    >
      等待其他人棄牌<span>...</span>
    </div>
    <div
      class="await"
      v-else-if="!playerMove.dropOpen && playerMove.currentStep === 'drop'"
    >
      <div class="text">
        <p>等待其他人投票<span></span></p>
      </div>
    </div>
  </section>

  <!-- new game await other player -->
  <div v-if="playerMove.currentStep === ''">
    <h1>newGameOpen</h1>
  </div>
</template>

<script>
import userNameBox from '@/../src/components/layout/userNameBox.vue';

import handCardHandler from '@/../src/components/yellowCard/handCardHandler.vue';

export default {
  data() {
    return {
      xxxx: null,
      gameRoom: null,
      ownself: null,
      timer: {
        countTimer: null,
        time: 15,
        default: 15,
      },
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
        yellowCard: [],
      },
      playerMove: {
        currentStep: null,
        voteNumber: null,
        pickCard: [],
        pickCardclickQueue: 0,
        sendUsed: false,
        voteOpen: false,
        dropOpen: false,
        usedOpen: false,
      },
      wait: {
        quest: null,
      },
    };
  },
  components: { userNameBox, handCardHandler },
  props: ['socket', 'state'],
  watch: {
    'state.yellowCard': {
      handler(el) {
        this.playerMove.usedOpen = false;
        this.playerMove.voteOpen = false;
        this.playerMove.dropOpen = false;

        if (el.message.action) this.gameDataLayout(el.message.action, el.page);
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
    currentStep() {
      const el = this.playerMove.currentStep;
      // console.log(this.timer.countTimer);

      switch (el) {
        case 'used':
          this.playerMove.usedOpen =
            this.gameData.tableCard.length <= this.gameData.player.length
              ? true
              : false;
          this.checkToCreatTimer(this.playerMove.usedOpen);
          break;

        case 'vote':
          this.playerMove.voteOpen =
            this.gameData.tableCard.length >= this.gameData.player.length
              ? true
              : false;
          this.checkToCreatTimer(this.playerMove.voteOpen);
          break;

        case 'drop':
          this.playerMove.dropOpen =
            this.gameData.vote.length >= this.gameData.player.length
              ? true
              : false;
          this.checkToCreatTimer(this.playerMove.dropOpen);
          break;
      }
    },
    checkToCreatTimer(el) {
      this.timer.countTimer === null && el ? this.creatTimer() : '';
    },
    drop() {
      this.socket.emit('yc', {
        id: this.getUserName,
        room: this.getUserRoom,
        drop: [this.gameData.selfHand[1]],
      });

      // this.playerMove.currentStep = 'used';
      this.playerMove.currentStep = '';
      this.playerMove.pickCard = [];
      this.cleanTimer();
    },
    vote() {
      this.socket.emit('yc', {
        id: this.getUserName,
        room: this.getUserRoom,
        vote: this.gameData.tableCard[this.playerMove.voteNumber],
      });
      this.playerMove.voteNumber = null;
      this.cleanTimer();
      // this.playerMove.currentStep = 'drop';
    },
    checkQuestLength(el) {
      return [...el.matchAll('{}')].length;
    },
    pickUsedCard(el) {
      let span,
        result = this.gameData.quest;

      if (this.playerMove.pickCard.length >= this.gameData.questLength) return;
      this.playerMove.pickCardclickQueue += 1;
      this.playerMove.pickCard.push(el);
      this.playerMove.pickCard.forEach((val) => {
        result = result.replace('__', `<span class="insert">${val}</span>`);
      });

      this.questInnerHTML(result);
    },
    pickUsedCardRemove(el) {
      let result = this.gameData.quest;

      this.playerMove.pickCardclickQueue -= 1;
      this.playerMove.pickCard.splice(this.playerMove.pickCard.indexOf(el), 1);

      this.playerMove.pickCard.forEach((val) => {
        result = result.replace('__', `<span class="insert">${val}</span>`);
      });

      this.questInnerHTML(result);
    },
    rePickUsedCard() {
      this.questInnerHTML(this.gameData.quest);
      this.repickCard();
    },
    questInnerHTML(el) {
      const target = document.getElementById('quest');
      target.innerHTML = el;
      this.wait.quest = target.innerHTML;
    },
    pickDropCard(el) {
      if (this.playerMove.pickCard.length >= 3) return;
      this.playerMove.pickCardclickQueue += 1;
      this.playerMove.pickCard.push(el);
    },
    pickDropCardRemove(el) {
      this.playerMove.pickCardclickQueue -= 1;
      this.playerMove.pickCard.splice(this.playerMove.pickCard.indexOf(el), 1);
    },
    repickCard() {
      this.playerMove.pickCard = [];
      this.playerMove.pickCardclickQueue = 0;
    },

    creatTimer() {
      this.timer.countTimer = setInterval(() => {
        this.timer.time -= 1;
        if (this.timer.time <= 0) {
          this.cleanTimer();
        }
      }, 1000);
    },
    cleanTimer() {
      this.timer.time = this.timer.default;
      clearInterval(this.timer.countTimer);
      this.timer.countTimer = null;
    },
    gameDataLayoutFirstLoad(el) {
      if (el === null || el === undefined) return;
      // console.log(el);
      let yellowCard = [];
      this.playerMove.currentStep = 'used';
      this.playerMove.usedOpen = true;
      this.gameData.hp = el.hp;
      this.gameData.quest = el.quest.replace(/{}/g, '__');
      this.gameData.questLength = this.checkQuestLength(el.quest);
      this.gameData.selfHand = el[this.getUserName].hand;
      el.player.forEach((name) => {
        yellowCard.push({ [name]: 0 });
      });
      this.gameData.yellowCard = yellowCard;
    },
    // receive each data from bkend after first in game.
    gameDataLayout(action = null, el) {
      // console.log('gameDataLayout', el);
      if (el === null || el === undefined) return;

      let yellowCard = [];
      this.gameData.tableCard = el['檯面上'];
      this.gameData.ownself = el['我的資訊'];
      this.gameData.quest = el['題目'].replace(/{}/g, '__');
      this.gameData.questLength = this.checkQuestLength(el['題目']);
      this.gameData.selfHand = this.gameData.ownself['手牌'];
      this.gameData.player = el['玩家列表'];
      this.gameData.vote = el['投票欄'];

      this.gameData.player.forEach((name) => {
        if (el[name]) yellowCard.push({ [name]: el[name]['黃牌'] });
      });
      yellowCard.push({ [this.getUserName]: el['我的資訊']['黃牌'] });

      this.gameData.yellowCard = yellowCard;

      switch (action) {
        case 'used':
          // check is play cards and go next.
          if (this.gameData.ownself['出牌'].length != 0)
            this.playerMove.currentStep = 'vote';
          break;
        case 'vote':
          if (this.gameData.ownself['投給'] != '')
            this.playerMove.currentStep = 'drop';
          break;
        case 'drop':
          if (
            this.gameData.tableCard.length === 0 &&
            this.gameData.vote.length === 0
          )
            this.playerMove.currentStep = 'used';
          break;
      }

      this.currentStep();
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
      this.repickCard();
      this.cleanTimer();
      // this.playerMove.currentStep = 'vote';
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

<style scoped>
@import '@/scss/yellowCard.scss';
</style>
