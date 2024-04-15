<template>
  <div id="vote" v-if="playerMove.currentStep === 'vote'">
    <div v-if="playerMove.voteOpen">
      <h2>誰最沒梗?</h2>
      <template v-for="(val, index) in gameData.tableCard" :key="index">
        <div
          class="item"
          :class="[playerMove.voteNumber === index ? 'check' : 'default']"
          @click="updateVoteNumber(index, val)"
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
  props: ['gameData', 'playerMove'],
  methods: {
    card(el) {
      let result = this.gameData.quest;
      const usedCards = this.splitUsedCard(el);

      usedCards.forEach((card) => {
        result = result.replace('___', `<span class="insert">${card}</span>`);
      });

      return result;
    },
    splitUsedCard(el) {
      const quest = this.gameData.quest.split('___');
      let st = el;

      quest.forEach((els) => {
        st = st.replace(els, ',');
      });

      return st.split(',').filter((r) => r != '' && r != ' ');
    },

    vote() {
      speechSynthesis.cancel();
      this.$emit('vote');
    },
    updateVoteNumber(index, val) {
      speechSynthesis.cancel();
      // let utterance = new SpeechSynthesisUtterance(val);
      this.voice(val);
      this.$emit('updateVoteNumber', index);
    },
    voice(msg) {
      const synth = window.speechSynthesis;
      let u = new SpeechSynthesisUtterance();
      u.text = msg;
      let voices = synth.getVoices();

      for (let index = 0; index < voices.length; index++) {
        /*
    "Google US English"
    "Google 日本語"
    "Google 普通话（中国大陆）"
    "Google 粤語（香港）"
    "Google 國語（臺灣）"
    */

        if (
          voices[index].name ==
          'Microsoft HsiaoChen Online (Natural) - Chinese (Taiwan)'
        ) {
          //HsiaoChen (Neural) - 曉臻 (MS Edge專用)
          u.voice = voices[index];
          break;
        } else if (voices[index].name == 'Google 國語（臺灣）') {
          //Chrome專用
          u.voice = voices[index];
          break;
        }

        //當最後一個都還沒找到時才設u.lang
        if (index + 1 === voices.length) {
          u.lang = 'zh-TW';
        }
      }

      synth.speak(u);
    },
  },
};
</script>

<style scoped>
@import '@/scss/yellowCard.scss';
</style>
