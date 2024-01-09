<template>
  <userNameBox :userName="getUserName" class="name"></userNameBox>
  <section id="player_list">
    <div class="title">
      <p>Players</p>
    </div>
    <div class="items">
      <div v-for="i in gameData.yellowCard" :key="i" class="item">
        <p>{{ Object.keys(i)[0] }}</p>
        <p>{{ Object.values(i)[0] }}</p>
      </div>
    </div>
  </section>

  <!-- hand card -->
  <handCardHandler
    :gameData="gameData"
    :playerMove="playerMove"
    :class="{ active: playerMove.usedOpen }"
    @pickUsedCard="pickUsedCard"
    @pickUsedCardRemove="pickUsedCardRemove"
    @used="used"
    @rePickUsedCard="rePickUsedCard"
  ></handCardHandler>

  <!-- vote -->
  <voteHandler
    :class="{ active: playerMove.voteOpen }"
    :gameData="gameData"
    :playerMove="playerMove"
    @vote="vote"
    @updateVoteNumber="updateVoteNumber"
  ></voteHandler>

  <!-- drop -->
  <dropHandler
    :gameData="gameData"
    :playerMove="playerMove"
    :class="{ active: playerMove.dropOpen }"
    @pickDropCardRemove="pickDropCardRemove"
    @pickDropCard="pickDropCard"
    @drop="drop"
    @repickCard="repickCard"
  ></dropHandler>

  <section id="await" v-if="isShowAwait(playerMove.currentStep)">
    <div class="await" :class="{ active: isShowAwait(playerMove.currentStep) }">
      <div
        v-if="playerMove.currentStep === 'vote'"
        class="content"
        v-html="wait.quest"
      ></div>

      <div class="text">
        <p v-if="playerMove.currentStep === 'vote'">
          等待其他人出牌<span></span>
        </p>

        <p v-if="playerMove.currentStep === 'drop'">
          等待其他人投票<span></span>
        </p>
      </div>
    </div>
  </section>

  <!-- new game await other player -->
  <div
    v-if="playerMove.currentStep === ''"
    :class="{ active: playerMove.currentStep === '' }"
  >
    <h1>新局即將開始</h1>
  </div>
</template>

<script>
import userNameBox from '@/../src/components/layout/userNameBox.vue';
import handCardHandler from '@/../src/components/yellowCard/handCardHandler.vue';
import voteHandler from '@/../src/components/yellowCard/voteHandler.vue';
import dropHandler from '@/../src/components/yellowCard/dropHandler.vue';

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
  components: { userNameBox, handCardHandler, voteHandler, dropHandler },
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
    isShowAwait(el) {
      let result = false;
      switch (el) {
        case 'vote':
          result = !this.playerMove.voteOpen ? true : false;
          break;
        case 'drop':
          result = !this.playerMove.dropOpen ? true : false;
          break;
      }

      return result;
    },
    currentStep() {
      const el = this.playerMove.currentStep;

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
      let leng = this.playerMove.pickCard.length;

      if (leng <= 0) alert('最少棄一張牌，最多3張牌');
      if (leng > 0 && leng <= 3) {
        this.socket.emit('yc', {
          id: this.getUserName,
          room: this.getUserRoom,
          drop: this.playerMove.pickCard,
        });
        this.playerMove.currentStep = '';
        this.playerMove.pickCard = [];
        this.cleanTimer();
      }
    },
    vote() {
      this.socket.emit('yc', {
        id: this.getUserName,
        room: this.getUserRoom,
        vote: this.gameData.tableCard[this.playerMove.voteNumber],
      });
      this.playerMove.voteNumber = null;
      this.cleanTimer();
    },
    updateVoteNumber(val) {
      this.playerMove.voteNumber = val;
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
      console.log(el);
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
      console.log('gameDataLayout', el);
      if (el === null || el === undefined) return;

      let yellowCard = [];
      console.log(el);
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
