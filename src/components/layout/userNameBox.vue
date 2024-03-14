<template>
  <transition name="lobby">
    <div class="user-container" :class="[on ? on : 'light']" v-show="ani">
      <div class="content">
        {{ userIcon }}
        <h2 id="userid">勇者: {{ userName }}</h2>
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
      on: false,
    };
  },
  props: ['userName', 'userIcon'],
  watch: {
    $route: {
      handler(to, from) {
        this.ani = false;
      },
    },
  },
  mounted() {
    this.on =
      this.$route.meta.style?.userName != undefined
        ? this.$route.meta.style.userName
        : false;
    // console.log(this.on);
    if (this.userName != null) this.ani = true;
    else this.ani = false;
  },
};
</script>

<style lang="scss" scoped>
@import '@/../../../scss/color.scss';
@import '@/../../../scss/rwd.scss';
.user-container {
  height: 80px;
  position: relative;
  width: 100%;
  overflow: hidden;
  @include sm {
    height: 80px;
  }
  &.dark {
    color: black;
  }
  &.light {
    color: $text_default_title;
  }
  > :deep(.content) {
    right: 20px;
    top: 20px;
    position: absolute;
    @include sm {
      right: 10px;
      top: 10px;
      h2 {
        font-size: 1rem;
      }
    }
    p {
      text-align: right;
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
