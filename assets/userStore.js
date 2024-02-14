const userData = JSON.parse(localStorage.getItem('userData'))
const userName = userData != null ? userData.userName : null
const userRoom = userData != null ? userData.userRoom : null

const userStore = {
  state() {
    return {
      userName,
      userRoom,
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
    clearUserRoom(state, data) {
      const userData = JSON.parse(localStorage.getItem('userData'))
      if (userData === null) return;
      userData.userRoom = null
      localStorage.setItem('userData', JSON.stringify(userData))
    }
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


export { userStore, loopStore }
