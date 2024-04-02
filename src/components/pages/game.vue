<template>
  <!-- game content -->
  <div v-show="!passNotice" class="game-container_">
    <div class="game_container">
      <div id="in_play">
        <div v-if="gameData === null"></div>
        <div class="level" v-else>
          <p>
            Level:<span>{{ inGameInfo.level }}</span>
          </p>
        </div>
      </div>

      <!-- game -->
      <template v-if="!leaveGame.open">
        <!-- current card tent -->
        <div class="dsdsa">
          <div class="current-card">
            <div class="title">
              <p>檯面上的牌</p>
            </div>
            <div class="flex">
              <div
                class="card-box card-style"
                v-for="i in currentCard"
                :key="i"
              >
                <div class="card-num">
                  <p>
                    <span>{{ i }}</span>
                  </p>
                </div>
                <div class="card-bg">
                  <img src="./../../image/card/01.svg" />
                </div>
              </div>
              <div
                class="card-box card-style wait"
                v-for="i in 5 - currentCard.length"
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
        <div id="hand-card">
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
                @click="playcard()"
                :class="{ disabled: handCard.length === 0 }"
                :disabled="handCard.length === 0"
              >
                <template v-if="handCard.length != 0">
                  {{ lastPlayerTheRound() ? '就是我了' : '我覺得應該輪到我' }}
                </template>
                <template v-else>
                  {{ lastPlayerTheRound() ? '已無手牌' : '我覺得應該輪到我' }}
                </template>
              </button>

              <button
                @click="sendSticker()"
                :class="{
                  disabled: handCard.length === 0 || lastPlayerTheRound(),
                }"
                :disabled="handCard.length === 0 || lastPlayerTheRound()"
              >
                {{ lastPlayerTheRound() ? '一定不是我' : '應該不是我吧' }}
              </button>
              <button
                @click="
                  startDart(
                    inGameInfo.dart === 0 ||
                      handCard.length === 0 ||
                      lastPlayerTheRound()
                  )
                "
                :class="{
                  disabled:
                    inGameInfo.dart === 0 ||
                    handCard.length === 0 ||
                    lastPlayerTheRound(),
                }"
                :disabled="inGameInfo.dart === 0 || handCard.length === 0"
              >
                {{ inGameInfo.dart === 0 ? '飛鏢不足' : '丟飛鏢' }}
              </button>
            </div>
          </div>
        </div>
      </template>

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
            <div class="name_box">{{ player.user_id }}</div>
            <div class="card_info">
              /
              <span :class="{ remind: wholeData[player.user_id] <= 0 }">
                {{ wholeData[player.user_id] }}
              </span>
            </div>
          </div>
        </div>
        <userNameBox
          :userName="player"
          :userIcon="userIcon"
          class="name_content"
        >
          <leaveGameHadnler
            :socket="props.socket"
            game="card"
          ></leaveGameHadnler>
        </userNameBox>
      </div>

      <!-- game informaion -->
      <div id="game_info" v-show="!passNotice">
        <!-- life -->
        <div class="flex item">
          <div class="img-box">
            <img src="./../../image/ui/heart.png" />
          </div>
          <div class="num-box">
            <p>x {{ inGameInfo.hp }}</p>
          </div>
        </div>

        <!-- dart -->
        <div class="flex dart item">
          <div class="img-box">
            <img src="./../../image/ui/gem.png" />
          </div>
          <div class="num-box">
            <p>x {{ inGameInfo.dart }}</p>
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
  <div class="transition" v-if="drawVote.state">
    <div id="dart">
      <div class="title">
        <h2>有人現在要使用飛鏢, 同意使用嗎?</h2>
      </div>
      <img src="./../../image/ui/gem_large.png" />
      <!-- vote option -->
      <div class="click-btn" v-if="!isDrawVoted">
        <button
          class="agree"
          :class="{ disabled: isDrawVoted === 'no' }"
          :disabled="isDrawVoted === 'no'"
          @click="votedDart('yes')"
        >
          <p>&nbsp;&nbsp;同意&nbsp;&nbsp;</p>
        </button>
        <button
          class="reject"
          :class="{ disabled: isDrawVoted === 'yes' }"
          @click="votedDart('no')"
          :disabled="isDrawVoted === 'yes'"
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
            agree: isDrawVoted === 'yes',
            reject: isDrawVoted === 'no',
          }"
        >
          {{ isDrawVoted }}
        </button>
      </div>
    </div>
    <div class="t-countdown" v-show="drawVote.time != 0">
      will vote "no" in {{ drawVote.time }} s
    </div>
  </div>

  <!-- next round -->
  <div class="transition" v-show="passNotice != false">
    <div class="next-container">
      <div class="msg-box">
        <h2>
          {{ passNotice.msg }}
        </h2>
      </div>
      <div class="countDown">
        <div class="title" v-show="!voteFail">即將進入下一關</div>
        <div class="title" v-show="voteFail">返回遊戲</div>
        <div class="time">
          {{ backGameTime }}
        </div>
      </div>
    </div>
  </div>

  <!-- leave game popup -->
  <div id="leave_info" class="full_container bg" v-if="leaveGame.open">
    <div class="align_middle content_box">
      <!-- title -->
      <div class="title">
        <h2>{{ 'game close'.toUpperCase() }}</h2>
      </div>
      <template v-if="!timeoutLeave">
        <!-- user info -->
        <div class="user_box flex">
          <div class="flex">
            <div class="img">
              <img
                :src="$global_getImgUrl(leaveGame.who.icon, 'player')"
                alt=""
              />
            </div>
            <div class="name">
              <p>
                {{ leaveGame.who.user_id }}
              </p>
            </div>
          </div>
        </div>
      </template>
      <!-- content -->
      <div class="content">
        <div v-if="!timeoutLeave">
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
  <div class="transition" v-if="gameOver.state">
    <div id="gameover">
      <!-- title -->
      <div class="title">
        <h2>game over</h2>
      </div>
      <div class="container">
        <!-- options -->
        <div class="options">
          <!-- level -->
          <div class="item-box">
            <div class="item-title">Last level</div>
            <div class="item-content">{{ inGameInfo.level }}</div>
          </div>
          <!-- dart -->
          <div class="item-box">
            <div class="item-title">darts remaining</div>
            <div class="flex" v-if="inGameInfo.dart != 0">
              <div v-for="i in inGameInfo.dart" :key="i">
                <img src="./../../image/ui/gem.png" />
              </div>
            </div>
            <div class="item-content" v-else>
              <p>0</p>
            </div>
          </div>
          <!-- plaeyr -->
          <div class="item-box">
            <div class="item-title">game plaeyrs</div>
            <div class="item-content" v-for="i in player" :key="i">
              {{ i }}
            </div>
          </div>
        </div>
        <div class="click-btn">
          <button @click="goLobby()">leave</button>
        </div>
      </div>
    </div>
    <div class="t-countdown">
      will return to LOBBY in {{ store.state.loopStore.tryTime }} s
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
import leaveGameHadnler from '@/../src/components/global/leaveGameHadnler.vue';

