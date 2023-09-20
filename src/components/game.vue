<template>
  <userNameBox :userName="player" class="name"></userNameBox>
  <div class="transition" v-show="passNotice != false">
    <!-- <div id="transition"> -->
    <div class="next-container">
      <div class="msg-box">
        <h2>
          {{ passNotice.msg }}
        </h2>
      </div>
      <div class="countDown">
        <div class="title">即將進入下一關</div>
        <div class="time">
          {{ time }}
        </div>
      </div>
    </div>
  </div>
  <div class="transition" v-if="drawVote">
    <div id="dart">
      <div class="title">
        <h2>有人現在要使用飛鏢, 同意使用嗎?</h2>
      </div>
      <img src="./../image/ui/gem_large.png" />
      <div class="click-btn">
        {{ isDrawVote }}
        <button
          class="agree"
          :class="{ disabled: isDrawVote === 'no' }"
          :disabled="isDrawVote === 'no'"
          @click="voiteDart('yes')"
        >
          <p>&nbsp;&nbsp;同意&nbsp;&nbsp;</p>
        </button>
        <button
          class="reject"
          :class="{ disabled: isDrawVote === 'yes' }"
          @click="voiteDart('no')"
          :disabled="isDrawVote === 'yes'"
        >
          不要咧
        </button>
      </div>
    </div>
  </div>
  <!-- GAME OVER -->
  <div class="transition" v-if="gameOver">
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
          <button @click="$router.replace('/lobby')">leave</button>
        </div>
      </div>
    </div>
  </div>

  <div v-show="!passNotice" class="game-container">
    <div id="in_play">
      <div v-if="gameData === null"></div>
      <div class="game-info" v-else>
        <p>
          Level:<span>{{ level }}</span>
        </p>
      </div>
    </div>

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
      </div>
    </div>

    <div id="hand-card">
      <div class="card-container">
        <div class="card-box card-style" v-for="i in handCard" :key="i">
          <div class="card-num">
            <p>
              <span>{{ i }}</span>
            </p>
          </div>
          <div class="card-bg">
            <img src="./../image/card/01.svg" />
          </div>
        </div>
      </div>
      <div class="card-play" v-if="!drawVote">
        <div id="play" class="click-btn">
          <button @click="playcard()">我覺得應該輪到我</button>
          <button @click="start_dart()" :disabled="dart === 0 || dart === null">
            丟飛鏢
          </button>
        </div>
      </div>
    </div>

    <div class="game_info">
      <div class="flex">
        <!-- <p>生命值</p> -->
        <div v-for="i in hp" :key="i">
          <img src="./../image/ui/hp.svg" />
        </div>
        <div v-for="i in dieHp - hp" :key="i">
          <img src="./../image/ui/hp_die.svg" />
        </div>
      </div>

      <div class="flex dart">
        <!-- <p>生命值</p> -->
        <div v-for="i in dart" :key="i">
          <img src="./../image/ui/gem.png" />
        </div>
        <div v-for="i in dieDart - dart" :key="i">
          <img src="./../image/ui/gem_die.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userNameBox from '@/../src/components/layout/userNameBox.vue';
export default {
  data() {
    return {
      player: null,
      gameData: false,
      handCard: null,
      hp: null,
      dieHp: 4,
      dart: null,
      dieDart: 4,
      remain: null,
      level: null,
      currentCard: [],
      num: 10,
      drawVote: false,
      isDrawVote: null,
      passNotice: false,
      time: 5,
      gameOver: null,
      players: null,
    };
  },
  components: { userNameBox },
  props: ['socket', 'state'],
  watch: {
    passNotice(el) {
      if (el.msg != null && el.states === 'msg') {
        this.time = 5;
        this.showTime();
      }
    },
    'state.drawVote': {
      handler(el) {
        if (el === true) this.drawVote = el;
        if (el === false) {
          this.drawVote = false;
          alert('Not pass game yet, Continue playing games');
        }
        if (el === null) {
          this.drawVote = false;
        }
        this.isDrawVote = null;
      },
      deep: true,
    },
    'state.gameDataFirstLoad': {
      handler(el) {
        this.gameData = true;
        this.hp = el.hp;
        this.dart = el.dart;
        this.remain = el.remain;
        this.level = el.data.level;
        this.handCard = el.data[this.player];
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
          if (this.hp < el.hp) console.log('fail');
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
        console.log('gogo', el);
        if (el.url === null && el.url != 'lobby') return;
        this.gameOver = true;
        this.dart = el.dart;
        this.hp = el.hp;
        this.level = el.level;
        this.player = el.player;
        // this.$router.replace('/lobby');
      },
    },
    handCard(el) {
      console.log('handCard', this.handCard);
      this.$nextTick(() => {
        this.cardAnimate();
      });
    },
  },
  methods: {
    showTime() {
      this.time -= 1;

      if (this.time <= 0) {
        this.passNotice = false;
      }
      if (this.time != 0) {
        setTimeout(() => {
          this.showTime();
        }, 1000);
      }
    },
    playcard() {
      const data = { player: this.player, room: this.state.activeGameRoom };
      this.socket.emit('play', data);
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

        console.log(i);

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
    start_dart() {
      console.log(this.dart);
      if (this.dart > 0) {
        this.socket.emit('draw', {
          message: 'go',
          room: this.state.activeGameRoom,
        });
      } else {
        alert('沒飛鏢啊!!按屁按逆!!');
      }
    },
    voiteDart(data) {
      if (data === 'yes') {
        this.socket.emit('draw', {
          message: data,
          room: this.state.activeGameRoom,
        });
      }
      if (data === 'no') {
        this.drawVote = false;
      }
      this.isDrawVote = data;
    },
  },
  mounted() {
    if (this.state.activeGameRoom === null) this.$router.replace('/lobby');
    this.cardAnimate();
    this.player = this.$store.state.userStore.userName;
    this.socket.emit('game_room', this.state.activeGameRoom);
  },
};
</script>

<style scoped>
@import '@/scss/gameRoom.scss';
</style>
