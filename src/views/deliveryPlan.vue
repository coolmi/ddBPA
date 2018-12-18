<template>
  <div>
    <group title="交货计划明细" labelWidth="6.5rem" gutter="0" labelMarginRight="1rem">
      <selector title="期间标识" placeholder="请选择" v-model="obj.prgrs" :options="list1" @on-change="getbsname"></selector>
      <datetime title="交货日期" v-model="obj.etdat" placeholder="请输入交货日期" format="YYYY-MM-DD"></datetime>
      <x-input title="数量" v-model="obj.wmeng"></x-input>
      <cell title="单位" v-model="obj.vrkme" value-align="left"></cell>
      <cell v-show="idflag" v-model="ids"></cell>
    </group>
    <flexbox class="footerButton" style="z-index: 2;">
      <flexbox-item v-if="flag === '0'" @click.native="oneevent" style="color:#FF8519;">保存</flexbox-item>
      <flexbox-item v-if="flag === '1'" @click.native="twoevent" style="color:#FF8519;">保存</flexbox-item>
    </flexbox>
  </div>
</template>

<script>
  import {Group, XInput, Datetime, Cell, XButton, Box, Flexbox, FlexboxItem, Selector} from 'vux'
  import router from '../router';
  import {mapGetters} from 'vuex'

  export default {
    components: {
      Group, XInput, Datetime, Cell, XButton, Box, Flexbox, FlexboxItem, Selector
    },
    data() {
      return {
        list1: [
          {key: '01', value: '日'},
          {key: '02', value: '周'},
          {key: '03', value: '月'}
        ],
        obj: {
          wlid: '',
          id: '',
          prgrs: '',
          bsname: '',
          etdat: '',
          wmeng: '',
          vrkme: 'T'
        },
        idflag: false,
        flag: '0',
        idf: ''
      }
    },
    computed: {
      ...mapGetters({
        getlist: 'getplantlist', // 交货计划
        getwlid: 'getmaterialid' // 物料id
      }),
      // 赋予对象唯一标识
      ids: function () {
        this.obj.id = new Date().getTime()
        return this.obj.id
      }
    },
    created() {
      this.getlocalTime();
      let pl = JSON.parse(this.$route.query.pl);
      if (pl !== null) {
        this.obj = pl
        this.idf = pl.id // 通过交货计划对象id修改
        this.flag = '1'
      }
    },
    methods: {
      // 保存
      oneevent() {
        this.$store.dispatch('addplantlist', this.obj)
        router.push({path: '/deliveryList'})
      },
      // 修改保存
      twoevent() {
        let _that = this
        _that.getlist.forEach(item => {
          if (_that.idf === item.id) {
            item.wlid = _that.obj.wlid
            item.etdat = _that.obj.etdat
            item.wmeng = _that.obj.wmeng
            item.prgrs = _that.obj.prgrs
            item.vrkme = _that.obj.vrkme
          }
        })
        this.$store.dispatch('saveplantlist', _that.getlist)
        router.push({path: '/deliveryList'})
      },
      // 获取当前时间
      getlocalTime () {
        let time = new Date()
        this.obj.wlid = this.getwlid; // 物料id赋给交货计划对象中
        this.obj.etdat = time.toLocaleDateString().replace(/\//g, '-')
        console.log(this.obj.etdat)
      },
      // 标识name
      getbsname(code) {
        for (let o of this.list1) {
          if (code === o.key) {
            this.obj.bsname = o.value
          }
        }
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
