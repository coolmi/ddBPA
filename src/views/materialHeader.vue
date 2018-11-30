<template>
  <div>
    <group title="需求抬头" labelWidth="6.5rem" gutter="0" labelMarginRight="1rem">
      <cell title="客户名称" v-model="name" :options="list1" value-align="left"></cell>
      <cell title="销售部门" v-model="name" :options="list1" value-align="left"></cell>
      <cell title="需求编号" v-model="nameceshi" value-align="left"></cell>
      <datetime title="创建时间" v-model="nameceshi" format="YYYY-MM-DD"></datetime>
      <selector title="业务类别" v-model="name" :options="list1"></selector>
      <selector title="需求类型" v-model="name" :options="list1"></selector>
      <selector title="销售范围" v-model="name" :options="list1"></selector>
      <selector title="货币" v-model="name" :options="list1"></selector>
      <x-input title="汇率" v-model="nameceshi" text-align="center"></x-input>
    </group>
    <box gap="10px 50px">
      <flexbox>
        <flexbox-item>
          <x-button text="返回" @click.native="fhinfo" class="baocun" plain type="primary"></x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button text="保存" @click.native="saveinfo" class="baocun" plain type="primary"></x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button text="提交" @click.native="tjinfo" class="baocun" plain type="primary"></x-button>
        </flexbox-item>
      </flexbox>
    </box>
  </div>
</template>

<script>
  import {Group, Selector, XInput, Datetime, Cell, XButton, Box, Flexbox, FlexboxItem} from 'vux'
  import whole from '@/lib/whole';
  import axios from 'axios';
  import router from '../router';
  import api from 'api';

  export default {
    components: {
      Group, Selector, XInput, Datetime, Cell, XButton, Box, Flexbox, FlexboxItem
    },
    data() {
      return {
        list1: [
          {key: '01', value: '日'},
          {key: '02', value: '周'},
          {key: '03', value: '月'}
        ],
        name: '02',
        nameceshi: ''
      }
    },
    created() {
      this.getUserInfos();
    },
    methods: {
      getUserInfos() {
        let _that = this;
        api.getUserInfos(function (res) {
          if (res.data.code && res.data.data) {
            console.log(res)
            _that.infos.name = res.data.data.info.name;
            _that.list3 = _that.nationData(res.data.data.t505r);
            _that.infos.racky = [res.data.data.info.racky];
            _that.list1 = _that.marriageData(res.data.data.t5);
            _that.infos.famst = [res.data.data.info.famst];
            _that.list2 = _that.modiData(res.data.data.t7);
            _that.infos.pcode = [res.data.data.info.pcode];
            _that.infos.emailFrom = res.data.data.info.emailFrom;
            _that.infos.emailType = res.data.data.info.emailType;
            _that.infos.email_zui = [_that.emailData(_that.infos.emailType, _that.list5)]
            _that.infos.zzdsffy = res.data.data.info.zzdsffy;
            _that.infos.zzdfyqks = _that.formatdates(res.data.data.info.zzdfyqks);
            _that.infos.zzdfyqjs = _that.formatdates(res.data.data.info.zzdfyqjs);
            _that.list4 = _that.stationData(res.data.data.zbghkxzList);    // 户口性质
            _that.infos.zhrhkxz = [res.data.data.info.zhrhkxz];
            _that.addressData = _that.modifyCode(res.data.data.t0);   // 籍贯集合
            // 籍贯字段
            _that.infos.zhrjg = res.data.data.info.zhrjg;
            // 户口所在地
            _that.infos.residenceAddre.push(res.data.data.info.state5);
            _that.infos.residenceAddre.push(res.data.data.info.state5 + '-' + res.data.data.info.ort015);
            _that.infos.residenceAddre.push(res.data.data.info.state5 + '-' + res.data.data.info.ort015 + '-' + res.data.data.info.ort025);
            // 有效通讯地址
            _that.infos.residenceture.push(res.data.data.info.stateb);
            _that.infos.residenceture.push(res.data.data.info.stateb + '-' + res.data.data.info.ort01b);
            _that.infos.residenceture.push(res.data.data.info.stateb + '-' + res.data.data.info.ort01b + '-' + res.data.data.info.ort02b);
            _that.infos.strasb = res.data.data.info.strasb;
            _that.infos.no = res.data.data.info.no;
            _that.infos.phone = res.data.data.info.phone;
            _that.befphone = res.data.data.info.phone;
            _that.jkData.zzdsg = res.data.data.info.zzdsg;
            _that.jkData.zzdtz = res.data.data.info.zzdtz;
            _that.jkData.zhrscbw = res.data.data.info.zhrscbw;
            _that.jkData.zhrsccd = res.data.data.info.zhrsccd;
            _that.jkData.sbgsz = res.data.data.info.sbgsz;
            _that.jkData.sbadt = res.data.data.info.sbadt;
            _that.jkData.sbdst = res.data.data.info.sbdst;
            _that.jyData.jylist = res.data.data.jylist;
            _that.jyData.xltype = res.data.data.t517t;
            _that.jyData.degree = res.data.data.t519t;
            _that.wklist = res.data.data.wklist;
            _that.zzData.zclist = res.data.data.zclist;
            _that.zzData.zc = res.data.data.zc;
            _that.recordData.dat01 = res.data.data.info.dat01;
            _that.recordData.dat02 = res.data.data.info.dat02;
            _that.recordData.dat06 = res.data.data.info.dat06;
          }
        })
      },
      fhinfo() {
        let _that = this;
        router.push({path: '/materialList', query: {codeData: JSON.stringify(_that.jkData)}})
      },
      tjinfo() {
        let _that = this;
        if (_that.bsup === '0') {
          _that.jkData.zhrscbw = '';
          // _that.jkData.zhrsccd = '';
        }
      },
      saveinfo() {
        let _that = this;
        let params = new window.FormData();
        console.log(_that.jkData);
        params.append('zzdsg', _that.jkData.zzdsg || '');
        params.append('zzdtz', _that.jkData.zzdtz || '');
        params.append('bsup', _that.bsup || '');
        params.append('zhrscbw', _that.jkData.zhrscbw || '');
        params.append('zhrsccd', _that.jkData.zhrsccd || '');
        params.append('certificate', _that.certificate || '');
        params.append('sbgsz', _that.jkData.sbgsz || '');
        params.append('sbadt', _that.jkData.sbadt || '');
        params.append('sbdst', _that.jkData.sbdst || '');
        axios.post('/dingding/es/health', params)
          .then((res) => {
            //  保存成功 返回true
            if (res.data.code) {
              whole.showTop('保存成功');
              setTimeout(() => {
                router.go(-1);
              }, 1000);
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
    margin-top: 1.5rem;
    color: #E59313;
    border-color: #E59313;
  }

</style>
