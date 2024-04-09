<template>
  <div class="ans_container" v-if="show">
    <div class="content">
      <div class="text">
        <h2><slot></slot></h2>
      </div>
      <div class="btn_box">
        <answerBtn state="true" class="agree" @click="this.$emit('agree', true)"
          >同意</answerBtn
        >
        <answerBtn
          state="false"
          class="cancel"
          @click="this.$emit('close', false)"
        >
          取消
        </answerBtn>
      </div>
    </div>
  </div>
</template>

<script>
import answerBtn from '@/../src/components/global/answerBtn.vue';
export default {
  props: ['show'],
  components: { answerBtn },
};
</script>

<style lang="scss" scoped>
@import '@/scss/answerHandler.scss';
</style>
