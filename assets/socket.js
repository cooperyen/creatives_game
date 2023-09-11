import { reactive } from "vue";
import { io } from "socket.io-client";
import { userStore } from '@/../assets/userStore.js';


export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: [],
  login: false,
  socketId: '',
  lobbyRooms: '',
  userName: null
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

socket.on('relobby', function (data) {
  // console.log(data);
  state.userName = data.userSids;
  state.lobbyRooms = data.gameList;
});

socket.on('re_updatepage', function (data) {
  state.userName = data.id;
});

socket.on('reJoinGame', function (data) {
  console.log(data);
});


socket.on('gotogame', function (data) {
  console.log(data);
});

socket.on('add_id', function (addSid) {
  console.log(addSid)
});

socket.on('remove_id', function (re_sid) {
  console.log(re_sid);
});

socket.on('already_joined', function () {
  alert("你在房間內了啊!!!!!!");
});

socket.on('full', function () {
  alert("房間已滿");
});

socket.on('notcool', function () {
  alert("一次一間");
});

socket.on('redirect', function (url) {
  console.log(url);
});

socket.on('re_act', function (data) {
  if (data.way === 'login') {
    localStorage.setItem('userData', JSON.stringify({ 'userName': data.id }))
    setTimeout(() => {
      state.login = true
    }, 500);
  }
});
