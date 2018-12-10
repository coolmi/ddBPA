<template>
  <div>
    <group title="BOM明细" labelWidth="6.5rem" gutter="0" labelMarginRight="1rem">
      <cell title="组件类型" v-model="obj.type" value-align="left"></cell>
      <x-input title="物料" v-model="obj.wl"></x-input>
      <x-input title="单吨用量" v-model="obj.pernum"></x-input>
      <cell title="单位" v-model="obj.danwei" value-align="left"></cell>
      <cell v-show="idflag" v-model="ids"></cell>
    </group>
    <flexbox class="footerButton" style="z-index: 2;">
      <flexbox-item v-if="flag === '0'" @click.native="onesave" style="color:#FF8519;">保存</flexbox-item>
      <flexbox-item v-if="flag === '1'" @click.native="twosave" style="color:#FF8519;">保存</flexbox-item>
    </flexbox>
  </div>
</template>

<script>
  import {Group, XInput, Cell, XButton, Box, Selector, Flexbox, FlexboxItem} from 'vux'
  import whole from '@/lib/whole';
  import axios from 'axios';
  import router from '../router';
  import {mapGetters} from 'vuex'

  export default {
    components: {
      Group, XInput, Cell, XButton, Box, Selector, Flexbox, FlexboxItem
    },
    data() {
      return {
        idflag: false,
        flag: '0',
        idf: '',
        obj: {
          wlid: '',
          id: '',
          type: '原料',
          wl: '',
          pernum: '',
          danwei: 'T'
        }
      }
    },
    computed: {
      ...mapGetters({
        getlist: 'getbomlist'
      }),
      // 赋予对象唯一标识
      ids: function () {
        this.obj.id = new Date().getTime()
        return this.obj.id
      }
    },
    created() {
      this.obj.id = new Date().getTime()
      this.obj.wlid = JSON.parse(this.$route.query.wlid);
      let bomobj = JSON.parse(this.$route.query.bomobj);
      if (bomobj !== null) {
        this.obj = bomobj.pl
        this.obj.wlid = bomobj.wlid
        this.idf = bomobj.pl.id
        this.flag = '1'
      }
    },
    methods: {
      onesave() {
        this.$store.dispatch('addbomlist', this.obj)
        router.go(-1)
      },
      twosave() {
        let _that = this
        _that.getlist.forEach(item => {
          if (item.id === _that.idf) {
            item.type = _that.obj.type
            item.wl = _that.obj.wl
            item.pernum = _that.obj.pernum
            item.danwei = _that.obj.danwei
            item.wlid = _that.obj.wlid
          }
        })
        this.$store.dispatch('savebomlist', _that.getlist)
        router.push({path: '/BOMList'})
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
