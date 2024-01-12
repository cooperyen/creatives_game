<template>
  <div id="vote" v-if="playerMove.currentStep === 'vote'">
    <div v-if="playerMove.voteOpen">
      <template v-for="(val, index) in gameData.tableCard" :key="index">
        <div
          class="item"
          :class="[playerMove.voteNumber === index ? 'check' : 'default']"
          @click="updateVoteNumber(index)"
        >
          <p v-html="card(val)"></p>
        </div>
      </template>

      <div class="btn-box">
        <button
          class="btn"
          :class="{ selected: playerMove.voteNumber != null }"
          @click="vote"
          :disabled="playerMove.voteNumber === null"
        >
          投票
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['isShow', 'isOpen', 'gameData', 'playerMove'],
  methods: {
    card(el) {
      let result = this.gameData.quest;
      const usedCards = this.splitUsedCard(el);

      usedCards.forEach((card) => {
        result = result.replace('__', `<span class="insert">${card}</span>`);
      });

      return result;
    },
    splitUsedCard(el) {
      const quest = this.gameData.quest.split('__');
      let st = el;

      quest.forEach((els) => {
        st = st.replace(els, ',');
      });

      return st.split(',').filter((r) => r != '' && r != ' ');
    },

    vote() {
      this.$emit('vote');
    },
    updateVoteNumber(val) {
      this.$emit('updateVoteNumber', val);
    },
  },
};
</script>

<style scoped>
@import '@/scss/yellowCard.scss';
</style>
