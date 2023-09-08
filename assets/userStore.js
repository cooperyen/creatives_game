const userStore = {
  state() {
    return {
      userData: '123',
    };
  },
  mutations: {
    increment(state, data) {
      state.userData = data;
    },

  },
}

export { userStore }
