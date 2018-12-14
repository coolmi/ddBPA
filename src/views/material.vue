<template>
  <div>
    <group title="物料明细信息" labelWidth="6.5rem" gutter="0" labelMarginRight="1rem">
      <selector title="物料类别" placeholder="请选择" v-model="info.wllb" :options="protypeList"></selector>
      <x-input type="text" title="搜索" placeholder="请输入物料关键词" text-align="center" v-model="wuliao"/>
      <selector title="物料" placeholder="物料数据生成中..." v-model="info.wl" :options="wllist"></selector>
      <x-input title="数量" v-model="info.num" text-align="left"></x-input>
      <cell title="单位" v-model="info.danwei" value-align="left"></cell>
      <x-input title="单价" v-model="info.price" text-align="left"></x-input>
      <selector title="货币" placeholder="请选择" direction="ltr" v-model="info.coin" :options="huobiList" :readonly="hbflag"></selector>
      <cell title="金额" v-model="money" value-align="left"></cell>
      <!--<selector title="工厂" placeholder="请选择" :options="tplantList" v-model="info.factory" @on-change="getgcname"></selector>-->
      <x-textarea title="质量要求" placeholder="请填写详细信息" :rows="2" v-model="info.zlrequest"></x-textarea>
      <x-textarea title="技术工艺要求" placeholder="请填写详细信息" :rows="2" v-model="info.jsrequest"></x-textarea>
      <cell v-show="idflag" v-model="ids"></cell>
    </group>
    <box gap="10px 80px">
      <x-button v-if="flag === '0'" text="下一步" @click.native="one" class="baocun" plain type="primary"></x-button>
      <x-button v-if="flag === '1'" text="保存" @click.native="two" class="baocun" plain type="primary"></x-button>
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
    Cell,
    Selector
  } from 'vux'
  import api from 'api';
  import whole from '@/lib/whole'
  import router from '../router'
  import {mapGetters} from 'vuex'

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
      Selector
    },
    data() {
      return {
        info: {
          wllb: '',
          wl: '',
          num: '',
          danwei: 'T',
          price: '',
          coin: '',
          cash: '', // 金额
          zlrequest: '',
          jsrequest: '',
          id: ''
          // factory: '',
          // plant: '',,
        },
        wuliao: '', // 物料监听关键字,支持模糊查询
        idf: '', // id接收
        idflag: false, // id状态标识
        flag: '0',
        hbflag: 'false',
        wllist: [], // 物料
        protypeList: [], // 物料类别
        huobiList: [] // 货币
        // tplantList: [], // 工厂
      }
    },
    watch: {
      wuliao: function (val) {
        this.getwlInfo()
      }
    },
    computed: {
      ...mapGetters({
        getmateriallist: 'getmateriallist'
      }),
      // 计算金额
      money: function () {
        this.info.cash = this.info.price * this.info.num
        return this.info.cash
      },
      // 赋予对象唯一标识
      ids: function () {
        this.info.id = new Date().getTime()
        return this.info.id
      }
    },
    created() {
      let _that = this
      _that.getlistInfo();
      _that.getsamename();
      // 接收列表单个对象详情数据
      let pl = JSON.parse(_that.$route.query.pl);
      if (pl !== null) {
        _that.info = pl
        _that.idf = pl.id
        _that.flag = '1'
      }
    },
    methods: {
      // 获取下拉数据
      getlistInfo() {
        let _that = this;
        api.getlistData(function (res) {
          if (res) {
            console.log(res);
            // 物料类别
            res.data.protypeList.forEach(function (item) {
              let protypeobj = {
                key: item.LABEL,
                value: item.VALUE
              }
              _that.protypeList.push(protypeobj)
            })
            // 货币
            res.data.currencyList.forEach(function (item) {
              let hbobj = {
                key: item.LABEL,
                value: item.VALUE
              }
              _that.huobiList.push(hbobj)
            })
            // 工厂
            // res.data.tplantList.forEach(function (item) {
            //   let tplantobj = {
            //     key: item.PLANT,
            //     value: item.PLANT_DESC
            //   }
            //   _that.tplantList.push(tplantobj)
            // })
          }
        })
      },
      // 获取物料模糊查询数据
      getwlInfo () {
        let _that = this
        api.getmaterialinfos(_that.wuliao, _that.info.wllb, function (res) {
          if (res) {
            _that.wllist = []
            res.data.productList.forEach(function (item) {
              let wlobj = {
                key: item.label,
                value: item.value
              }
              _that.wllist.push(wlobj)
            })
            if (_that.wllist.length === 0) {
              whole.showTop('查询无结果!请重试')
            }
          }
        })
      },
      // 列表页面下一步跳转
      one() {
        let _that = this
        // if (_that.info.wllb === '') {
        //   whole.showTop('物料类别不能为空哦~');
        //   return;
        // }
        // if (_that.info.wl === '') {
        //   whole.showTop('物料不能为空哦~');
        //   return;
        // }
        // if (_that.info.num === '') {
        //   whole.showTop('数量不能为空哦~');
        //   return;
        // }
        // if (_that.info.price === '') {
        //   whole.showTop('单价不能为空哦~');
        //   return;
        // }
        // if (_that.info.coin === '') {
        //   whole.showTop('货币不能为空哦~');
        //   return;
        // }
        // if (_that.info.zlrequest === '') {
        //   whole.showTop('质量要求不能为空哦~');
        //   return;
        // }
        // if (_that.info.jsrequest === '') {
        //   whole.showTop('技术工艺要求不能为空哦~');
        //   return;
        // }
        // if (_that.getmateriallist.length > 0) {
        //   _that.getmateriallist.forEach(function (item) {
        //     if (item.coin !== '') {
        //       if (_that.info.coin !== item.coin) {
        //         let name = _that.gethbname(item.coin)
        //         whole.showTop('货币要保持一致!请选择' + name + '!')
        //         return;
        //       } else {
        //       }
        //     }
        //   })
        // }
        _that.$store.dispatch('addmateriallist', _that.info)
        router.push({path: '/materialList'})
      },
      // 物料详情页面修改保存跳转
      two() {
        let _that = this;
        // if (_that.info.wllb === '') {
        //   whole.showTop('物料类别不能为空哦~');
        //   return;
        // }
        // if (_that.info.wl === '') {
        //   whole.showTop('物料不能为空哦~');
        //   return;
        // }
        // if (_that.info.num === '') {
        //   whole.showTop('数量不能为空哦~');
        //   return;
        // }
        // if (_that.info.price === '') {
        //   whole.showTop('单价不能为空哦~');
        //   return;
        // }
        // if (_that.info.coin === '') {
        //   whole.showTop('货币不能为空哦~');
        //   return;
        // }
        // if (_that.info.factory === '') {
        //   whole.showTop('工厂不能为空哦~');
        //   return;
        // }
        // if (_that.info.zlrequest === '') {
        //   whole.showTop('质量要求不能为空哦~');
        //   return;
        // }
        // if (_that.info.jsrequest === '') {
        //   whole.showTop('技术工艺要求不能为空哦~');
        //   return;
        // }
        _that.getmateriallist.forEach(function (item) {
          if (item.id === _that.idf) {
            item.wllb = _that.info.wllb
            item.wl = _that.info.wl
            item.num = _that.info.num
            item.price = _that.info.price
            item.coin = _that.info.coin
            item.cash = _that.info.cash
            item.zlrequest = _that.info.zlrequest
            item.jsrequest = _that.info.jsrequest
          }
        })
        this.$store.dispatch('savemateriallist', _that.getmateriallist)
        router.push({path: '/materialList'})
      },
      // 货币处理
      gethbname (val) {
        for (let h of this.huobiList) {
          if (val === h.key) {
            return h.value
          }
        }
      },
      // 货币一致
      getsamename () {
        let _that = this
        if (_that.getmateriallist.length > 0) {
          _that.getmateriallist.forEach(function (item) {
            if (item.coin !== '') {
              _that.info.coin = item.coin
              _that.hbflag = true;
            }
          })
        } else {
          _that.hbflag = false;
        }
      },
      // 工厂name
      getgcname(code) {
        for (let o of this.tplantList) {
          if (code === o.key) {
            this.info.plant = o.value
          }
        }
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

