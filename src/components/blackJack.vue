<template>
  <div class="container">
    <h1>{{ game }}</h1>
    <div>
      {{ state.blackJack }}
    </div>
    <!-- snatch bank  -->
    <div v-if="!game.bank">
      <button @click="snatchBank()">bank</button>
    </div>
    <!-- bank set max bet -->
    <div v-if="!bet.isBankSetBetMax && game.bank === player">
      <button @click="setBetMax(30)">betMax</button>
    </div>
    <!-- card -->
    <div></div>
    <!-- player -->
    <div v-if="!bet.isPlayerBet && game.bank != player">
      <button @click="playerBet(30)">bet</button>
    </div>
    <!-- players -->
    <div>
      <div v-for="i in game.players" :key="i">
        {{ i }}
      </div>
    </div>
    <!-- hit card player-->
    <div v-if="bet.isAllBet && game.bank != player && game.isHit">
      <button @click="playerHitCard()">hit card</button>
      <button @click="playerStopCard()">stop card</button>
    </div>

    <!-- hit card bank-->
    <div v-if="bet.isAllBet && game.bank === player">
      <button @click="playerHitCard()">hit card</button>
      <button @click="playerStopCard()">stop card</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      player: null,
      gameRoom: null,
      bet: {
        isPlayerBet: false,
        isAllBet: false,
        isBankSetBetMax: false,
      },
      game: {
        handCard: null,
        bank: null,
        betMax: null,
        players: null,
        isHit: false,
        cardCount: null,
        endGame: false,
      },
    };
  },
  props: ['socket', 'state'],
  watch: {
    'state.goUrl': {
      handler(el) {
        console.log(el);

        // if (el != null) this.$router.replace(el);
      },
      deep: true,
    },
    'state.blackJack': {
      handler(el) {
        if (el.cardStand.length != el.players.length) {
          this.game.endGame = false;
          // game
          this.game.bank = el.bank;
          this.game.betMax = el.max;
          this.game.handCard = el[this.player].handCard;
          this.game.players = el.players.map((p) => {
            return { [p]: el[p] };
          });

          this.game.cardCount = el[this.player].cardCount;
          this.game.isHit = this.game.cardCount > 21 ? false : true;

          // bet
          this.bet.isPlayerBet = el[this.player].bet != 0 ? true : false;
          this.bet.isAllBet =
            el.players
              .map((p) => {
                let re;
                if (el[this.game.bank]) return true;
                if (el[p].bet != 0) re = true;
                if (el[p].bet === 0) re = false;
                return re;
              })
              .indexOf(false) === -1
              ? true
              : false;
        } else {
          this.game.endGame = true;
        }
      },
      deep: true,
    },
    'game.endGame'(el) {
      console.log(el);
      if (el) {
        const data = this.sendEmitData();
        data.showdown = true;
        this.socket.emit('bj', data);
      }
    },
  },
  methods: {
    snatchBank() {
      const data = {
        id: this.player,
        room: `blackjack/${this.gameRoom}`,
        bank: true,
      };
      this.socket.emit('bj', data);
    },
    setBetMax(el) {
      const data = this.sendEmitData();
      data.max = el;
      this.bet.isBankSetBetMax = true;
      this.socket.emit('bj', data);
    },
    playerBet(el) {
      const data = this.sendEmitData();
      data.bet = el;
      this.socket.emit('bj', data);
    },
    playerHitCard() {
      const data = this.sendEmitData();
      data.hit = true;
      this.socket.emit('bj', data);
    },
    playerStopCard() {
      const data = this.sendEmitData();
      data.stand = true;
      this.socket.emit('bj', data);
    },
    sendEmitData() {
      return {
        id: this.player,
        room: `blackjack/${this.gameRoom}`,
      };
    },
  },
  mounted() {
    if (this.state.activeGameRoom === null) this.$router.replace('/lobby');

    this.player = this.$store.state.userStore.userName;
    this.gameRoom = this.$store.state.userStore.userRoom;
    // this.snatchBank();
    // console.log(object);
    const data = { id: this.player, room: this.gameRoom };

    console.log(data);
    this.socket.emit('id_check', data);

    // console.log(this.gameRoom);
    this.socket.emit('bj', {
      id: this.player,
      room: `blackjack/${this.gameRoom}`,
    });
  },
  // created(){}
};
</script>
<style scoped>
@import '@/scss/blackJack.scss';
</style>
