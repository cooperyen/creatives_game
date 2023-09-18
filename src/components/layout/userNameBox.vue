<template>
  <div class="user-container">
    <div class="content">
      <h2 id="userid" style="text-align: right">勇者 : {{ userName }}</h2>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['userName'],
};
</script>

<style lang="scss" scoped>
@import '@/../../../scss/color.scss';
.user-container {
  color: $text;
  height: 50px;
  position: relative;
  > .content:deep {
    right: 20px;
    top: 20px;
    position: absolute;
    a {
      color: $text;
      float: right;
    }
  }
}
</style>
