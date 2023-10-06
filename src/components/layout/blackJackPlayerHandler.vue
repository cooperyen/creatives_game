<template>
  <div class="flex" v-if="players">
    <div class="hand-card-box players" v-for="i in players" :key="i">
      <!-- <div>name: {{ i.name }}</div>
      <div>point: {{ i.cardCount }}</div>
      <div>chips: {{ i.chips }}</div>
      <div>bet: {{ i.bet }}</div> -->
      <div class="in-flex">
        <div class="hand-card" v-for="card in i.handCard" :key="card">
          <img :src="'/src/image/poker/' + card + '.png'" alt="" />
        </div>
      </div>
      <slot></slot>
    </div>
  </div>

  <div class="hand-card-box self-box" v-if="self">
    <!-- <div>point: {{ self.cardCount }}</div>
    <div>chips: {{ self.chips }}</div>
    <div>bet: {{ self.bet }}</div> -->
    <div class="in-flex hand-cards">
      <div
        class="hand-card self"
        v-for="(card, index) in self.handCard"
        :key="index"
      >
        <img :src="'/src/image/poker/' + card + '.png'" alt="" />
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ['self', 'players'],
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
