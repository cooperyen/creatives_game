<template>
  <div class="connected" v-show="store.state.loopStore.tryTime != 0">
    <div>connecting : {{ store.state.loopStore.tryTime }}</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useStore } from 'vuex';
const props = defineProps(['socket', 'state']);
const store = useStore();

onMounted(() => {
  socketConnectCheck();
});

function socketConnectCheck() {
  store.commit('connectHandlerDelete');
  store.commit('connected', false);

  store.commit(
    'connectHandler',
    setInterval(() => {
      store.commit('loopTimePlus');
      if (props.state.connected) store.commit('connected', true);
      if (props.state.connected === 'fail' || store.state.userStore.loading)
        store.commit('connectHandlerDelete');
    }, 1000)
  );
}
</script>
