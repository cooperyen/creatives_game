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
  position: absolute;
  left: 50%;
  bottom: 15px;
  transform: translateX(-50%);
  font-size: 0.9rem;
  color: rgb(157 166 187);
  width: 100%;
  text-align: center;
  @include sm {
    font-size: 0.6rem;
  }
}
</style>
