import { reactive } from "vue";
import { io } from "socket.io-client";
import { userStore } from '@/../assets/userStore.js';


export const state = reactive({
  isConnected: false,
  connected: false,
  loading: false,
  socketId: '',
  userName: null,
  goUrl: null,
  gameRooms: { state: false, gameList: null },
  lobbyPlayerList: null,
  currentPlayers: null,
  router: null,
  loginError: null,
  activeGameRoom: null,
  gameDataFirstLoad: null,
  gameDataUpdate: null,
  currentCard: null,
  drawVote: null,
  gameOne: {
    readyList: null,
    gameOver: null,
    readyToGo: false
  },
  blackJack: null
});

// const testURL = 'http://200.69.21.59:88'
const testURL = 'https://user.creatives.ink'
// const testURL = 'http://127.0.0.1:5000/'
// const testURL = 'https://6d09-60-251-61-249.ngrok-free.app'

// "undefined" means the URL will be computed from the `window.location` object
const URL = testURL;

export const socket = io(URL);

// export const conntect = () => {

socket.on("connect", (el) => {
  state.connected = true;
  state.socketId = socket.id;

});

socket.on("connected", (el) => {
  state.connected = true;

});

socket.on("disconnect", () => {
  state.connected = false;
});
// }


state.connected = false;
state.gameDataUpdate = null;
state.gameOne.readyList = null;
state.currentPlayers = null;

socket.on('re_act', function (data) {

  state.goUrl = null;
  state.gameDataFirstLoad = null;
  state.loginError = null;
  state.activeGameRoom = null;

  const gameRoom = data.url.substring(data.url.indexOf('/') + 1)
  state.activeGameRoom = gameRoom;

  switch (data.way) {

    case 'id_check':
      if (data.game_list != null || data.game_list != undefined) {
        state.gameRooms = null;
        state.gameRooms = { state: true, gameList: data.game_list };
      }

      // lobby escapes from load cycles.
      if (data.url === 'lobby') {
        state.gameOne.gameOver = data;
      }

      if (data.go === 'waiting_room')
        state.goUrl = `waiting_room/${data.url}`

      if (data.backGame != null) {
        state.goUrl = `${data.backGame}/${data.url}`
      }
      break;

    case 'id_check_in_game':
      if (data.url != 'lobby') state.gameDataFirstLoad = data.page;
      if (data.url === 'lobby') state.loginError = 'fail';
      break;

    case 'login':

      localStorage.setItem('userData', JSON.stringify({ userName: data.id, userRoom: null }));
      state.loginError = null;
      state.goUrl = null;


      if (data.url != null || data.url != undefined) {
        state.goUrl = data.url;
      }

      if (data.message != null || data.message != undefined)
        state.loginError = data.message;
      break;

    case 'lunch_bj':
    case 'lunch_mind':

      if (data.url === null || data.url === undefined) break;

      // const gameRoom = data.url.substring(data.url.indexOf('/') + 1)
      // state.activeGameRoom = gameRoom
      const userData = JSON.parse(localStorage.getItem('userData'));
      userData.userRoom = gameRoom

      state.goUrl = data.url;

      localStorage.setItem('userData', JSON.stringify(userData));
      state.gameDataFirstLoad = data


      break;

    case 'lunch_start':
      if (data.data === null || data.data === undefined) break;

      state.gameDataFirstLoad = data
      break;

    case 'lunch_start_fail':
      state.loginError = 'fail';
      break;
  }

});


socket.on('updata_watingroom_ready', function (data) {
  state.currentPlayers = data.room_data
})


socket.on('update_lobby', function (data) {
  if (data.user_sids != null || data.user_sids != undefined)
    state.lobbyPlayerList = data.user_sids;

  if (data.page != null || data.page != undefined)
    state.currentPlayers = data.page;
})

socket.on('updata_ready', function (data) {
  state.gameOne.readyToGo = false;
  state.gameOne.readyList = data.reduce((key, val, index) => {
    key[val] = val
    return key
  }, {})
})

socket.on('game_update_game', function (data) {
  state.gameDataUpdate = data
  state.drawVote = null
})

socket.on('re_flash', function (data) {
  state.gameDataUpdate = data
})

socket.on('re_draw', function (data) {
  state.drawVote = null;
  if (data.message === 'draw') state.drawVote = { isPass: true }
  if (data.message === 'play') state.drawVote = { isPass: false, card: data.card };


})

socket.on('re_lunch', function (data) {
  state.gameOne.readyToGo = false;
  if (data.isReady != null || data.isReady != undefined) {
    state.gameOne.readyToGo = data.isReady;
  }
})


socket.on('re_bj', function (data) {
  // console.log(data);
  if (data === null || data === undefined) return;
  state.blackJack = null;

  state.blackJack = data
})

socket.on('re_no_game', function (data) {
  // console.log('re_no_game', data);
  state.goUrl = null;
  if (data.noRoom === null || data.noRoom === undefined) return;
  state.goUrl = 'lobby';
})

