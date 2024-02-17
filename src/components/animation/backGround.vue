<template>
  <div class="check"></div>
</template>

<style lang="scss" scoped>
.check {
  overflow: hidden;
  display: grid;
  place-items: center;
  place-content: center;
  background-color: rgb(244, 244, 244);
  position: relative;
  &::after {
    content: '';
    --size: 250vmax;
    --bg-size: 200px;
    grid-area: body;
    inline-size: var(--size);
    block-size: var(--size);
    background-image: url('@/./image/bg/icons_bg.svg');
    background-size: var(--bg-size);
    background-repeat: repeat;
    transform: rotate(45deg);
    opacity: 0.1;
    animation: login_bg 10s linear infinite;
    position: fixed;
    z-index: -3;
  }
}

@keyframes login_bg {
  to {
    background-position: 0 calc(var(--bg-size) * -1);
  }
}
</style>
