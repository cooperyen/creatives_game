<template>
  <transition name="lobby">
    <div class="user-container" v-show="ani">
      <div class="content">
        <h2 id="userid">勇者 : {{ userName }}</h2>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      ani: false,
    };
  },
  props: ['userName'],
  watch: {
    $route: {
      handler(to, from) {
        this.ani = false;
      },
    },
  },
  mounted() {
    if (this.userName != null) this.ani = true;
    else this.ani = false;
  },
};
</script>

<style lang="scss" scoped>
@import '@/../../../scss/color.scss';
@import '@/../../../scss/rwd.scss';
.user-container {
  color: $text;
  height: 80px;
  position: relative;
  width: 100%;
  overflow: hidden;
  > :deep(.content) {
    right: 20px;
    top: 20px;
    position: absolute;
    h2 {
      @include sm {
        font-size: 1.2rem;
      }
    }
    a {
      color: $text;
      float: right;
      @include sm {
        font-size: 1rem;
      }
    }
    a,
    p {
      cursor: pointer;
    }
  }
}
</style>
