export default {
  state: {
    materialinfo: {},
    materiallist: [],
    id: ''
  },

  actions: {
    addmateriallist({commit}, info) {
      commit('ADD_MATERIALIST', info);
    },
    addmaterialid({commit}, id) {
      commit('ADD_MATERIALID', id);
    },
    clearmaterialinfo({commit}) {
      commit('CLEAR_MATERIAINFO');
    },
    savemateriallist({commit}, list) {
      commit('SAVE_MATERIALLIST', list);
    },
    clearmateriallist({commit}) {
      commit('CLEAR_MATERIALLIST');
    }
  },

  mutations: {
    'ADD_MATERIALIST'(state, info) {
      state.materiallist.push(info)
    },
    'ADD_MATERIALID'(state, id) {
      state.id = id
    },
    'CLEAR_MATERIAINFO'(state) {
      state.materialinfo = {}
    },
    'SAVE_MATERIALLIST'(state, list) {
      state.materiallist = list
    },
    'CLEAR_MATERIALLIST'(state) {
      state.materiallist = []
    }
  },
  getters: {
    getmaterialinfo: state => state.materialinfo,
    getmateriallist: state => state.materiallist,
    getmaterialid: state => state.id
  }
}
