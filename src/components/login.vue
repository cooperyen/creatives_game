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
      <div class="login btn">
        <button @click.prevent="connecting()">登入</button>
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
      this.socket.emit('login', 'dfdsfd');

      // if (this.state.login) this.$router.push(`?user=${this.state.socketId}`);
    },
    connecting() {
      this.socket.emit('set_ids', 'dfdsfd');
    },
  },
};
</script>
