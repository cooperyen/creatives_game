<template>
  <div class="connected" v-show="$store.state.loopStore.connectedTime != 0">
    <div>connecting : {{ $store.state.loopStore.connectedTime }}</div>
  </div>
</template>
