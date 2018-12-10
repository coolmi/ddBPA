<template>
  <div>
    <!--<group>-->
      <!--<cell v-for="kqobj in listce" :key="kqobj.id" :title="kqobj" is-link @click.native="toDetail(kqobj)"></cell>-->
    <!--</group>-->
    <group title="交货计划明细" labelWidth="6.5rem" gutter="0" labelMarginRight="1rem">
      <selector title="期间标识" v-model="obj.qjbs" :options="list1" @on-change="getbsname"></selector>
      <datetime title="交货日期" v-model="obj.jhrq" format="YYYY-MM-DD"></datetime>
      <x-input title="数量" v-model="obj.num"></x-input>
      <cell title="单位" v-model="obj.danwei" value-align="left"></cell>
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
          qjbs: '01',
          bsname: '',
          jhrq: '',
          num: '',
          danwei: 'T'
        },
        idflag: false,
        flag: '0',
        idf: ''
      }
    },
    computed: {
      ...mapGetters({
        getlist: 'getplantlist'
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
      let planobj = JSON.parse(this.$route.query.planobj);
      console.log(planobj)
      if (planobj !== null) {
        this.obj = planobj.pl
        this.obj.wlid = planobj.wlid
        this.idf = planobj.pl.id
        this.flag = '1'
      }
    },
    methods: {
      oneevent() {
        this.$store.dispatch('addplantlist', this.obj)
        router.go(-1)
      },
      twoevent() {
        let _that = this
        _that.getlist.forEach(item => {
          if (item.id === _that.idf) {
            item.qjbs = _that.obj.qjbs
            item.jhrq = _that.obj.jhrq
            item.num = _that.obj.num
            item.danwei = _that.obj.danwei
            item.wlid = _that.obj.wlid
          }
        })
        this.$store.dispatch('saveplantlist', _that.getlist)
        router.push({path: '/deliveryPlanList'})
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
