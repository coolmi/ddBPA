<template>
  <div>
    <group title="物料明细信息" labelWidth="6.5rem" gutter="0" labelMarginRight="1rem">
      <v-search title="物料类别" :cdata="listce" v-model="nameceshi"></v-search>
      <x-input title="物料" v-model="nameceshi" text-align="left"></x-input>
      <v-search title="工厂" :cdata="listce" v-model="nameceshi"></v-search>
      <x-input title="单价" v-model="nameceshi" text-align="left"></x-input>
      <cell title="金额" v-model="nameceshi" value-align="left"></cell>
      <cell title="货币" v-model="nameceshi" value-align="left"></cell>
      <x-input title="数量" v-model="nameceshi" text-align="left"></x-input>
      <cell title="单位" v-model="nameceshi" value-align="left"></cell>
      <x-textarea title="质量要求" placeholder="请填写详细信息" :rows="2" v-model="nameceshi"></x-textarea>
      <x-textarea title="技术工艺要求" placeholder="请填写详细信息" :rows="2" v-model="nameceshi"></x-textarea>
    </group>
    <box gap="10px 80px">
      <x-button text="下一步" @click.native="one" class="baocun" plain type="primary"></x-button>
    </box>
  </div>
</template>

<script>
  import {
    Box,
    Flexbox,
    FlexboxItem,
    XButton,
    Group,
    GroupTitle,
    XInput,
    XTextarea,
    PopupPicker,
    Cell
  } from 'vux'
  import api from 'api';
  import axios from 'axios';
  import whole from '@/lib/whole'
  import router from '../router'
  import ding from '@/lib/ding'
  import vSearch from '@/components/searchChecker';

  export default {
    components: {
      Box,
      Flexbox,
      FlexboxItem,
      XButton,
      Group,
      GroupTitle,
      XInput,
      XTextarea,
      PopupPicker,
      Cell,
      vSearch
    },
    data() {
      return {
        nameceshi: 'QQ',
        namece: [],
        listce: []
      }
    },
    created() {
      // this.getInfos();
      // this.getadmininfo();
    },
    methods: {
      one() {
        // 健康页面跳转
        let _that = this;
        router.push({path: '/materialList', query: {codeData: JSON.stringify(_that.jkData)}})
      },
      getadmininfo() {
        let _that = this;
        api.getadmin(function (res) {
          if (res.data.code) {
            console.log(res);
            _that.ddid = res.data.data.data.ddid;
          }
        })
      },
      // 打开钉钉人员page
      openPerInfo() {
        let dd = window.dd;
        let _that = this;
        dd.ready(function () {
          dd.biz.util.open({
            name: 'profile',
            params: {
              id: _that.ddid,
              corpId: ding.CORPID
            },
            onSuccess: function () {
              whole.showTop('跳转至HR的钉钉！');
            },
            onFail: function (err) {
              console.log(err)
              whole.showTop('获取HR钉钉失败！请联系管理员！');
            }
          });
        })
      },
      saveinfo: function () {
        let _that = this;
        let params = new window.FormData();

        if (_that.infos.phone.length === 0) {
          window.alert('请输入手机号!');
          return;
        }
        params.append('name', _that.infos.name || '');
        params.append('racky', _that.infos.racky || '');
        params.append('famst', _that.infos.famst || '');
        params.append('pcode', _that.infos.pcode || '');
        params.append('zzdsffy', _that.infos.zzdsffy || '');
        params.append('zzdfyqks', _that.infos.zzdfyqks || '');
        params.append('zzdfyqjs', _that.infos.zzdfyqjs || '');
        params.append('zhrhkxz', _that.infos.zhrhkxz || '');
        params.append('zhrjg', _that.infos.zhrjg || '');
        params.append('state5', _that.diqudata.state5 || '');
        params.append('ort015', _that.diqudata.ort015 || '');
        params.append('ort025', _that.diqudata.ort025 || '');
        params.append('stateb', _that.diqudata.stateb || '');
        params.append('ort01b', _that.diqudata.ort01b || '');
        params.append('ort02b', _that.diqudata.ort02b || '');
        params.append('strasb', _that.infos.strasb || '');
        params.append('number', _that.number || '');  // 验证码
        params.append('no', _that.infos.no || '');
        params.append('phone', _that.infos.phone || '');
        if (_that.befphone !== _that.infos.phone && _that.number === '') {
          window.alert('手机号变更， 必须输入验证码')
          return;
        }
        if (_that.infos.email_zui[0] !== null) {
          _that.estr = _that.infos.email_zui[0].toString();
          _that.ename = this.emaildd(_that.estr, _that.list5)
          params.append('email', _that.infos.emailFrom + '@' + _that.ename || '');
          if (_that.infos.emailFrom.indexOf('@') !== -1) {
            window.alert('请输入合法邮箱号码，且不包括后缀名！')
            return;
          }
        }
        axios.post('/dingding/es/info', params)
          .then((res) => {
            //  保存成功 返回true
            if (res.data.code) {
              whole.showTop('保存成功');
              // setTimeout(() => {
              //   let dd = window.dd;
              //   dd.biz.navigation.close({
              //     onSuccess: function (result) {
              //     },
              //     onFail: function (err) {
              //     }
              //   })
              // }, 1500);
            } else {
              window.alert('保存失败,请重试')
            }
          }).catch((error) => {
          return Promise.reject(error)
        })
      }
    }
  }
</script>

<style scoped lang='less'>
  @import '~vux/src/styles/1px.less';

  .baocun {
    border-radius: 99px;
    margin-top: 3rem;
    color: #E59313;
    border-color: #E59313;
  }

</style>

