<template>
  <div class="ans_container" v-if="show">
    <div class="content">
      <div class="text">
        <h2><slot></slot></h2>
      </div>
      <div class="btn_box">
        <answerBtn state="true" class="agree" @click="this.$emit('agree', true)"
          >agree</answerBtn
        >
        <answerBtn
          state="false"
          class="cancel"
          @click="this.$emit('close', false)"
        >
          cancel
        </answerBtn>
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
