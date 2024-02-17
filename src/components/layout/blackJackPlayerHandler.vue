<template>
  <!-- players -->
  <div class="flex" v-if="players">
    <div
      class="hand-card-box players-box"
      v-for="(i, index) in players"
      :key="index"
    >
      <!-- bet coins -->
      <div v-show="i.name != bank" class="coin-box flex">
        <div class="item" v-for="i in sort(i.bet)" :key="i">
          <img :src="getCoinUrl(i)" />
        </div>
      </div>
      <!-- bank icon -->
      <div class="bank-box flex">
        <div class="icon" v-show="i.name === bank">
          <img src="@/image/poker/start.svg" />
        </div>
      </div>
      <!-- hand cards -->
      <div class="hand-cards in-flex">
        <div class="count flex" v-show="i.cardCount != 0">
          {{ i.cardCount <= 9 ? '0' + i.cardCount : i.cardCount }}
        </div>
        <div
          class="hand-card player"
          v-for="(card, index) in i.handCard"
          :key="index"
          :style="{ 'z-index': index }"
        >
          <div :class="{ 'card-shdow': card === 'card_back' }">
            <img :src="getPorkerUrl(card)" alt="" />
          </div>
        </div>
      </div>
      <!-- player info -->
      <div class="info-box">
        <div class="name">
          <p>{{ i.name }}</p>
        </div>
        <div class="chips">
          <p>coin : ${{ i.chips }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ownself -->
  <div class="hand-card-box self-box" v-if="self">
    <!-- bank icon -->
    <div class="bank-box flex">
      <div class="icon" v-show="self.name === bank">
        <img src="@/image/poker/start.svg" />
      </div>
      <!-- point -->
      <div class="count flex" v-show="self.cardCount != 0">
        {{ self.cardCount <= 9 ? '0' + self.cardCount : self.cardCount }}
      </div>
    </div>
    <!-- hand cards -->
    <div class="in-flex hand-cards">
      <div
        class="hand-card self"
        v-for="(card, index) in self.handCard"
        :key="index"
        :style="{ 'z-index': index }"
      >
        <div :class="{ 'card-shdow': card === 'card_back' }">
          <img :src="getPorkerUrl(card)" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['self', 'players', 'bank'],
  watch: {
    players(el) {
      this.$nextTick(() => {
        this.coinsTranform();
        this.playersCardTranform();
      });
    },
    'self.handCard'() {
      this.$nextTick(() => {
        this.cardTranform();
      });
    },
  },
  methods: {
    getCoinUrl(name) {
      return new URL(`/src/image/poker/coin_${name}.png`, import.meta.url).href;
    },
    getPorkerUrl(name) {
      return new URL(`/src/image/poker/card/${name}.png`, import.meta.url).href;
    },
    sort(arr) {
      if (arr.length === 0 || arr === 0) return [];
      function compare(a, b) {
        return a - b;
      }
      return arr.sort(compare);
    },
    cardTranform() {
      const handCard = document.querySelector('.self-box .hand-cards');
      const handCardEach = document.querySelectorAll(
        '.self-box .hand-cards .self'
      );
      const self = handCard.querySelectorAll('.hand-card.self');

      let move = 0;
      let num = 90;
      let mover = 0;

      if ((window.innerWidth >= 992) & (window.innerWidth < 1139)) num = 100;
      if (window.innerWidth >= 1140) num = 130;
      if (window.innerWidth <= 576) num = 60;

      setTimeout(() => {
        self.forEach((el) => {
          el.style.transform = `translateX(-${move}px)`;
          if (self.length > 2) move += num;
        });

        if (self.length > 2) {
          const swith = handCardEach[0].getBoundingClientRect().width;
          mover = (swith * self.length - move) * 2;
          handCard.style.transform = `translateX(${mover}px)`;
        }
        if (self.length <= 2) {
          handCard.style.transform = '';
        }
      }, 100);
    },
    playersCardTranform() {
      // console.log('object');
      const handCardBox = document.querySelectorAll(
        '.hand-card-box.players-box'
      );
      let move = 0;
      let num = 80;
      if (window.innerWidth >= 992) num = 65;
      if (window.innerWidth <= 576) num = 55;

      handCardBox.forEach((el) => {
        const handCard = el.querySelectorAll('.hand-card');
        handCard.forEach((s) => {
          s.style.transform = `translateX(-${move}px)`;
          if (handCard.length > 2) move += num;
        });
      });
    },
    coinsTranform() {
      const coins = document.querySelectorAll(
        '.hand-card-box.players .coin-box'
      );
      let move = 0;
      // setTimeout(() => {
      coins.forEach((el) => {
        const coin = el.querySelectorAll('.item');
        coin.forEach((s) => {
          s.style.transform = `translateX(-${move}px)`;
          move += 20;
        });
      });
      // }, 100);
    },
  },
  mounted() {
    this.$nextTick(() => {
      () => {
        this.cardTranform();
        this.coinsTranform();
        this.playersCardTranform();
      };
    });
    window.addEventListener('resize', () => {
      this.cardTranform();
      this.coinsTranform();
      this.playersCardTranform();
    });
  },
};
</script>
