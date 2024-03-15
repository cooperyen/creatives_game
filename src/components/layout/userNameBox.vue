<template>
  <transition name="lobby">
    <div class="user-container" :class="[on ? on : 'light']" v-show="ani">
      <div class="content">
        <div class="flex">
          <div class="icon">
            <img
              :src="this.$global_getImgUrl(userIcon, 'player_icon')"
              alt=""
            />
          </div>
          <div class="user flex">
            <p>勇者 : {{ userName }}</p>
          </div>
        </div>
      </div>

      <slot></slot>
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
  background-color: rgba(255, 255, 255, 0.5);
  height: 80px;
  position: relative;
  width: 100%;
  overflow: hidden;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 10px;
  @include sm {
    padding-top: 5px;
    height: 45px;
  }
  &.dark {
    color: black;
  }
  &.light {
    color: $text_default_title;
  }
  > :deep(.icon) {
    width: 50px;
  }
  > :deep(.content) {
    right: 20px;
    top: 20px;
    position: absolute;
    @include sm {
      right: 15px;
      top: 10px;
      h2 {
        font-size: 1rem;
      }
    }
    p {
      text-align: right;
      font-weight: bold;
    }
    .user {
      align-items: center;
    }

    .icon {
      width: 40px;
      margin-right: 5px;
      margin-left: 5px;
      @include sm {
        width: 25px;
      }
    }
  }
}
</style>
