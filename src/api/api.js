import axios from './axiosConfig'
import ding from '@/lib/ding';

const AUTH_DINGTALKCODE = 'auth.dingtalkcode';
export default {

  /**
   * 获取个人信息
   * @param params
   * @param cb
   */
  getUserInfos: function (cb) {
    axios.get('/dingding/es/info')
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  },
  /**
   * 获取登录 -- Debug模式用
   * @param params
   * @param cb
   */
  getDebugLogin: function (code, itcode, cb) {
    let dingtalkCode = ding.parseParam(window.location.href, 'dingtalk_code') || ding.getLocation(AUTH_DINGTALKCODE)
    axios.get('/dingding/es/login?code=' + code + '&debugitcode=' + itcode + '&dingtalk_code=' + dingtalkCode)
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  },

  /**
   * 登录
   * @param params
   * @param cb
   */
  getLogin: function (data, cb) {
    axios.get('/dingding/es/login?code=' + data)
      console.log('皮不皮啊')
      console.log(data)
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  },

  /**
   * 登出
   * @param params
   * @param cb
   */
  getLogout: function (cb) {
    axios.get('/app/logout')
      .then((res) => {
        cb(res)
      }).catch((error) => {
      return Promise.reject(error)
    })
  },

  /**
   * 获取JsApi参数
   * @param cb
   */
  getJsApiInfos: function (params, cb) {
      // let dingtalkCode = ding.parseParam(window.location.href, 'dingtalk_code') || ding.getLocation(AUTH_DINGTALKCODE)
      axios.get('/api/ddtalk/miandeng/h5config?purl=' + params)
        .then((res) => {
          console.log('什么数据:')
          console.log(params)
          console.log(res)
          cb(res);
        }).catch((error) => {
        return Promise.reject(error)
      })
    },
  // getJsApiInfos: function (params, cb) {
  //   console.log(params)
  //   let dingtalkCode = ding.parseParam(window.location.href, 'dingtalk_code') || ding.getLocation(AUTH_DINGTALKCODE)
  //   axios.get('/api/ddtalk/miandeng/h5config?purl=' + params + '&dingtalk_code=' + dingtalkCode)
  //     .then((res) => {
  //       console.log('ddddddddd')
  //       console.log(res)
  //       cb(res);
  //     }).catch((error) => {
  //     return Promise.reject(error)
  //   })
  // },
  /**
   * 获取家庭成员
   * @param cb
   */
  getjtData: function (cb) {
    axios.get('/dingding/es/family')
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  },
  /**
  * 获取紧急联系人
  * @param cb
  */
  getjjData: function (cb) {
    axios.get('/dingding/es/emcontact')
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  },
  /**
   * 获取管理员信息
   * @param cb
   */
  getadmin: function (cb) {
    axios.get('/dingding/es/hradmin')
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  }
}
