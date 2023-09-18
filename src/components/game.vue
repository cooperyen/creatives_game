<template>
  <userNameBox :userName="player" class="name"></userNameBox>
  <div class="game-container">
    <div id="in_play">
      <div v-if="gameData === null"></div>
      <div class="game-info" v-else>
        <p>
          Level:<span>{{ level }}</span>
        </p>
        <p id="hp">
          生命值 : <span>{{ hp }}</span>
        </p>
        <p id="dart">
          飛鏢 : <span>{{ dart }}</span>
        </p>
        <!-- <button onclick="start_draw()">丟飛鏢</button> -->
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
      <div class="card-play">
        <button @click="playcard()">我覺得應該輪到我</button>
        <button @click="start_draw()">丟飛鏢</button>
        <div id="draw" v-if="drawVote">
          {{ drawVote }}
          <button @click="draw('yes')">同意</button>
          <button @click="draw('no')">不要咧</button>
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
      dart: null,
      remain: null,
      level: null,
      currentCard: [],
      num: 10,
      drawVote: false,
    };
  },
  components: { userNameBox },
  props: ['socket', 'state'],
  watch: {
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
      },
      deep: true,
    },
    'state.gameDataFirstLoad': {
      handler(el) {
        console.log(el);
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
        } else alert(el.card);

        if (tureFalse('hp')) this.hp = el.hp;
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
    handCard(el) {
      console.log('handCard', this.handCard);
      this.$nextTick(() => {
        this.cardAnimate();
      });
    },
  },
  methods: {
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
    start_draw() {
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
    draw(data) {
      this.socket.emit('draw', {
        message: data,
        room: this.state.activeGameRoom,
      });
    },
  },
  mounted() {
    this.cardAnimate();
    // console.log(this.state);
    this.player = this.$store.state.userStore.userName;
    this.socket.emit('game_room', this.state.activeGameRoom);
  },
};
</script>

<style scoped>
@import '@/scss/gameRoom.scss';
</style>
