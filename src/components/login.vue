<template>
  <transition name="login">
    <div class="login-container" v-show="$store.state.userStore.loading">
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
            @keyup.enter="login()"
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
      connected: '',
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
    // this.$store.commit('clearUserRoom');
  },
  watch: {
    'state.connected': {
      handler(el) {
        // console.log(el);
        this.connected = el;
        if (el) this.$store.state.userStore.loading = el;
      },
    },
    'state.goUrl': {
      handler(el) {
        console.log('url', el);
        if (el === null) return;
        this.$router.replace(el);
        // this.state.goUrl = null;
      },
      deep: true,
    },
    'state.loginError': {
      handler(el) {
        if (el === null) return;
        alert(JSON.stringify(el));
      },
      deep: true,
    },
  },
  created() {
    localStorage.setItem(
      'userData',
      JSON.stringify({ userName: null, userRoom: null })
    );
    this.state.connected = false;
  },
  beforeUnmount() {
    localStorage.removeItem('reloaded');
    this.$store.state.userStore.loading = false;
  },
  mounted() {
    // this.$emit('waitPageTrLoop', true);

    const that = this;
    const conetectLoop = setInterval(() => {
      const result = doCheck();
      this.connectedTime += 1;
      if (result) {
        this.connectedTime = 0;
        clearInterval(conetectLoop);
        setTimeout(() => {
          this.$store.state.userStore.loading = true;
        }, 1000);
      }
      if (this.connectedTime >= 10) this.$router.go(0);
    }, 1000);

    function doCheck(el) {
      if (that.state.connected || that.connected) return true;
      if (!that.state.connected || !that.connected) return false;
    }
  },
};
</script>
<style scoped>
@import '@/scss/login.scss';
</style>
