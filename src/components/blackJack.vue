<template>
  <h1>123</h1>
  {{ state.gameDataFirstLoad }}
</template>

<script>
export default {
  props: ['socket', 'state'],
  watch: {
    'state.gameDataFirstLoad': {
      handler(el) {
        console.log(el);
      },
      deep: true,
    },
  },
};
</script>
