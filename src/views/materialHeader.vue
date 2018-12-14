<template>
  <div>
    <group title="需求抬头" labelWidth="6.5rem" gutter="0" labelMarginRight="1rem">
      <cell title="需求编号" v-model="info.demandnum" value-align="left"></cell>
      <cell title="业务员" v-model="info.name" value-align="left"></cell>
      <cell title="销售部门" v-model="info.dept" value-align="left"></cell>
      <datetime title="创建时间" v-model="info.createtime" format="YYYY-MM-DD"></datetime>
      <selector title="业务类别" placeholder="请选择" v-model="info.ywtype" :options="ywlist"></selector>
      <selector title="需求类型" placeholder="请选择" v-model="info.xqtype" :options="xqlist"></selector>
      <!--<x-input type="text"  title="搜索" placeholder="请输入销售范围关键词" text-align="center" v-model="sealfan"/>-->
      <selector title="销售范围" placeholder="请选择" v-model="info.sealfan" :options="xslist"></selector>
      <x-input type="text" title="搜索" placeholder="请输入客户关键词" text-align="center" v-model="kehu"/>
      <selector title="客户名称" placeholder="客户数据生成中..." v-model="info.customname" :options="customerlist"></selector>
      <selector title="货币" placeholder="请选择" v-model="info.coin" :options="huobiList" :readonly="hbflag"></selector>
      <x-input title="汇率" v-model="info.rate" text-align="center"></x-input>
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
  import router from '../router';
  import api from 'api';
  import {mapGetters} from 'vuex'
  import whole from '@/lib/whole';

  export default {
    components: {
      Group, Selector, XInput, Datetime, Cell, XButton, Box, Flexbox, FlexboxItem, mapGetters
    },
    data() {
      return {
        info: {
          name: '',
          dept: '',
          demandnum: '',
          createtime: '',
          ywtype: '',
          xqtype: '',
          sealfan: '',
          customname: '',
          coin: '',
          rate: ''
        },
        sealfan: '',
        kehu: '',
        hbflag: 'false',
        ywlist: [], // 业务类别
        xqlist: [], // 需求类型
        xslist: [], // 销售范围
        huobiList: [], // 货币
        customerlist: [] // 客户
      }
    },
    watch: {
      kehu: function (val) {
        this.getkhInfo()
      },
      sealfan: function (val) {
        this.getxfInfo()
      }
    },
    computed: {
      ...mapGetters({
        getmateriallist: 'getmateriallist'
      })
    },
    created() {
      this.getlistInfo();
      this.getsamename();
    },
    methods: {
      // 获取下拉数据
      getlistInfo() {
        let _that = this;
        api.getlistData(function (res) {
          if (res) {
            console.log(res);
            // 用户信息
            _that.info.name = res.data.headVo.salesmanName
            _that.info.dept = res.data.headVo.departmentName
            // 业务类别
            res.data.bustypeList.forEach(function (item) {
              let ywobj = {
                key: item.LABEL,
                value: item.VALUE
              }
              _that.ywlist.push(ywobj)
            })
            // 需求类型
            res.data.reqtypeList.forEach(function (item) {
              let xqobj = {
                key: item.LABEL,
                value: item.VALUE
              }
              _that.xqlist.push(xqobj)
            })
            // 销售范围
            res.data.saleAreasList.forEach(function (item) {
              let xsobj = {
                key: item.id,
                value: item.text
              }
              _that.xslist.push(xsobj)
            })
            // 货币
            res.data.currencyList.forEach(function (item) {
              let hbobj = {
                key: item.LABEL,
                value: item.VALUE
              }
              _that.huobiList.push(hbobj)
            })
          }
        })
      },
      // 获取客户模糊查询数据
      getkhInfo () {
        let _that = this
        api.getmcustomerinfos(_that.info.sealfan, _that.kehu, function (res) {
          if (res) {
            _that.customerlist = []
            res.data.customerList.forEach(function (item) {
              let cuobj = {
                key: item.id,
                value: item.text
              }
              _that.customerlist.push(cuobj)
            })
            if (_that.customerlist.length === 0) {
              whole.showTop('查询无结果!请重试')
            }
          }
        })
      },
      // 获取销售范围模糊查询数据
      // getxfInfo () {
      //   let _that = this
      //   _that.xslist = _that.xslist.filter(function (item) {
      //     item.indexOf(_that.sealfan) !== -1
      //   })
      //   return _that.xslist
      // },
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
      // 返回
      fhinfo () {
        router.go(-1)
      },
      // 保存
      saveinfo () {
        let params = {
          info: this.info
        }
        api.savematerial(params, function (res) {
          console.log('看接口')
          console.log(res);
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
