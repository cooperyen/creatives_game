<template>
  <div id="instruction" v-if="show">
    <div class="content">
      <div class="title">
        <h2>{{ $store.state.instructions[game].title.ch }}</h2>
      </div>
      <div class="text_box">
        <div class="text">
          <p>{{ $store.state.instructions[game].content.ch.title }}</p>
        </div>
      </div>
      <div class="text_box">
        <div
          class="text"
          v-for="i in $store.state.instructions[game].content.ch.content"
          :key="i"
        >
          <p>{{ i }}</p>
        </div>
      </div>
      <closeBtn @click="close()"></closeBtn>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ['show', 'game'],
  methods: {
    close() {
      this.$emit('close', false);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/color.scss';
#instruction {
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  position: fixed;
  background-color: $bg_pevent;
  z-index: 2;
  align-items: center;
  display: flex;
  .content {
    width: calc(100% - 30px);
    padding: 15px 25px;
    max-width: 800px;
    max-height: 600px;
    height: 60%;
    min-height: 20%;
    margin: 0 auto;
    background-color: $bg_light;
    border-radius: 8px;
    box-shadow: 0 0 0 8px #8cacdb;
    position: relative;
    .title {
      h2 {
        font-size: 1.2rem;
        color: $titlColor;
      }
    }
    .text_box {
      margin-top: 20px;
      .text {
        margin-top: 10px;
      }
    }
  }
}
</style>
