<template>
  <div v-if="windowSize" class="window">
    <div class="content">
      <div class="icon">
        <font-awesome-icon icon="fa-solid fa-mobile-screen-button" />
      </div>
      <div>
        <p>rotate your phone.</p>
      </div>
    </div>
  </div>
  <div class="bg">
    <userNameBox :userName="ownself" class="name"></userNameBox>
    <div class="container">
      <!-- snatch bank  -->
      <div class="snatch-bank" v-if="!game.bank">
        <button @click="snatchBankEmit()">BANK</button>
      </div>

      <!-- hand card -->
      <div>
        <blackJackPlayerHandler
          :players="game.players"
          :bank="game.bank"
        ></blackJackPlayerHandler>
        <blackJackPlayerHandler :self="game.self" :bank="game.bank">
        </blackJackPlayerHandler>
      </div>

      <!-- self option -->
      <div class="game-ctrl">
        <div class="game-info flex">
          <div class="item">COIN {{ game.self.chips }}</div>
          <div class="item">WIN {{ game.self.win }}</div>
        </div>
        <div class="game-option flex">
          <!-- info -->
          <div class="info content flex">
            <div class="info-box flex">
              <div class="info">
                <div class="title"><p>MAX</p></div>
                <div class="num">
                  {{ game.betMax === 0 ? bet.bankSetMaxBet : game.betMax }}
                </div>
              </div>
              <!-- player -->
              <div class="info" v-if="!isPlayerBank()">
                <div class="title"><p>BET</p></div>
                <div class="num">
                  <p>
                    {{
                      arySum(game.self.bet) != 0
                        ? arySum(game.self.bet)
                        : arySum(bet.playerBeted)
                    }}
                  </p>
                </div>
              </div>
              <!-- bank -->
              <div class="info" v-if="isPlayerBank()">
                <div class="title"><p>LIMIT</p></div>
                <div class="num"><p>150</p></div>
              </div>
            </div>
          </div>

          <!-- coin -->
          <div class="coin content">
            <div class="coin-box flex">
              <!-- player -->
              <div
                class="item"
                :class="{
                  undo: arySum(bet.playerBeted) === 0 || bet.isPlayerBet,
                }"
                v-if="!isPlayerBank() && game.betMax != null"
              >
                <button
                  class="bet"
                  @click="
                    bet.playerBeted != 0 && game.self.bet === 0
                      ? playerBetEmit()
                      : ''
                  "
                >
                  BET
                </button>
              </div>

              <!-- bank set max bet -->
              <div
                v-if="isPlayerBank()"
                class="item"
                :class="{
                  undo: bankSetMaxBetHandler(),
                }"
              >
                <button
                  class="bet-max"
                  @click="
                    bet.isBankSetBetMax && isPlayerBank()
                      ? ''
                      : bankBetMaxEmit()
                  "
                >
                  BET<br />
                  MAX
                </button>
              </div>

              <!-- coins -->
              <div
                class="item"
                :class="{ undo: coinShowHideHandler() }"
                v-for="i in game.coins"
                :key="i"
                @click="
                  isPlayerBank()
                    ? bankMaxCoinSet(i.coin)
                    : playerBitCoinSet(i.coin)
                "
              >
                <!-- <img :src="'/src/image/poker/' + i.img + '.png'" /> -->
                <img :src="getCoinUrl(i.img)" />
              </div>

              <!-- rest -->
              <div class="item" :class="{ undo: !restBetBTNHandler() }">
                <button
                  class="reset"
                  @click="
                    isPlayerBank()
                      ? (bet.bankSetMaxBet = 0)
                      : (bet.playerBeted = [])
                  "
                >
                  RESET
                </button>
              </div>
            </div>
          </div>

          <!-- hit -->
          <div class="hit content">
            <!-- hit card player-->
            <div class="flex" v-if="!isPlayerBank()">
              <button
                class="hit"
                :class="{ undo: !bet.isPlayerBet || hit.isPlayerStand }"
                @click="
                  bet.isPlayerBet && !hit.isPlayerStand
                    ? playerHitCardEmit()
                    : ''
                "
              >
                Hit
              </button>
              <button
                class="stand"
                :class="{ undo: !bet.isPlayerBet || hit.isPlayerStand }"
                @click="
                  bet.isPlayerBet && !hit.isPlayerStand
                    ? playerStandCardEmit()
                    : ''
                "
              >
                Stand
              </button>
            </div>

            <!-- hit card bank-->
            <div class="flex" v-if="bet.isAllBet && isPlayerBank()">
              <button
                class="hit"
                :class="{ undo: !isBankHit }"
                @click="isBankHit ? playerHitCardEmit() : ''"
              >
                Hit
              </button>
              <button
                class="stand"
                :class="{ undo: !isBankHit }"
                @click="isBankHit ? playerStandCardEmit() : ''"
              >
                Stand
              </button>
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
import blackJackHitHandler from '@/../src/components/layout/blackJackHitHandler.vue';
export default {
  data() {
    return {
      ownself: null,
      gameRoom: null,
      isBankHit: false,
      windowSize: false,
      hit: {
        isPlayerStand: false,
      },
      bet: {
        isPlayerBet: false,
        playerBeted: [],
        bankSetMaxBet: 0,
        isAllBet: false,
        isBankSetBetMax: false,
      },
      // backend data
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
          win: 0,
        },
        isHit: false,
        cardCount: null,
        endGame: false,
      },
    };
  },
  components: { userNameBox, blackJackPlayerHandler, blackJackHitHandler },
  props: ['socket', 'state'],
  watch: {
    'state.connected': {
      handler(el) {
        if (!el) return;
        const data = { id: this.ownself, room: this.gameRoom };
        this.socket.emit('id_check', data);
        this.socket.emit('bj', {
          id: this.ownself,
          room: `blackjack/${this.gameRoom}`,
        });
      },
    },
    'state.blackJack': {
      handler(el) {
        // console.log(el);
        const data = el.page;
        const msg = el.message;
        // gameing
        if (data.cardStand.length != data.players.length) {
          // reset value.
          this.game.endGame = false;
          this.isBankHit = false;

          // new game with no bank.
          if (data.bank === null || !data.bank) {
            // this.bet.playerBeted = 0;
            this.bet.playerBeted = [];
            this.bet.isBankSetBetMax = false;
            this.hit.isPlayerStand = false;
          }

          if (!data.bank && data.max === null) {
            this.bet.bankSetMaxBet = 0;
            // this.game.self.win -= this.game.self.win -
          }

          // bank play time.
          if (
            this.ownself === data.bank &&
            data[this.ownself].handCard.filter((el) => el != 'card_back')
              .length >= 2
          )
            this.isBankHit = true;

          // show hide bank set buttom.
          if (this.ownself === data.bank && data.max != null) {
            this.bet.isBankSetBetMax = true;
            this.bet.bankSetMaxBet = 0;
          }

          if (msg != null && msg === `${this.ownself}停牌`)
            this.hit.isPlayerStand = true;

          this.receiveDataSeting(data);
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
        const data = this.registerEmit();
        data.showdown = true;
        this.socket.emit('bj', data);
      }
    },
  },
  methods: {
    getCoinUrl(name) {
      return new URL(`/src/image/poker/${name}.png`, import.meta.url).href;
    },
    // data.
    receiveDataSeting(data) {
      // game
      this.game.bank = data.bank;
      this.game.betMax = !data.max ? 0 : data.max;
      this.game.handCard = data[this.ownself].handCard;
      this.game.players = data.players
        .filter((player) => player != this.ownself)
        .map((player) => {
          data[player].name = player;
          return data[player];
        });

      this.game.self = data.players
        .filter((player) => player === this.ownself)
        .map((player) => {
          data[player].name = player;
          data[player].win = data[player].chips - 500;
          return data[player];
        })[0];

      this.game.cardCount = data[this.ownself].cardCount;
      this.game.isHit = this.game.cardCount > 21 ? false : true;

      // bet
      this.bet.isPlayerBet = data[this.ownself].bet != 0 ? true : false;
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
    },
    registerEmit() {
      return {
        id: this.ownself,
        room: `blackjack/${this.gameRoom}`,
      };
    },
    // stock emit.
    snatchBankEmit() {
      const data = {
        id: this.ownself,
        room: `blackjack/${this.gameRoom}`,
        bank: true,
      };
      this.socket.emit('bj', data);
    },
    bankBetMaxEmit() {
      if (this.bet.maxCoin <= 0) return;
      const data = this.registerEmit();
      data.max = this.bet.bankSetMaxBet;
      this.socket.emit('bj', data);
    },
    playerBetEmit() {
      // const bet = this.bet.playerBeted;
      const bet = this.arySum(this.bet.playerBeted);
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
          const data = this.registerEmit();
          data.bet = this.bet.playerBeted;
          this.socket.emit('bj', data);
        }
      }
    },
    playerHitCardEmit() {
      const data = this.registerEmit();
      data.hit = true;
      this.socket.emit('bj', data);
    },
    playerStandCardEmit() {
      const data = this.registerEmit();
      data.stand = true;
      this.socket.emit('bj', data);
    },

    // bet coin.
    playerBitCoinSet(coin) {
      if (this.bet.isPlayerBet) return;
      // let x = this.bet.playerBeted;
      // if (x + coin <= this.game.betMax) this.bet.playerBeted += coin;
      let x = this.arySum(this.bet.playerBeted);
      if (x + coin <= this.game.betMax) this.bet.playerBeted.push(coin);
    },
    bankMaxCoinSet(coin) {
      if (this.bet.isBankSetBetMax) return;
      let x = this.bet.bankSetMaxBet;

      if (x + coin < 150) this.bet.bankSetMaxBet += coin;
      else this.bet.bankSetMaxBet = 150;
    },

    // show hide handler
    bankSetMaxBetHandler() {
      if (this.game.bank != this.ownself) return false;
      if (this.bet.bankSetMaxBet === 0) return true;
      if (this.bet.bankSetMaxBet != 0) return false;
    },
    restBetBTNHandler() {
      // const player =
      //   this.bet.playerBeted != 0 && !this.bet.isPlayerBet ? true : false;
      const player =
        this.arySum(this.bet.playerBeted) != 0 && !this.bet.isPlayerBet
          ? true
          : false;

      const bank = this.bet.bankSetMaxBet != 0 ? true : false;

      return this.isPlayerBank() ? bank : player;
    },
    coinShowHideHandler() {
      let result = false;
      if (!this.isPlayerBank()) {
        if (this.ownself === this.game.bank) result = true;
        result = !this.game.betMax || this.bet.isPlayerBet;
      }
      if (this.isPlayerBank()) {
        if (this.game.betMax === 0) result = false;
        if (this.game.betMax != 0 && this.game.betMax != null) result = true;
      }

      return result;
    },

    arySum(arr) {
      const reducer = (accumulator, curr) => accumulator + curr;
      if (arr.length === 0 || arr === 0) return 0;
      else return arr.reduce(reducer);
    },

    /**
     * check the bank is ownself.
     */
    isPlayerBank() {
      return this.game.bank === this.ownself ? true : false;
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
    detectWindowWidth(e) {
      if (window.innerWidth < 768 && window.innerWidth < window.innerHeight)
        this.windowSize = true;

      if (window.innerWidth >= 768 && window.innerWidth > window.innerHeight)
        this.windowSize = false;
    },
  },
  created() {
    this.ownself = this.$store.state.userStore.userName;
    this.gameRoom = this.$store.state.userStore.userRoom;
  },
  unmounted() {
    window.removeEventListener('resize', this.detectWindowWidth);
  },
  mounted() {
    this.detectWindowWidth();
    window.addEventListener('resize', this.detectWindowWidth);

    if (this.state.activeGameRoom === null) this.$router.replace('/lobby');

    if (this.state.activeGameRoom != null)
      this.$store.state.userStore.loading = true;
  },
};
</script>
<style scoped>
@import '@/scss/blackJack.scss';
</style>
