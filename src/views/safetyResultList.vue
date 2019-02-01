<template>
  <div>
    <x-input title="姓名" v-model="username" disabled style="color: #000;display: none"></x-input>
    <x-input title="所属组织" v-model="orgname" disabled style="color: #000;;display: none"></x-input>
    <x-textarea title="报平安人员" @click.native="checkPerson" v-model="infos.users" :rows="2" name="请选择报平安人员" autosize
                style="display: none">
    </x-textarea>
    <x-table v-if="userInfo.length > 0">
      <thead>
      <tr>
        <th style="width: 110px;font-size: 14px;text-align: left;padding-left: 3px"><input type="checkbox" name="checkAll" id="checkAll" style="zoom:140%;vertical-align:middle;" @click="checkAll()">人员</th>
        <th style="width: 110px;font-size: 14px">手机号</th>
        <th style="width: 60px;font-size: 14px">情况</th>
        <th style="width: 140px;font-size: 14px">未上报原因</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item,index) in userInfo" :key="index">
        <td style="font-size: 14px;text-align: left;padding-left: 3px"><input type="checkbox" name="check" :disabled="item.handleState === '1' ? true : item.handleState === '2' ? true : false" :value="item.pernr" style="zoom:140%;vertical-align:middle;">{{item.nachn}}</td>
        <td @click="showCall(item.mobile)" style="color: deepskyblue;font-size: 14px">{{item.mobile}}</td>
        <td style="font-size: 14px">{{item.handleState === '0' ? '未报' : item.handleState === '1' ? '已报' : item.handleState === '2' ? '例外' : '已报'}}</td>
        <td>
          <cell v-if="item.handleState === '0' || item.handleState === '3'" v-model="item.excReason" is-link @click.native="showPopupOption(item.pernr)" style="height: 30px;font-size: 12px;color: black;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 140px;padding-left: 0px"></cell>
          <!--<x-input placeholder="请填写未上报原因" v-if="item.handleState === '0'" v-model="item.excReason"-->
                   <!--style="color: #000;font-size: 14px"></x-input>-->
          <!--<p style="color: black;font-size: 14px;padding-left: -20px" v-if="item.handleState === '1'">{{item.excReason}}</p>-->
          <!--<p style="color: black;font-size: 14px" v-if="item.handleState === '2'">{{item.excReason}}</p>-->
          <x-input v-if="item.handleState === '2'" disabled v-model="item.excReason"
                   style="color: black;font-size: 12px;padding-left: 5px"></x-input>
          <x-input v-if="item.handleState === '1'" disabled v-model="item.excReason"
                   style="color: black;font-size: 12px;padding-left: 5px"></x-input>
          <!--<x-input v-if="item.handleState === '1'" disabled v-model="item.excReason"-->
                   <!--style="color: black;font-size: 12px;padding-left: 5px"></x-input>-->
        </td>
      </tr>
      </tbody>
    </x-table>
    <br>
    <checker
      v-if="userInfo.length > 0"
      v-model="demo4"
      default-item-class="demo4-item"
      selected-item-class="demo4-item-selected"
      :max="1"
    >
      <checker-item v-for="(val,index) in chooseReason" :key="index" :value="val.value"
                    @on-item-click="onItemClick(val)">{{val.text}}
      </checker-item>
    </checker>
    <br>
    <popup v-model="showPopup">
      <div style="padding:10px 10px 40px 10px;">
        <p style="padding: 5px 5px 5px 2px;color:#888;font-size: 14px">请选择未上报原因</p>
        <checker
          v-model="demo5"
          default-item-class="demo4-item"
          selected-item-class="demo4-item-selected">
          <checker-item v-for="(val,index) in chooseReason" :key="index" :value="val.value" @on-item-click="onItemClickPop(val)">{{val.text}}</checker-item>
        </checker>
      </div>
    </popup>
    <!--<group labelWidth="6.5rem" gutter="0" labelMarginRight="1rem" v-if="userInfo.length > 0">-->
    <!--<datetime v-model="openDate" name="会议日期" required format="YYYY-MM-DD">-->
    <!--<p slot="title">开启日期<span class="tip">*</span></p>-->
    <!--</datetime>-->
    <!--<datetime v-model="openTime" format="HH:mm"  name="开始时间"  required>-->
    <!--<p slot="title">开启时间<span class="tip">*</span></p>-->
    <!--</datetime>-->
    <!--<x-input title="间隔时间(分钟)" v-model="openReport" style="color: #000"></x-input>-->
    <!--</group>-->
    <x-button text="保存" @click.native="btnDisabled" :gradients="['#1D62F0', '#19D5FD']" v-if="userInfo.length > 0"
              style="margin-bottom: 30px"></x-button>
  </div>
