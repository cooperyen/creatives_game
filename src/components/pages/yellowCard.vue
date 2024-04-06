<template>
  <div id="yellowCard">
    <userNameBox :userName="userInfo.id" :userIcon="userInfo.icon" class="name">
      <leaveGameHadnler :socket="socket" game="yc"></leaveGameHadnler>
    </userNameBox>

    <popupAnnunce :show="annunceShow" @close="(n) => (annunceShow = n)"
      >至少選 1 個</popupAnnunce
    >

    <div v-show="playerMove.currentStep != 'end'">
      <div class="header">
        <div class="title">
          <p>Players</p>
        </div>
        <div class="items">
          <div v-for="i in gameData.yellowCard" :key="i" class="item flex">
            <div class="img_box">
              <img :src="$global_getImgUrl('apple', 'player_icon')" />
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
          <div class="img_box" :class="{ stop: !timer.show }">
            <font-awesome-icon icon="fa-solid fa-clock" />
          </div>
          <div class="number" :class="{ stop: !timer.show }">
            <template v-if="timer.show">{{ timer.time }}</template>
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

      <!-- game transitions -->
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
    </div>

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

<script setup>
import {
  ref,
  reactive,
  onBeforeMount,
  onMounted,
  watch,
  nextTick,
  onBeforeUnmount,
  computed,
} from 'vue';
import { useStore } from 'vuex';
import { router } from '@/../assets/router.js';
import userNameBox from '@/../src/components/layout/userNameBox.vue';
import handCardHandler from '@/../src/components/yellowCard/handCardHandler.vue';
import voteHandler from '@/../src/components/yellowCard/voteHandler.vue';
import dropHandler from '@/../src/components/yellowCard/dropHandler.vue';
import leaveGameHadnler from '@/../src/components/global/leaveGameHadnler.vue';
const props = defineProps(['socket', 'state']);
const store = useStore();

const userInfo = computed(() => {
  const res = {
    id: store.state.userStore.userName,
    room: store.state.userStore.userRoom,
    icon: store.state.userStore.icon,
  };
  return res;
});

const timer = reactive({
  countTimer: null,
  time: 60,
  long: 60,
  show: false,
  isWait: false,
  default: 60,
});
const gameData = reactive({
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
});
const playerMove = reactive({
  currentStep: null,
  voteNumber: null,
  pickCard: [],
  pickCardclickQueue: 0,
  sendUsed: false,
  voteOpen: false,
  dropOpen: false,
  usedOpen: false,
});
const wait = reactive({
  quest: null,
});
const gameFinal = ref(null);
const backToLobbyTimer = ref(null);
const annunceShow = ref(false);

onMounted(() => {
  updateUserRoom();

  if (
    props.state.gameDataFirstLoad === null ||
    props.state.gameDataFirstLoad === undefined
  )
    router.replace('/lobby');

  if (
    props.state.gameDataFirstLoad != undefined &&
    props.state.gameDataFirstLoad != null
  ) {
    gameDataLayoutFirstLoad(props.state.gameDataFirstLoad.page);
    setTimeout(() => {
      store.commit('updateLoading', true);
    }, 2000);
  }

  setTimeout(() => {
    props.socket.emit('id_check', {
      id: store.state.userStore.userName,
      room: store.state.userStore.userRoom,
      icon: store.state.userStore.icon,
    });
  }, 1000);
});

onBeforeUnmount(() => {
  store.commit('clearUserRoom');
  cleanTimer();
});

watch(
  () => props.state.goUrl,
  (cur) => {
    if (cur != null) router.replace(`/${cur}`);
  }
);

watch(
  () => props.state.yellowCard,
  (cur) => {
    playerMove.usedOpen = false;
    playerMove.voteOpen = false;
    playerMove.dropOpen = false;

    if (cur.action === 'in' || cur.action === 'game_update') {
      gameDataLayout(cur.message.action, cur.page);
    }
    if (
      cur.action === 'lose' ||
      cur.action === 'win' ||
      cur.action === 'end' ||
      cur.action === 'close'
    )
      setTimeout(() => {
        gameEnd(cur.action);
      }, 1000);
  }
);

// watch(
//   () => playerMove.currentStep,
//   (cur) => {
//     // check if is step statistic.
//     if (cur != 'statistic') return;
//     checkToCreatTimer();
//   }
// );

