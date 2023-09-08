import { reactive } from "vue";
import { io } from "socket.io-client";
import { userStore } from '@/../assets/userStore.js';


export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: [],
  login: false,
  socketId: ''
});

const testURL = 'http://198.211.33.236:88'
// const testURL = 'http://localhost:5088/'

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === "production" ? undefined : testURL;

export const socket = io(URL);

socket.on("connect", (el) => {
  state.connected = true;
  state.socketId = socket.id;
});


socket.on('nononos', function (data) {
  state.login = data
});

socket.on('re_login', function (data) {
  console.log(data);
  state.login = true
});

socket.on('re_test', function (data) {
  console.log(data);
});



socket.on("disconnect", () => {
  state.connected = false;
});

