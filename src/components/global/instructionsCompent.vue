<template>
  <div id="instruction" v-if="show">
    <div class="content">
      <div class="title">
        {{ title }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ['show', 'game'],
  computed: {
    title() {
      return $store.state.instruction[game].title.ch;
    },
  },
};
</script>

<style lang="scss" scoped>
#instruction {
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  position: fixed;
  .content {
    width: calc(100% - 30px);
    padding: 15px 5px;
    max-width: 500px;
    margin: 0 auto;
  }
}
</style>
