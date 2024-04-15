<template>
  <div id="await" v-if="isShowAwait(moveStep.currentStep)">
    <div class="await" :class="{ active: isShowAwait(moveStep.currentStep) }">
      <div
        v-if="moveStep.currentStep === 'vote'"
        class="content"
        v-html="waitQuest.quest"
      ></div>

      <div class="text">
        <p v-if="moveStep.currentStep === 'vote'">
          等待其他人出牌<span></span>
        </p>

        <p v-if="moveStep.currentStep === 'drop'">
          等待其他人投票<span></span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(['playerMove', 'wait', 'data']);
const emits = defineEmits(['show']);

const moveStep = computed(() => {
  return props.playerMove;
});

const datas = computed(() => {
  return props.data;
});

const waitQuest = computed(() => {
  return props.wait;
});

function isShowAwait(el) {
  let result = false;
  switch (el) {
    case 'vote':
      result = !moveStep.value.voteOpen ? true : false;
      break;
    case 'drop':
      result = !moveStep.value.dropOpen ? true : false;
      break;
    case 'statistic':
      result = true;
      break;
  }

  emits('show', !result);
  return result;
}
</script>

<style lang="scss" scoped>
@import '@/scss/rwd.scss';
@import '@/scss/color.scss';
// #await {
//   position: fixed;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   max-width: calc(100% - 50px);
//   width: 100%;
//   margin: 0 auto;
//   @include min-med {
//     max-width: calc(100% - 200px);
//   }
//   @include xs {
//     max-width: calc(100% - 15px);
//   }
//   &::v-deep(.insert) {
//     color: rgb(215, 57, 49);
//   }
//   .content {
//     padding: 25px 0;
//     border-radius: 8px;
//     font-size: clamp(1.4rem, 3vw, 2.2rem);
//     // background-color: $yellowCardLight;
//     text-align: center;
//     font-weight: bold;
//   }
//   .text {
//     font-size: 1.4rem;
//     margin-top: 5vh;
//     color: rgb(29, 29, 29) 37;
//     text-align: center;

//     span {
//       position: absolute;
//       &::after {
//         content: '...';
//         display: block;
//         width: 0%;
//         overflow: hidden;
//         animation: loading 1s infinite ease-in-out;
//       }
//     }
//   }
// }
</style>
