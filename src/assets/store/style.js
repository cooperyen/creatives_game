const style = {
  state() {
    return {
      'class': ['default', 'yellowCard']
    }
  },
  mutations: {
    backGorund(state, el = 'default') {
      document.querySelector('body').classList.remove(...state.class)

      switch (el) {
        case 'default':
          document.querySelector('body').classList.add('default');
          break;

        case 'yellowCard':
          document.querySelector('body').classList.add('yellowCard');
          break;

      }
    }
  },

}

class bg_style {
  constructor() {
    this.class = ['default', 'yellowCard', 'login_bd']
  }

  backGorund(el) {
    const bodyClassHandle = document.querySelector('body').classList
    bodyClassHandle.remove(...bodyClassHandle)

    this.class.includes(el) ? bodyClassHandle.add(el) : bodyClassHandle.add('default')

  }
}

export { style, bg_style }