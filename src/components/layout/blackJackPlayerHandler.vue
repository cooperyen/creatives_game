<template>
  <div class="flex" v-if="players">
    <div class="hand-card-box players" v-for="i in players" :key="i">
      <div class="bank flex">
        <div v-show="i.name === bank">
          <img src="@/image/poker/start.svg" />
        </div>
        <div class="count flex">count : {{ i.cardCount }}</div>
      </div>
      <div class="in-flex">
        <div class="hand-card" v-for="card in i.handCard" :key="card">
          <div :class="{ 'card-shdow': card === 'card_back' }">
            <img :src="'/src/image/poker/card/' + card + '.png'" alt="" />
          </div>
        </div>
      </div>
      <!-- <div>{{ i }}</div> -->
      <div>name : {{ i.name }}</div>
      <div>chips : {{ i.chips }}</div>
      <div v-show="i.name != bank">bet : {{ i.bet }}</div>
      <!-- <div>count : {{ i.cardCount }}</div> -->
    </div>
  </div>

  <div class="hand-card-box self-box" v-if="self">
    <div class="bank flex">
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
    'self.handCard'() {
      this.$nextTick(() => {
        // this.cardTranform();
      });
    },
  },
  methods: {
    cardTranform() {
      const self = document.querySelectorAll('.hand-card.self');
      const handCard = document.querySelector('.hand-cards');
      let move = 0;
      setTimeout(() => {
        self.forEach((el) => {
          el.style.transform = `translateX(-${move}px)`;
          move += 100;
        });
        handCard.style.transform = `translateX(${(move - 100) / 2}px)`;
      }, 100);
    },
  },
  mounted() {
    // this.cardTranform();
  },
};
</script>
