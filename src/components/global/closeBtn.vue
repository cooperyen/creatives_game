<template>
  <div class="close_btn">
    <button><font-awesome-icon icon="fa-solid fa-circle-xmark" /></button>
  </div>
</template>

<style lang="scss" scoped>
@import '@/scss/color.scss';
.close_btn {
  position: absolute;
  right: 7px;
  top: 7px;
  button {
    cursor: pointer;
    color: $mainColor;
    font-size: clamp(1.3rem, 1.5rem, 10vw);
    background-color: transparent;
  }
}
</style>
