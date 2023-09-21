<template>
  <div class="container">
    <div class="title">
      <h1>幫自己取個名字吧</h1>
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
</template>

<script>
export default {
  data() {
    return {
      userName: '',
    };
  },
  props: ['socket', 'state'],
  methods: {
    login() {
      if (this.userName === '') alert('this.userName');
      if (this.userName != '') {
        this.$store.state.userStore.userName = this.userName;
        this.socket.emit('login', { id: this.userName });
      }
    },
  },
  created() {
    this.$store.commit('clearUserRoom');
  },
  watch: {
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
  mounted() {},
};
</script>
<style scoped>
@import '@/scss/login.scss';
</style>
