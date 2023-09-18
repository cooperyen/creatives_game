import { createRouter, createWebHistory } from 'vue-router';
import lobby from '@/components/lobby.vue';
import NotFound from '@/components/404.vue';
import game from '@/components/game.vue';
import login from '@/components/login.vue';
import waitingRoom from '@/components/waitingRoom.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
    },
    {
      path: '/lobby',
      name: 'lobby',
      component: lobby,
    },
    {
      path: '/waiting_room/:room',
      name: 'waiting_room',
      component: waitingRoom,
    },
    {
      path: '/mind/:room',
      name: 'game',
      component: game,
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
  ],
});

router.beforeEach((to, from, next) => {

  const reloaded = window.localStorage.getItem('reloaded') || '';
  if (reloaded === '' && to.name === 'login') {
    window.location.reload();
    window.localStorage.setItem('reloaded', 'yes');
  }
  next()
})

export default router;
