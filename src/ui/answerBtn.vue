<template>
  <button :class="{ agree: state === true, cancel: state === false }">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: ['state'],
};
</script>

<style lang="scss" scoped>
@import '@/scss/color.scss';
@import '@/scss/rwd.scss';
button {
  font-size: 1rem;
  padding: 10px 10px;
  border-radius: 10px;
  margin: 0 10px;
  border-width: 2px;
  border-style: solid;
  min-width: 70px;
  cursor: pointer;
  @include xs {
    padding: 8px 10px;
  }
  &.agree {
    background-color: #7ad97a;
    border-color: #54af54;
  }
  &.cancel {
    border-color: rgb(203, 91, 91);
  }
}
</style>
