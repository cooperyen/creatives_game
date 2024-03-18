import { createApp } from 'vue'
import router from '@/../assets/router.js';
import { userStore, loopStore, gameData, playerIcon } from '@/../assets/userStore.js';
import { style } from '@/../assets/style.js';
import readyIcon from '@/../src/ui/ready.vue';
import backGroundAnimate from '@/../src/components/animation/backGround.vue';
import answerHandler from '@/../src/components/global/answerHandler.vue';
import answerBtn from '@/../src/ui/answerBtn.vue';
import App from '@/App.vue'
import { createStore } from 'vuex';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { faChevronLeft, faMobileScreenButton, faGear, faArrowLeftLong, faArrowRightLong, faUserPen } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faChevronLeft, faMobileScreenButton, faGear, faArrowLeftLong, faArrowRightLong, faUserPen)


const store = createStore({
  modules: {
    userStore,
    loopStore,
    gameData,
    style,
    playerIcon
  }
});




const app = createApp(App);
app.use(store);
app.use(router);
app.component('font-awesome-icon', FontAwesomeIcon)
app.component('readyIcon', readyIcon)
app.component('backGroundAnimate', backGroundAnimate)
app.component('answerBtn', answerBtn)
app.component('answerHandler', answerHandler)



app.config.globalProperties.$global_getImgUrl = function (name, place) {
  if (name === null) return;
  return new URL(`/src/image/${place}/${name}.svg`, import.meta.url)
    .href;
}

router.isReady().then(() => app.mount('#app'))
