<template>
  <audio ref="audio" autoplay loop v-if="sound" :data-sound="soundMax">
    <source
      :src="soundUrl(soundList[sound].name, soundList[sound].type)"
      type="audio/mp3"
    />
  </audio>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted, computed, watch } from 'vue';
import { useStore } from 'vuex';
const store = useStore();

const soundList = {
  bg: { name: 'lobby', type: 'mp3' },
  mind: { name: 'mind', type: 'mp3' },
};
const props = defineProps(['bg', 'sound', 'max']);
const audio = ref(null);
const set = ref(null);
const num = ref(0);
const list = [0, 0.4, 1];

const soundMax = computed(() => {
  clearInterval(set.value);
  const sound = store.state.userStore.userSound;
  if (sound === undefined || !list.includes(sound))
    store.commit('updateUserSound', 1);
  if (list.includes(sound) && audio.value != null) audioSoundStart(500, sound);
  return sound;
});

let audioCtx;
let source;
let gainNode;

onMounted(() => {
  if (!props.sound) return;
  audioHandler();
  if (list.includes(store.state.userStore.userSound)) audio.value.play();
});

watch(
  () => store.state.userStore.userSound,
  (el) => {
    if (el === 0) audio.value.pause();
    if (list.includes(el)) audio.value.play();
  }
);

function audioSoundStart(time, maxs) {
  const max = maxs;
  gainNode.gain.setTargetAtTime(max, audioCtx.currentTime + 1, 0.5);
}

function audioHandler(el) {
  audioCtx = new AudioContext();
  source = audioCtx.createMediaElementSource(audio.value);
  gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.1;
  source.connect(gainNode).connect(audioCtx.destination);
  audio.value.pause();
  audioSoundStart(500, 0.2);
}

onBeforeUnmount(() => {
  if (!props.sound) return;
  clearInterval(set.value);
  audio.value.pause();
});

function soundUrl(soundName, type) {
  return new URL(`/src/sound/${soundName}.${type}`, import.meta.url).href;
}
</script>
