import axios from './axiosConfig'
import ding from '@/lib/ding';

const AUTH_DINGTALKCODE = 'auth.dingtalkcode';
export default {
  /**
   * 获取面试评价列表 数量固定(暂定为 10 需改为 15 or 20 )
   * @param cb
   */
  getInterviewList: function (cb) {
    axios.get('/authapi/interviewSchedule/interviewSchedule/interEval4dd?&_time_=' + Date.now())
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  },
  /**
   * 获取搜索结果 与下拉刷新 (暂定为 10 需改为 15 or 20 )
   * @param cb
   */
  getSearchList: function (nameorpostname, cb) {
    axios.get('/authapi/interviewSchedule/interviewSchedule/interEval4dd?nameorpostname=' + nameorpostname + '&_time_=' + Date.now())
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  },
  /**
   * 下拉刷新 获取面试评价列表
   * @param nameorpostname
   * @param endno
   * @param cb
   */
  getFreshList: function (nameorpostname, endnum, cb) {
    axios.get('/authapi/interviewSchedule/interviewSchedule/interEval4dd?endno=' + endnum + '&nameorpostname=' + nameorpostname + '&_time_=' + Date.now())
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
    axios.get('/dingding/es/login?code=' + code + '&debugitcode=' + itcode + '&dingtalk_code=' + dingtalkCode + '&_time_=' + Date.now())
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
  // getLogin: function (data, cb) {
  //   let dingtalkCode = ding.parseParam(window.location.href, 'dingtalk_code') || ding.getLocation(AUTH_DINGTALKCODE)
  //   axios.get('/dingding/es/login?code=' + data + '&dingtalk_code=' + dingtalkCode)
  //     .then((res) => {
  //       cb(res);
  //     }).catch((error) => {
  //     return Promise.reject(error)
  //   })
  // },

  /**
   * 登录
   * @param params
   * @param cb
   */
  getLogin: function (data, cb) {
    axios.get('/dingding/es/login?code=' + data + '&_time_=' + Date.now())
      .then((res) => {
        console.log(res);
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
    axios.get('dingding/es/logout')
      .then((res) => {
        cb(res)
      }).catch((error) => {
      return Promise.reject(error)
    })
  },
  getDocument: function (url, cb) {
    axios.get(url).then((res) => {
      cb(res);
    }).catch((error) => {
      return Promise.reject(error)
    })
  },
  /**
   * 获取JsApi参数
   * @param cb
   */
  getJsApiInfos: function (params, cb) {
    let dingtalkCode = '';
    let ddcode = 'BPA';
    // ding.parseParam(window.location.href, 'dingtalk_code') || ding.getLocation(AUTH_DINGTALKCODE)
    axios.get('/api/ddtalk/miandeng/h5config?purl=' + params + '&dingtalk_code=' + dingtalkCode + '&ddcode=' + ddcode + '&_time_=' + Date.now())
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  },
  /**
   * 获取个人信息
   * @param params
   * @param cb
   */
  getUserInfos: function (cb) {
    axios.get('/dingding/es/info?&_time_=' + Date.now())
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  },
  /**
   * 获取个人组织id
   * @param params
   * @param cb
   */
  getOrgDdid: function (cb) {
    axios.get('/dingding/safetyreport/getOrgDdid?&_time_=' + Date.now())
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  },
  /**
   * 开启报平安
   * @param params
   * @param cb
   */
  saveOpenReport: function (params, cb) {
    axios.post('/dingding/safetyreport/saveOpenReport', params)
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  },
  /**
   * 员工报平安
   * @param params
   * @param cb
   */
  saveSafetyResult: function (params, cb) {
    axios.post('/dingding/safetyreport/saveSafetyResult', params)
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  },
  /**
   * 查询报平安状态
   * @param cb
   */
  getSafetyReportState: function (cb) {
    axios.get('/dingding/safetyreport/getSafetyReportState?&_time_=' + Date.now())
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  },
  /**
   * 获取上报情况总览
   * @param cb
   */
  getSafetyResultsCount: function (leadername, dateStr, isyc, cb) {
    axios.get('/dingding/safetyreport/getSafetyResultsCount?leadername=' + leadername + '&dateStr=' + dateStr + '&isyc=' + isyc + '&_time_=' + Date.now())
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  },
  /**
   * 领导获取当天下级的上报情况
   * @param cb
   */
  getSafetyResultsByLeader: function (cb) {
    axios.get('/dingding/safetyreport/getSafetyResultsByLeader?&_time_=' + Date.now())
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  },
  /**
   * 保存未上报原因
   * @param params
   * @param cb
   */
  saveSafetyResultHandle: function (params, cb) {
    axios.post('/dingding/safetyreport/saveSafetyResultHandle', params)
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  },
  /**
   * 获取上报情况总览
   * @param cb
   */
  getSafetyResults: function (ename, mobile, leadername, dateStr, repState, cb) {
    axios.get('/dingding/safetyreport/getSafetyResults?ename=' + ename + '&mobile=' + mobile + '&leadername=' + leadername + '&dateStr=' + dateStr + '&repState=' + repState + '&_time_=' + Date.now())
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  },
  /**
   * 上报异常信息统计
   * @param cb
   */
  getSafetyResultsException: function (leadername, dateStr, cb) {
    axios.get('/dingding/safetyreport/getSafetyResultsException?leadername=' + leadername + '&dateStr=' + dateStr + '&_time_=' + Date.now())
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  },
  /**
   * 获取管理组织及下级组织
   * @param cb
   */
  getOrgInfo: function (cb) {
    axios.get('/dingding/safetyreport/getOrgInfo?&_time_=' + Date.now())
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  },
  /**
   * 获取组织下人员
   * @param orgobjid
   * @param cb
   */
  getOrgUserInfo: function (orgobjid, cb) {
    axios.get('/dingding/safetyreport/getOrgUserInfo?orgobjid=' + orgobjid + '&_time_=' + Date.now())
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  }
}
