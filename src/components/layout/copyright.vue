<template>
  <div id="copyright">
    <p>©{{ time }} CREATIVES TEAM&COOPER.</p>
  </div>
</template>

<script>
export default {
  computed: {
    time() {
      return new Date().getFullYear();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/rwd.scss';
#copyright {
  position: fixed;
  left: 50%;
  bottom: 15px;
  transform: translate(-50%, -50%);
  font-size: 0.9rem;
  color: rgb(157 166 187);
  width: auto;
  text-align: center;
  z-index: 5;
  white-space: nowrap;
  @include L {
    bottom: 2px;
    font-size: 0.7rem;
  }
}
</style>
