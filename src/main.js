import { createApp } from 'vue'
import router from '@/../assets/router.js';
import { userStore } from '@/../assets/userStore.js';
import App from '@/App.vue'
import { createStore } from 'vuex';

const store = createStore({
  modules: {
    userStore
  }
});




const app = createApp(App);
app.use(router);
app.use(store);
router.isReady().then(() => app.mount('#app'))
