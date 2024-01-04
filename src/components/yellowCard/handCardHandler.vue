<template>
  <!-- hand card -->
  <div id="hand-card" v-show="playerMove.currentStep === 'used'">
    <div v-if="playerMove.usedOpen">
      <!-- quest -->
      <div id="quest">
        <p>{{ gameData.quest }}</p>
      </div>
      <!-- content -->
      <div class="conetnt flex">
        <div
          class="card item"
          v-for="(val, index) in gameData.selfHand"
          :key="index"
        >
          <div
            class="option"
            :class="{ selected: playerMove.pickCard.includes(val) }"
            @click="
              playerMove.pickCard.includes(val)
                ? pickUsedCardRemove(val)
                : pickUsedCard(val)
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
      <!-- btn -->
      <div class="btn-box flex">
        <button
          class="btn"
          :class="{
            selected: playerMove.pickCard.length === gameData.questLength,
          }"
          @click="used"
          :disabled="playerMove.pickCard.length != gameData.questLength"
        >
          出牌
        </button>
        <button
          class="btn"
          @click="rePickUsedCard"
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
  props: ['isShow', 'isOpen', 'gameData', 'playerMove'],
  methods: {
    pickUsedCard(val) {
      this.$emit('pickUsedCard', val);
    },
    pickUsedCardRemove(val) {
      this.$emit('pickUsedCardRemove', val);
    },
    used() {
      this.$emit('used');
    },
    rePickUsedCard() {
      this.$emit('rePickUsedCard');
    },
  },
};
</script>

<style scoped>
@import '@/scss/yellowCard.scss';
</style>
