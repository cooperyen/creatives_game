<template>
  <!-- players -->
  <div class="flex" v-if="players">
    <!-- {{  }} -->
    <div class="hand-card-box players" v-for="i in players" :key="i">
      <!-- bank icon -->
      <div class="bank-box flex">
        <div v-show="i.name === bank">
          <img src="@/image/poker/start.svg" />
        </div>
        <div class="count flex">count : {{ i.cardCount }}</div>
      </div>
      <!-- hand card -->
      <div class="hand-cards in-flex">
        <div class="hand-card" v-for="card in i.handCard" :key="card">
          <div :class="{ 'card-shdow': card === 'card_back' }">
            <img :src="'/src/image/poker/card/' + card + '.png'" alt="" />
          </div>
        </div>
      </div>
      <!-- player info -->
      <div class="info-box">
        <div class="name">{{ i.name }}</div>
        <div>${{ i.chips }}</div>
        <div v-show="i.name != bank" class="coin-box flex">
          <div class="item" v-for="i in sort(i.bet)" :key="i">
            <img :src="'/src/image/poker/coin_' + i + '.png'" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ownself -->
  <div class="hand-card-box self-box" v-if="self">
    <!-- bank icon -->
    <div class="bank-box flex">
      <div v-show="self.name === bank">
        <img src="@/image/poker/start.svg" />
      </div>
      <div class="count flex">count : {{ self.cardCount }}</div>
    </div>
    <div class="in-flex hand-cards">
      <div
        class="hand-card self"
        v-for="(card, index) in self.handCard"
        :key="index"
      >
        <div :class="{ 'card-shdow': card === 'card_back' }">
          <img :src="'/src/image/poker/card/' + card + '.png'" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['self', 'players', 'bank'],
  watch: {
    players() {
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
    sort(arr) {
      if (arr.length === 0 || arr === 0) return [];
      function compare(a, b) {
        return a - b;
      }
      return arr.sort(compare);
    },
    cardTranform() {
      const handCard = document.querySelector('.self-box .hand-cards');
      const self = handCard.querySelectorAll('.hand-card.self');

      let move = 0;

      setTimeout(() => {
        self.forEach((el) => {
          el.style.transform = `translateX(-${move}px)`;
          if (self.length > 2) move += 100;
        });

        let mover = 0;
        if (self.length > 2) mover = (move - 100) / 2;
        handCard.style.transform = `translateX(${mover}px)`;
      }, 100);
    },
    playersCardTranform() {
      const handCardBox = document.querySelectorAll('.hand-card-box.players');

      // setTimeout(() => {
      handCardBox.forEach((el) => {
        let move = 0;
        const handCard = el.querySelectorAll('.hand-card');
        handCard.forEach((s) => {
          s.style.transform = `translateX(-${move}px)`;
          if (handCard.length > 2) move += 65;
        });
      });
      // }, 100);
    },
    coinsTranform() {
      const coins = document.querySelectorAll('.info-box .coin-box');
      let move = 0;
      setTimeout(() => {
        coins.forEach((el) => {
          const coin = el.querySelectorAll('.item');
          coin.forEach((s) => {
            s.style.transform = `translateX(-${move}px)`;
            move += 20;
          });
        });
      }, 100);
    },
  },
  mounted() {
    // this.cardTranform();
    this.$nextTick(() => {
      // this.cardTranform();
      // this.coinsTranform();
      // this.playersCardTranform();
    });
  },
};
</script>
