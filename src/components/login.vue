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
      this.$store.state.userStore.userName = this.userName;
      this.socket.emit('login', { id: this.userName });
    },
  },
  created() {
    this.$store.commit('clearUserRoom');
  },
  mounted() {
    const that = this;

    this.socket.on('re_act', function (data) {
      if (data.way !== 'login') return;
      localStorage.setItem('userData', JSON.stringify({ userName: data.id }));
      setTimeout(() => {
        // state.login = true;
        that.$router.push('/lobby');
      }, 500);
    });
  },
};
</script>
<style scoped>
@import '@/scss/login.scss';
</style>
