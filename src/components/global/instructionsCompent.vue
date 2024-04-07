<template>
  <div id="instruction" v-if="show">
    <div class="container">
      <div class="title">
        <h2>{{ $store.state.instructions[game].title.ch }}</h2>
      </div>
      <div class="content">
        <div class="text_box">
          <div class="text">
            <p>{{ $store.state.instructions[game].content.ch.title }}</p>
          </div>
          <div
            class="text"
            v-for="i in $store.state.instructions[game].content.ch.content"
            :key="i"
          >
            <p v-html="html(i)"></p>
          </div>
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
    html(i) {
      return i.replace(/([$])/g, '<span class="ObjectBrace">$1</span>');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/color.scss';
@import '@/scss/rwd.scss';
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
  text-align: justify;

  .container {
    width: calc(100% - 30px);
    max-width: 800px;
    max-height: 600px;
    height: calc(100% - 30px);
    // min-height: 100px;
    margin: 0 auto;
    background-color: $bg_light;
    border-radius: 8px;
    box-shadow: 0 0 0 8px rgb(182, 182, 182);
    position: relative;
    overflow: hidden;

    .content {
      overflow-y: auto;
      height: calc(100% - 65px);
    }
    .title {
      padding: 0 25px;
      margin-bottom: 15px;
      margin-top: 15px;
      @include sm {
        padding: 0 15px;
      }
      h2 {
        font-size: 1.5rem;
        color: $titlColor;
      }
    }
    .text_box {
      padding: 0 25px 30px 25px;
      @include sm {
        padding: 0 15px 30px 15px;
      }
      .text {
        margin-top: 10px;
        :deep(.red) {
          color: #bd3d35;
        }
      }
    }
  }
}
</style>