const props = defineProps(['socket', 'state']);
const store = useStore();

const userIcon = ref(false);
const player = ref(false);
const gameRoom = ref(false);
const gameData = ref(false);
const handCard = ref([]);
const inGameInfo = reactive({ hp: 0, dart: 0, level: 1 });
const currentCard = ref([]);
const drawVote = reactive({ state: false, countTimer: null, time: 20 });
const isDrawVoted = ref(false);
const passNotice = ref(false);
const backGameTime = ref(3);
const countDownFun = ref(false);
const gameOver = reactive({ state: false, countTimer: null, time: 10 });
const players = ref(false);
const voteFail = ref(false);
const leaveGame = reactive({
  who: null,
  open: false,
});
const wholeData = ref({});
const timeoutLeave = ref(false);
const gamePlayTime = 300;
const sendStickerBtn = ref(false);
const playerSticker = ref({});
const playerStickerOpen = ref({});
const playerStickerHandler = ref({});

watch(passNotice, (el) => {
  if (el.msg != null && el.states === 'msg') {
    backGameTime.value = 5;
    countDownInGameAction();
  }
});

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
      clearTimeout(playerStickerHandler.value[el]);
      playerStickerHandler.value[el] = setTimeout(() => {
        playerStickerOpen.value[el] = false;
      }, 5000);
    }
  }
);

