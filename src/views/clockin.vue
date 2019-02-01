<template>
  <div>
    <div class="d_box">
      <div class="d_title">
        <div class="d_name">
          <div class="n_info">{{username}}</div>
        </div>
        <div class="d_info">
          <p style="font-size: 14px">{{username}}</p>
          <p class="n_dep">{{userdep}}</p>
        </div>
        <div class="d_date">
          <p style="" class="p_date">{{bdate}}</p>
        </div>
      </div>
      <div class="nowtime" v-show="!this.bshow">
        <p style="font-size: 14px">
          {{warnInfo}}
        </p>
      </div>
      <div class="d_content">
        <div class="content_s">
          <div class="btn"  @click="show" :class="bshow ? '' : 'gray'">
            <br><br><br><br><br>
            <span style="margin-top: 20px;font-size: 14px">{{ntime}}</span>
            <br>
            <span style="font-size:1.4rem;font-size: 14px">{{info}}</span>
          </div>
        </div>
      </div>
    </div>
    <!--<div class="nowtimeAddress">-->
      <!--<p style="font-size: 14px">-->
        <!--{{address}}-->
      <!--</p>-->
    <!--</div>-->
  </div>
</template>

<script>
  import whole from '@/lib/whole'
  import api from 'api'
  import ding from '@/lib/ding'
  import dingUser from '@/lib/dingUser'
  import DEM from '@/lib/dingErrMessage'
  import {mapGetters} from 'vuex'

  export default {
    data () {
      return {
        latitude: '',
        longitude: '',
        address: '',
        bdate: new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate(),
        ntime: '',
        bshow: true,
        info: '平安到家',
        warnInfo: '您已上报平安到家信息，祝您生活愉快！',
        set: '',
        username: '',
        userddid: '',
        userdep: ''
      }
    },
    computed: {
      ...mapGetters({
        path: 'getddConfigPath'
      })
    },
    created () {
      this.getddUserID()
      this.getSafetyReportState()
      this.setTime()
      this.getLocation()
      this.setRight();
    },
    methods: {
      getorg () {
        let _that = this;
        let dd = window.dd;
        ding.jsApiOAuth(_that.path).then((ddconfig) => {
          dd.config(ddconfig);
        }).catch(function (error) {
          ding.alertInfo(DEM.ddConfigInfoError);
        });
      },
      setRight() {
        let dd = window.dd
        let _that = this;
        let rightBtn = {
          text: '切换用户',
          show: true, // 控制按钮显示， true 显示， false 隐藏， 默认true
          control: true, // 是否控制点击事件，true 控制，false 不控制， 默认false
          showIcon: true, // 是否显示icon，true 显示， false 不显示，默认true； 注：具体UI以客户端为准
          onSuccess: function (result) {
            api.getLogout(function () {
              dd.device.notification.prompt({
                message: '输入itcode',
                title: '提示',
                buttonLabels: ['确定', '取消'],
                onSuccess: function (result) {
                  if (result.buttonIndex === 0) {
                    dingUser.getRequestAuthCode(_that.path).then((data) => {
                      api.getDebugLogin(data, result.value, function (res) {
                        if (res.data.code) {
                          _that.showPage = 1;
                          _that.getddUserID()
                          _that.getSafetyReportState()
                          _that.getorg();
                        } else {
                          _that.showPage = 2;
                        }
                      })
                    })
                  }
                },
                onFail: function (err) {
                }
              });
            })
          }
        }
        ding.setRight(rightBtn)
      },
      getddUserID() {
        let _that = this;
        api.getOrgDdid(function (res) {
          // alert(JSON.stringify(res.data))
          _that.username = res.data.data.leadername
          _that.userddid = res.data.data.leaderpernr
          _that.userdep = res.data.data.orginfos[0].orgname
        })
      },
      getSafetyReportState() {
        let _that = this;
        let dd = window.dd;
        api.getSafetyReportState(function (res) {
          // alert(res.data.data.repState)
          if (res.data.data.repState === '0') {
            _that.bshow = false;
            _that.warnInfo = '您当前未被开启报平安';
            // whole.showTop('您当前未被开启报平安');
            dd.device.notification.alert({
              message: '您的班组长今天还没有开启报平安，请稍后上报',
              title: '提示', // 可传空
              buttonName: '确定',
              onSuccess: function() {
                // setTimeout(() => {
                //   let dd = window.dd;
                //   dd.biz.navigation.close({
                //     onSuccess: function(result) {
                //     },
                //     onFail: function(err) {}
                //   })
                // }, 500);
                // return;
              },
              onFail: function(err) {}
            });
          }
          if (res.data.data.repState === '2') {
            _that.bshow = false;
            // whole.showTop('您已上报平安结果');
            dd.device.notification.alert({
              message: '您已上报平安结果',
              title: '提示', // 可传空
              buttonName: '确定',
              onSuccess: function() {
                // setTimeout(() => {
                //   let dd = window.dd;
                //   dd.biz.navigation.close({
                //     onSuccess: function(result) {
                //     },
                //     onFail: function(err) {}
                //   })
                // }, 500);
                // return;
              },
              onFail: function(err) {}
            });
          }
          if (res.data.data.repState === '1') {
            _that.bshow = true;
          }
        })
      },
      show () {
        let _that = this;
        let dd = window.dd;

        var params = new window.FormData();
        if (_that.bshow === false) {
          return;
        }
        if (_that.address === '') {
          dd.device.notification.alert({
            message: '当前无定位，暂不能上传报平安信息',
            title: '提示', // 可传空
            buttonName: '确定',
            onSuccess: function() {
            },
            onFail: function(err) {}
          });
          return;
        }
        params.append('place', _that.address);
        params.append('longitude', _that.longitude);
        params.append('latitude', _that.latitude);

        api.saveSafetyResult(params, function (res) {
          if (res.data.code) {
            // whole.showTop('已上报平安到家');
            _that.bshow = false
            _that.info = '已上报'
            _that.clearTime()
            dd.device.notification.alert({
              message: '已上报平安到家',
              title: '提示', // 可传空
              buttonName: '确定',
              onSuccess: function() {
                // setTimeout(() => {
                //   let dd = window.dd;
                //   dd.biz.navigation.close({
                //     onSuccess: function(result) {
                //     },
                //     onFail: function(err) {}
                //   })
                // }, 500);
                // return;
              },
              onFail: function(err) {}
            });
          } else {
            // window.alert('上报失败，请重试')
            dd.device.notification.alert({
              message: '上报失败，请重试',
              title: '提示', // 可传空
              buttonName: '确定',
              onSuccess: function() {
              },
              onFail: function(err) {}
            });
          }
        })
        // if (_that.bshow) {
        //   ding.jsApiOAuth(_that.path).then((ddconfig) => {
        //     // alert(JSON.stringify(ddconfig))
        //     dd.config(ddconfig);
        //     _that.geolocation();
        //   }).catch(function (error) {
        //     ding.alertInfo(DEM.ddConfigInfoError);
        //   });
        // } else {
        //   whole.showTop('已上报平安到家');
        //   return;
        // }
      },
      /**
       * 定位
       */
      geolocation() {
        let _that = this;
        let dd = window.dd;
        dd.ready(function () {
          dd.biz.map.search({
            scope: 1500, // 限制搜索POI的范围；设备位置为中心，scope为搜索半径
            onSuccess: function (poi) {
              let address = poi.adName + poi.snippet + poi.title;
              var params = new window.FormData();
              params.append('place', address);
              params.append('longitude', poi.longitude);
              params.append('latitude', poi.latitude);

              api.saveSafetyResult(params, function (res) {
                if (res.data.code) {
                  whole.showTop('已上报平安到家');
                  _that.bshow = false
                  _that.info = '已上报'
                  _that.clearTime()
                  // setTimeout(() => {
                  //   let dd = window.dd;
                  //   dd.biz.navigation.close({
                  //     onSuccess: function(result) {
                  //     },
                  //     onFail: function(err) {}
                  //   })
                  // }, 1500);
                } else {
                  window.alert('上报失败，请重试')
                }
              })
            },
            onFail: function (err) {
              alert(JSON.stringify(err));
            }
          });
        })
      },
      getLocation() {
        let _that = this;
        let dd = window.dd;

        if (_that.bshow) {
          ding.jsApiOAuth(_that.path).then((ddconfig) => {
            // alert(JSON.stringify(ddconfig))
            dd.config(ddconfig);
            _that.geolocationGet();
          }).catch(function (error) {
            ding.alertInfo(DEM.ddConfigInfoError);
          });
        } else {
          whole.showTop('已上报平安到家');
          return;
        }
      },
      /**
       * 定位
       */
      geolocationGet() {
        let _that = this;
        let dd = window.dd;
        dd.ready(function () {
          dd.device.geolocation.get({
            // argetAccuracy: 100, // 期望精确度
            // iOSDistanceFilter: 20, // 变更感知精度(iOS端参数)
            // useCache: false, // 是否使用缓存(Android端参数)
            // withRegeocode: true, // 是否返回逆地理信息,默认否
            // callBackInterval: 50, // 回传时间间隔，ms
            // sceneId: 'geo', // 定位场景id,
            targetAccuracy: 100,
            coordinate: 1,
            withReGeocode: true,
            useCache: false, // 默认是true，如果需要频繁获取地理位置，请设置false
            onSuccess: function (result) {
              if (result.errorCode) {
                _that.showMess();
              } else {
                _that.latitude = result.latitude;
                _that.longitude = result.longitude;
                _that.address = result.address;
              }
            },
            onFail: function (err) {
              dd.device.notification.alert({
                message: JSON.stringify(err),
                title: '提示', // 可传空
                buttonName: '确定',
                onSuccess: function() {
                  // setTimeout(() => {
                  //   let dd = window.dd;
                  //   dd.biz.navigation.close({
                  //     onSuccess: function(result) {
                  //     },
                  //     onFail: function(err) {}
                  //   })
                  // }, 1500);
                  // return;
                },
                onFail: function(err) {}
              });
            }
          });
        })
      },
      showMess() {
        let dd = window.dd;
        dd.ready(function () {
          dd.device.notification.confirm({
            message: '请先开启系统设置内钉钉的定位权限；检查是否有预装管家软件限制钉钉的定位权限',
            title: '钉钉无法获取你的定位',
            buttonLabels: ['查看详情'],
            onSuccess: function (result) {
              if (result.buttonIndex === 0) {
                dd.biz.util.openLink({
                  url: 'https://csmobile.alipay.com/detailSolution.htm?knowledgeType=1&scene=dd_gdwt&questionId=201602079853', // 要打开链接的地址
                  onSuccess: function (result) {
                  },
                  onFail: function (err) {
                  }
                })
              }
            },
            onFail: function (err) {
            }
          });
        })
      },
      updateTime () {
        this.ntime = new Date().toLocaleTimeString()
      },
      setTime () {
        this.set = setInterval(this.updateTime, 1000)
      },
      clearTime () {
        clearInterval(this.set)
      }
    }
  }
