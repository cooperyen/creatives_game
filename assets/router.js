import { createRouter, createWebHistory } from 'vue-router';
import lobby from '@/components/lobby.vue';
import NotFound from '@/components/404.vue';
import gameRoom from '@/components/gameRoom.vue';
import login from '@/components/login.vue';
import waitingRoom from '@/components/waitingRoom.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
      // children: [
      //   {
      //     // 当 /user/:id/profile 匹配成功
      //     // UserProfile 将被渲染到 User 的 <router-view> 内部
      //     path: ':user',
      //     component: loby,
      //   },
      // ],
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
      path: '/gameRoom',
      name: 'gameRoom',
      component: gameRoom,
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
  ],
});

// router.beforeEach((to, from, next) => {
//   const isLogin = JSON.parse(localStorage.getItem('user'));
//   if (isLogin !== null) {
//     if (to.path === '/') next(`/user/${isLogin.member}/`);
//     else next();
//   } else {
//     if (to.path === '/callback') next();
//     if (to.path !== '/login') next('/login');
//     else next();
//   }
// });


export default router;
