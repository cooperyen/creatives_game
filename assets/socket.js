import { reactive } from "vue";
import { io } from "socket.io-client";
import { userStore, gameData, playerIcon } from '@/../assets/userStore.js';


export const state = reactive({
  isConnected: null,
  connected: null,
  loading: false,
  socketId: '',
  userName: null,
  goUrl: null,
  gameRooms: { state: false, gameList: null },  // wehn get gameList data that state will be true.
  lobbyPlayerList: null,
  currentPlayers: null,
  updateCurrentPlayers: null,
  currentPlayersLoby: null,
  eachPlayers: null,
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
  blackJack: null,
  yellowCard: null,
  lunch: {
    leaveGame: null,
    sticker: {}, // {id:boolen}
  }
});

// const testURL = 'http://200.69.21.59:88'
const testURL = 'https://user.creatives.ink'
// const testURL = 'http://127.0.0.1:5000/'
// const testURL = 'http://200.69.21.59:1144'
// const testURL = 'https://bkgame.creatives.ink'
// const testURL = 'https://6d09-60-251-61-249.ngrok-free.app'

// "undefined" means the URL will be computed from the `window.location` object
const URL = testURL;

export const socket = io(URL, {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});



function handleErrors(el) {
  let time = 5

  if (state.isConnected) return;
  state.isConnected = true

  const xx = setInterval(() => {
    time -= 1
    console.log(time);
    if (time <= 0) {
      state.connected = false;
      socket.disconnect()
      clearInterval(xx)
    }
  }, 5000);



}

// export const conntect = () => {
socket.on('connect_error', err => handleErrors(err))

socket.on("connect", (el) => {
  // alert(el);
  state.connected = true;
  state.socketId = socket.id;

});

socket.on("disconnect", (el) => {
  console.log(el);

});



const int = () => {
  state.gameDataUpdate = null;
  state.gameOne.readyList = null;
  state.currentPlayers = null;
  state.eachPlayers = null;
  state.updateCurrentPlayers = null;
}
int();

socket.on('re_act', function (datas) {
  // console.log(datas)
  state.goUrl = null;
  state.gameDataFirstLoad = null;
  state.loginError = null;
  state.activeGameRoom = null;
  router(datas);
});

function router(data) {
  switch (data.way) {

    case 'id_check':

      if (data.user_sids != null || data.user_sids != undefined) {
        state.currentPlayers = data
      }


      if (data.game_list != null || data.game_list != undefined) {
        state.gameRooms = null;
        state.gameRooms = { state: true, gameList: data.game_list };
      }

      // lobby escapes from load cycles.
      if (data.url === 'lobby') {
        state.gameOne.gameOver = data;
      }

      if (data.go === 'lobby') state.goUrl = `lobby`;


      if (data.go === 'waiting_room') {
        state.goUrl = `waiting_room/${data.url}`
        state.gameRooms.state = false;
      }


      if (data.backGame != null) {
        state.goUrl = `${data.backGame}/${data.url}`
      }
      break;

    case 'id_check_in_game':
      if (data.url != 'lobby') {
        state.gameDataFirstLoad = data.page;
        state.goUrl = data.url;
      };
      if (data.url === 'lobby') state.loginError = 'fail';
      break;

    case 'login':
      const cookie = JSON.parse(localStorage.getItem('userData'))
      const icon = playerIcon[0]
      let cookieData = { userName: data.id, userRoom: null, icon };
      if (cookie.icon != icon) cookieData.icon = icon;
      localStorage.setItem('userData', JSON.stringify(cookieData));
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
    case 'lunch_yc':

      if (data.url === null || data.url === undefined) break;

      const userData = JSON.parse(localStorage.getItem('userData'));
      userData.userRoom = data.url;
      state.activeGameRoom = data.url;
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

    case 'return':
      break;
  }
}

socket.on('updateWaitRoomPlayers', function (data) {
  state.updateCurrentPlayers = data
  state.gameOne.readyToGo = false;

})

socket.on('update_lobby', function (data) {
  if (data.user_sids != null || data.user_sids != undefined)
    state.lobbyPlayerList = data.user_sids;

})

socket.on('updata_ready', function (data) {
  state.gameOne.readyToGo = false;
  state.gameOne.readyList = data.reduce((key, val, index) => {
    key[val] = val
    return key
  }, {})
})

/**
 *  lunch game.
 */
lunchGame()
function lunchGame() {

  socket.on('lunch_sticker', function (data) {
    state.lunch.sticker = data;
  })

  socket.on('lunch_leaveGame', function (data) {
    state.lunch.leaveGame = data;
  })

  socket.on('game_update_game', function (data) {
    state.gameDataUpdate = data;
    state.drawVote = null;
  })

  socket.on('re_draw', function (data) {
    console.log(data);
    if (data.message === 'draw') state.drawVote = { isPass: true }
    if (data.message === 'play') state.drawVote = { isPass: false, card: data.card };

  })

  socket.on('re_flash', function (data) {
    state.gameDataUpdate = data;
  })


  socket.on('re_lunch', function (data) {
    // state.gameOne.readyToGo = false;
    if (data.isReady != null || data.isReady != undefined)
      state.gameOne.readyToGo = data.isReady;
  })

}



/**
 * blackjack
 */
socket.on('re_bj', function (data) {
  if (data === null || data === undefined) return;
  state.blackJack = null;

  state.blackJack = data;
})

// yellow card
socket.on('re_yc', function (data) {

  if (data === null || data === undefined) return;
  state.yellowCard = null;
  state.yellowCard = data;

})

socket.on('re_no_game', function (data) {
  // console.log('re_no_game', data);
  state.goUrl = null;
  if (data.noRoom === null || data.noRoom === undefined) return;
  state.goUrl = 'lobby';
})

socket.on('update_wait_room', function (data) {
  // console.log(data)
})