</script>

<style scoped>
  *{
    margin: 0;
    padding: 0;
    list-style: none;
    text-decoration: none;
  }
  html{
    width: 100%;
    height: 100%;
  }
  body{
    width: 100%;
    height: 100%;
  }
  .d_box{
    width: 100%;
    height: 100%;
  }
  .d_title{
    width: 100%;
    height: 10%;
    border-bottom: 1px solid #dbdbdb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 5px;
    margin-bottom: 5px;
  }
  .d_name{
    width: 15%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .d_info{
    width: 50%;
    margin-left: -55px;
  }
.d_date{
  padding-right: 20px;
}
  .n_info{
    width: 3rem;
    height: 3rem;
    border-radius: 1.5rem;
    text-align: center;
    line-height: 3rem;
    background-color: deepskyblue;
    color: #FFFFFF;
    font-size: 10px;
  }
  .d_content{
    width:100%;
    height: 90%;
    margin-top: 100px;
  }
  .content_s{
    background-color: #FFFFFF;
    width: 100%;
    height: 20rem;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .btn{
    width: 20rem;
    height: 20rem;
    background: url("../../static/green.png");
    background-repeat: no-repeat;
    background-size: 100%;
    background-position:center top;
    color: #fafff0;
    /*color: #000;*/
    /*border: 1px solid;*/

    text-align: center;
    /*float: left;*/
  }
  .gray{
    background: url("../../static/gray2.png");
    background-repeat: no-repeat;
    background-size: 100%;
    background-position:center top;
  }
  .nowtime{
    width: 100%;
    height: 4rem;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #dbdbdb;
  }
  .nowtimeAddress{
    width: 100%;
    height: 4rem;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #dbdbdb;
    border-top: 1px solid #dbdbdb;
  }
  .n_dep{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    font-size: 12px;
    color: #888888;
  }
  .p_date{
    color: #556994;
    font-size: 12px
  }
</style>
