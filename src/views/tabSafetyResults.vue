<template>
  <div class="tab_box">
    <div class="all">
      <!--<br>-->
      <!--<x-header :left-options="{preventGoBack: true}" @on-click-back="goBack" style="position: fixed;width: 100%; left: 0;top: 0px;" :class="mtop ? 'm_top':''">已报/未报统计</x-header>-->
      <!--<br>-->
      <div class="title" :class="mtop ? 'margin_top':''">
        <div class="title_left">
          <table class="main_table">
            <tr v-for="(val,index) in list2" :key="index">
              <th style="width: 45px;font-size: 14px">{{val.xh}}</th>
              <th style="width: 70px;font-size: 14px">{{val.a}}</th>
              <th style="width: 110px;font-size: 14px">{{val.c}}</th>
              <!--<th style="width: 80px;font-size: 14px" v-if="repS !== '1'">{{val.b}}</th>-->
              <th style="width: 100px;font-size: 14px">{{val.d}}</th>
              <th style="width: 100px;font-size: 14px">{{val.e}}</th>
              <th style="width: 70px;font-size: 14px">{{val.f}}</th>
            </tr>
          </table>
        </div>
      </div>
      <div class="content" :class="mtop ? 'content_height1':'content_height2'">
        <div class="content_left">
          <table class="main_table">
            <tr v-for="(item,index) in list" :key="index">
              <td style="width: 45px;font-size: 14px">{{index+1}}</td>
              <td style="width: 70px;font-size: 14px">{{item.ename}}</td>
              <td style="width: 110px;color: deepskyblue;font-size: 14px" @click="showCall(item.mobile)">
                {{item.mobile}}
              </td>
              <!--<td style="width: 80px;font-size: 14px" v-if="repS !== '1'">{{item.exc_reason}}</td>-->
              <td style="width: 100px;font-size: 14px">{{item.place}}</td>
              <td style="width: 100px;font-size: 14px">{{item.orgname}}</td>
              <td style="width: 70px;font-size: 14px">{{item.leadername}}</td>
            </tr>
          </table>
        </div>
      </div>
      <div>
        <div style="display: flex;justify-content: space-between; align-items: center;">
          <div style="width: 30%;">
            <x-input title="姓名" v-model="ename" style="color: #000;font-size: 14px" placeholder="请输入姓名"></x-input>
          </div>
          <div style="width: 35%;">
            <x-input title="手机号" v-model="mobile" style="color: #000;font-size: 14px" placeholder="请输入手机号"></x-input>
          </div>
          <div style="width: 35%;">
            <x-input title="直接领导" v-model="leadername" style="color: #000;font-size: 14px" placeholder="请输入直接领导"></x-input>
          </div>
        </div>
        <div style="display: flex;justify-content: space-between; align-items: center;">
          <div style="width: 50%;">
            <datetime v-model="dateStr" name="查询日期" format="YYYY-MM-DD" style="font-size: 14px">
              <p slot="title" style="font-size: 14px">查询日期</p>
            </datetime>
          </div>
          <div style="width: 50%;">
            <selector title="是否上报" :options="list1" v-model="repState" style="font-size: 14px"></selector>
            <!--<x-switch title="是否上报" :value-map="['0', '1']" v-model="repState" style="font-size: 14px"></x-switch>-->
          </div>
        </div>
        <x-button text="查询" @click.native="getSafetyResults(ename, mobile, leadername, dateStr, '1')"
                  :gradients="['#1D62F0', '#19D5FD']"></x-button>
      </div>
    </div>
  </div>
</template>

<script>
  import api from 'api'
  import {XHeader, XInput, Datetime, XButton, XSwitch, Selector} from 'vux'
  import {mapGetters} from 'vuex'
  import ding from '@/lib/ding'
  import DEM from '@/lib/dingErrMessage'

  export default {
    components: {
      XHeader,
      XInput,
      Datetime,
      XButton,
      XSwitch,
      Selector
    },
    data() {
      return {
        list1: [{key: '9', value: '全部'}, {key: '0', value: '未上报'}, {key: '1', value: '已上报'}],
        dateStr: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
        repS: '',
        repState: '9',
        ename: '',
        mobile: '',
        leadername: '',
        mtop: false,
        list: '',
        list2: [
          {
            xh: '序号',
            a: '员工姓名',
            c: '手机号',
            b: '未上报原因',
            d: '申报地点',
            e: '所属组织',
            f: '直接领导'
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
      // ding.jsApiOAuth(_that.path).then((ddconfig) => {
      //   // alert(JSON.stringify(ddconfig))
      //   dd.config(ddconfig);
      //   // _that.getddUserID();
      //   // _that.checkPerson();
      // }).catch(function (error) {
      //   ding.alertInfo(DEM.ddConfigInfoError);
      // });
      _that.getSafetyResults('', '', '', '', '0');
      dd.ui.webViewBounce.disable();
      dd.device.base.getPhoneInfo({
        onSuccess: function (data) {
          if (data.brand === 'iPhone') {
            _that.mtop = true
          } else {
            _that.mtop = false
          }
        }
      });
      dd.ready(function () {
        dd.biz.navigation.setRight({
          show: false, // 控制按钮显示， true 显示， false 隐藏， 默认true
          control: true, // 是否控制点击事件，true 控制，false 不控制， 默认false
          text: '查询', // 控制显示文本，空字符串表示显示默认文本
          onSuccess: function (result) {
            alert('查询')
          },
          onFail: function (err) {
          }
        });
      })
    },
    methods: {
      goBack() {
        let _that = this;
        let dd = window.dd;
        dd.device.screen.resetView({
          onSuccess: function (result) {
          },
          onFail: function (err) {
          }
        });
        _that.$router.go(-1);
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
      getSafetyResults(ename, mobile, leadername, dateStr, flag) {
        let _that = this;
        var rep = '';
        if (flag === '0') {
          rep = '';
          _that.repS = '0';
        } else {
          if (_that.repState === '') {
            rep = '0';
            _that.repS = '0';
          } else {
            rep = _that.repState;
            _that.repS = _that.repState;
          }
        }
        api.getSafetyResults(ename, mobile, leadername, dateStr, rep, function (res) {
          // alert(JSON.stringify(res.data.data.safetyresult))
          _that.list = res.data.data.safetyresult;
        })
      }
    }
  }
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
  }

  body, html {
    font-size: 62.5%;
  }

  div.tab_box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  div.all {
    border: 0px solid #000;
    width: 99.5%;
    clear: right;
    height: 100%;
  }

  div.title {
    width: 100%;
    height: 10%;
  }

  div.content {
    width: 100%;
    overflow: scroll;
    overflow-x: hidden;
  }

  div.title_left {
    float: left;
  }

  div.content_left {
    height: 100%;
    float: left;
  }

  .main_table {
    width: 100%;
    border: 1px solid #000;
    border-collapse: collapse; /*边线与旁边的合并*/
    table-layout: fixed;
    text-align: center;
  }

  .main_table tr th {
    border: 1px solid #000;
  }

  /*单元格样式*/
  .main_table tr td {
    border: 1px solid #000;
  }

  .m_top {
    top: 20px;
    margin-top: 20px;
  }

  .margin_top {
    margin-top: 0px;
  }

  .content_height1 {
    height: 160px;
  }

  .content_height2 {
    height: 126px;
  }
</style>
