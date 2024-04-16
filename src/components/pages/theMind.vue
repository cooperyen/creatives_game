<template>
  <!-- game content -->
  <div v-show="!nextRound" class="game-container_">
    <div class="game_container">
      <div id="in_play">
        <div class="level">
          <p>
            Level:<span
              >{{ gameStateHandler.level }}/{{ gameStateHandler.end }}</span
            >
          </p>
        </div>
      </div>

      <!-- game -->
      <div v-show="!leaveGameOpen">
        <!-- current card tent -->
        <div class="dsdsa">
          <div class="current-card">
            <div class="title">
              <p>檯面上的牌</p>
            </div>
            <div class="flex">
              <div
                class="card-box card-style"
                v-for="i in cardsPlayed"
                :key="i"
              >
                <div class="card-bg">
                  <img src="./../../image/card/01.svg" />
                </div>
                <div class="card-num">
                  <p>
                    <span>{{ i }}</span>
                  </p>
                </div>
              </div>
              <div
                class="card-box card-style wait"
                v-for="i in 5 - cardsPlayed.length"
                :key="i"
              >
                <div class="card-bg">
                  <img src="./../../image/card/01.svg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- hand card content -->
        <div id="hand-card" v-show="!isLeaveGameWindowOpen">
          <div class="card-container">
            <div class="card-box card-style" v-for="i in handCard" :key="i">
              <div class="card-num">
                <p :class="{ large: String(i).length >= 3 }">
                  <span>{{ i }}</span>
                </p>
              </div>
              <div class="card-bg">
                <img src="./../../image/card/01.svg" />
              </div>
            </div>
          </div>

          <!-- play move -->
          <div class="card-play" v-if="!drawVote.state">
            <div class="click-btn">
              <button
                @click="playCard()"
                :class="{ disabled: handCard.length === 0 }"
                :disabled="handCard.length === 0"
              >
                <template v-if="handCard.length != 0">
                  {{ lastPlayerTheRound() ? '就是我了' : '應該輪到我?' }}
                </template>
                <template v-else>
                  {{ lastPlayerTheRound() ? '已無手牌' : '應該輪到我?' }}
                </template>
              </button>

              <button
                @click="sendSticker()"
                :class="{
                  disabled: handCard.length === 0 || lastPlayerTheRound(),
                }"
                :disabled="handCard.length === 0 || lastPlayerTheRound()"
              >
                {{
                  lastPlayerTheRound()
                    ? handCard.length != 0
                      ? '出牌吧別猶豫'
                      : '一定不是我'
                    : '應該不是我吧'
                }}
              </button>
              <button
                @click="
                  startDart(
                    gameStateHandler.dart === 0 ||
                      handCard.length === 0 ||
                      lastPlayerTheRound()
                  )
                "
                :class="{
                  disabled:
                    gameStateHandler.dart === 0 ||
                    handCard.length === 0 ||
                    lastPlayerTheRound(),
                }"
                :disabled="gameStateHandler.dart === 0 || handCard.length === 0"
              >
                {{ gameStateHandler.dart === 0 ? '飛鏢不足' : '丟飛鏢' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- bottom info -->
      <div class="option_content">
        <div class="players_box flex">
          <div class="flex player" v-for="player in players" :key="player">
            <div
              class="sticker_box"
              :class="{ active: playerStickerOpen[player.user_id] }"
              v-show="playerStickerOpen[player.user_id]"
            >
              <div>
                <img
                  :src="
                    $global_getImgUrl(
                      playerSticker[player.user_id]
                        ? playerSticker[player.user_id]['msg']
                        : null,
                      'lunch'
                    )
                  "
                />
              </div>
            </div>

            <div class="img_box">
              <img :src="$global_getImgUrl(player.icon, 'player')" alt="" />
            </div>
            <div class="name_box">
              <p>{{ player.user_id }}</p>
            </div>
            <div class="card_info">
              /
              <span :class="{ remind: playersCardLength[player.user_id] <= 0 }">
                {{ playersCardLength[player.user_id] }}
              </span>
            </div>
          </div>
        </div>
        <userNameBox
          :userName="userInfo.id"
          :userIcon="userInfo.icon"
          class="name_content"
        >
          <leaveGameHadnler
            @open="(el) => (isLeaveGameWindowOpen = el)"
            :socket="props.socket"
            game="card"
          ></leaveGameHadnler>
        </userNameBox>
      </div>

      <!-- game informaion -->
      <div id="game_info" v-show="!nextRound">
        <!-- life -->
        <div class="flex item">
          <div class="img-box">
            <img src="./../../image/ui/heart.png" />
          </div>
          <div class="num-box">
            <p>x {{ gameStateHandler.hp }}</p>
          </div>
        </div>

        <!-- dart -->
        <div class="flex dart item">
          <div class="img-box">
            <img src="./../../image/ui/gem.png" />
          </div>
          <div class="num-box">
            <p>x {{ gameStateHandler.dart }}</p>
          </div>
        </div>

        <!-- time -->
        <div class="flex item">
          <div class="img-box">
            <font-awesome-icon icon="fa-solid fa-clock" />
          </div>
          <div class="num-box">
            <p>{{ store.state.loopStore.tryTime }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- dart vote UI -->
  <div class="transition" v-show="drawVote.state">
    <div id="dart">
      <div class="title">
        <h2>有人現在要使用飛鏢, 同意使用嗎?</h2>
      </div>
      <img src="./../../image/ui/gem_large.png" />
      <!-- vote option -->
      <div class="click-btn" v-if="!voteAnswer">
        <button
          class="agree"
          :class="{ disabled: voteAnswer === 'no' }"
          :disabled="voteAnswer === 'no'"
          @click="votedDart('yes')"
        >
          <p>&nbsp;&nbsp;同意&nbsp;&nbsp;</p>
        </button>
        <button
          class="reject"
          :class="{ disabled: voteAnswer === 'yes' }"
          @click="votedDart('no')"
          :disabled="voteAnswer === 'yes'"
        >
          不要咧
        </button>
      </div>
      <!-- waiting other player vote -->
      <div v-else class="click-btn unclick">
        <p>你已投票, 等待其他玩家中</p>
        <button
          unclick
          :class="{
            agree: voteAnswer === 'yes',
            reject: voteAnswer === 'no',
          }"
        >
          {{ voteAnswer }}
        </button>
      </div>
    </div>
    <div class="t-countdown" v-show="voteCountTimer.time != 0">
      <p v-show="voteAnswer">
        wait other player in {{ voteCountTimer.time }} s
      </p>
      <p v-show="!voteAnswer">will vote "no" in {{ voteCountTimer.time }} s</p>
    </div>
  </div>

  <!-- next round -->
  <div class="transition" v-show="nextRound != false">
    <div class="next-container">
      <div class="msg-box">
        <h2>
          {{ passNotice.msg }}
        </h2>
      </div>
      最後一張牌
      <div class="card_content">
        <div class="card-box card-style">
          <div class="card-bg">
            <img src="./../../image/card/01.svg" />
          </div>
          <div class="card-num">
            <p>
              <span>{{ gameStateHandler.lastCard }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="countDown">
        <div class="title" v-show="!voteResult">即將進入下一關</div>
        <div class="title" v-show="voteResult">返回遊戲</div>
        <div class="time">
          {{ nextRoundHandler.time }}
        </div>
      </div>
    </div>
  </div>

  <!-- leave game popup -->
  <div
    id="leave_info"
    class="full_container bg"
    v-if="leaveGameWho.open && leaveGameOpen"
  >
    <div class="align_middle content_box">
      <!-- title -->
      <div class="title">
        <h2>{{ 'game close'.toUpperCase() }}</h2>
      </div>
      <template v-if="!leaveGameWho.timeoutLeave">
        <!-- user info -->
        <div class="user_box flex">
          <div class="flex">
            <div class="img">
              <img
                :src="$global_getImgUrl(leaveGameWho.who.icon, 'player')"
                alt=""
              />
            </div>
            <div class="name">
              <p>
                {{ leaveGameWho.who.user_id }}
              </p>
            </div>
          </div>
        </div>
      </template>
      <!-- content -->
      <div class="content">
        <div v-if="!leaveGameWho.timeoutLeave">
          <p>
            離開了遊戲, 將在{{ store.state.loopStore.tryTime }}秒後自動返回大廳
          </p>
        </div>
        <div v-else>
          <p>超過出牌時間啦!</p>
        </div>
        <div class="btn">
          <button @click="goLobby()">返回大廳</button>
        </div>
      </div>
    </div>
  </div>

  <!-- GAME OVER popup -->
  <div class="transition" v-if="gameOverHandler.state">
    <div id="gameover">
      <!-- title -->
      <div class="title">
        <h2>
          <template v-if="!gameOverHandler.win">game over</template>
          <template v-else>太強了 恭喜通關!!</template>
        </h2>
      </div>
      <div class="container">
        <!-- options -->
        <div class="options">
          <!-- level -->
          <div class="item-box">
            <div class="item-title">達到關卡</div>
            <div class="item-content">{{ gameStateHandler.level }}</div>
          </div>
          <!-- dart -->
          <div class="item-box">
            <div class="item-title">剩餘的飛鏢</div>
            <div class="flex" v-if="gameStateHandler.dart != 0">
              <div v-for="i in gameStateHandler.dart" :key="i">
                <img src="./../../image/ui/gem.png" />
              </div>
            </div>
            <div class="item-content" v-else>
              <p>0</p>
            </div>
          </div>
          <!-- plaeyr -->
          <div class="item-box">
            <div class="item-title">玩家</div>
            <div
              class="item-content"
              v-for="i in gameStateHandler.gameOver"
              :key="i"
            >
              {{ i }}
            </div>
          </div>
        </div>
        <div class="click-btn">
          <button @click="goLobby()">離開</button>
        </div>
      </div>
    </div>
    <div class="t-countdown">
      即將回到大廳 {{ store.state.loopStore.tryTime }} 秒
    </div>
  </div>

  <soundHandler
    v-if="store.state.userStore.userSound > 0"
    id="bg_sound_effect"
    sound="mind"
    max="0.2"
  ></soundHandler>
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
import { router } from '@/assets/router.js';
import userNameBox from '@/components/layout/userNameBox.vue';
import leaveGameHadnler from '@/components/global/leaveGameHadnler.vue';

const props = defineProps(['socket', 'state']);
const store = useStore();

// audio
const bgAduio = ref('');

// option.
const gamePlayTime = 300;
const backGameTime = 3;

// user information.
const userInfo = computed(() => {
  const res = {
    id: store.state.userStore.userName,
    room: store.state.userStore.userRoom,
    icon: store.state.userStore.icon,
  };
  return res;
});

// game data
const handCard = ref([]);
const cardsPlayed = ref([]);
const gameStateHandler = reactive({
  hp: 0,
  dart: 0,
  level: 1,
  end: 0,
  gameOver: '',
  lastCard: 0,
});
const players = ref(false);
const playersCardLength = ref({});

// transition
const passNotice = ref(false);
const nextRound = computed(() => {
  let res;
  if (!passNotice.value) {
    res = false;
  }
  if (passNotice.value.msg != null && passNotice.value.states === 'msg') {
    res = true;
    countDownInGameAction();
  }
  return res;
});
const countDownFun = ref(false);
const countDownFunTime = ref('');

const nextRoundHandler = reactive({
  time: '',
  countTimer: null,
});
const gameOverHandler = reactive({
  win: false,
  state: false,
  countTimer: null,
  time: 60,
});

// sticker.
const sendStickerBtn = ref(false);
const playerSticker = ref({});
const playerStickerOpen = ref({});
const playerStickerTimerHandler = ref({});
const playerStickerCountTime = 2 * 1000;

// draw
const voteResult = ref(false);
const voteAnswer = ref(false);
const voteCountTimer = reactive({ time: 0, content: null });
const drawVote = computed(() => {
  const data = props.state.drawVote;
  let res = { state: false, time: 5 };

  if (data != null) {
    if (data.isPass) res.state = true;
    if (!data.isPass) {
      res.state = false;
      passNotice.value = { msg: data.card, states: 'msg' };
      voteResult.value = true;
    }
  }

  count(res.state);
  function count(el) {
    if (el) {
      voteCountTimer.time = res.time;
      voteCountTimer.content = setInterval(() => {
        if (voteCountTimer.time <= 0 && voteAnswer.value) {
          clearInterval(voteCountTimer.content);
        }
        if (voteCountTimer.time <= 0 && !voteAnswer.value) {
          votedDart('no');
          voteAnswer.value = null;
          clearInterval(voteCountTimer.content);
        }
        if (voteCountTimer.time > 0) voteCountTimer.time -= 1;
      }, 1000);
    }
    if (!el) {
      voteAnswer.value = null;
      clearInterval(voteCountTimer.content);
    }
  }

  return res;
});

// quit the game actively.
const isLeaveGameWindowOpen = ref(false);
const leaveGameOpen = ref(false);
const leaveGameWho = computed(() => {
  const data = props.state.lunch.leaveGame;
  let res = {
    who: null,
    timeoutLeave: false,
    open: false,
  };

  if (data != null) {
    if (data.msg === 'whoLeave') createCountTime(10, true);
    if (data.msg === 'whoFail')
      res.timeoutLeave = data.who.user_id === userInfo.value.id ? true : false;

    res.who = data.who;
    res.open = true;
    leaveGameOpen.value = true;
    store.commit('clearUserRoom');
  }
  return res;
});

onMounted(() => {
  // update user room by bk end.
  updateUserRoom();
  // check where is current room.
  isGoLobby();
  // card animation.
  cardAnimate();
  // exchange check bk end.
  exchange();

  // DOM
  bgAduio.value = document.getElementById('bg_sound_effect');
});

onBeforeUnmount(() => {
  store.commit('loopHandlerDelete');
  store.commit('clearUserRoom');
  clearInterval(drawVote.countTimer);
  clearInterval(gameOverHandler.countTimer);
  clearInterval(nextRoundHandler.countTimer);
});

watch(
  () => props.state.lunchMind.lastCard,
  (cur) => {
    gameStateHandler.lastCard = cur.card;
  }
);

// sticker
watch(
  () => props.state.lunch.sticker,
  (cur, pre) => {
    playerSticker.value = cur;
    Object.keys(cur).forEach((el) => {
      if (!(el in pre)) if (cur[el]['num'] === 0) sticker_(el);
      if (el in pre) if (cur[el]['num'] != pre[el]['num']) sticker_(el);
    });

    function sticker_(el) {
      playerStickerOpen.value[el] = true;
      clearTimeout(playerStickerTimerHandler.value[el]);
      playerStickerTimerHandler.value[el] = setTimeout(() => {
        playerStickerOpen.value[el] = false;
      }, playerStickerCountTime);
    }
  }
);

// login Error.
watch(
  () => props.state.loginError,
  (el) => {
    if (el === 'fail') router.replace('/lobby');
  },
  { once: true }
);

// pull data at game start.
watch(
  () => props.state.gameDataFirstLoad,
  (el) => {
    if (el === null || el === undefined) return;
    playersCardLength.value = figout(el);
    gameStateHandler['hp'] = el.hp;
    gameStateHandler['dart'] = el.dart;
    gameStateHandler['level'] = el.level;
    gameStateHandler['end'] = el.end;
    handCard.value = el[userInfo.value.id];
    players.value = el['player_info'];
    store.commit('loopHandlerDelete');
    setTimeout(() => {
      store.commit('updateLoading', true);
      createCountTime(gamePlayTime);
      // bgAduio.value.play();
    }, 3000);

    function figout(data) {
      const player = data['player'];
      let res = {};
      player.forEach((name) => {
        res[name] = data[name].length;
      });
      return res;
    }
  },
  { once: true }
);

// monitor game data.
watch(
  () => props.state.gameDataUpdate,
  (el, pl) => {
    if ('cardLength' in el) {
      playersCardLength.value = el['cardLength'];
    }

    if (!('cardLength' in el)) {
      if (gameStateHandler.level != el.level) {
        store.commit('loopHandlerDelete');
        cardsPlayed.value = [];
        setTimeout(() => {
          createCountTime(gamePlayTime);
        }, 5000);
      }
      if (!isNaN(el.card)) {
        if (cardsPlayed.value.length >= 5) cardsPlayed.value.shift();
        cardsPlayed.value.push(el.card);
      } else passNotice.value = { msg: el.card, states: 'msg' };

      if (el['hp']) gameStateHandler['hp'] = el.hp;
      if (el['dart']) gameStateHandler['dart'] = el.dart;
      if (el['hand']) handCard.value = el.hand;
      if (el['level']) gameStateHandler['level'] = el.level;
      setTimeout(() => {
        store.commit('updateLoading', true);
      }, 2000);
    }
  }
);

// game leave.
watch(
  () => props.state.lunchMind.gameOver,
  (el) => {
    if (el.url === null && el.url != 'lobby') return;
    store.commit('loopHandlerDelete');
    gameStateHandler['hp'] = el.hp;
    gameStateHandler['dart'] = el.dart;
    gameStateHandler['level'] = el.level;
    gameStateHandler['gameOver'] = el.player;
    gameOverHandler.state = true;
    store.state.loopStore.tryTime = gameOverHandler.time;
    bgAduio.value.pause();
    store.commit(
      'loopHandler',
      setInterval(() => {
        store.commit('loopTimeMinus');
        if (store.state.loopStore.tryTime <= 0) goLobby();
      }, 1000)
    );
  },
  { once: true }
);

watch(
  () => props.state.lunchMind.gameWin,
  (el) => {
    store.commit('loopHandlerDelete');
    gameStateHandler['hp'] = el.hp;
    gameStateHandler['dart'] = el.dart;
    gameStateHandler['level'] = el.level;
    gameStateHandler['gameOver'] = el.player;
    gameOverHandler.state = true;
    gameOverHandler.win = true;
    store.state.loopStore.tryTime = 300;
    bgAduio.value.pause();
    store.commit(
      'loopHandler',
      setInterval(() => {
        store.commit('loopTimeMinus');
        if (store.state.loopStore.tryTime <= 0) goLobby();
      }, 1000)
    );
  },
  { once: true }
);

// hand card animation.
watch(handCard, (time) => {
  nextTick(() => {
    cardAnimate();
  });
});

function sendSticker() {
  if (sendStickerBtn.value) return;

  sendStickerBtn.value = true;
  const data = {
    id: userInfo.value.id,
    room: userInfo.value.room,
    act: 'no',
  };
  props.socket.emit('lunch_sticker', data);
  setTimeout(() => {
    sendStickerBtn.value = false;
  }, 1000);
}

function lastPlayerTheRound() {
  let sum = 0;
  Object.values(playersCardLength.value).forEach((val) => {
    if (val >= 1) sum += 1;
  });
  return sum <= 1 ? true : false;
}

function createCountTime(time, back = false, self = false) {
  store.commit('loopHandlerDelete');
  store.state.loopStore.tryTime = time;
  store.commit(
    'loopHandler',
    setInterval(() => {
      store.commit('loopTimeMinus');
      if (store.state.loopStore.tryTime <= 0) {
        const data = {
          game: 'card',
          id: userInfo.value.id,
          room: userInfo.value.room,
          icon: userInfo.value.icon,
        };

        props.socket.emit('gamesLeave', data);
        store.commit('loopHandlerDelete');

        if (back) goLobby();
      }
    }, 1000)
  );
}

function countDownInGameAction() {
  nextRoundHandler.time = backGameTime;
  nextRoundHandler.countTimer = setInterval(() => {
    nextRoundHandler.time -= 1;
    if (nextRoundHandler.time <= 0) {
      clearTimeout(nextRoundHandler.countTimer);
      passNotice.value = false;
    }
  }, 1000);
}

function playCard() {
  const userRoom = userInfo.value.room;
  // { player:value, room:value }
  props.socket.emit('play', {
    player: userInfo.value.id,
    room: userRoom.substring(userRoom.indexOf('/') + 1),
  });
}

function cardAnimate() {
  const handCardBox = document.querySelectorAll('#hand-card .card-box');
  const handCardLength = handCardBox.length;
  let dx = 0;
  let dy = 0;
  let fsdfsd = -15;

  for (let i = 0; i < handCardBox.length; i++) {
    const DOM = handCardBox[i];
    const degrees = i === 0 ? 0 : ((13 * i * 0.3) / i) * (2 * i);

    if (i >= 1) dx = 25;

    dy = (10 * 2) / 10;
    fsdfsd += dy;

    DOM.style.transform = '';
    DOM.style.transform = `
          translate(${-50 + i * 5}% , ${fsdfsd * i}px)
          rotate(${degrees}deg)
          scale(${(20 - i) * 0.05})
        `;

    DOM.style.zIndex = handCardLength - i;

    if (i >= 10) {
      DOM.style.display = 'none';
    }
  }
}

function startDart(el) {
  if (el) return;
  const userRoom = userInfo.value.room;

  if (gameStateHandler.dart > 0) {
    // { message:value, room:value }
    props.socket.emit('draw', {
      message: 'go',
      room: userRoom.substring(userRoom.indexOf('/') + 1),
    });
  }
}

function votedDart(data) {
  if (voteAnswer.value != null) return;
  if (data != 'yes' && data != 'no') return;

  const userRoom = store.state.userStore.userRoom;
  const room = userRoom.substring(userRoom.indexOf('/') + 1);

  // { message:value, room:value }
  props.socket.emit('draw', {
    message: data,
    room,
  });

  voteAnswer.value = data;
}

function exchange() {
  setTimeout(() => {
    props.socket.emit('id_check', {
      id: store.state.userStore.userName,
      room: store.state.userStore.userRoom,
      icon: store.state.userStore.icon,
    });
  }, 1000);
}

function goLobby() {
  store.commit('clearUserRoom');
  router.replace('/lobby');
}

function isGoLobby() {
  setTimeout(() => {
    if (store.state.userStore.userRoom != null) return;
    goLobby();
  }, 500);
}

function updateUserRoom() {
  if (props.state.activeGameRoom != null)
    store.commit('updateUserRoom', props.state.activeGameRoom);
}
</script>

<style scoped>
@import '@/scss/gameRoom.scss';
</style>
