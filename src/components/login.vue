<template>
  <transition name="login">
    <div class="container" v-show="loading">
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
</template>

<script>
export default {
  data() {
    return {
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
        console.log(el);
        if (el) this.loading = true;
        if (!el) this.loading = false;
      },
    },
    'state.goUrl': {
      handler(el) {
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
  },
  beforeUnmount() {
    localStorage.removeItem('reloaded');
  },
  mounted() {
    this.state.connected = false;
  },
};
</script>
<style scoped>
@import '@/scss/login.scss';
</style>
