<template>
  <!-- game content -->
  <div v-show="!passNotice" class="game-container_">
    <div class="game_container">
      <div id="in_play">
        <div v-if="gameData === null"></div>
        <div class="level" v-else>
          <p>
            Level:<span>{{ level }}</span>
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
                {{ lastPlayerTheRound() ? '就是我了' : '我覺得應該輪到我' }}
              </button>
              <button
                @click="sendSticker()"
                :class="{
                  disabled: handCard.length === 0 || lastPlayerTheRound(),
                }"
                :disabled="handCard.length === 0 || lastPlayerTheRound()"
              >
                應該不是我吧
              </button>
              <button
                @click="startDart()"
                :class="{
                  disabled:
                    dart === 0 || handCard.length === 0 || lastPlayerTheRound(),
                }"
                :disabled="dart === 0 || handCard.length === 0"
              >
                {{ dart === 0 ? '飛鏢不足' : '丟飛鏢' }}
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
                    this.$global_getImgUrl(
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
          <leaveGameHadnler :socket="socket" game="card"></leaveGameHadnler>
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
            <p>x {{ hp }}</p>
          </div>
        </div>

        <!-- dart -->
        <div class="flex dart item">
          <div class="img-box">
            <img src="./../../image/ui/gem.png" />
          </div>
          <div class="num-box">
            <p>x {{ dart }}</p>
          </div>
        </div>

        <!-- time -->
        <div class="flex item">
          <div class="img-box">
            <font-awesome-icon icon="fa-solid fa-clock" />
          </div>
          <div class="num-box">
            <p>{{ $store.state.loopStore.tryTime }}</p>
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
      <div class="click-btn" v-if="isDrawVoted === null">
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
            agree: this.isDrawVoted === 'yes',
            reject: this.isDrawVoted === 'no',
          }"
        >
          {{ this.isDrawVoted }}
        </button>
      </div>
    </div>
    <div class="t-countdown" v-show="this.drawVote.time != 0">
      will vote "no" in {{ this.drawVote.time }} s
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
            離開了遊戲, 將在{{ $store.state.loopStore.tryTime }}秒後自動返回大廳
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
            <div class="item-content">{{ level }}</div>
          </div>
          <!-- dart -->
          <div class="item-box">
            <div class="item-title">darts remaining</div>
            <div class="flex" v-if="dart != 0">
              <div v-for="i in dart" :key="i">
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
    <div class="t-countdown" v-show="this.gameOver.time != 0">
      will return to LOBBY in {{ this.gameOver.time }} s
    </div>
  </div>
</template>

