<template>
  <div class="ready flex">
    <div class="host" v-show="host">
      <img :src="$global_getImgUrl('host', 'ui')" />
    </div>
    <p>READY</p>
  </div>
</template>

<script>
export default {
  props: ['host'],
};
</script>

<style lang="scss" scoped>
$br: rgb(84, 177, 137);

.content {
  position: relative;
}
.ready {
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
  color: $br;
  border-radius: 8px;

  .host {
    width: 22px;
    margin-right: 2px;
    display: flex;
    align-items: center;
  }
}
</style>
