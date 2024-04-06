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
  @include sm {
    &:first-child {
      margin-bottom: 10px;
    }
  }
  @include xs {
    margin: 0;
    width: 100%;
    padding: 8px 10px;
  }
  &.agree {
    background-color: #a3d19f;
    border-color: #3b873b;
  }
  &.cancel {
    border-color: rgb(195 136 136);
    color: rgb(195 136 136);
  }
}
</style>
