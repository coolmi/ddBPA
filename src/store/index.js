import Vue from 'vue';
import Vuex from 'vuex';
import loading from './modules/loading'
import ddstate from './modules/ddstate'
import material from './modules/material'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules: {
      loading,
      ddstate,
      material
    },
    strict: debug
});
