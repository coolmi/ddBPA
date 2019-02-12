<template>
  <div>
    <x-input title="姓名" v-model="username" disabled style="color: #000;display: none"></x-input>
    <x-input title="所属组织" v-model="orgname" disabled style="color: #000;;display: none"></x-input>
    <x-textarea title="报平安人员" @click.native="checkPerson" v-model="infos.users" :rows="2" name="请选择报平安人员" autosize style="display: none">
    </x-textarea>
    <x-table>
      <tr>
        <th style="width: 113px;font-size: 14px">组织</th>
        <th style="width: 187px;font-size: 14px">
          <cell is-link v-model="orginfosName" @click.native="showPopupOptionOrg()" style="width: 180px;height: 30px;font-size: 14px;color: black;overflow: hidden;text-overflow: ellipsis;white-space: nowrap"></cell>
        </th>
      </tr>
    </x-table>
    <br>
    <x-table v-if="userInfo.length > 0">
      <thead>
      <tr>
        <th style="width: 120px;font-size: 14px">报平安人员</th>
        <th style="width: 180px;font-size: 14px;">例外原因</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item,index) in userInfo" :key="index">
        <td style="font-size: 14px;width: 120px;">{{item.ename}}</td>
        <td>
          <cell v-model="item.reason" is-link @click.native="showPopupOption(item.pernr)" style="width: 180px;height: 30px;font-size: 14px;color: black;padding-right: 30px"></cell>
        </td>
      </tr>
      </tbody>
    </x-table>
    <br>
    <br>
    <br>
    <popup v-model="showPopup">
      <div style="padding:10px 10px 40px 10px;">
        <p style="padding: 5px 5px 5px 2px;color:#888;font-size: 14px">请选择例外原因</p>
        <checker
          v-model="demo4"
          default-item-class="demo4-item"
          selected-item-class="demo4-item-selected">
          <checker-item v-for="(val,index) in chooseReason" :key="index" :value="val.value" @on-item-click="onItemClick(val)">{{val.text}}</checker-item>
        </checker>
      </div>
    </popup>
    <popup v-model="showPopupOrg">
      <div style="padding:10px 10px 20px 10px">
        <p style="padding: 5px 5px 5px 2px;color:#888;font-size: 14px">请选择组织</p>
        <checker
          v-model="selectOrginfos"
          type="checkbox"
          default-item-class="demo4-item"
          selected-item-class="demo4-item-selected"
          disabled-item-class="demo4-item-disabled"
        >
          <checker-item v-for="(val,index) in orginfos" :key="index" :value="val">{{val.key}}</checker-item>
        </checker>
      </div>
      <x-button text="确定" @click.native="confimOrg" :gradients="['#1D62F0', '#19D5FD']" style="margin-bottom: 20px"></x-button>
    </popup>
    <group labelWidth="6.5rem" gutter="0" labelMarginRight="1rem" v-if="userInfo.length > 0">
      <datetime v-model="openDate" name="会议日期" required format="YYYY-MM-DD">
        <p slot="title">开启日期<span class="tip">*</span></p>
      </datetime>
      <datetime v-model="openTime" format="HH:mm"  name="开始时间"  required>
        <p slot="title">开启时间<span class="tip">*</span></p>
      </datetime>
      <div style="display: flex;justify-content: space-between; align-items: center;border-top: 1px solid #e3e3e3">
        <div style="width: 30%; margin-left: 15px">
          开启
          <!--<x-input title="姓名" v-model="ename" style="color: #000;" placeholder="请输入姓名"></x-input>-->
        </div>
        <div style="width: 40%;">
          <x-input title="" v-model="openReport" style="color: #000" placeholder="请输入间隔时间"></x-input>
        </div>
        <div style="width: 30%;">
          分钟之后开始
          <!--<x-switch title="是否上报" :value-map="['0', '1']" v-model="repState"></x-switch>-->
        </div>
      </div>
    </group>
    <x-button text="开启报平安" @click.native="btnDisabled" v-if="userInfo.length > 0" :gradients="['#1D62F0', '#19D5FD']" style="margin-bottom: 30px"></x-button>
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
    data () {
      return {
        openS: '',
        selectOrginfos: '',
        orginfos: '',
        orginfosName: '',
        openReport: '',
        openTime: new Date().getHours() + ':' + new Date().getMinutes(),
        openDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
        emplId: '',
        orgname: '',
        orgddid: '',
        username: '',
        userInfo: '',
        showPopup: false,
        showPopupOrg: false,
        demo4: '请假',
        infos: {
          users: '',
          ddids: ''
        },
        chooseReason: [
          {
            text: '请假',
            value: 1
          },
          {
            text: '异动办理中',
            value: 2
          },
          {
            text: '其他',
            value: 3
          },
          {
            text: '取消',
            value: ''
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
      let dd = window.dd;
      ding.jsApiOAuth(_that.path).then((ddconfig) => {
        dd.config(ddconfig);
        _that.getOrgInfo();
      }).catch(function (error) {
        ding.alertInfo(DEM.ddConfigInfoError);
      });
    },
    methods: {
      confimOrg () {
        let _that = this;
        let orgobjid = '';
        let orginfosName = '';
        for (let i = 0; i < _that.selectOrginfos.length; i++) {
          orgobjid += _that.selectOrginfos[i].value + ',';
          orginfosName += _that.selectOrginfos[i].key + ',';
        }
        if (orgobjid.length > 0) {
          orgobjid = orgobjid.substr(0, orgobjid.length - 1);
        }
        if (orginfosName.length > 0) {
          orginfosName = orginfosName.substr(0, orginfosName.length - 1);
        }
        _that.orginfosName = orginfosName;
        _that.getOrgUserInfo(orgobjid);
        _that.showPopupOrg = false;
      },
      // 获取组织下人员
      getOrgUserInfo(orgobjid) {
        let _that = this;
        api.getOrgUserInfo(orgobjid, function (res) {
          // _that.username = res.data.data.leadername
          // _that.orgname = res.data.data.orginfos[0].orgname
          // _that.orgddid = res.data.data.orginfos[0].orgddid
          _that.openS = res.data.data.openState;
          _that.userInfo = res.data.data.userInfo;
          for (let i = 0; i < _that.userInfo.length; i++) {
            _that.userInfo[i].reason = '';
            _that.userInfo[i].repState = '';
          }
          // alert(JSON.stringify(_that.userInfo))
        })
      },
      // 获取获取管理组织及下级组织
      getOrgInfo () {
        let _that = this;
        let dd = window.dd;
        api.getOrgInfo(function (res) {
          let orginfos = res.data.data.orginfos;
          if (orginfos.length === 0) {
            dd.device.notification.alert({
              message: '您当前岗位下无组织',
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
              },
              onFail: function(err) {}
            });
            return;
          }
          _that.orginfos = orginfos;
          let orgobjid = '';
          _that.selectOrginfos = orginfos.slice(0, [1]);
          for (let i = 0; i < _that.selectOrginfos.length; i++) {
            _that.orginfosName = _that.selectOrginfos[i].key;
            orgobjid = _that.selectOrginfos[i].value;
          }
          _that.getOrgUserInfo(orgobjid);
        })
      },
      // 选择例外原因
      onItemClick (val) {
        // alert(JSON.stringify(val.text));
        let _that = this;
        if (!_that.disabled) {
          _that.showPopup = false
        }
        if (_that.emplId) {
          for (var i = 0; i < _that.userInfo.length; i++) {
               if (_that.userInfo[i].pernr === _that.emplId) {
                 _that.userInfo[i].reason = JSON.stringify(val.text).replace(/"/g, '');
                 if (_that.userInfo[i].reason === '取消') {
                   _that.userInfo[i].reason = '';
                 }
                 _that.userInfo[i].repState = JSON.stringify(val.value);
               }
            }
        }
      },
      showPopupOption (data) {
        let _that = this;
        _that.emplId = '';
        _that.emplId = data;
        _that.showPopup = true
      },
      showPopupOptionOrg () {
        let _that = this;
        _that.showPopupOrg = true
      },
      // 获取员工信息及部门信息
      getddUserID() {
       let _that = this;
        api.getOrgDdid(function (res) {
          _that.username = res.data.data.leadername
          _that.orgname = res.data.data.orginfos[0].orgname
          _that.orgddid = res.data.data.orginfos[0].orgddid
          _that.userInfo = res.data.data.userInfo;
          for (let i = 0; i < _that.userInfo.length; i++) {
            _that.userInfo[i].reason = '';
            _that.userInfo[i].repState = '';
          }
          // alert(JSON.stringify(_that.userInfo))
        })
      },
      // 点击选取部门列表
      checkPerson () {
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
                alert(JSON.stringify(_that.userInfo))
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
          alert('dd ding error: ' + window.location.href + JSON.stringify(err));
          console.log('dd ding error: ' + window.location.href + JSON.stringify(err));
        });
      },
      // 点击开启报平安
      btnDisabled () {
        let _that = this;
        let dd = window.dd;
        if (_that.openS === '1') {
          // whole.showTop('间隔时间必填');
          dd.device.notification.alert({
            message: '当前组织已经开启，请重新选择！',
            title: '提示', // 可传空
            buttonName: '确定',
            onSuccess: function() {
            },
            onFail: function(err) {}
          });
          return;
        }
        if (_that.openDate === '') {
          // whole.showTop('开启日期必填');
          dd.device.notification.alert({
            message: '开启日期必填',
            title: '提示', // 可传空
            buttonName: '确定',
            onSuccess: function() {
            },
            onFail: function(err) {}
          });
          return;
        }
        if (_that.openTime === '') {
          // whole.showTop('开启时间必填');
          dd.device.notification.alert({
            message: '开启时间必填',
            title: '提示', // 可传空
            buttonName: '确定',
            onSuccess: function() {
            },
            onFail: function(err) {}
          });
          return;
        }
        if (Number(_that.openReport) === 0) {
          // whole.showTop('间隔时间必填');
          dd.device.notification.alert({
            message: '间隔时间无效',
            title: '提示', // 可传空
            buttonName: '确定',
            onSuccess: function() {
            },
            onFail: function(err) {}
          });
          return;
        }
        var params = new window.FormData();
        params.append('openDate', _that.openDate);
        params.append('openTime', _that.openTime);
        params.append('openReport', _that.openReport);
        params.append('userInfo', JSON.stringify(_that.userInfo));

        api.saveOpenReport(params, function (res) {
          if (res.data.code) {
            // whole.showTop('报平安已开启');
            dd.device.notification.alert({
              message: '报平安已开启',
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
    background-color: #FF3B3B;
    color: #fff;
  }
  /*禁止选择样式*/
  .demo4-item-disabled {
    color: #999;
  }
</style>
