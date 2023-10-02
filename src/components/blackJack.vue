<template>
  <h1>123</h1>
  {{ state.gameDataFirstLoad }}
</template>

<script>
export default {
  data() {
    return {
      cooper: this.state.gameDataFirstLoad,
    };
  },
  props: ['socket', 'state'],
  watch: {
    'state.gameDataFirstLoad': {
      handler(el) {
        console.log(el);
        this.cooper = el;
      },
      deep: true,
    },
  },
  mounted() {
    if (this.state.activeGameRoom === null) this.$router.replace('/lobby');
  },
};
</script>