watch(
  () => props.state.lunch.leaveGame,
  (el) => {
    store.commit('clearUserRoom');

    if (el.msg === 'whoLeave') createCountTime(10, true);
    // if (el.msg === 'whoFail') timeoutLeave = self;

    leaveGame.who = el.who;
    leaveGame.open = true;
  }
);

watch(
  () => props.state.loginError,
  (el) => {
    if (el === 'fail') router.replace('/lobby');
  }
);

watch(
  () => props.state.drawVote,
  (el) => {
    if (el != null && el.isPass) drawVote.state = el;
    if (el != null && !el.isPass) {
      drawVote.state = false;
      passNotice.value = { msg: el.card, states: 'msg' };
      voteFail.value = true;
    }
    if (el === null) {
      drawVote.state = false;
    }
    isDrawVoted.value = null;
  }
);

watch(
  () => props.state.gameDataFirstLoad,
  (el) => {
    console.log(el);
    if (el === null || el === undefined) return;
    wholeData.value = figout(el);
    gameData.value = true;
    inGameInfo['hp'] = el.hp;
    inGameInfo['dart'] = el.dart;
    inGameInfo['level'] = el.level;
    handCard.value = el[player.value];
    players.value = el['player_info'];
    store.commit('updateLoading', true);
    store.commit('loopHandlerDelete');
    setTimeout(() => {
      createCountTime(gamePlayTime);
    }, 2000);

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

watch(
  () => props.state.gameDataUpdate,
  (el) => {
    if ('cardLength' in el) {
      wholeData.value = el['cardLength'];
    }

    if (!('cardLength' in el)) {
      if (inGameInfo.level != el.level) {
        store.commit('loopHandlerDelete');
        currentCard.value = [];
        setTimeout(() => {
          createCountTime(gamePlayTime);
        }, 5000);
      }
      if (!isNaN(el.card)) {
        if (currentCard.value.length >= 5) currentCard.value.shift();
        currentCard.value.push(el.card);
      } else passNotice.value = { msg: el.card, states: 'msg' };

      if (tureFalse('hp')) inGameInfo['hp'] = el.hp;
      if (tureFalse('dart')) inGameInfo['dart'] = el.dart;
      if (tureFalse('hand')) handCard.value = el.hand;
      if (tureFalse('level')) inGameInfo['level'] = el.level;
    }

    function tureFalse(key) {
      const check = el[key];
      return check != null || check != undefined ? true : false;
    }
  }
);

watch(
  () => props.state.gameOne.gameOver,
  (el) => {
    console.log(el);
    if (el.url === null && el.url != 'lobby') return;
    store.commit('loopHandlerDelete');
    inGameInfo['hp'] = el.hp;
    inGameInfo['dart'] = el.dart;
    inGameInfo['level'] = el.level;
    player.value = el.player;
    gameOver.state = true;
    store.state.loopStore.tryTime = gameOver.time;
    store.commit(
      'loopHandler',
      setInterval(() => {
        store.commit('loopTimeMinus');
        if (store.state.loopStore.tryTime <= 0) {
          store.commit('loopHandlerDelete');
          goLobby();
        }
      }, 1000)
    );
  },
  { once: true }
);

watch(
  () => drawVote.state,
  (el) => {
    drawVote.time = 5;
    if (el)
      drawVote.countTimer = setInterval(() => {
        if (drawVote.time <= 0) drawVote.time = 0;
        if (drawVote.time > 0) drawVote.time -= 1;
      }, 1000);
    if (!el) clearInterval(drawVote.countTimer);
  }
);

watch(
  () => drawVote.time,
  (time) => {
    if (time > 0) return;
    votedDart('no');
    clearInterval(drawVote.countTimer);
  }
);

watch(handCard, (time) => {
  nextTick(() => {
    cardAnimate();
  });
});

function sendSticker() {
  if (sendStickerBtn.value) return;

  sendStickerBtn.value = true;
  const data = {
    id: store.state.userStore.userName,
    room: store.state.userStore.userRoom,
    act: 'no',
  };
  props.socket.emit('lunch_sticker', data);
  setTimeout(() => {
    sendStickerBtn.value = false;
  }, 1000);
}

function playerCardLength(el) {
  return wholeData[el]?.length || wholeData[el];
}

function lastPlayerTheRound() {
  let sum = 0;
  Object.values(wholeData.value).forEach((val) => {
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
          id: store.state.userStore.userName,
          room: store.state.userStore.userRoom,
          icon: store.state.userStore.icon,
        };

        props.socket.emit('gamesLeave', data);
        store.commit('loopHandlerDelete');

        if (back)
          setTimeout(() => {
            goLobby();
          }, 1000);
      }
    }, 1000)
  );
}

