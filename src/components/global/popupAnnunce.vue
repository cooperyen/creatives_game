<template>
  <div id="pop_annunce" class="full_container bg" v-if="show">
    <div class="middle content">
      <div class="text">
        <p class="main"><slot></slot></p>
        <p class="notice"><slot name="notice"></slot></p>
      </div>
      <div class="btn">
        <button @click="close()">確定</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['show'],
  methods: {
    close() {
      this.$emit('close', false);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/color.scss';
#pop_annunce {
  top: 0;
  left: 0;
  > div.middle {
    position: absolute;
    max-width: 400px;
    width: calc(100% - 30px);
    margin: 0 auto;
    background-color: rgb(255 255 243);
    top: 40%;
    border-radius: 8px;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.6);
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .content {
    padding: 20px;
    text-align: center;
  }
  .text {
    margin-bottom: 20px;
    .main {
      font-size: clamp(1.3rem, 1.6rem, 3vw);
    }
    .notice {
      margin-top: 2px;
      font-size: clamp(0.9rem, 1rem, 2vw);
    }
  }
  .btn {
    margin-top: 15px;
    button {
      cursor: pointer;
      padding: 8px 20px;
      border-radius: 8px;
      background-color: $agree_btn;
      box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.15);
      width: auto;
      &:hover {
        background-color: $agree_btn_hover;
      }
    }
  }
}
</style>
