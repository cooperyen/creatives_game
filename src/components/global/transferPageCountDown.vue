<template>
  <div class="connected">
    <div
      v-if="store.state.loopStore.tryTime != 0 && store.state.userStore.loading"
    >
      connecting : {{ store.state.loopStore.tryTime }}
    </div>
    <div
      v-if="
        store.state.loopStore.connectTryTime != 0 &&
        !store.state.userStore.loading
      "
    >
      connecting : {{ store.state.loopStore.connectTryTime }}
    </div>
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
      store.commit('connectTimePlus');

      if (props.state.connected === true) store.commit('connected', true);
      if (
        props.state.connected === 'fail' ||
        store.state.userStore.loading ||
        store.state.loopStore.connectTryTime >= 27
      )
        store.commit('connectHandlerDelete');
    }, 1000)
  );
}
</script>
