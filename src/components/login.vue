<template>
  <transition name="login">
    <div class="container" v-show="$store.state.userStore.loading">
      <div class="title">
        <h1>
          幫自己取個名字吧
          <p>.</p>
        </h1>
      </div>
      <div class="content">
        <div class="input-box">
          <input
            v-model="userName"
            type="text"
            placeholder="名字必須有氣勢"
            required=""
          />
        </div>
        <div class="login btn">
          <button @click.prevent="login()">登入</button>
        </div>
      </div>
    </div>
  </transition>
  <div class="connected" v-show="connectedTime != 0">
    <div>connecting : {{ connectedTime }}</div>
  </div>
</template>

<script>
export default {
  emits: ['waitPageTrLoop'],
  data() {
    return {
      connectedTime: 0,
      userName: '',
      loading: false,
    };
  },
  props: ['socket', 'state'],
  methods: {
    login() {
      const nameLength = this.userName.length;

      if (this.userName === '' || nameLength > 15) alert('this.userName');
      if (this.userName != '' && nameLength <= 15) {
        this.$store.state.userStore.userName = this.userName;
        this.socket.emit('login', { id: this.userName });
      }
    },
  },
  created() {
    this.$store.commit('clearUserRoom');
  },
  watch: {
    'state.connected': {
      handler(el) {
        // console.log(el);
        if (el) this.$store.state.userStore.loading = true;
        if (!el) this.$store.state.userStore.loading = false;
      },
    },
    'state.goUrl': {
      handler(el) {
        console.log('url', el);
        if (el === null) return;
        this.$router.push(el);
        // this.state.goUrl = null;
      },
      deep: true,
    },
    'state.loginError': {
      handler(el) {
        if (el === null) return;
        alert(el);
      },
      deep: true,
    },
  },
  created() {
    localStorage.setItem('userData', JSON.stringify({ userName: null }));
    this.state.connected = false;
  },
  beforeUnmount() {
    localStorage.removeItem('reloaded');
    this.$store.state.userStore.loading = false;
  },
  mounted() {
    // this.$emit('waitPageTrLoop', true);

    const conetectLoop = setInterval(() => {
      const result = doCheck(this);
      this.connectedTime += 1;
      if (result) {
        this.connectedTime = 0;
        clearInterval(conetectLoop);
        this.$store.state.userStore.loading = true;
      }
      if (this.connectedTime >= 4) this.$router.go(0);
    }, 1000);

    function doCheck(el) {
      if (el.state.connected) return true;
      if (!el.state.connected) return false;
    }
  },
};
</script>
<style scoped>
@import '@/scss/login.scss';
</style>