</template>

<script>
  import {XInput, XTextarea, XTable, Group, XButton, Checker, Cell, CheckerItem, Popup, Datetime} from 'vux'
  import whole from '@/lib/whole'
  import api from 'api'
  import ding from '@/lib/ding'
  import DEM from '@/lib/dingErrMessage'
  import {mapGetters} from 'vuex'

  export default {
    components: {
      XInput,
      XTextarea,
      XTable,
      Group,
      XButton,
      Checker,
      Cell,
      CheckerItem,
      Popup,
      Datetime
    },
    data() {
      return {
        isCheckedAll: false,
        openReport: '',
        openTime: '',
        openDate: '',
        pernr: '',
        orgname: '',
        orgddid: '',
        username: '',
        userInfo: '',
        showPopup: false,
        demo4: '',
        demo5: '',
        infos: {
          users: '',
          ddids: ''
        },
        chooseReason: [
          {
            text: '未激活，已确认到家',
            value: 1
          },
          {
            text: '忘记报，已确认到家',
            value: 2
          },
          {
            text: '手机没电，已确认到家',
            value: 3
          },
          {
            text: '系统原因，已确认到家',
            value: 4
          },
          {
            text: '取消',
            value: 5
          }
        ]
      }
    },
    computed: {
      ...mapGetters({
        path: 'getddConfigPath'
      })
    },
    created() {
      let _that = this;
      _that.getSafetyResultsByLeader();
      // let dd = window.dd;
      // ding.jsApiOAuth(_that.path).then((ddconfig) => {
      //   // alert(JSON.stringify(ddconfig))
      //   dd.config(ddconfig);
      //   _that.getddUserID();
      //   _that.checkPerson();
      // }).catch(function (error) {
      //   ding.alertInfo(DEM.ddConfigInfoError);
      // });
    },
    methods: {
      checkAll() {
        let _that = this;
        _that.isCheckedAll = !_that.isCheckedAll
        var id = document.getElementsByName('check');
        if (_that.isCheckedAll) {
          // 全选时
          for (var i = 0; i < id.length; i++) {
            if (id[i].disabled === false) {
              id[i].checked = true
            }
          }
        } else {
          for (var j = 0; j < id.length; j++) {
            if (id[j].disabled === false) {
              id[j].checked = false
            }
          }
        }
      },
      showCall(phone) {
        let _that = this;
        let dd = window.dd;
        ding.jsApiOAuth(_that.path).then((ddconfig) => {
          dd.config(ddconfig);
          _that.callPhone(phone)
        }).catch(function (error) {
          ding.alertInfo(DEM.ddConfigInfoError);
        });
      },
      callPhone(phone) {
        let dd = window.dd;
        dd.ready(function () {
          dd.biz.telephone.showCallMenu({
            phoneNumber: phone, // 期望拨打的电话号码
            code: '+86', // 国家代号，中国是+86
            showDingCall: false, // 是否显示钉钉电话
            onSuccess: function () {
            },
            onFail: function () {
            }
          })
        })
      },
      // 选择例外原因
      onItemClick(val) {
        // alert(JSON.stringify(val.text));
        let _that = this;
        var id = document.getElementsByName('check');
        // var CheckValue = [];
        for (var i = 0; i < id.length; i++) {
          if (id[i].checked) {
            // CheckValue.push(id[i].value);
            for (var j = 0; j < _that.userInfo.length; j++) {
                if (_that.userInfo[j].pernr === id[i].value) {
                  _that.userInfo[i].excReason = JSON.stringify(val.text).replace(/"/g, '');
                  _that.userInfo[i].handleState = '3';
                  var checkAll = document.getElementsByName('checkAll');
                  for (var l = 0; l < checkAll.length; l++) {
                    checkAll[l].checked = false
                  }
                  _that.isCheckedAll = false
                  if (_that.userInfo[i].excReason === '取消') {
                    _that.userInfo[i].excReason = '';
                    _that.userInfo[i].handleState = '0';
                  }
              }
            }
          }
        }
        for (var k = 0; k < id.length; k++) {
          id[k].checked = false;
        }
        _that.userInfo.sort(_that.compareUp('handleState'))
      },
      onItemClickPop(val) {
        // alert(JSON.stringify(val.text));
        let _that = this;
        if (_that.pernr) {
          for (var i = 0; i < _that.userInfo.length; i++) {
            if (_that.userInfo[i].pernr === _that.pernr) {
              _that.userInfo[i].excReason = JSON.stringify(val.text).replace(/"/g, '');
              _that.userInfo[i].handleState = '3';
              if (_that.userInfo[i].excReason === '取消') {
                _that.userInfo[i].excReason = '';
                _that.userInfo[i].handleState = '0';
              }
              _that.showPopup = false
              // _that.userInfo[i].handleState = JSON.stringify(val.value);
            }
          }
        }
        _that.userInfo.sort(_that.compareUp('handleState'))
      },
      compareUp(propertyName) {
        let _that = this;
        if ((typeof _that.userInfo[0][propertyName]) !== 'number') {
          return function(object1, object2) {
            var value1 = object1[propertyName];
            var value2 = object2[propertyName];
            return value1.localeCompare(value2);
          }
        } else {
          return function(object1, object2) {
            var value1 = object1[propertyName];
            var value2 = object2[propertyName];
            return value1 - value2;
          }
        }
      },
      showPopupOption(data) {
        let _that = this;
        _that.pernr = '';
        _that.pernr = data;
        _that.showPopup = true
      },
      // 获取当天下级的上报情况
      getSafetyResultsByLeader() {
        let _that = this;
        let dd = window.dd;
        api.getSafetyResultsByLeader(function (res) {
          // alert(res.data.data.safetyresult.length)
          if (res.data.data.safetyresult.length > 0) {
            _that.userInfo = res.data.data.safetyresult;
            // for (let i = 0; i < _that.userInfo.length; i++) {
            //   _that.userInfo[i].reason = '';
            // }
          } else {
            // alert('暂无上报情况信息');
            dd.device.notification.alert({
              message: '暂无上报情况信息',
              title: '提示', // 可传空
              buttonName: '确定',
              onSuccess: function () {
                setTimeout(() => {
                  let dd = window.dd;
                  dd.biz.navigation.close({
                    onSuccess: function (result) {
                    },
                    onFail: function (err) {
                    }
                  })
                }, 500);
              },
              onFail: function (err) {
              }
            });
            // let dd = window.dd;
            // dd.biz.navigation.close({
            //   onSuccess: function(result) {
            //   },
            //   onFail: function(err) {}
            // })
          }
          // alert(JSON.stringify(_that.userInfo))
        })
      },
      // 获取员工信息及部门信息
      getddUserID() {
        let _that = this;
        api.getOrgDdid(function (res) {
          _that.username = res.data.data.leadername
          _that.orgname = res.data.data.orginfos[0].orgname
          _that.orgddid = res.data.data.orginfos[0].orgddid
        })
      },
      // 点击选取部门列表
      checkPerson() {
        let _that = this;
        let pickedUsers = [];
        for (let u of _that.userInfo) {
          pickedUsers.push(u.emplId);
        }
        let dd = window.dd;
        dd.ready(function () {
          dd.biz.contact.complexPicker({
            title: '选择人员',
            corpId: 'ding7d5c838d71be2f8535c2f4657eb6378f',
            multiple: true,
            limitTips: '超出人员限制',
            maxUsers: 1000,
            pickedDepartments: [_that.orgddid],
            appId: 126759727,
            permissionType: 'GLOBAL',
            responseUserOnly: true,
            startWithDepartmentId: 0,
            onSuccess: function (result) {
              if (result.users.length > 0) {
                // alert(JSON.stringify(result.users))
                // _that.infos.users = '';
                // _that.infos.ddids = '';
                // for (let i = 0; i < result.users.length; i++) {
                //   _that.infos.users += result.users[i].name + ',';
                //   _that.infos.ddids += result.users[i].emplId + ',';
                // }
                // _that.infos.users = _that.infos.users.substr(0, _that.infos.users.length - 1);
                // _that.infos.ddids = _that.infos.ddids.substr(0, _that.infos.ddids.length - 1);
                // 传递默认选项
                _that.userInfo = result.users;
                for (let i = 0; i < _that.userInfo.length; i++) {
                  _that.userInfo[i].reason = '';
                  _that.userInfo[i].repState = '';
                }
                // alert(JSON.stringify(_that.userInfo))
              } else {
                // _that.infos.users = '';
                // _that.infos.ddids = '';
                _that.userInfo = [];
              }
            },
            onFail: function (err) {
              console.log(err)
              if (err.errorMessage) {
                whole.showTop(err.errorMessage);
                whole.showTop('获取钉钉权限失败，请退回上一页面重新进入');
              }
            }
          });
        });
        dd.error(function (err) {
          /**
           {
              message:"错误信息",//message信息会展示出钉钉服务端生成签名使用的参数，请和您生成签名的参数作对比，找出错误的参数
              errorCode:"错误码"
           }
           **/
          // alert('dd ding error: ' + window.location.href + JSON.stringify(err));
          console.log('dd ding error: ' + window.location.href + JSON.stringify(err));
        });
      },
      // 点击开启报平安
      btnDisabled() {
        let _that = this;
        let dd = window.dd;
        // if (_that.openDate === '') {
        //   window.alert('开启日期必填');
        //   return;
        // }
        // if (_that.openTime === '') {
        //   window.alert('开启时间必填');
        //   return;
        // }
        // if (_that.openReport === '') {
        //   window.alert('间隔时间必填');
        //   return;
        // }
        var params = new window.FormData();
        // params.append('openDate', _that.openDate);
        // params.append('openTime', _that.openTime);
        // params.append('openReport', _that.openReport);
        params.append('userInfo', JSON.stringify(_that.userInfo));
        // alert(JSON.stringify(_that.userInfo))

        api.saveSafetyResultHandle(params, function (res) {
          if (res.data.code) {
            // whole.showTop('保存成功');
            dd.device.notification.alert({
              message: '保存成功',
              title: '提示', // 可传空
              buttonName: '确定',
              onSuccess: function() {
                setTimeout(() => {
                  let dd = window.dd;
                  dd.biz.navigation.close({
                    onSuccess: function(result) {
                    },
                    onFail: function(err) {}
                  })
                }, 500);
                return;
              },
              onFail: function(err) {}
            });
          } else {
            window.alert('开启失败，请重试')
          }
        })
      }
    }
  }
</script>

<style lang='less' scoped>
  /*demo4*/
  .demo4-item {
    background-color: #ddd;
    color: #222;
    font-size: 14px;
    padding: 5px 10px;
    margin-right: 10px;
    line-height: 18px;
    border-radius: 15px;
    margin-top: 5px;
  }

  /*选中样式*/
  .demo4-item-selected {
    background-color: #ddd;
    color: #222;
  }
</style>
