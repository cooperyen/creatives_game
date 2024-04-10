import { reactive } from "vue";
import { io } from "socket.io-client";
import { playerIcon } from '@/../assets/store/userStore.js';

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
  lunchMind: {
    readyList: null,
    gameOver: null,
    readyToGo: false,
    gameWin: null,
    lastCard: 0,
  },
  blackJack: null,
  yellowCard: null,
  lunch: {
    leaveGame: null,
    sticker: {}, // {id:boolen}
  }
});

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'https://user.creatives.ink';
export const socket = io(URL, {
  withCredentials: true,
});


/**
 * create countdown, if error then disconnect
 */
function handleErrors(el) {
  let time = 3;

  if (state.isConnected) return;
  state.isConnected = true

  const timer = setInterval(() => {
    time -= 1
    if (time <= 0) {
      state.connected = 'fail';
      socket.disconnect()
      clearInterval(timer)
    }
  }, 5000);



}

socket.on('connect_error', err => handleErrors(err))

socket.on("connect", (el) => {
  state.connected = true;
  state.socketId = socket.id;

});

socket.on("disconnect", (el) => {
  console.log(el);
});

int();
function int() {
  state.gameDataUpdate = null;
  state.lunchMind.readyList = null;
  state.currentPlayers = null;
  state.eachPlayers = null;
  state.updateCurrentPlayers = null;
}


socket.on('re_act', function (datas) {
  state.drawVote = null;
  state.lunch.leaveGame = null;
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
        state.lunchMind.gameOver = data;
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
      state.gameDataFirstLoad = data;
      break;

    case 'lunch_start_fail':
      state.loginError = 'fail';
      break;

    case 'lunch_mind_pass':
      console.log(data.data);
      state.lunchMind.gameWin = data.data;
      break;
  }
}


// lobby
socket.on('update_lobby', function (data) {
  if (data.user_sids != null || data.user_sids != undefined)
    state.lobbyPlayerList = data.user_sids;
})

// watting room
socket.on('updateWaitRoomPlayers', function (data) {
  state.updateCurrentPlayers = data
  state.lunchMind.readyToGo = false;
})

socket.on('updata_ready', function (data) {
  state.lunchMind.readyToGo = false;
  state.lunchMind.readyList = data.reduce((key, val, index) => {
    key[val] = val
    return key
  }, {})
})

/**
 *  game mind.
 */
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

  socket.on('game_last_card', function (data) {
    state.lunchMind.lastCard = data;
  })

  socket.on('re_draw', function (data) {
    if (data.message === 'draw') state.drawVote = { isPass: true }
    if (data.message === 'play') state.drawVote = { isPass: false, card: data.card };

  })

  socket.on('re_flash', function (data) {
    state.gameDataUpdate = data;
  })


  socket.on('re_lunch', function (data) {
    // state.lunchMind.readyToGo = false;
    if (data.isReady != null || data.isReady != undefined)
      state.lunchMind.readyToGo = data.isReady;
  })

}
lunchGame()

// game blackjack.
socket.on('re_bj', function (data) {
  if (data === null || data === undefined) return;
  state.blackJack = null;

  state.blackJack = data;
})

// game yellow card.
socket.on('re_yc', function (data) {

  if (data === null || data === undefined) return;
  state.yellowCard = null;
  state.yellowCard = data;

})

// player not in any game.
socket.on('re_no_game', function (data) {
  state.goUrl = null;
  if (data.noRoom === null || data.noRoom === undefined) return;
  state.goUrl = 'lobby';
})


