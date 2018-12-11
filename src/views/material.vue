<template>
  <div>
    <group title="物料明细信息" labelWidth="6.5rem" gutter="0" labelMarginRight="1rem">
      <selector title="物料类别" placeholder="请选择" v-model="info.wllb" :options="protypeList"></selector>
      <x-input title="物料" v-model="info.wl" text-align="left" @click="getwlInfo"></x-input>
      <x-input title="数量" v-model="info.num" text-align="left"></x-input>
      <cell title="单位" v-model="info.danwei" value-align="left"></cell>
      <x-input title="单价" v-model="info.price" text-align="left"></x-input>
      <selector title="货币" placeholder="请选择" v-model="info.coin" :options="huobiList"></selector>
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
  // import whole from '@/lib/whole'
  import router from '../router'
  import {mapGetters} from 'vuex'
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
      vSearch,
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
          cash: '',
          // factory: '',
          // plant: '',
          zlrequest: '',
          jsrequest: '',
          id: ''
        },
        idf: '',
        idflag: false,
        flag: '0',
        protypeList: [], // 物料类别
        // tplantList: [], // 工厂
        huobiList: [
          {key: '人民币', value: '人民币'},
          {key: '美元', value: '美元'},
          {key: '日元', value: '日元'},
          {key: '欧元', value: '欧元'}
        ]
      }
    },
    created() {
      this.getlistInfo();
      // 接收列表单个对象详情数据
      let pl = JSON.parse(this.$route.query.pl);
      if (pl !== null) {
        this.info = pl
        this.idf = pl.id
        this.flag = '1'
      }
    },
    computed: {
      ...mapGetters({
        getmateriallist: 'getmateriallist'
      }),
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
    methods: {
      // 获取下拉数据
      getlistInfo() {
        let _that = this;
        api.getlistData(function (res) {
          if (res) {
            console.log(res);
            res.data.protypeList.forEach(function (item) {
              let protypeobj = {
                key: item.LABEL,
                value: item.VALUE
              }
              _that.protypeList.push(protypeobj)
            })
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
      getwlInfo () {
        api.getmaterialinfos(this.info.wl, this.info.wllb, function (res) {
          console.log('================' + res)
        })
      },
      // 列表页面下一步跳转
      one() {
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
        this.$store.dispatch('addmateriallist', this.info)
        router.push({path: '/materialList'})
      },
      // 列表页面保存跳转
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
            item.factory = _that.info.factory
            item.plant = _that.info.plant
            item.zlrequest = _that.info.zlrequest
            item.jsrequest = _that.info.jsrequest
          }
        })
        this.$store.dispatch('savemateriallist', _that.getmateriallist)
        router.push({path: '/materialList'})
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

