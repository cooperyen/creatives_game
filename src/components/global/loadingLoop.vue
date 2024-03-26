<template>
  <div id="looping">
    <div class="loading">
      <div class="ani"></div>
    </div>
    <div class="text">LOADING</div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import '@/scss/color.scss';
#looping {
  width: 100%;
  height: 100%;
  background-color: rgba($color: $shadowcolor, $alpha: 0.7);
  position: fixed;
  z-index: 9999999999;
  .loading,
  .text {
    color: white;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
  }
  .loading {
    .ani {
      width: 100%;
      height: 100%;
      border-radius: 100%;
      border: 2px solid transparent;
      border-color: transparent #fff transparent #fff;
      animation: rotate-loading 1.5s linear infinite;
    }
  }
  .text {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

@keyframes rotate-loading {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
