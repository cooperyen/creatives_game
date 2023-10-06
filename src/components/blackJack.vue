<template>
  <div class="bg">
    <userNameBox :userName="player" class="name"></userNameBox>
    <div class="container">
      <!-- <h1>{{ game }}</h1> -->
      <!-- <div>
      {{ state.blackJack }}
    </div> -->
      <!-- snatch bank  -->
      <div v-if="!game.bank">
        <button @click="snatchBank()">bank</button>
      </div>

      <!-- card -->
      <div>{{ game.bank }}</div>

      <!-- players -->
      <blackJackPlayerHandler :players="game.players"></blackJackPlayerHandler>
      <blackJackPlayerHandler :self="game.self"> </blackJackPlayerHandler>

      <!-- self option -->
      <div class="game-ctrl flex">
        <!-- info -->
        <div class="info content">
          <div>COIN {{ game.self.chips }}</div>
        </div>

        <!-- hit -->
        <div class="hit content">
          <!-- hit card player-->
          <div class="flex" v-if="game.bank != player">
            <button
              class="hit"
              :class="{ undo: !bet.isPlayerBet || hit.isPlayerStand }"
              @click="
                bet.isPlayerBet && !hit.isPlayerStand ? playerHitCard() : ''
              "
            >
              Hit
            </button>
            <button
              class="stand"
              :class="{ undo: !bet.isPlayerBet || hit.isPlayerStand }"
              @click="
                bet.isPlayerBet && !hit.isPlayerStand ? playerStopCard() : ''
              "
            >
              Stand
            </button>
          </div>

          <!-- hit card bank-->
          <div class="flex" v-if="bet.isAllBet && game.bank === player">
            <button
              class="hit"
              :class="{ undo: !isBankHit }"
              @click="isBankHit ? playerHitCard() : ''"
            >
              Hit
            </button>
            <button
              class="stand"
              :class="{ undo: !isBankHit }"
              @click="isBankHit ? playerStopCard() : ''"
            >
              Stand
            </button>
          </div>
        </div>

        <!-- coin -->
        <div class="coin content">
          <div class="flex info-box">
            <div class="info">
              <div class="title">MAX BET</div>
              <div class="num">
                {{ game.betMax === 0 ? bet.bankSetMaxBet : game.betMax }}
              </div>
            </div>
            <div class="info" v-if="game.bank != player">
              <div class="title">BET</div>
              <div class="num">
                {{ game.self.bet != 0 ? game.self.bet : bet.playerBeted }}
              </div>
            </div>
          </div>
          <div class="flex">
            <!-- player -->
            <div
              class="coin-box"
              v-if="game.bank != player && game.betMax != null"
            >
              <button
                :class="{ undo: undo() }"
                @click="
                  bet.playerBeted != 0 && game.self.bet === 0 ? playerBet() : ''
                "
              >
                bet
              </button>
            </div>

            <!-- bank set max bet -->
            <div
              v-if="game.bank === player"
              class="coin-box"
              :class="{ undo: bet.isBankSetBetMax && game.bank === player }"
            >
              <button
                @click="
                  bet.isBankSetBetMax && game.bank === player ? '' : setBetMax()
                "
              >
                betMax
              </button>
            </div>
            <!-- coins -->
            <div
              class="coin-box"
              :class="{ undo: isPlayer() ? bankUndo() : undo() }"
              v-for="i in game.coins"
              :key="i"
              @click="isPlayer() ? maxCoin(i.coin) : bitCoin(i.coin)"
            >
              <img :src="'/src/image/poker/' + i.img + '.png'" />
            </div>
            <div
              class="coin-box"
              :class="{ undo: isPlayer() ? bankUndo() : undo() }"
              @click="
                isPlayer() ? (bet.bankSetMaxBet = 0) : (bet.playerBeted = 0)
              "
            >
              reset
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userNameBox from '@/../src/components/layout/userNameBox.vue';
import blackJackPlayerHandler from '@/../src/components/layout/blackJackPlayerHandler.vue';
export default {
  data() {
    return {
      player: null,
      gameRoom: null,
      isBankHit: false,
      hit: {
        isPlayerStand: false,
      },
      bet: {
        isPlayerBet: false,
        playerBeted: 0,
        bankSetMaxBet: 0,
        isAllBet: false,
        isBankSetBetMax: false,
      },
      game: {
        coins: [
          { img: 'coin_25', coin: 25 },
          { img: 'coin_50', coin: 50 },
          { img: 'coin_100', coin: 100 },
        ],
        handCard: null,
        bank: null,
        betMax: 0,
        players: null,
        self: {
          chips: 0,
          bet: 0,
        },
        isHit: false,
        cardCount: null,
        endGame: false,
      },
    };
  },
  components: { userNameBox, blackJackPlayerHandler },
  props: ['socket', 'state'],
  watch: {
    'state.blackJack': {
      handler(el) {
        const data = el.page;
        const msg = el.message;
        // gameing
        if (data.cardStand.length != data.players.length) {
          // reset value.
          this.game.endGame = false;
          this.isBankHit = false;

          // new game with no bank.
          if (data.bank === null || !data.bank) {
            this.bet.playerBeted = 0;
            this.bet.isBankSetBetMax = false;
            this.hit.isPlayerStand = false;
          }

          if (!data.bank && data.max === null) this.bet.bankSetMaxBet = 0;

          // bank play time.
          if (
            this.player === data.bank &&
            data[this.player].handCard.filter((el) => el != 'card_back')
              .length >= 2
          )
            this.isBankHit = true;

          // show hide bank set buttom.
          if (this.player === data.bank && data.max != null)
            this.bet.isBankSetBetMax = true;

          if (msg != null && msg === `${this.player}停牌`)
            this.hit.isPlayerStand = true;

          // game
          this.game.bank = data.bank;
          this.game.betMax = !data.max ? 0 : data.max;
          this.game.handCard = data[this.player].handCard;
          this.game.players = data.players
            .filter((player) => player != this.player)
            .map((player) => {
              data[player].name = player;
              return data[player];
            });

          this.game.self = data.players
            .filter((player) => player === this.player)
            .map((player) => {
              data[player].name = player;
              return data[player];
            })[0];

          this.game.cardCount = data[this.player].cardCount;
          this.game.isHit = this.game.cardCount > 21 ? false : true;

          // bet
          this.bet.isPlayerBet = data[this.player].bet != 0 ? true : false;
          this.bet.isAllBet =
            data.players
              .map((p) => {
                let re;
                if (data[this.game.bank]) return true;
                if (data[p].bet != 0) re = true;
                if (data[p].bet === 0) re = false;
                return re;
              })
              .indexOf(false) === -1
              ? true
              : false;
        }

        // end game.
        if (data.cardStand.length === data.players.length)
          this.game.endGame = true;
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
    setBetMax() {
      if (this.bet.maxCoin <= 0) return;
      const data = this.sendEmitData();
      data.max = this.bet.bankSetMaxBet;
      this.socket.emit('bj', data);
    },
    playerBet() {
      const bet = this.bet.playerBeted;
      // bet not integer and number. do....
      if (!Number.isInteger(bet) && isNaN(bet)) return;

      const betMax = this.game.betMax;
      // betMax not set. do....
      if (betMax === null || betMax === undefined || betMax === 0)
        console.log('bet max not set yet.');

      // betMax setted.
      if (betMax != null && betMax != undefined && betMax != 0) {
        // bet over then betMax.
        if (bet > betMax) console.log('no');

        // bet small then betMax.
        if (bet <= betMax) {
          const data = this.sendEmitData();
          data.bet = bet;
          this.socket.emit('bj', data);
        }
      }
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
    bitCoin(coin) {
      let x = this.bet.playerBeted;
      if (x + coin <= this.game.betMax) this.bet.playerBeted += coin;
    },
    maxCoin(coin) {
      let x = this.bet.bankSetMaxBet;

      if (x + coin < 150) this.bet.bankSetMaxBet += coin;
      else this.bet.bankSetMaxBet = 150;
    },
    undo() {
      if (this.player === this.game.bank) return true;

      return !this.game.betMax || this.bet.isPlayerBet;
    },
    bankUndo() {
      if (this.game.betMax === 0) return false;
      if (this.game.betMax != null) return true;
    },
    sendEmitData() {
      return {
        id: this.player,
        room: `blackjack/${this.gameRoom}`,
      };
    },
    isPlayer() {
      return this.game.bank === this.player ? true : false;
    },
    windowSizeListener() {
      const mediaQuery = '(max-width: 700px)';
      const mediaQueryList = window.matchMedia(mediaQuery);

      mediaQueryList.addEventListener('change', (event) => {
        console.log(window.innerWidth);
        if (event.matches) {
          console.log('The window is now 700px or under');
        } else {
          console.log('The window is now over 700px');
        }
      });
    },
  },
  created() {
    this.player = this.$store.state.userStore.userName;
    this.gameRoom = this.$store.state.userStore.userRoom;
  },
  mounted() {
    // this.windowSizeListener();
    // window.addEventListener('resize', this.windowSizeListener());

    if (this.state.activeGameRoom === null) this.$router.replace('/lobby');

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
