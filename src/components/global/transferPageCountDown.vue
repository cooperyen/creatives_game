<template>
  <div class="connected" v-show="$store.state.loopStore.tryTime != 0">
    <div>connecting : {{ $store.state.loopStore.tryTime }}</div>
  </div>
</template>
