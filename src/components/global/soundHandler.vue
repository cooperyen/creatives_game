<template>
  <audio ref="audio" autoplay loop v-if="sound">
    <source
      :src="soundUrl(soundList[sound].name, soundList[sound].type)"
      type="audio/mp3"
    />
  </audio>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted, computed } from 'vue';

const soundList = {
  bg: { name: 'lobby', type: 'mp3' },
};
const props = defineProps(['bg', 'sound']);
const audio = ref(null);
let set = null;
const num = ref(0);

onMounted(() => {
  if (!props.sound) return;
  if (props.bg) {
    const audioContext = new AudioContext();
    const track = audioContext.createMediaElementSource(audio.value);
    const gainNode = audioContext.createGain();
    track.connect(gainNode).connect(audioContext.destination);
    gainNode.gain.value = num.value;

    set = setInterval(() => {
      num.value += 0.1;
      gainNode.gain.value = num.value;
      if (num.value >= 1) {
        clearInterval(set);
      }
    }, 200);
  }
});

onBeforeUnmount(() => {
  if (!props.sound) return;
  clearInterval(set);
  audio.value.pause();
});

function soundUrl(soundName, type) {
  return new URL(`/src/sound/${soundName}.${type}`, import.meta.url).href;
}
</script>
