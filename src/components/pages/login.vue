<template>
  <transition name="login">
    <div id="login" v-show="$store.state.userStore.loading">
      <div class="login-container">
        <div class="title">
          <h1 class="">
            <span
              :class="{ space: string === ' ' }"
              class="ani_text"
              v-for="(string, index) in titleText()"
              :key="index"
            >
              {{ string }}
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

  <popupAnnunce :show="annunceShow" @close="(n) => (annunceShow = n)"
    >請輸入 3 - 15 字元

    <template v-slot:notice>不含特殊符號 : $#!@...</template>
  </popupAnnunce>

  <!-- sound -->
  <soundHandler id="bg_sound_effect" :bg="true" sound="bg"></soundHandler>
</template>

<script>
import popupAnnunce from '@/../src/components/global/popupAnnunce.vue';
export default {
  data() {
    return {
      tryTime: 0,
      userName: '',
      loading: false,
      connected: '',
      title: '幫自己取個名字吧',
      annunceShow: false,
    };
  },
  props: ['socket', 'state'],
  components: [popupAnnunce],
  methods: {
    /**
     * Converts all characters between their fullwidth and halfwidth font.
     *
     */
    toHalfwidth(chars) {
      let halfwidth = '';
      for (let i = 0, l = chars.length; i < l; i++) {
        let c = chars[i].charCodeAt(0);

        // convert to halfwidth.
        if (c >= 0xff00 && c <= 0xffef) c = 0xff & (c + 0x20);

        halfwidth += String.fromCharCode(c);
      }
      return halfwidth;
    },
    login() {
      const nameLength = this.userName.length;
      const searchString = new RegExp(
        "[`~!@#$^&*()=|{}':;',\\[\\].<>《》/\?~！@#￥……&*（）——|{}【】‘；：”“'。，、？+-/ ]|[\\\\/]"
      );
      const string = this.toHalfwidth(this.userName);
      // character should between 3-15
      if (string.search(searchString) != -1) this.annunceShow = true;
      if (string === '' || nameLength > 15 || nameLength < 3)
        this.annunceShow = true;
      if (
        string.search(searchString) === -1 &&
        string != '' &&
        nameLength <= 15 &&
        nameLength >= 3
      ) {
        this.$store.commit('updateUserName', this.userName);
        this.socket.emit('login', {
          id: string,
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
  beforeUnmount() {
    // localStorage.removeItem('reloaded');
  },
  mounted() {
    this.socket.emit('logout');
    this.socket.emit('connecting');
    this.$nextTick(() => this.titleAnimte());

    this.$store.commit(
      'loopHandler',
      setInterval(() => {
        this.$store.commit('loopTimePlus');

        if (this.$store.state.loopStore.connected) {
          this.$store.commit('loopHandlerDelete');
          this.$store.commit('updateLoading', true);
          document.getElementById('bg_sound_effect').play();
        }

        if (this.$store.state.loopStore.tryTime >= 30)
          this.$store.commit('loopHandlerDelete');
      }, 1000)
    );
  },
};
</script>
<style scoped>
@import '@/scss/login.scss';
</style>
