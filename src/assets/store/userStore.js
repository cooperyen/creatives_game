const playerIcon = ['apple', 'grape', 'orange', 'pineapple', 'watermelon', 'burger', 'cheese', 'chickenleg', 'chips', 'cowbread', 'donut', 'egg', 'hotdog', 'pizza', 'sandwich', 'steak', 'toast'];


const userData = JSON.parse(localStorage.getItem('userData'));
const userName = userData != null ? userData.userName : null;
const userRoom = userData != null ? userData.userRoom : null;
const userSound = userData != null ? userData.userSound : 0.3;
// const userIcon = userData != null ? userData.icon : null;


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
      icon: userData?.icon != null ? userData.icon : playerIcon[0],
      userSound
    };
  },
  mutations: {
    updateUserName(state, data) {
      state.userName = data;
      localStorage.setItem('userData', JSON.stringify(state))
    },

    updateLoading(state, el) {
      state.loading = el;
    },
    updateUserRoom(state, data) {
      state.userRoom = data;
      localStorage.setItem('userData', JSON.stringify(state))
    },
    updateUserSound(state, data) {
      state.userSound = data;
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
      if (isNotExist(userData.userSound) || !isNotExist(userData.userSound) && !playerIcon.includes(userData.userSound)) userData.userSound = state.userSound

      // update cookie
      updateCookie('userData', userData)

    },
    createDefaultData(state) {
      updateCookie('userData', state)
    },
  },
}


const loopStore = {
  state() {
    return {
      connectHandler: null,
      connected: false,
      connectTryTime: 0,
      loopHandler: null,
      tryTime: 0,
      entrys: false,
    }
  },
  mutations: {
    connected(state, el) {
      state.connected = el;
    },
    connectHandler(state, el) {
      state.connectHandler = el;
    },
    connectHandlerDelete(state) {
      clearInterval(state.connectHandler);
      state.connectHandler = null;
      state.connectTryTime = 0;
    },
    loopHandler(state, el) {
      state.loopHandler = el;
    },
    loopHandlerDelete(state, el) {
      clearInterval(state.loopHandler);
      state.loopHandler = null;
      state.tryTime = 0;
    },
    // loadRoomLoop(state, el) {
    //   state.loadRoomLoop = el;
    // },
    // loadRoomLoopDelete(state) {
    //   clearInterval(state.loadRoomLoop);
    //   state.loadRoomLoop = null;
    //   state.tryTime = 0;
    // },
    loopTimePlus(state) {
      state.tryTime += 1;
    },
    connectTimePlus(state) {
      state.connectTryTime += 1;
    },
    loopTimeMinus(state) {
      state.tryTime -= 1;
    },
  }
}

const iconData = {
  state() {
    return {
      playerIcon
    }
  },
  mutations: {

  }
}


export { userStore, loopStore, iconData, playerIcon }
