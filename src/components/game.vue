<template>
  <div id="in_play">
    <h1>{{ player }}</h1>
    <div v-if="gameData === null"></div>
    <div v-else>
      <p>
        level:<span>{{ level }}</span>
      </p>
      <p id="hp">
        生命值:<span>{{ hp }}</span>
      </p>
      <p id="dart">
        飛鏢:<span>{{ dart }}</span>
      </p>

      <p id="card">
        檯面上的牌: <span>{{ currentCard }}</span>
      </p>
      <p id="dis_card">勇敢的出牌吧!!</p>
      <button @click="playcard()">我覺得應該輪到我</button>
      <!-- <button onclick="start_draw()">丟飛鏢</button> -->
    </div>
  </div>

  <!-- <div id="draw" style="display: none"> -->
  <!-- <button onclick="draw('yes')">同意</button>
    <button onclick="draw('no')">不要咧</button> -->
  <!-- </div> -->
  <div id="hand-card">
    <div class="title">
      <p>我的手牌</p>
    </div>
    <div class="card-box" v-for="i in 6" :key="i">
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
</template>

<script>
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
      currentCard: null,
    };
  },
  props: ['socket', 'state'],
  watch: {
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
        if (!isNaN(el.card)) this.currentCard = el.card;
        else alert(el.card);

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
      const handCardBox = document.querySelectorAll('.card-box');
      const handCardLength = handCardBox.length;

      for (let i = 0; i < handCardBox.length; i++) {
        const DOM = handCardBox[i];
        console.log(i === 0);
        const degrees =
          i === 0
            ? (handCardLength / (i + 1)) * (80 * i + 1)
            : (handCardLength / (i + 1)) * (8 * i);
        DOM.style.transform = `translate(${i * 20}px , ${
          i + 2 * 5
        }px) rotate(${degrees}deg) scale(${i * (0.1 - i) * 0.1})`;
        DOM.style.zIndex = handCardLength - i;
      }
      // handCardBox.forEach((el) => {
      //   el.style.transform = 'translate(-50%, -50%)';
      // });
      // console.log(handCardBox.length);
    },
  },
  methods: {
    playcard() {
      const data = { player: this.player, room: this.state.activeGameRoom };
      this.socket.emit('play', data);
    },
  },
  mounted() {
    // console.log(this.state);
    this.player = this.$store.state.userStore.userName;
    this.socket.emit('game_room', this.state.activeGameRoom);
  },
};
</script>

<style scoped>
@import '@/scss/gameRoom.scss';
</style>
