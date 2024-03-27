<template>
  <div id="yellowCard">
    <leaveGameHadnler></leaveGameHadnler>
    <userNameBox
      :userName="getUserName"
      :userIcon="getUserIcon"
      class="name"
    ></userNameBox>

    <template v-if="playerMove.currentStep != 'end'">
      <div class="header">
        <div class="title">
          <p>Players</p>
        </div>
        <div class="items">
          <div v-for="i in gameData.yellowCard" :key="i" class="item flex">
            <div class="img_box">
              <img
                :src="
                  $global_getImgUrl(
                    gameData.icon[Object.keys(i)[0]]['icon'],
                    'player_icon'
                  )
                "
              />
            </div>
            <div class="text">
              <p>
                {{ Object.keys(i)[0] }} /
                <span :class="{ light: Object.values(i)[0] >= 1 }">{{
                  Object.values(i)[0] < 10
                    ? '0' + Object.values(i)[0]
                    : Object.values(i)[0]
                }}</span>
              </p>
            </div>
          </div>
        </div>
        <div class="timer flex" v-if="playerMove.currentStep != 'end'">
          <div class="img_box" :class="{ stop: !this.timer.show }">
            <font-awesome-icon icon="fa-solid fa-clock" />
          </div>
          <div class="number" :class="{ stop: !this.timer.show }">
            <template v-if="this.timer.show">{{ this.timer.time }}</template>
            <template v-else>0</template>
          </div>
        </div>
      </div>

      <!-- hand card -->
      <div>
        <handCardHandler
          :gameData="gameData"
          :playerMove="playerMove"
          :class="{ active: playerMove.usedOpen }"
          @pickUsedCard="pickUsedCard"
          @pickUsedCardRemove="pickUsedCardRemove"
          @used="used"
          @rePickUsedCard="rePickUsedCard"
        ></handCardHandler>
      </div>

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

      <div id="await" v-if="isShowAwait(playerMove.currentStep)">
        <div
          class="await"
          :class="{ active: isShowAwait(playerMove.currentStep) }"
        >
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
      </div>

      <!-- new game await other player -->
      <div
        v-if="playerMove.currentStep === 'statistic'"
        :class="{ active: playerMove.currentStep === 'statistic' }"
      >
        <h1>回合計算中</h1>
      </div>
    </template>

    <div
      v-if="playerMove.currentStep === 'end'"
      :class="{ active: playerMove.currentStep === 'end' }"
      id="end_game"
    >
      <div class="container">
        <div class="title">{{ gameFinal.toUpperCase() }} GAME</div>
        <div class="result">
          <h2>{{ gameData.endGameSentence[gameFinal] }}</h2>
        </div>

        <div>
          <router-link to="/lobby" replace>Leave</router-link>
          <p>
            leave the game in <span>{{ timer.time }}</span> seconds
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userNameBox from '@/../src/components/layout/userNameBox.vue';
import handCardHandler from '@/../src/components/yellowCard/handCardHandler.vue';
import voteHandler from '@/../src/components/yellowCard/voteHandler.vue';
import dropHandler from '@/../src/components/yellowCard/dropHandler.vue';
import leaveGameHadnler from '@/../src/components/global/leaveGameHadnler.vue';

