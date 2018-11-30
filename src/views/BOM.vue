<template>
  <div>
    <!--<group>-->
      <!--<cell v-for="kqobj in listce" :key="kqobj.id" :title="kqobj" is-link @click.native="toDetail(kqobj)"></cell>-->
    <!--</group>-->
    <group title="BOM明细" labelWidth="6.5rem" gutter="0" labelMarginRight="1rem">
      <selector title="组件类型" v-model="name" :options="list1"></selector>
      <x-input title="物料" v-model="namevalue"></x-input>
      <x-input title="单吨用量" v-model="namevalue"></x-input>
      <cell title="单位" v-model="namevalue" value-align="left"></cell>
    </group>
    <flexbox class="footerButton" style="z-index: 2;">
      <flexbox-item @click.native="saveevent" style="color:#FF8519;">保存</flexbox-item>
    </flexbox>
  </div>
</template>

<script>
  import {Group, XInput, Cell, XButton, Box, Selector, Flexbox, FlexboxItem} from 'vux'
  import whole from '@/lib/whole';
  import axios from 'axios';
  import router from '../router';

  export default {
    components: {
      Group, XInput, Cell, XButton, Box, Selector, Flexbox, FlexboxItem
    },
    data() {
      return {
        list1: [
          {key: '01', value: '日'},
          {key: '02', value: '周'},
          {key: '03', value: '月'}
        ],
        name: '03',
        namevalue: '真的'
      }
    },
    created() {},
    methods: {
      saveevent() {
        let _that = this;
        router.push({path: '/BOMList', query: {codeData: JSON.stringify(_that.jkData)}})
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
  .footerButton{
    padding-bottom: 5px;
    text-align: center;
  }
</style>
