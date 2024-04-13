import App from '@/App.vue'
import { createApp } from 'vue'
import { createStore } from 'vuex'
import { createMetaManager } from 'vue-meta'
import {
  readyIcon,
  backGroundAnimate,
  answerHandler,
  instructionsCompent,
  closeBtn,
  popupAnnunce,
  soundHandler
} from '@/../assets/componentsHandler.js';
import { router, pageHandler } from '@/../assets/router.js';
import { userStore, loopStore, iconData, playerIcon, style, instructions } from '@/../assets/storeHandler.js';
import FontAwesomeIcon from '@/../assets/fortawesomeHandler.js';
;

const store = createStore({
  modules: {
    userStore,
    loopStore,
    iconData,
    style,
    playerIcon,
    instructions,
    pageHandler
  }
});



const app = createApp(App);
app.use(store);
app.use(router);
app.use(createMetaManager())

app.component('font-awesome-icon', FontAwesomeIcon)
app.component('readyIcon', readyIcon)
app.component('backGroundAnimate', backGroundAnimate)
app.component('answerHandler', answerHandler)
app.component('instructionsCompent', instructionsCompent)
app.component('closeBtn', closeBtn)
app.component('popupAnnunce', popupAnnunce)
app.component('soundHandler', soundHandler)


app.config.globalProperties.$global_getImgUrl = function (name, place) {
  if (name === null || place === null) return;
  let route = null;

  switch (place) {
    case 'player':
      route = 'player_icon'
      break;
  }

  return new URL(`/src/image/${route || place}/${name}.svg`, import.meta.url)
    .href;
}

router.isReady().then(() => app.mount('#app'))
