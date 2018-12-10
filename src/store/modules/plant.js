export default {
  state: {
    plantinfo: {},
    plantlist: []
  },

  actions: {
    addplantlist({commit}, info) {
      commit('ADD_PLANTLIST', info);
    },
    clearplantinfo({commit}) {
      commit('CLEAR_PLANTINFO');
    },
    saveplantlist({commit}, list) {
      commit('SAVE_PLANTLIST', list);
    },
    clearplantlist({commit}) {
      commit('CLEAR_PLANTLIST');
    }
  },

  mutations: {
    'ADD_PLANTLIST'(state, info) {
      state.plantlist.push(info)
    },
    'CLEAR_PLANTINFO'(state) {
      state.plantinfo = {}
    },
    'SAVE_PLANTLIST'(state, list) {
      state.plantlist = list
    },
    'CLEAR_PLANTLIST'(state) {
      state.plantlist = []
    }
  },
  getters: {
    getplantinfo: state => state.plantinfo,
    getplantlist: state => state.plantlist
  }
}