// receive each data from bkend after first in game.
function gameDataLayout(action = null, el) {
  if (el === null || el === undefined) return;

  if (el['玩家列表'].length <= 1)
    props.socket.emit('yc', {
      id: userInfo.value.id,
      room: userInfo.value.room,
      immediate: true,
    });

  if (el['玩家列表'].length > 1) {
    let yellowCard = [];
    gameData.tableCard = el['檯面上'];
    gameData.ownself = el['我的資訊'];
    gameData.quest = el['題目'].replace(/{}/g, '___');
    gameData.questLength = checkQuestLength(el['題目']);
    gameData.selfHand = gameData.ownself['手牌'];
    gameData.player = el['玩家列表'];
    gameData.vote = el['投票欄'];

    gameData.player.forEach((name) => {
      if (el[name]) yellowCard.push({ [name]: el[name]['黃牌'] });
    });
    yellowCard.push({ [userInfo.value.id]: el['我的資訊']['黃牌'] });

    gameData.yellowCard = yellowCard;

    switch (action) {
      case 'used':
        // check is play cards and go next.
        if (gameData.ownself['出牌'].length != 0)
          playerMove.currentStep = 'vote';
        break;
      case 'vote':
        if (gameData.ownself['投給'] != '') playerMove.currentStep = 'drop';
        break;
      case 'drop':
        if (gameData.tableCard.length === 0 && gameData.vote.length === 0)
          playerMove.currentStep = 'used';
        break;
    }

    currentStep();
  }
}
function gameEnd(el) {
  playerMove.currentStep = 'end';
  gameFinal.value = el;
  const res = cleanTimer();
  if (res)
    creatTimer(10, () => {
      router.replace('/lobby');
    });
}
function isShowAwait(el) {
  let result = false;
  switch (el) {
    case 'vote':
      result = !playerMove.voteOpen ? true : false;
      break;
    case 'drop':
      result = !playerMove.dropOpen ? true : false;
      break;
    case 'statistic':
      result = true;
  }

  timer.show = !result;
  return result;
}
function currentStep() {
  switch (playerMove.currentStep) {
    case 'used':
      playerMove.usedOpen =
        gameData.tableCard.length <= gameData.player.length ? true : false;
      checkToCreatTimer();

      break;

    case 'vote':
      playerMove.voteOpen =
        gameData.tableCard.length >= gameData.player.length ? true : false;

      checkToCreatTimer();
      break;

    case 'drop':
      playerMove.dropOpen =
        gameData.vote.length >= gameData.player.length ? true : false;
      checkToCreatTimer();
      break;
  }
}
function outCheck(el) {
  props.socket.emit('yc', {
    id: userInfo.value.id,
    room: userInfo.value.room,
    re_player: el,
  });
}

function checkToCreatTimer() {
  let time;
  const point = playerMove.currentStep;

  switch (point) {
    case 'used':
    case 'vote':
    case 'statistic':
      time = timer.long;
      break;
    default:
      time = timer.default;
      break;
  }

  if (!timer.show) cleanTimer();
  timer.countTimer === null
    ? creatTimer(time, () => {
        outCheck(point);
      })
    : false;
}
function creatTimer(countTime = timer.default, callback) {
  timer.time = countTime;
  timer.countTimer = setInterval(() => {
    timer.time -= 1;
    if (timer.time <= 0) {
      cleanTimer() ? callback() : '';
    }
  }, 1000);
}
function cleanTimer() {
  timer.time = 0;
  clearInterval(timer.countTimer);
  timer.countTimer = null;
  return true;
}
/**
 *  Check if the current time has expired.
 *  @return Boolean
 */
