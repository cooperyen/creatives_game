<template>
  <audio ref="audio" autoplay loop v-if="sound">
    {{ soundMax }}
    <source
      :src="soundUrl(soundList[sound].name, soundList[sound].type)"
      type="audio/mp3"
    />
  </audio>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted, computed } from 'vue';
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
const soundMax = computed(() => {
  clearInterval(set.value);
  const sound = store.state.userStore.userSound;
  if (sound === undefined) store.commit('updateUserSound', 1);
  if (sound != 0) audioSoundStart(500, sound);
  console.log(audio.value);
  return sound;
});

let audioContext;
let track;
let gainNode;

onMounted(() => {
  if (!props.sound) return;
  audioHandler();
  // audioSoundStart(500);
});

function audioSoundStart(time, maxs) {
  const max = maxs;
  console.log(maxs);
  set.value = setInterval(() => {
    if (max != 0) {
      num.value += 0.1;
      gainNode.gain.value = num.value;
      if (num.value >= max) {
        clearInterval(set.value);
        num.value = 0;
      }
    }
    if (max === 0) {
      console.log(object);
      gainNode.gain.value = 0.0;

      clearInterval(set.value);
      num.value = 0;
    }
  }, time);
}

function audioHandler(el) {
  audioContext = new AudioContext();
  track = audioContext.createMediaElementSource(audio.value);
  gainNode = audioContext.createGain();
  track.connect(gainNode).connect(audioContext.destination);
  audio.value.pause();
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
