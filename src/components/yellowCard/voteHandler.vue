<template>
  <div id="vote" v-if="playerMove.currentStep === 'vote'">
    <div v-if="playerMove.voteOpen">
      <template v-for="(val, index) in gameData.tableCard" :key="index">
        <div
          class="item"
          :class="[playerMove.voteNumber === index ? 'check' : 'default']"
          @click="updateVoteNumber(index)"
        >
          <p>{{ val }}</p>
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
