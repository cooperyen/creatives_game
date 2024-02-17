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
          <button @click.prevent="connected ? login() : ' '">登入</button>
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
        this.socket.emit('login', {
          id: this.userName,
          icon: this.$store.state.gameData.playerIcon[0],
        });
      }
    },
  },
  computed: {
    connecteds() {
      return this.state.connected;
    },
  },
  watch: {
    'state.connected': {
      handler(el) {
        this.connected = el;
      },
      deep: true,
    },
    'state.goUrl': {
      handler(el) {
        // console.log('url', el);
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
  // create new database from local.
  created() {
    this.$store.commit('createDefaultData');
  },
  beforeMount() {
    // this.$store.commit('backGorund', 'default');
  },
  beforeUnmount() {
    localStorage.removeItem('reloaded');
  },
  mounted() {
    setTimeout(() => {
      const conetectLoop = setInterval(() => {
        this.connectedTime += 1;
        if (this.connected) {
          this.connectedTime = 0;
          clearInterval(conetectLoop);
          setTimeout(() => {
            this.$store.commit('updateLoading', true);
          }, 200);
        }
        // if (this.connectedTime >= 5) this.socket.emit('isConnect');
        if (this.connectedTime >= 10) {
          // this.$router.go(0);
        }
      }, 1000);
    }, 200);
  },
};
</script>
<style scoped>
@import '@/scss/login.scss';
</style>
