<template>
  <div id="drop" v-if="playerMove.currentStep === 'drop'">
    <div v-if="playerMove.dropOpen">
      <h2>選擇0-3張牌棄掉</h2>
      <div class="conetnt flex">
        <div
          class="card item"
          v-for="(val, index) in gameData.selfHand"
          :key="index"
        >
          <div
            class="option"
            :class="{ selected: playerMove.pickCard.includes(val) }"
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
        <button
          class="btn"
          @click="drop"
          :class="{
            selected: playerMove.pickCard.length >= 1,
          }"
        >
          棄牌
        </button>
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
