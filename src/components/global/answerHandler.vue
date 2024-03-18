<template>
  <div class="ans_container" v-if="show">
    <div class="content">
      <div class="text">
        <h2><slot></slot></h2>
      </div>
      <div class="btn_box">
        <answer-btn
          state="true"
          class="agree"
          @click="this.$emit('agree', true)"
          >agree</answer-btn
        >
        <answer-btn
          state="false"
          class="cancel"
          @click="this.$emit('close', false)"
        >
          cancel
        </answer-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['show'],
};
</script>

<style lang="scss" scoped>
@import '@/scss/answerHandler.scss';
</style>
