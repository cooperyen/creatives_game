<template>
  <userNameBox :userName="player" class="name"></userNameBox>

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

  <!-- dart vote UI -->
  <div class="transition" v-if="drawVote.state">
    <div id="dart">
      <div class="title">
        <h2>有人現在要使用飛鏢, 同意使用嗎?</h2>
      </div>
      <img src="./../image/ui/gem_large.png" />
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

  <!-- GAME OVER UI -->
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
                <img src="./../image/ui/gem.png" />
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

  <!-- game content -->
  <div v-show="!passNotice" class="game-container">
    <div id="in_play">
      <div v-if="gameData === null"></div>
      <div class="game-info" v-else>
        <p>
          Level:<span>{{ level }}</span>
        </p>
      </div>
    </div>

    <!-- current card tent -->
    <div class="current-card">
      <div class="title">
        <p>檯面上的牌 :</p>
      </div>
      <div class="flex">
        <div class="card-box card-style" v-for="i in currentCard" :key="i">
          <div class="card-num">
            <p>
              <span>{{ i }}</span>
            </p>
          </div>
          <div class="card-bg">
            <img src="./../image/card/01.svg" />
          </div>
        </div>
        <div
          class="card-box card-style wait"
          v-for="i in 5 - currentCard.length"
          :key="i"
        >
          <div class="card-bg">
            <img src="./../image/card/01.svg" />
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
            <img src="./../image/card/01.svg" />
          </div>
        </div>
      </div>
      <div class="card-play" v-if="!drawVote.state">
        <div class="click-btn">
          <button
            @click="playcard()"
            :class="{ disabled: handCard.length === 0 }"
            :disabled="handCard.length === 0"
          >
            我覺得應該輪到我
          </button>
          <button
            @click="startDart()"
            :class="{ disabled: dart === 0 }"
            :disabled="dart === 0 || dart === null"
          >
            {{ dart === 0 || dart === null ? '飛鏢不足' : '丟飛鏢' }}
          </button>
        </div>
      </div>
    </div>

    <!-- game informaion -->
    <div class="game_info">
      <div class="flex">
        <div class="img-box">
          <img src="./../image/ui/heart.png" />
        </div>
        <div class="num-box">
          <p>x {{ hp }}</p>
        </div>
      </div>

      <div class="flex dart">
        <div class="img-box">
          <img src="./../image/ui/gem.png" />
        </div>
        <div class="num-box">
          <p>x {{ dart }}</p>
        </div>
      </div>
    </div>
  </div>

  <transferPageCountDown></transferPageCountDown>
</template>

<script>
import transferPageCountDown from '@/../src/ui/transferPageCountDown.vue';
import userNameBox from '@/../src/components/layout/userNameBox.vue';
export default {
  data() {
    return {
      socketConetectLoop: null,
      player: null,
      gameRoom: null,
      gameData: false,
      handCard: [],
      hp: null,
      dart: null,
      remain: null,
      level: null,
      currentCard: [],
      drawVote: { state: false, countTimer: null, time: 20 },
      isDrawVoted: null,
      passNotice: false,
      backGameTime: 5,
      gameOver: { state: null, countTimer: null, time: 60 },
      players: null,
      voteFail: false,
    };
  },
  components: { userNameBox, transferPageCountDown },
  props: ['socket', 'state'],
  watch: {
    passNotice(el) {
      // console.log(el);
      if (el.msg != null && el.states === 'msg') {
        this.backGameTime = 5;
        this.countDownInGameAction();
      }
    },
    'state.loginError': {
      handler(el) {
        if (el === 'fail') this.$router.replace('/lobby');
      },
      deep: true,
    },
    'state.drawVote': {
      handler(el) {
        // console.log(el);
        if (el != null && el.isPass) this.drawVote.state = el;
        if (el != null && !el.isPass) {
          this.drawVote.state = false;
          this.passNotice = { msg: el.card, states: 'msg' };
          this.voteFail = true;
          // alert('Not pass game yet, Continue playing games');
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
        console.log(el);
        if (el === null || el === undefined) return;
        this.gameData = true;
        this.hp = el.hp;
        this.dart = el.dart;
        this.remain = el.remain;
        this.level = el.level;
        this.handCard = el[this.player];
        this.$store.state.userStore.loading = true;
      },
      deep: true,
    },
    'state.gameDataUpdate': {
      handler(el) {
        if (this.level != el.level) this.currentCard = [];
        if (!isNaN(el.card)) {
          if (this.currentCard.length >= 5) this.currentCard.shift();
          this.currentCard.push(el.card);
        } else this.passNotice = { msg: el.card, states: 'msg' };

        if (tureFalse('hp')) {
          // if (this.hp < el.hp) console.log('fail');
          this.hp = el.hp;
        }
        if (tureFalse('dart')) this.dart = el.dart;
        if (tureFalse('remain')) this.remain = el.remain;
        if (tureFalse('hand')) this.handCard = el.hand;
        if (tureFalse('level')) this.level = el.level;
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
        this.gameOver.state = true;
        this.dart = el.dart;
        this.hp = el.hp;
        this.level = el.level;
        this.player = el.player;

        this.gameOver.time = 10;

        this.gameOver.countTimer = setInterval(() => {
          this.gameOver.time -= 1;
          if (this.gameOver.time <= 0) {
            this.gameOver.time = 0;
            this.goLobby();
          }
        }, 1000);
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
    handCard(el) {
      this.$nextTick(() => {
        this.cardAnimate();
      });
    },
  },
  methods: {
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

        // if (i === 1) dx = 40;
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
      if (data != 'yes' || data != 'no') return;

      const userRoom = this.$store.state.userStore.userRoom;
      const room = userRoom.substring(userRoom.indexOf('/') + 1);

      // { message:value, room:value }
      this.socket.emit('draw', {
        message: data,
        room,
      });

      this.isDrawVoted = data;
    },
    socketConnectCheck() {
      const that = this;
      this.socketConetectLoop = setInterval(() => {
        const result = doCheck(this);
        this.$store.state.userStore.connectedTime += 1;

        if (this.$store.state.userStore.connectedTime >= 15) {
          alert('Connection failed, will return to lobby.');
          clearInterval(this.socketConetectLoop);
          this.$store.state.userStore.connectedTime = 0;
          this.goLobby();
        }

        if (result) {
          this.$store.state.userStore.connectedTime = 0;
          clearInterval(this.socketConetectLoop);
        }
      }, 1000);

      function doCheck() {
        that.socket.emit('id_check', {
          id: that.$store.state.userStore.userName,
          room: that.$store.state.userStore.userRoom,
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
  },
  mounted() {
    this.socketConnectCheck();
    this.isGoLobby();
    this.updateUserRoom();
    this.cardAnimate();
  },
  beforeUnmount() {
    clearInterval(this.socketConetectLoop);
    clearInterval(this.drawVote.countTimer);
    clearInterval(this.gameOver.countTimer);
    this.$store.state.userStore.userRoom = null;
    this.$store.state.userStore.loading = false;
  },
};
</script>

<style scoped>
@import '@/scss/gameRoom.scss';
</style>
