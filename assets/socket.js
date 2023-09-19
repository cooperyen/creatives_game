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
  activeGameRoom: null,
  gameDataFirstLoad: null,
  gameDataUpdate: null,
  currentCard: null,
  drawVote: null,
});

const testURL = 'http://198.211.33.236:88'
// const testURL = 'http://127.0.0.1:5000/'

// "undefined" means the URL will be computed from the `window.location` object
const URL = testURL;

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

  state.goUrl = null;

  switch (data.way) {
    case 'id_check':
      console.log(data.url)
      if (data.game_list != null || data.game_list != undefined)
        state.gameRooms = data.game_list;

      // lobby escapes from load cycles.
      if (data.url === 'lobby') {
        state.goUrl = data.url;
      }

      if (data.go === 'waiting_room')
        state.goUrl = `waiting_room/${data.url}`

      break;

    case 'login':
      localStorage.setItem('userData', JSON.stringify({ userName: data.id }));
      state.loginError = null;

      if (data.url != null || data.url != undefined) {
        state.goUrl = data.url;
      }

      if (data.message != null || data.message != undefined)
        state.loginError = data.message;
      break;


    case 'lunch_mind':
      if (data.url != null || data.url != undefined) {
        state.goUrl = data.url;
        const gameRoom = data.url.substring(data.url.indexOf('/') + 1)
        state.activeGameRoom = gameRoom
        const userData = JSON.parse(localStorage.getItem('userData'));
        userData.userRoom = gameRoom

        localStorage.setItem('userData', JSON.stringify(userData));
      }

      state.gameDataFirstLoad = data
      console.log(state.gameDataFirstLoad)
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

socket.on('updata_ready', function (data) {
  console.log(data)
})

socket.on('update_game', function (data) {
  console.log(data)
  state.gameDataUpdate = data
  state.drawVote = null
})

socket.on('re_flash', function (data) {
  state.gameDataUpdate = data
})

socket.on('re_draw', function (data) {
  state.drawVote = null;
  if (data.message === 'draw') state.drawVote = true;
  if (data.message === 'play') state.drawVote = false;


})


// socketio.emit('re_draw',{'message':'draw'},room=user_room)#回傳資料把玩家都轉去投票