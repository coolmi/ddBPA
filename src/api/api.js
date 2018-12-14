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
    return new Promise((resolve, reject) => {
      axios.post('/dingding/pm/login?code=' + data)
        .then((res) => {
          resolve(res);
        }).catch((error) => {
        reject(error)
      })
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
          cb(res);
        }).catch((error) => {
        return Promise.reject(error)
      })
    },
  /**
   * 获取明细信息列表数据
   * @param cb
   */
  getlistData: function (cb) {
    axios.get('/api/sopheader/create')
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  },
  /**
  * 获取物料模糊查询信息
  * @param cb
  */
  getmaterialinfos: function (name, category, cb) {
    axios.get('/api/sopheader/json/listproduct?name=' + name + '&category=' + category)
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  },
  /**
   * 获取客户模糊查询信息
   * @param cb
   */
  getmcustomerinfos: function (saleArea, name1, cb) {
    axios.get('/api/sopheader/json/listcustomer?saleArea=' + saleArea + '&name1=' + name1)
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  },
  /**
   * 获取汇率值
   * @param cb
   */
  getratevalue: function (saleArea, name1, cb) {
    axios.get('/api/sopheader//sop/apply/sopheader/exchangeRate')
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  },
  /**
   * 保存
   * @param cb
   */
  savematerial: function (params, cb) {
    axios.post('/api/sopheader/sop/apply/sopheader/saveJson', params)
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  }
}
