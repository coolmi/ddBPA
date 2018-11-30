// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store';
import {sync} from 'vuex-router-sync'
import api from 'api'
import dingUser from '@/lib/dingUser'
import whole from '@/lib/whole'

import Navigation from '@/nav'
Vue.use(Navigation, {router}) // 后退不刷新

store.dispatch('saveURL', location.href)
store.dispatch('saveDingTalkCode')
// initVue();
dingUser.getRequestAuthCode(location.href).then((data) => {
  api.getLogin(data, function (res) {
    console.log('oipopoi')
    if (res.data.code) {
      console.log(res)
      initVue();
    } else {
      whole.showTop('获取钉钉免登权限失败')
    }
  })
})

Vue.config.productionTip = false

const FastClick = require('fastclick');
FastClick.attach(document.body);

require('./filters');

sync(store, router);

function initVue() {
  new Vue({
    router,
    store,
    ...App
  }).$mount('#app')
}
