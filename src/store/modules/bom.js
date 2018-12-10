export default {
  state: {
    bominfo: {},
    bomlist: []
  },

  actions: {
    addbomlist({commit}, info) {
      commit('ADD_BOMLIST', info);
    },
    clearbominfo({commit}) {
      commit('CLEAR_BOMINFO');
    },
    savebomlist({commit}, list) {
      commit('SAVE_BOMLIST', list);
    },
    clearbomlist({commit}) {
      commit('CLEAR_BOMLIST');
    }
  },

  mutations: {
    'ADD_BOMLIST'(state, info) {
      state.bomlist.push(info)
    },
    'CLEAR_BOMINFO'(state) {
      state.bominfo = {}
    },
    'SAVE_BOMLIST'(state, list) {
      state.bomlist = list
    },
    'CLEAR_BOMLIST'(state) {
      state.bomlist = []
    }
  },
  getters: {
    getbominfo: state => state.bominfo,
    getbomlist: state => state.bomlist
  }
}
