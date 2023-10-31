<template>
  <div class="connected" v-show="$store.state.userStore.connectedTime != 0">
    <div>connecting : {{ $store.state.userStore.connectedTime }}</div>
  </div>
</template>
