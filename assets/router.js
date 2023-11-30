import { createRouter, createWebHistory } from 'vue-router';
import lobby from '@/components/lobby.vue';
import NotFound from '@/components/404.vue';
import game from '@/components/game.vue';
import blackJack from '@/components/blackJack.vue';
import yellowCard from '@/components/yellowCard.vue';
import login from '@/components/login.vue';
import waitingRoom from '@/components/waitingRoom.vue';
import { socket } from '@/../assets/socket.js';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
      meta: { transition: 'move-out' },
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
    {
      path: '/blackjack/:room',
      name: 'blackJack',
      component: blackJack,
    },
    {
      path: '/yellow_cards/:room',
      name: 'yellowCards',
      component: yellowCard,
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
  ],
});

router.beforeEach((to, from, next) => {

  const reloaded = window.localStorage.getItem('reloaded') || '';
  if (reloaded === '' && to.name === 'login') {
    console.log(reloaded);
    window.location.reload();
    window.localStorage.setItem('reloaded', 'yes');
  }
  next();

})

export default router;
