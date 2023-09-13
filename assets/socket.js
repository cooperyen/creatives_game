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
  dsds: null
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

socket.on('re_login', function (data) {
  console.log(data.id);
  // localStorage.setItem('userData', JSON.stringify({ 'userName': data.id }))
  // setTimeout(() => {
  //   state.login = true
  // }, 500);
});

socket.on("disconnect", () => {
  state.connected = false;
});


socket.on('re_act', function (data) {
  console.log(data)

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
      state.router = 'lobby';

      if (data.message != null || data.message != undefined)
        state.loginError = data.message;

      break;

  }


});

socket.on('updata_lobby', function (data) {
  console.log('updata_lobby', data)
  state.currentPlayers = data.room_data

})

// socket.on('update_wait_room', function (data) {
//   // console.log('update_wait_room', data.page)
//   // if (data.page != null || data.page != undefined)
//   state.currentPlayers = data;

//   console.log('update_wait_room', state)
// })


socket.on('update_lobby', function (data) {
  console.log('update_lobby', data)
  if (data.user_sids != null || data.user_sids != undefined)
    state.lobbyPlayerList = data.user_sids;

  if (data.page != null || data.page != undefined)
    state.currentPlayers = data.page;
})



// import { reactive } from "vue";
// import { io } from "socket.io-client";
// import { userStore } from '@/../assets/userStore.js';


// export const state = reactive({
//   connected: false,
//   socketId: '',
//   userName: null,
//   goUrl: null,
//   gameRooms: null,
//   lobbyPlayerList: null,
//   currentPlayers: null
// });

// // const testURL = 'http://198.211.33.236:88'
// const testURL = 'http://127.0.0.1:5000/'

// // "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === "production" ? undefined : testURL;

// export const socket = io(URL);

// socket.on("connect", (el) => {
//   console.log('connect')
//   state.connected = true;
//   state.socketId = socket.id;
// });

// socket.on('re_login', function (data) {
//   console.log(data.id);
//   // localStorage.setItem('userData', JSON.stringify({ 'userName': data.id }))
//   // setTimeout(() => {
//   //   state.login = true
//   // }, 500);
// });

// socket.on("disconnect", () => {
//   state.connected = false;
// });

// // socket.on('re_lobby', function (data) {
// //   state.lobbyRooms = data.gameList;
// // });

// socket.on('re_updatepage', function (data) {
//   state.userName = data.id;
// });

// socket.on('reJoinGame', function (data) {
//   console.log(data);
// });


// socket.on('gotogame', function (data) {
//   console.log(data);
// });

// socket.on('add_id', function (addSid) {
//   console.log(addSid)
// });

// socket.on('remove_id', function (re_sid) {
//   console.log(re_sid);
// });

// socket.on('already_joined', function () {
//   alert("你在房間內了啊!!!!!!");
// });

// socket.on('full', function () {
//   alert("房間已滿");
// });

// socket.on('notcool', function () {
//   alert("一次一間");
// });

// socket.on('redirect', function (url) {
//   console.log(url);
// });

// // socket.on('re_act', function (data) {
// //   if (data.way === 'login') {
// //     localStorage.setItem('userData', JSON.stringify({ 'userName': data.id }))
// //     setTimeout(() => {
// //       state.login = true
// //     }, 500);
// //   }
// // });


// socket.on('re_act', function (data) {

//   console.log(data);

//   if (data.way === 'id_check') {

//     if (data.user_sids != null || data.user_sids != undefined)
//       state.lobbyPlayerList = data.user_sids;

//     // game rooms data.
//     if (data.game_list != null || data.game_list != undefined)
//       state.gameRooms = data.game_list;

//     // lobby escapes from load cycles.
//     if (data.url === 'lobby')
//       state.goUrl = data.url;

//     if (data.url === 'waiting_room')
//       state.goUrl = `${data.url}/${data.user_room}`

//     // if (data.players != null || data.players != undefined) {
//     //   state.currentPlayers = data.players
//     // }

//   };

// });

// socket.on('updata_lobby', function (data) {
//   console.log(data);
//   state.currentPlayers = data.room_data
// })


