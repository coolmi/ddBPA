import Vue from 'vue'
import Router from 'vue-router'
// import api from 'api'
// import whole from '@/lib/whole'
// import dingUser from '@/lib/dingUser'
import store from '@/store'
import base from '@/api/baseConfig'
import ding from '@/lib/ding'
import DEM from '@/lib/dingErrMessage'

Vue.use(Router)
let dd = window.dd;
const router = new Router({
  mode: 'history',
  base: '/bpa/',
  routes: [
    {
      path: '/',
      component: require('@/views/bpaHome'),
      meta: {title: '工作台'}
    },
    {
      path: '/unlock',
      component: require('@/views/unlock'),
      meta: {title: '开启报平安'}
    },
    {
      path: '/safetyResultList',
      component: require('@/views/safetyResultList'),
      meta: {title: '上报情况'}
    },
    {
      path: '/clockin',
      component: require('@/views/clockin'),
      meta: {title: '员工报平安'}
    },
    {
      path: '/tabSafetyResultsCount',
      component: require('@/views/tabSafetyResultsCount'),
      meta: {title: '上报情况总览'}
    },
    {
      path: '/tabSafetyResults',
      component: require('@/views/tabSafetyResults'),
      meta: {title: '已报/未报情况统计'}
    },
    {
      path: '/tabSafetyResultsException',
      component: require('@/views/tabSafetyResultsException'),
      meta: {title: '上报异常信息统计'}
    },
    {
      path: '/123',
      component: require('@/views/interview'),
      meta: {title: '面试评价'}
    },
    {
      path: '/viewing',
      component: require('@/views/viewing'),
      meta: {title: '进行评价'}
    }
  ]
})

router.beforeEach((to, from, next) => {
// else if ((to.fullPath === '/flowHandle' || to.fullPath === '/flowQuery') && !getRequestAuthCode()) {
//     next(false)
//   }
  if (dd.version === null && to.fullPath.indexOf('/cs') < 0) {
    window.alert('请在钉钉手机端打开')
    next()
  } else {
    if (to.meta.ddConfig) { // 如果ddConfig为ture 则进行授权jsAPI
      setDDConfig(to)
    }
    if (!to.meta.pullToRefresh) {
      dd.ui.pullToRefresh.disable()
    }
    typeof to.meta.title !== undefined && setDocumentTitle(to.meta.title) // 设置title

    if (to.meta.leftBtn) {
      setLeftBtn(to) // 设置左侧按钮
    }
    if (to.meta.rightBtn) {
      setRightBtn(to) // 设置右侧按钮
    }
    next();
  }
});

let setDDConfig = function (to) {
  let path = store.state.ddstate.ddConfigPath || base.baseURL
  ding.jsApiOAuth(path).then((ddconfig) => {
    dd.config(ddconfig)
  }).catch(function (error) {
    ding.alertInfo(DEM.ddConfigInfoError);
  });
}

let setDocumentTitle = function (title) {
  let config = {
    title: title
  }
  dd.ready(function () {
    dd.biz.navigation.setTitle(config);
  });
  dd.error(function (err) {
    console.error('dd setTitle error: ' + window.location.href + JSON.stringify(err));
  });
};

let setLeftBtn = function (to) {
  let config = {
    text: '返回'
  }
  let leftConfig = to.meta.leftBtn || config;
  dd.ready(function () {
    dd.biz.navigation.setLeft(leftConfig);
  });
  dd.error(function (err) {
    console.error('dd setLeftBtn error: ' + window.location.href + JSON.stringify(err));
  });
};

let setRightBtn = function (to) {
  let config = {
    text: '更多'
  }
  let rightConfig = to.meta.rightBtn || config;
  dd.ready(function () {
    dd.biz.navigation.setRight(rightConfig);
  });
  dd.error(function (err) {
    console.error('dd setRightBtn error: ' + window.location.href + JSON.stringify(err));
  });
};

export default router;
