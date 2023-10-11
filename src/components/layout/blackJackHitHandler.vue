<template>
  <!-- hit -->
  <div class="hit content">
    <!-- hit card player-->
    <div class="flex" v-if="status">
      <slot></slot>
    </div>

    <!-- hit card bank-->
    <div class="flex" v-if="!status">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['status'],
};
</script>