function timeOutCheck() {
  if (timer.time <= 0) {
    return true;
  }
}
function drop(auto = false) {
  if (timeOutCheck()) return;
  let leng = playerMove.pickCard.length;

  if (auto === false) {
    if (leng <= 0) annunceShow = true;
    if (leng > 0 && leng <= 3) {
      props.socket.emit('yc', {
        id: userInfo.value.id,
        room: userInfo.value.room,
        drop: playerMove.pickCard,
      });
      playerMove.currentStep = 'statistic';
      playerMove.pickCard = [];
      cleanTimer();
    }
  }

  if (auto === true) {
    props.socket.emit('yc', {
      id: userInfo.value.id,
      room: userInfo.value.room,
      drop: gameData.selfHand[0],
    });

    playerMove.currentStep = 'statistic';
    playerMove.pickCard = [];
    cleanTimer();
  }
}
function vote(auto = false) {
  if (timeOutCheck()) return;

  props.socket.emit('yc', {
    id: userInfo.value.id,
    room: userInfo.value.room,
    vote: auto
      ? gameData.tableCard[getRandom(0, gameData.tableCard.length)]
      : gameData.tableCard[playerMove.voteNumber],
  });
  playerMove.voteNumber = null;
  cleanTimer();

  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
function updateVoteNumber(val) {
  playerMove.voteNumber = val;
}
function checkQuestLength(el) {
  return [...el.matchAll('{}')].length;
}
function pickUsedCard(el) {
  if (timeOutCheck()) return;

  let result = gameData.quest;

  if (playerMove.pickCard.length >= gameData.questLength) return;
  playerMove.pickCardclickQueue += 1;
  playerMove.pickCard.push(el);
  playerMove.pickCard.forEach((val) => {
    result = result.replace('___', `<span class="insert">${val}</span>`);
  });

  questInnerHTML(`<p>${result}</p>`);
}
function pickUsedCardRemove(el) {
  if (timeOutCheck()) return;

  let result = gameData.quest;

  playerMove.pickCardclickQueue -= 1;
  playerMove.pickCard.splice(playerMove.pickCard.indexOf(el), 1);

  playerMove.pickCard.forEach((val) => {
    result = result.replace('___', `<span class="insert">${val}</span>`);
  });

  questInnerHTML(`<p>${result}</p>`);
}
function rePickUsedCard() {
  if (timeOutCheck()) return;

  questInnerHTML(gameData.quest);
  repickCard();
}
function questInnerHTML(el) {
  const target = document.getElementById('quest');
  target.innerHTML = el;
  wait.quest = target.innerHTML;
}
function pickDropCard(el) {
  if (timeOutCheck()) return;

  if (playerMove.pickCard.length >= 3) return;
  playerMove.pickCardclickQueue += 1;
  playerMove.pickCard.push(el);
}
function pickDropCardRemove(el) {
  if (timeOutCheck()) return;

  playerMove.pickCardclickQueue -= 1;
  playerMove.pickCard.splice(playerMove.pickCard.indexOf(el), 1);
}
function repickCard() {
  if (timeOutCheck()) return;
  playerMove.pickCard = [];
  playerMove.pickCardclickQueue = 0;
}

function gameDataLayoutFirstLoad(el) {
  if (el === null || el === undefined) return;
  let yellowCard = [];
  playerMove.currentStep = 'used';
  playerMove.usedOpen = true;
  gameData.hp = el.hp;
  gameData.quest = el.quest.replace(/{}/g, '___');
  gameData.questLength = checkQuestLength(el.quest);
  gameData.selfHand = el[userInfo.value.id].hand;
  el.player.forEach((name) => {
    yellowCard.push({ [name]: 0 });
  });

  gameData.player = el.player;
  gameData.icon = el.icon;
  gameData.yellowCard = yellowCard;
  checkToCreatTimer('used');
}

function used(auto = false) {
  if (timeOutCheck()) return;
  if (!auto) {
    if (playerMove.pickCard.length != gameData.questLength) return;

    props.socket.emit('yc', {
      id: userInfo.value.id,
      room: userInfo.value.room,
      used: playerMove.pickCard,
    });
  }

  if (auto) {
    let autoPick = [];
    for (let i = 0; i < gameData.questLength; i++) {
      autoPick.push(gameData.selfHand[i]);
    }

    props.socket.emit('yc', {
      id: userInfo.value.id,
      room: userInfo.value.room,
      used: autoPick,
    });
  }

  playerMove.sendUsed = true;
  repickCard();
  cleanTimer();
}

/**
 *  update user room
 */
function updateUserRoom() {
  if (props.state.activeGameRoom != null)
    store.commit('updateUserRoom', props.state.activeGameRoom);
}
</script>

<style scoped>
@import '@/scss/yellowCard.scss';
</style>
