<template>
  <userNameBox
    :userName="userInfo.name"
    :userIcon="userInfo.icon"
  ></userNameBox>
  <backGroundAnimate></backGroundAnimate>
  <!-- content -->
  <transition name="content-ready">
    <div class="lobby-container">
      <div
        class="room-container pd_side"
        v-show="gameRoomsData.gameRooms != null"
      >
        <!-- each room -->
        <template v-for="(x, y) in gameRoomsData.sliceRoom" :key="y">
          <div class="page-room flex" v-show="y === gameRoomSlide.currentPage">
            <div class="room-box exist" v-for="room in x" :key="room">
              <!-- room -->
              <div class="room-layout">
                <div
                  class="room-content"
                  :class="{ active: room != 'soon' }"
                  @click="joinRoom(room)"
                >
                  <!-- content -->
                  <div class="content flex">
                    <div class="title" v-if="room != 'soon'">
                      <p>{{ getRoomDetail(room, 'name') }}</p>
                    </div>
                    <div class="soon" v-else>
                      <p>coming</p>
                      <p>soon</p>
                    </div>
                    <div class="players" v-if="room != 'soon'">
                      <p>{{ getRoomDetail(room, 'player') }}人</p>
                    </div>
                  </div>
                  <!-- content end -->
                  <!-- game pic -->
                  <div class="img-box">
                    <div class="bg"></div>
                    <div class="right">
                      <img
                        :src="
                          $global_getImgUrl(
                            `${room != 'soon' ? room : 'default_game'}`,
                            'game'
                          )
                        "
                        :alt="room"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <!-- game end -->
                </div>
              </div>
            </div>
          </div>
        </template>
        <!-- end -->

        <!-- pagination -->
        <div class="pagination" v-if="gameRoomSlide.pageSum > 1">
          <button
            @click="moveRoomPage(false)"
            :class="{ none: gameRoomSlide.currentPage === 0 }"
          >
            <font-awesome-icon icon="fa-solid fa-arrow-left-long" />
            <!-- <img :src="this.$global_getImgUrl('arrow_left', 'ui')" /> -->
          </button>
          <button
            @click="moveRoomPage(true)"
            :class="{
              none: gameRoomSlide.currentPage === gameRoomSlide.pageSum - 1,
            }"
          >
            <font-awesome-icon icon="fa-solid fa-arrow-right-long" />
            <!-- <img :src="this.$global_getImgUrl('arrow_right', 'ui')" /> -->
          </button>
        </div>
        <!-- end -->
      </div>
      <!-- end -->

      <!-- Players who are not currently in the game or in the room -->
      <div id="user" class="container pd_side current-users-container">
        <div class="title">
          <p>當前玩家</p>
        </div>
        <div class="content">
          <div>
            <ul>
              <!-- lobbyPlayerList -->
              <li v-for="i in lobbyPlayerList" :key="i">
                <span>{{ i.user_id }}</span>
                <!-- <span>{{ i }}</span> -->
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- end -->

      <!-- change user role content -->
      <changeUserRoleHandler
        :isOpne="role.open"
        @close="(n) => (role.open = n)"
      ></changeUserRoleHandler>
      <!-- end -->
    </div>
  </transition>

  <!-- side menu -->
  <div class="side_menu flex">
    <div class="items setting">
      <div class="inner">
        <div class="box" @click="role.open = true">
          <font-awesome-icon icon="fa-solid fa-gear" />
        </div>
      </div>
    </div>
    <div class="items user_edit">
      <div class="inner">
        <div class="box" @click="answer.open = true">
          <font-awesome-icon icon="fa-solid fa-user-pen" />
        </div>
      </div>
    </div>
  </div>
  <!-- end -->

  <audio id="playesdr" autoplay loop>
    <source src="./../../sound/dramatic.mp3" type="audio/mp3" />
  </audio>

  <answerHandler
    :show="answer.open"
    @close="(n) => (answer.open = n)"
    @agree="$router.replace('./')"
  >
    {{ answer.text }}
  </answerHandler>
</template>

<script setup>
import {
  ref,
  reactive,
  onBeforeMount,
  onMounted,
  watch,
  nextTick,
  onBeforeUnmount,
  computed,
} from 'vue';
import { useStore } from 'vuex';
import userNameBox from '@/../src/components/layout/userNameBox.vue';
import changeUserRoleHandler from '@/../src/components/global/changeUserRoleHandler.vue';
import { router } from '@/../assets/router.js';
const props = defineProps(['socket', 'state']);
const store = useStore();

const answer = ref({ open: false, text: '即將返回首頁, 確定?' });
const gameRoomSlide = reactive({
  pageSum: 1,
  currentPage: 0,
  breakpoints: {
    350: {
      pageSum: 2,
    },
    1141: {
      pageSum: 1,
    },
  },
});

const userInfo = reactive({
  name: null,
  room: null,
  icon: store.state.userStore.icon,
});

const gameRoomsData = reactive({
  gameRooms: {},
  sliceRoom: {},
});

