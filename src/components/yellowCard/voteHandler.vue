<template>
  <div id="vote" v-if="playerMove.currentStep === 'vote'">
    <div v-if="playerMove.voteOpen">
      <template v-for="(val, index) in gameData.tableCard" :key="index">
        <div
          class="item"
          :class="[playerMove.voteNumber === index ? 'check' : 'default']"
          @click="updateVoteNumber(index)"
        >
          <p>{{ vals(val) }}</p>
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
    vals(el) {
      console.log(this.gameData.quest);
      const x = this.gameData.quest.split('__');
      let yy = '';
      let sub = [];
      console.log(x);
      x.forEach((xxx) => {
        sub.push(el.indexOf(xxx));
      });
      // sub.push(el.length);
      console.log(sub);

      for (let i = 0; i < sub.length; i++) {
        console.log(yy);

        if (x[i].length === 0) yy += `k${el.substring(sub[i], sub[i + 1])}k`;
        if (x[i].length != 0 && i + 1 < sub.length) {
          console.log(sub[i + 1] - sub[i]);
          yy += `${el.substring(sub[i], sub[i] + x[i].length)}`;
          yy += `c${el.substring(sub[i] + x[i].length, sub[i + 1])}c`;
        }

        if (i + 1 === sub.length)
          yy += `${el.substring(sub[i], sub[i] + x[i].length)}`;
      }

      return yy;
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
