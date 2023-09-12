const userData = JSON.parse(localStorage.getItem('userData'))
const userName = userData != null ? userData.userName : null
const userRoom = userData != null ? userData.userRoom : null

const userStore = {
  state() {
    return {
      userName,
      userRoom,
    };
  },
  mutations: {
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

export { userStore }