const lobbyPlayerList = ref([]);
const isShowPage = ref(false);
const chGameName = {
  game01: { name: '心靈同步', ppl: '2-4' },
  // game02: { name: '21點', ppl: '2-4' },
  game03: { name: '黃牌', ppl: '2-4' },
};
const role = ref({
  open: false,
  icon: null,
});

onBeforeMount(() => {
  const userStore = store.state.userStore;

  if (userStore.userName != null) {
    userInfo.name = userStore.userName;
    userInfo.room =
      userStore.userRoom === undefined ? null : userStore.userRoom;
    userInfo.icon = userStore.icon;
  } else {
    router.replace('/');
  }
});

onMounted(() => {
  loadRoomData();
  onResize();
  nextTick(() => {
    window.addEventListener('resize', onResize);
  });
});

onBeforeUnmount(() => {
  store.commit('loopHandlerDelete');
});

watch(store.state.userStore, (news) => {
  userInfo.name = news.userName;
  userInfo.room = news.userRoom;
  userInfo.icon = news.icon;
});

watch(
  () => props.state.lobbyPlayerList,
  (el) => {
    lobbyPlayerList.value = Object.values(el).filter((vl) => {
      if (vl.room != null && vl.room != 'lobby') return;
      return vl.user_id;
    });
    document.querySelector('#playesdr').play();
  }
);

watch(
  () => props.state.goUrl,
  (url) => {
    store.commit('updateUserRoom', url.substring(url.indexOf('game')));
    router.replace(url);
  }
);

// functions
function sliceGameRoom() {
  const xxxx = gameRoomsData.gameRooms;
  let sum = xxxx.length / gameRoomSlide.pageSum;
  if (sum <= 4) sum = 4;

  let y = [];

  for (let i = 0; i < xxxx.length; i += sum) {
    y.push(xxxx.slice(i, i + sum));
  }
  gameRoomsData.sliceRoom = y;
}

function onResize() {
  const width = window.innerWidth;
  const breakpoints = Object.keys(gameRoomSlide.breakpoints);
  let pageSum = 1;
  gameRoomSlide.currentPage = 0;
  for (let i = 0; i < breakpoints.length; i++) {
    if (width <= breakpoints[i] && width <= breakpoints[i + 1]) {
      pageSum = gameRoomSlide.breakpoints[breakpoints[i]].pageSum;
    }
    if (width > breakpoints[breakpoints.length - 1]) {
      pageSum = gameRoomSlide.breakpoints[breakpoints[i]].pageSum;
    }
  }

  gameRoomSlide.pageSum = pageSum;

  nextTick(() => {
    sliceGameRoom();
  });
}

function loadRoomData() {
  store.commit(
    'loopHandler',
    setInterval(() => {
      const result = doCheck();
      store.commit('loopTimePlus');
      if (result) {
        store.commit('loopHandlerDelete');
        // display particular room with "chGameName".
        gameRoomsData.gameRooms = props.state.gameRooms.gameList.filter(
          (x, y) => {
            if (chGameName[x] != undefined) return x;
          }
        );

        if (gameRoomsData.gameRooms.length <= 6) {
          const sum = 8 - gameRoomsData.gameRooms.length;
          for (let i = 0; i < sum; i++) {
            gameRoomsData.gameRooms.push('soon');
          }
        }

        sliceGameRoom();
        store.commit('updateLoading', true);
      }

      if (store.state.loopStore.tryTime >= 20) {
        store.commit('loopHandlerDelete');
        store.commit('clearUserRoom');
        props.state.connected = false;
      }
    }, 1000)
  );

  function doCheck() {
    // make sure backEnd data same as frontEnd.

    if (!props.state.gameRooms.state) {
      props.socket.emit('id_check', {
        id: userInfo.name,
        room: userInfo.room,
        icon: userInfo.icon,
      });
      return false;
    }

    if (props.state.gameRooms.state) {
      return true;
    }
  }
}

function getRoomDetail(el, item = null) {
  if (item === null) return false;
  const data = store.state.instructions[el];

  if (data === null || data === undefined) {
    if (item === 'name') return el;
    if (item === 'player') return 1;
  }

  if (data !== null || data != undefined) {
    if (item === 'name') return data.title.ch;
    if (item === 'player') return data.ppl;
  }
}

function moveRoomPage(boolean = true) {
  if (boolean) {
    if (gameRoomsData.length <= gameRoomSlide.currentPage + 1) return;
    if (gameRoomSlide.currentPage < gameRoomSlide.pageSum - 1)
      gameRoomSlide.currentPage += 1;
  }
  if (!boolean) {
    if (gameRoomSlide.currentPage <= 0) return;
    gameRoomSlide.currentPage -= 1;
  }
}

function joinRoom(roomId) {
  if (roomId) {
    props.socket.emit('join', {
      room: roomId,
      id: userInfo.name,
      icon: userInfo.icon,
    });
  } else {
    alert('未指定房間 ID');
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/lobby.scss';
</style>
