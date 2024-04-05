<template>
  <transition name="login">
    <div id="login" v-show="$store.state.userStore.loading">
      <div class="login-container">
        <div class="title">
          <h1 class="">
            <span
              :class="{ space: t === ' ' }"
              class="ani_text"
              v-for="(t, i) in titleText()"
              :key="i"
            >
              {{ t }}
            </span>
            <p class="ani_text">
              <span class="dot">.</span>
            </p>
          </h1>
        </div>
        <div class="content flex">
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
            <button @click="login()">登入</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <div class="connected" v-show="tryTime != 0">
    <div>connecting : {{ tryTime }}</div>
  </div>
  <backGroundAnimate></backGroundAnimate>
</template>

<script>
export default {
  emits: ['waitPageTrLoop'],
  data() {
    return {
      tryTime: 0,
      userName: '',
      loading: false,
      connected: '',
      title: '幫自己取個名字吧',
      // Give yourself a name
    };
  },
  props: ['socket', 'state'],
  methods: {
    login() {
      const nameLength = this.userName.length;

      // character should between 1-15
      if (this.userName === '' || nameLength > 15) alert('this.userName');
      if (this.userName != '' && nameLength <= 15) {
        this.$store.state.userStore.userName = this.userName;
        this.socket.emit('login', {
          id: this.userName,
          icon: this.$store.state.userStore.icon,
        });
      }
    },
    titleText() {
      let res = this.title.split('');
      return res;
    },
    titleAnimte() {
      const text = document.querySelectorAll(
        '.login-container .title .ani_text'
      );
      function xx() {
        let sum = 1;
        text.forEach((el) => {
          setTimeout(() => {
            el.classList.add('ani_');
          }, sum * 100);

          sum += 1;
          setTimeout(() => {
            el.classList.remove('ani_');
          }, sum * 600);
        });
      }
      xx();

      setInterval(() => {
        xx();
      }, text.length * 1000);
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
        if (el === null) return;
        this.$router.replace(el);
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
    this.$nextTick(() => this.titleAnimte());
    setTimeout(() => {
      this.$store.commit('updateLoading', true);
    }, 1000);
  },
};
</script>
<style scoped>
@import '@/scss/login.scss';
</style>