function countDownInGameAction() {
  backGameTime.value -= 1;
  if (backGameTime.value <= 0) {
    passNotice.value = false;
  }
  if (backGameTime.value != 0) {
    countDownFun.value = setTimeout(() => {
      countDownInGameAction();
    }, 1000);
  }
}

function playcard() {
  const userRoom = store.state.userStore.userRoom;

  props.socket.emit('play', {
    player: store.state.userStore.userName,
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
  const userRoom = store.state.userStore.userRoom;

  if (inGameInfo.dart > 0) {
    props.socket.emit('draw', {
      message: 'go',
      room: userRoom.substring(userRoom.indexOf('/') + 1),
    });
  } else {
    alert('沒飛鏢啊!!按屁按逆!!');
  }
}

function votedDart(data) {
  if (isDrawVoted.value != null) return;
  if (data != 'yes' && data != 'no') return;

  const userRoom = store.state.userStore.userRoom;
  const room = userRoom.substring(userRoom.indexOf('/') + 1);

  // { message:value, room:value }
  props.socket.emit('draw', {
    message: data,
    room,
  });

  clearInterval(drawVote.countTimer);
  drawVote.time = 0;
  isDrawVoted.value = data;
}

function socketConnectCheck() {
  store.commit(
    'loopHandler',
    setInterval(() => {
      const result = doCheck();
      store.state.loopStore.tryTime += 1;

      if (store.state.loopStore.tryTime >= 15) {
        store.commit('loopHandlerDelete');
        alert('Connection failed, will return to lobby.');
        goLobby();
      }

      if (result) store.commit('loopHandlerDelete');
    }, 1000)
  );

  function doCheck() {
    props.socket.emit('id_check', {
      id: store.state.userStore.userName,
      room: store.state.userStore.userRoom,
      icon: store.state.userStore.icon,
    });

    return store.state.userStore.loading;
  }
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

onBeforeMount(() => {
  player.value = store.state.userStore.userName;
  userIcon.value = store.state.userStore.icon;
});

onMounted(() => {
  socketConnectCheck();
  isGoLobby();
  updateUserRoom();
  cardAnimate();
});

onBeforeUnmount(() => {
  store.commit('loopHandlerDelete');
  clearInterval(drawVote.countTimer);
  clearInterval(gameOver.countTimer);
  store.state.userStore.userRoom = null;
});
</script>

<style scoped>
@import '@/scss/gameRoom.scss';
</style>
