const playerIcon = ['cheese', 'strawberry', 'cheese2', 'strawberry2'];
const userData = JSON.parse(localStorage.getItem('userData'));
const userName = userData != null ? userData.userName : null;
const userRoom = userData != null ? userData.userRoom : null;


function updateCookie(el, val, each = null) {
  localStorage.setItem(
    el,
    JSON.stringify(val)
  );
}


function isNotExist(el) {
  return el === undefined || el === null || el === '' ? true : false
}

function getCookie(el) {
  return JSON.parse(localStorage.getItem(el))
}

const userStore = {
  state() {
    return {
      userName,
      userRoom,
      icon: playerIcon[0],
      loading: false,
    };
  },
  mutations: {
    updateLoading(state, el) {
      state.loading = el;
    },
    updateUserRoom(state, data) {
      state.userRoom = data;
      localStorage.setItem('userData', JSON.stringify(state))
    },
    updateUserIcon(state, data) {
      const userData = getCookie('userData')
      state.icon = data;
      userData.icon = state.icon
      localStorage.setItem('userData', JSON.stringify(userData))
    },
    clearUserRoom(state, data) {

      const userData = getCookie('userData')

      if (userData === null) return;

      state.userRoom = null
      userData.userRoom = state.userRoom

      updateCookie('userData', userData)
    },
    authCheck(state) {
      const userData = getCookie('userData')

      // check each cookie value.
      if (isNotExist(userData.userName)) userData.userName = state.userName
      if (isNotExist(userData.userRoom)) userData.userRoom = state.userRoom
      if (isNotExist(userData.icon) || !isNotExist(userData.icon) && !playerIcon.includes(userData.icon)) userData.icon = state.icon

      // update cookie
      updateCookie('userData', userData)

    },
    createDefaultData(state) {
      const cookie = getCookie('userData')
      let data = { userName: null, userRoom: null, icon: playerIcon[0] }

      if (cookie != null && cookie?.icon != playerIcon[0]) data.icon = cookie.icon

      updateCookie('userData', data)
    },
  },
}


const loopStore = {
  state() {
    return {
      socketConnect: null,
      loadRoomLoop: null,
      connectedTime: 0,
    }
  },
  mutations: {
    socketConnect(state, el) {
      state.socketConnect = el;
    },
    socketDelete(state) {
      clearInterval(state.socketConnect);
      state.socketConnect = null;
      state.connectedTime = 0;
    },
    loadRoomLoop(state, el) {
      state.loadRoomLoop = el;
    },
    loadRoomLoopDelete(state) {
      clearInterval(state.loadRoomLoop);
      state.loadRoomLoop = null;
      state.connectedTime = 0;
    },
    connectedTimePlus(state) {
      state.connectedTime += 1;
    },
    connectedTimeMinus(state) {
      state.connectedTime -= 1;
    },
  }
}

const gameData = {
  state() {
    return {
      chGameName: {
        game01: { name: '心靈同步', ppl: '2-4' },
        game02: { name: '21點', ppl: '2-4' },
        game03: { name: '黃牌', ppl: '2-4' },
      },
      playerIcon
    }
  },
  mutations: {

  }
}


export { userStore, loopStore, gameData, playerIcon }