<script>
import userNameBox from '@/../src/components/layout/userNameBox.vue';
import leaveGameHadnler from '@/../src/components/global/leaveGameHadnler.vue';
export default {
  data() {
    return {
      userIcon: null,
      player: null,
      gameRoom: null,
      gameData: false,
      handCard: [],
      hp: null,
      dart: 0,
      remain: null,
      level: null,
      currentCard: [],
      drawVote: { state: false, countTimer: null, time: 20 },
      isDrawVoted: null,
      passNotice: false,
      backGameTime: 3,
      gameOver: { state: null, countTimer: null, time: 60 },
      players: null,
      voteFail: false,
      leaveGame: {
        who: null,
        open: false,
      },
      wholeData: [],
      timeoutLeave: false,
      game: { time: 300 },
      sendStickerBtn: true,
      playerSticker: {},
      playerStickerOpen: {},
      playerStickerHandler: {},
    };
  },
  components: { userNameBox, leaveGameHadnler },
  props: ['socket', 'state'],
  watch: {
    passNotice(el) {
      if (el.msg != null && el.states === 'msg') {
        this.backGameTime = 5;
        this.countDownInGameAction();
      }
    },
    'state.lunch.sticker': {
      handler(cur, pre) {
        this.playerSticker = cur;
        Object.keys(cur).forEach((el) => {
          if (!(el in pre))
            if (cur[el]['num'] === 0) {
              this.playerStickerOpen[el] = true;
              clearTimeout(this.playerStickerHandler[el]);
              this.playerStickerHandler[el] = setTimeout(() => {
                this.playerStickerOpen[el] = false;
              }, 5000);
            }

          if (el in pre)
            if (cur[el]['num'] != pre[el]['num']) {
              this.playerStickerOpen[el] = true;
              clearTimeout(this.playerStickerHandler[el]);
              this.playerStickerHandler[el] = setTimeout(() => {
                this.playerStickerOpen[el] = false;
              }, 5000);
            }
        });
      },
      deep: true,
    },
    'state.lunch.leaveGame': {
      handler(el) {
        this.$store.commit('clearUserRoom');

        if (el.msg === 'whoLeave') this.createCountTime(10, true);
        if (el.msg === 'whoFail') this.timeoutLeave = self;

        this.leaveGame.who = el.who;
        this.leaveGame.open = true;
      },
      deep: true,
    },
    'state.loginError': {
      handler(el) {
        if (el === 'fail') this.$router.replace('/lobby');
      },
      deep: true,
    },
    'state.drawVote': {
      handler(el) {
        console.log(el);
        if (el != null && el.isPass) this.drawVote.state = el;
        if (el != null && !el.isPass) {
          this.drawVote.state = false;
          this.passNotice = { msg: el.card, states: 'msg' };
          this.voteFail = true;
        }
        if (el === null) {
          this.drawVote.state = false;
        }
        this.isDrawVoted = null;
      },
      deep: true,
    },
    'state.gameDataFirstLoad': {
      handler(el) {
        if (el === null || el === undefined) return;
        this.wholeData = figout(el);
        this.gameData = true;
        this.hp = el.hp;
        this.dart = el.dart;
        this.remain = el.remain;
        this.level = el.level;
        this.handCard = el[this.player];
        this.players = el['player_info'];
        this.$store.commit('updateLoading', true);
        this.$store.commit('loopHandlerDelete');
        setTimeout(() => {
          this.createCountTime(this.game.time);
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
      deep: true,
    },
    'state.gameDataUpdate': {
      handler(el) {
        if ('cardLength' in el) {
          this.wholeData = el['cardLength'];
        }

        if (!('cardLength' in el)) {
          if (this.level != el.level) {
            this.$store.commit('loopHandlerDelete');
            this.currentCard = [];
            setTimeout(() => {
              this.createCountTime(this.game.time);
            }, 5000);
          }
          if (!isNaN(el.card)) {
            if (this.currentCard.length >= 5) this.currentCard.shift();
            this.currentCard.push(el.card);
          } else this.passNotice = { msg: el.card, states: 'msg' };

          if (tureFalse('hp')) {
            this.hp = el.hp;
          }
          if (tureFalse('dart')) this.dart = el.dart;
          if (tureFalse('remain')) this.remain = el.remain;
          if (tureFalse('hand')) this.handCard = el.hand;
          if (tureFalse('level')) this.level = el.level;
        }

        function tureFalse(key) {
          const check = el[key];
          return check != null || check != undefined ? true : false;
        }
      },
      deep: true,
    },
    'state.gameOne.gameOver': {
      handler(el) {
        if (el.url === null && el.url != 'lobby') return;
        this.$store.commit('loopHandlerDelete');
        this.gameOver.state = true;
        this.dart = el.dart;
        this.hp = el.hp;
        this.level = el.level;
        this.player = el.player;
        this.gameOver.time = 10;
        this.gameOver.countTimer = setInterval(() => {
          this.gameOver.time -= 1;
          if (this.gameOver.time <= 0) {
            this.$store.commit('loopHandlerDelete');
            this.gameOver.time = 0;
            this.goLobby();
          }
        }, 1000);
      },
    },
    'state.gameOne.sendSticker': {
      handler(el) {
        console.log(el);
      },
    },
    'drawVote.state'(el) {
      this.drawVote.time = 5;
      if (el)
        this.drawVote.countTimer = setInterval(() => {
          if (this.drawVote.time <= 0) this.drawVote.time = 0;
          if (this.drawVote.time > 0) this.drawVote.time -= 1;
          console.log(this.drawVote.time);
        }, 1000);
      if (!el) clearInterval(this.drawVote.countTimer);
    },
    'drawVote.time'(time) {
      if (time > 0) return;
      this.votedDart('no');
      clearInterval(this.drawVote.countTimer);
    },
    handCard() {
      this.$nextTick(() => {
        this.cardAnimate();
      });
    },
  },
  methods: {
    sendSticker() {
      if (!this.sendStickerBtn) return;

      this.sendStickerBtn = false;
      const data = {
        id: this.$store.state.userStore.userName,
        room: this.$store.state.userStore.userRoom,
        act: 'no',
      };
      this.socket.emit('lunch_sticker', data);
      setTimeout(() => {
        this.sendStickerBtn = true;
      }, 1000);
    },
    playerCardLength(el) {
      return this.wholeData[el]?.length || this.wholeData[el];
    },
    lastPlayerTheRound() {
      let sum = 0;
      Object.values(this.wholeData).forEach((val) => {
        if (val >= 1) sum += 1;
      });
      return sum <= 1 ? true : false;
    },
    createCountTime(time, back = false, self = false) {
      this.$store.commit('loopHandlerDelete');
      this.$store.state.loopStore.tryTime = time;
      this.$store.commit(
        'loopHandler',
        setInterval(() => {
          this.$store.commit('loopTimeMinus');
          if (this.$store.state.loopStore.tryTime <= 0) {
            const data = {
              game: 'card',
              id: this.$store.state.userStore.userName,
              room: this.$store.state.userStore.userRoom,
              icon: this.$store.state.userStore.icon,
            };

            this.socket.emit('gamesLeave', data);
            this.$store.commit('loopHandlerDelete');

            if (back)
              setTimeout(() => {
                this.goLobby();
              }, 1000);
          }
        }, 1000)
      );
    },
    countDownInGameAction() {
      this.backGameTime -= 1;
      if (this.backGameTime <= 0) {
        this.passNotice = false;
      }
      if (this.backGameTime != 0) {
        this.countDownFun = setTimeout(() => {
          this.countDownInGameAction();
        }, 1000);
      }
    },
    playcard() {
      const userRoom = this.$store.state.userStore.userRoom;

      this.socket.emit('play', {
        player: this.player,
        room: userRoom.substring(userRoom.indexOf('/') + 1),
      });
    },
    cardAnimate() {
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
    },
    startDart() {
      const userRoom = this.$store.state.userStore.userRoom;

      if (this.dart > 0) {
        this.socket.emit('draw', {
          message: 'go',
          room: userRoom.substring(userRoom.indexOf('/') + 1),
        });
      } else {
        alert('沒飛鏢啊!!按屁按逆!!');
      }
    },
    votedDart(data) {
      if (this.isDrawVoted != null) return;
      if (data != 'yes' && data != 'no') return;

      const userRoom = this.$store.state.userStore.userRoom;
      const room = userRoom.substring(userRoom.indexOf('/') + 1);

      // { message:value, room:value }
      this.socket.emit('draw', {
        message: data,
        room,
      });

      clearInterval(this.drawVote.countTimer);
      this.drawVote.time = 0;
      this.isDrawVoted = data;
    },
    socketConnectCheck() {
      const that = this;

      this.$store.commit(
        'loopHandler',
        setInterval(() => {
          const result = doCheck(this);
          this.$store.state.loopStore.tryTime += 1;

          if (this.$store.state.loopStore.tryTime >= 15) {
            alert('Connection failed, will return to lobby.');
            this.$store.commit('loopHandlerDelete');
            this.$store.state.loopStore.tryTime = 0;
            this.goLobby();
          }

          if (result) {
            this.$store.state.loopStore.tryTime = 0;
            this.$store.commit('loopHandlerDelete');
          }
        }, 1000)
      );

      function doCheck() {
        that.socket.emit('id_check', {
          id: that.$store.state.userStore.userName,
          room: that.$store.state.userStore.userRoom,
          icon: that.$store.state.userStore.icon,
        });

        return that.$store.state.userStore.loading;
      }
    },
    goLobby() {
      this.$store.commit('clearUserRoom');
      this.$router.replace('/lobby');
    },
    isGoLobby() {
      setTimeout(() => {
        if (this.$store.state.userStore.userRoom != null) return;
        this.goLobby();
      }, 500);
    },
    updateUserRoom() {
      if (this.state.activeGameRoom != null)
        this.$store.commit('updateUserRoom', this.state.activeGameRoom);
    },
  },
  beforeMount() {
    this.player = this.$store.state.userStore.userName;
    this.userIcon = this.$store.state.userStore.icon;
    // :userIcon="userIcon"
  },
  mounted() {
    this.socketConnectCheck();
    this.isGoLobby();
    this.updateUserRoom();
    this.cardAnimate();
  },
  beforeUnmount() {
    this.$store.commit('loopHandlerDelete');
    clearInterval(this.drawVote.countTimer);
    clearInterval(this.gameOver.countTimer);
    this.$store.state.userStore.userRoom = null;
  },
};
</script>

<style scoped>
@import '@/scss/gameRoom.scss';
</style>
