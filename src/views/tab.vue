<template>
  <div class="tab_box">
    <div class="all">
      <!--<br>-->
      <!--<x-header title="上报情况总览" :left-options="{preventGoBack: true}" @on-click-back="goBack" style="position: fixed;width: 100%; left: 0;top: 0;" :class="mtop ? 'm_top':''"></x-header>-->
      <!--<br>-->
      <div>
        <x-input title="请输入所属组织" v-model="orgname" style="color: #000"></x-input>
        <datetime v-model="datestr" name="查询日期" format="YYYY-MM-DD">
          <p slot="title">开启日期</p>
        </datetime>
        <x-button text="查询" @click.native="getSafetyResultsCount(orgname, datestr)" :gradients="['#1D62F0', '#19D5FD']"></x-button>
      </div>
      <br>
      <div class="title" :class="mtop ? 'margin_top':''">
        <div class="title_left">
          <table class="main_table">
            <tr v-for="(val,index) in list2" :key="index">
              <th style="width: 50px;">{{val.xh}}</th>
              <th style="width: 70px;">{{val.a}}</th>
              <th style="width: 70px;">{{val.b}}</th>
              <th style="width: 90px;">{{val.c}}</th>
              <th style="width: 90px;">{{val.d}}</th>
              <th style="width: 160px;">{{val.e}}</th>
              <th>{{val.f}}</th>
            </tr>
          </table>
        </div>
      </div>
      <div class="content">
        <div class="content_left">
          <table class="main_table">
            <tr v-for="(item,index) in list" :key="index">
              <td style="width: 50px;">{{index+1}}</td>
              <td style="width: 70px;">{{item.sb}}</td>
              <td style="width: 70px;">{{item.ysb}}</td>
              <td style="width: 90px;">{{item.wsb}}</td>
              <td style="width: 90px;">{{item.ddyc}}</td>
              <td style="width: 160px;">{{item.orgname}}</td>
              <td>{{item.leadername}}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // import api from 'api'
  import { XHeader, XInput, Datetime, XButton } from 'vux'

export default {
  components: {
    XHeader,
    XInput,
    Datetime,
    XButton
  },
  data () {
    return {
      orgname: '',
      datestr: '',
      mtop: false,
      list: '',
      list2: [
        {
          xh: '序号',
          a: '应报人数',
          b: '已报人数',
          c: '未申报人数',
          d: '地理位置异常人数',
          e: '所属组织',
          f: '直接领导'
        }
      ]
    }
  },
  created() {
    let _that = this;
    let dd = window.dd;
    // dd.device.screen.rotateView({
    //   showStatusBar: true, // 否显示statusbar
    //   clockwise: true, // 是否顺时针方向
    //   onSuccess: function(result) {
    //     _that.getSafetyResultsCount();
    //   },
    //   onFail: function(err) {}
    // });
    _that.getSafetyResultsCount('34368619', '');
    dd.ui.webViewBounce.disable();
    dd.device.base.getPhoneInfo({
      onSuccess: function(data) {
        // alert(data.brand)
        if (data.brand === 'iPhone') {
          _that.mtop = true
        }
      }
    });
  },
  methods: {
    goBack () {
      let _that = this;
      let dd = window.dd;
      dd.device.screen.resetView({
        onSuccess: function(result) {
        },
        onFail: function(err) {}
      });
      _that.$router.go(-1);
    },
    check () {
      // alert('查询');
      // let _that = this;
      // let dd = window.dd;
      // dd.device.screen.resetView({
      //   onSuccess: function(result) {
      //   },
      //   onFail: function(err) {}
      // });
      // _that.$router.go(-1);
    },
    getSafetyResultsCount (orgname, datastr) {
      // let _that = this;
      // api.getSafetyResultsCount(orgname, datastr, function (res) {
      //   // alert(JSON.stringify(res.data.data.safetyresult))
      //   _that.list = res.data.data.safetyresult;
      // })
    }
  }
}
</script>

<style scoped>
  *{
    margin: 0;
    padding: 0;
  }
  body,html{
    font-size: 62.5%;
  }
  div.tab_box{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  div.all{
    border: 0px solid #000;
    width: 100%;
    clear: right;
    height: 100%;
  }
  div.title{
    width: 100%;
    height: 10%;
    /*margin-top: 20px;*/
  }
  div.content{
    width: 100%;
    height: 220px;
    overflow: scroll;
    overflow-x: hidden;
  }
  div.title_left{
    float: left;
  }
  div.content_left{
    height: 100%;
    float: left;
  }
  .main_table {
    width: 100%;
    border: 1px solid #000;
    border-collapse: collapse;  /*边线与旁边的合并*/
    table-layout:fixed;
    text-align: center;
  }
  .main_table tr th {
    border: 1px solid #000;
  }
  /*单元格样式*/
  .main_table tr td {
    border: 1px solid #000;
  }
  .m_top{
    top: 20px;
    margin-top: 20px;
  }
  .margin_top{
    margin-top: 0px;
  }
</style>
