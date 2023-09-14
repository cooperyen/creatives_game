import { reactive } from "vue";
import { io } from "socket.io-client";
import { userStore } from '@/../assets/userStore.js';


export const state = reactive({
  connected: false,
  socketId: '',
  userName: null,
  goUrl: null,
  gameRooms: null,
  lobbyPlayerList: null,
  currentPlayers: null,
  router: null,
  loginError: null,
});

// const testURL = 'http://198.211.33.236:88'
const testURL = 'http://127.0.0.1:5000/'

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === "production" ? undefined : testURL;

export const socket = io(URL);

socket.on("connect", (el) => {
  console.log('connect')
  state.connected = true;
  state.socketId = socket.id;
});

socket.on("disconnect", () => {
  state.connected = false;
});


socket.on('re_act', function (data) {


  switch (data.way) {
    case 'id_check':
      if (data.game_list != null || data.game_list != undefined)
        state.gameRooms = data.game_list;

      // lobby escapes from load cycles.
      if (data.url === 'lobby') {
        state.goUrl = data.url;
      }

      if (data.url === 'waiting_room')
        state.goUrl = `${data.url}/${data.user_room}`

      break;

    case 'login':
      localStorage.setItem('userData', JSON.stringify({ userName: data.id }));
      state.goUrl = null;
      state.loginError = null;

      if (data.url != null || data.url != undefined) {
        state.goUrl = data.url;
      }

      if (data.message != null || data.message != undefined)
        state.loginError = data.message;
      break;

  }


});

socket.on('re_clearUserId', function (data) {
  console.log('re_clearUserId', data)

})

socket.on('updata_lobby', function (data) {
  console.log('updata_lobby', data)
  state.currentPlayers = data.room_data

})


socket.on('update_lobby', function (data) {
  console.log('update_lobby', data)
  if (data.user_sids != null || data.user_sids != undefined)
    state.lobbyPlayerList = data.user_sids;

  if (data.page != null || data.page != undefined)
    state.currentPlayers = data.page;
})


