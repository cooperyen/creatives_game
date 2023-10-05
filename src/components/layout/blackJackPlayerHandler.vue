<template>
  <div class="flex" v-if="players">
    <div class="hand-card-box players" v-for="i in players" :key="i">
      <div>name: {{ i.name }}</div>
      <div>point: {{ i.cardCount }}</div>
      <div>chips: {{ i.chips }}</div>
      <div>bet: {{ i.bet }}</div>
      <div class="in-flex">
        <div class="hand-card" v-for="card in i.handCard" :key="card">
          <img :src="'/src/image/poker/' + card + '.png'" alt="" />
        </div>
      </div>
    </div>
  </div>

  <div class="hand-card-box self-box" v-if="self">
    <div>name: {{ self.name }}</div>
    <div>point: {{ self.cardCount }}</div>
    <div>chips: {{ self.chips }}</div>
    <div>bet: {{ self.bet }}</div>
    <div class="in-flex">
      <div class="hand-card self" v-for="card in self.handCard" :key="card">
        <img :src="'/src/image/poker/' + card + '.png'" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['self', 'players'],
};
</script>