export default {
  data() {
    return {
      gameRoom: null,
      ownself: null,
      timer: {
        countTimer: null,
        time: 60,
        long: 60,
        show: false,
        isWait: false,
        default: 60,
      },
      gameData: {
        endGameSentence: {
          end: 'The game exceed response time',
          win: 'You WIN!',
          lose: 'You LOSE',
          close: 'The number of players in the game is less than 2',
          re: '',
        },
        selfHand: null,
        hp: [],
        icon: [],
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
      gameFinal: null,
      backToLobbyTimer: null,
    };
  },
  components: {
    userNameBox,
    handCardHandler,
    voteHandler,
    dropHandler,
    leaveGameHadnler,
  },
  props: ['socket', 'state'],
  watch: {
    'state.yellowCard': {
      handler(el) {
        this.playerMove.usedOpen = false;
        this.playerMove.voteOpen = false;
        this.playerMove.dropOpen = false;

        if (el.action === 'in' || el.action === 'game_update') {
          this.gameDataLayout(el.message.action, el.page);
        }
        if (
          el.action === 'lose' ||
          el.action === 'win' ||
          el.action === 'end' ||
          el.action === 'close'
        )
          setTimeout(() => {
            this.gameEnd(el.action);
          }, 1000);
      },
      deep: true,
    },
    gameFinal: {
      handler(el) {
        const x = this.cleanTimer();
        if (x)
          this.creatTimer(10, () => {
            this.$router.replace('/lobby');
          });
      },
      deep: true,
    },
    'playerMove.currentStep': {
      handler(el) {
        // check if is step statistic.
        if (el != 'statistic') return;
        this.checkToCreatTimer();
      },
    },
  },
  computed: {
    getUserName() {
      return this.$store.state.userStore.userName;
    },
    getUserIcon() {
      return this.$store.state.userStore.icon;
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
    // receive each data from bkend after first in game.
    gameDataLayout(action = null, el) {
      if (el === null || el === undefined) return;

      if (el['玩家列表'].length <= 1)
        this.socket.emit('yc', {
          id: this.getUserName,
          room: this.getUserRoom,
          immediate: true,
        });

      if (el['玩家列表'].length > 1) {
        let yellowCard = [];
        this.gameData.tableCard = el['檯面上'];
        this.gameData.ownself = el['我的資訊'];
        this.gameData.quest = el['題目'].replace(/{}/g, '___');
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
      }
    },
    gameEnd(el) {
      this.playerMove.currentStep = 'end';
      this.gameFinal = el;
    },
    isShowStatistic() {
      return;
    },
    isShowAwait(el) {
      let result = false;
      switch (el) {
        case 'vote':
          result = !this.playerMove.voteOpen ? true : false;
          break;
        case 'drop':
          result = !this.playerMove.dropOpen ? true : false;
          break;
        case 'statistic':
          result = true;
      }

      this.timer.show = !result;
      return result;
    },
    currentStep() {
      switch (this.playerMove.currentStep) {
        case 'used':
          this.playerMove.usedOpen =
            this.gameData.tableCard.length <= this.gameData.player.length
              ? true
              : false;
          this.checkToCreatTimer();

          break;

        case 'vote':
          this.playerMove.voteOpen =
            this.gameData.tableCard.length >= this.gameData.player.length
              ? true
              : false;

          this.checkToCreatTimer();
          break;

        case 'drop':
          this.playerMove.dropOpen =
            this.gameData.vote.length >= this.gameData.player.length
              ? true
              : false;
          this.checkToCreatTimer();
          break;
      }
    },
    outCheck(el) {
      this.socket.emit('yc', {
        id: this.getUserName,
        room: this.getUserRoom,
        re_player: el,
      });
    },

    checkToCreatTimer() {
      let timer;
      const point = this.playerMove.currentStep;

      switch (point) {
        case 'used':
        case 'vote':
        case 'statistic':
          timer = this.timer.long;
          break;
        default:
          timer = this.timer.default;
          break;
      }

      if (!this.timer.show) this.cleanTimer();
      this.timer.countTimer === null
        ? this.creatTimer(timer, () => {
            this.outCheck(point);
          })
        : false;
    },
    creatTimer(countTime = this.timer.default, callback) {
      this.timer.time = countTime;
      this.timer.countTimer = setInterval(() => {
        this.timer.time -= 1;
        if (this.timer.time <= 0) {
          this.cleanTimer() ? callback() : '';
        }
      }, 1000);
    },
    cleanTimer() {
      this.timer.time = 0;
      clearInterval(this.timer.countTimer);
      this.timer.countTimer = null;
      return true;
    },
    /**
     *  Check if the current time has expired.
     *  @return Boolean
     */
    timeOutCheck() {
      if (this.timer.time <= 0) {
        return true;
      }
    },
    drop(auto = false) {
      if (this.timeOutCheck()) return;

      let leng = this.playerMove.pickCard.length;

      if (auto === false) {
        if (leng <= 0) alert('最少棄一張牌，最多3張牌');
        if (leng > 0 && leng <= 3) {
          this.socket.emit('yc', {
            id: this.getUserName,
            room: this.getUserRoom,
            drop: this.playerMove.pickCard,
          });
        }
      }

      if (auto === true) {
        this.socket.emit('yc', {
          id: this.getUserName,
          room: this.getUserRoom,
          drop: this.gameData.selfHand[0],
        });
      }

      this.playerMove.currentStep = 'statistic';
      this.playerMove.pickCard = [];
      this.cleanTimer();
    },
    vote(auto = false) {
      if (this.timeOutCheck()) return;

      this.socket.emit('yc', {
        id: this.getUserName,
        room: this.getUserRoom,
        vote: auto
          ? this.gameData.tableCard[
              getRandom(0, this.gameData.tableCard.length)
            ]
          : this.gameData.tableCard[this.playerMove.voteNumber],
      });
      this.playerMove.voteNumber = null;
      this.cleanTimer();

      function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
    },
    updateVoteNumber(val) {
      this.playerMove.voteNumber = val;
    },
    checkQuestLength(el) {
      return [...el.matchAll('{}')].length;
    },
    pickUsedCard(el) {
      if (this.timeOutCheck()) return;

      let span,
        result = this.gameData.quest;

      if (this.playerMove.pickCard.length >= this.gameData.questLength) return;
      this.playerMove.pickCardclickQueue += 1;
      this.playerMove.pickCard.push(el);
      this.playerMove.pickCard.forEach((val) => {
        result = result.replace('___', `<span class="insert">${val}</span>`);
      });

      this.questInnerHTML(`<p>${result}</p>`);
    },
    pickUsedCardRemove(el) {
      if (this.timeOutCheck()) return;

      let result = this.gameData.quest;

      this.playerMove.pickCardclickQueue -= 1;
      this.playerMove.pickCard.splice(this.playerMove.pickCard.indexOf(el), 1);

      this.playerMove.pickCard.forEach((val) => {
        result = result.replace('___', `<span class="insert">${val}</span>`);
      });

      this.questInnerHTML(`<p>${result}</p>`);
    },
    rePickUsedCard() {
      if (this.timeOutCheck()) return;

      this.questInnerHTML(this.gameData.quest);
      this.repickCard();
    },
    questInnerHTML(el) {
      const target = document.getElementById('quest');
      target.innerHTML = el;
      this.wait.quest = target.innerHTML;
    },
    pickDropCard(el) {
      if (this.timeOutCheck()) return;

      if (this.playerMove.pickCard.length >= 3) return;
      this.playerMove.pickCardclickQueue += 1;
      this.playerMove.pickCard.push(el);
    },
    pickDropCardRemove(el) {
      if (this.timeOutCheck()) return;

      this.playerMove.pickCardclickQueue -= 1;
      this.playerMove.pickCard.splice(this.playerMove.pickCard.indexOf(el), 1);
    },
    repickCard() {
      if (this.timeOutCheck()) return;
      this.playerMove.pickCard = [];
      this.playerMove.pickCardclickQueue = 0;
    },

    gameDataLayoutFirstLoad(el) {
      if (el === null || el === undefined) return;
      let yellowCard = [];
      this.playerMove.currentStep = 'used';
      this.playerMove.usedOpen = true;
      this.gameData.hp = el.hp;
      this.gameData.quest = el.quest.replace(/{}/g, '___');
      this.gameData.questLength = this.checkQuestLength(el.quest);
      this.gameData.selfHand = el[this.getUserName].hand;
      el.player.forEach((name) => {
        yellowCard.push({ [name]: 0 });
      });

      this.gameData.player = el.player;
      this.gameData.icon = el.icon;
      this.gameData.yellowCard = yellowCard;
      this.checkToCreatTimer('used');
    },

    updateUserRoom() {
      if (this.state.activeGameRoom != null)
        this.$store.commit('updateUserRoom', this.state.activeGameRoom);
    },
    used(auto = false) {
      if (this.timeOutCheck()) return;
      if (!auto) {
        if (this.playerMove.pickCard.length != this.gameData.questLength)
          return;

        this.socket.emit('yc', {
          id: this.getUserName,
          room: this.getUserRoom,
          used: this.playerMove.pickCard,
        });
      }

      if (auto) {
        let autoPick = [];
        for (let i = 0; i < this.gameData.questLength; i++) {
          autoPick.push(this.gameData.selfHand[i]);
        }

        this.socket.emit('yc', {
          id: this.getUserName,
          room: this.getUserRoom,
          used: autoPick,
        });
      }

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
  beforeMount() {
    // this.$store.commit('backGorund', 'yellowCard');
  },
  beforeUnmount() {
    this.$store.commit('clearUserRoom');
    this.cleanTimer();
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
