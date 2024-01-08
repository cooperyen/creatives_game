<template>
  <div id="drop" v-if="playerMove.currentStep === 'drop'">
    <div v-if="playerMove.dropOpen">
      <div class="conetnt flex">
        <div
          class="card item"
          v-for="(val, index) in gameData.selfHand"
          :key="index"
        >
          <div
            class="option"
            @click.stop="
              playerMove.pickCard.includes(val)
                ? pickDropCardRemove(val)
                : pickDropCard(val)
            "
          >
            {{ val }}
            <template
              v-for="(pickCard, cardIndex) in playerMove.pickCard"
              :key="cardIndex"
            >
              <div class="num" v-if="val === pickCard">
                {{ cardIndex + 1 }}
              </div>
            </template>
          </div>
        </div>
      </div>

      <div class="btn-box flex">
        <button class="btn" @click="drop">棄牌</button>
        <button
          class="btn"
          @click="repickCard"
          :disabled="playerMove.pickCard.length === 0"
        >
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['gameData', 'playerMove'],
  methods: {
    pickDropCardRemove(val) {
      this.$emit('pickDropCardRemove', val);
    },
    pickDropCard(val) {
      this.$emit('pickDropCard', val);
    },
    drop() {
      this.$emit('drop');
    },
    repickCard() {
      this.$emit('repickCard');
    },
  },
};
</script>

<style scoped>
@import '@/scss/yellowCard.scss';
</style>
