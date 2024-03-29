<template>
  <div id="pop_annunce" class="full_container bg" v-if="show">
    <div class="middle content">
      <div class="text">
        <p><slot></slot></p>
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
  > div.middle {
    max-width: 300px;
    width: 100%;
    background-color: rgb(255 255 243);
    top: 40%;
    border-radius: 8px;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.6);
  }
  .content {
    padding: 20px;
    text-align: center;
  }
  .text {
    margin-bottom: 25px;
    font-size: clamp(1rem, 1.5rem, 3vw);
  }
  .btn {
    margin-top: 15px;
    button {
      cursor: pointer;
      padding: 12px 20px;
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
