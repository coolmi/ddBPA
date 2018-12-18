<template>
  <div>
    <group title="需求抬头" labelWidth="6.5rem" gutter="0" labelMarginRight="1rem">
      <cell title="需求编号" v-model="info.doc" value-align="left"></cell>
      <cell title="业务员" v-model="info.salesmanName" value-align="left"></cell>
      <cell title="销售部门" v-model="info.department" value-align="left"></cell>
      <datetime title="创建时间" v-model="info.credat" format="YYYY-MM-DD"></datetime>
      <selector title="业务类别" placeholder="请选择" v-model="info.buscat" :options="ywlist"></selector>
      <selector title="需求类型" placeholder="请选择" v-model="info.doctype" :options="xqlist"></selector>
      <x-input type="text" placeholder="请输入销售范围关键词" text-align="center" v-model="sealfan" class="sousuo_in">
        <span slot="label" class="sousuo_sp">
          <img class="sousuo_img" src="/static/img/search.png">
          搜索
        </span>
      </x-input>
      <selector title="销售范围" placeholder="销售范围数据生成中..." v-model="info.saleArea" :options="xslist"></selector>
      <x-input type="text" placeholder="请输入客户关键词" text-align="center" v-model="kehu" class="sousuo_in">
        <span slot="label" class="sousuo_sp">
          <img class="sousuo_img" src="/static/img/search.png">
          搜索
        </span>
      </x-input>
      <selector title="客户名称" placeholder="客户数据生成中..." v-model="info.kunnrName" :options="customerlist" @on-change="gethbhlname"></selector>
      <selector title="货币" placeholder="请选择" v-model="info.waerk" :options="huobiList" :readonly="hbflag"></selector>
      <x-input title="汇率" v-model="info.wkurs" text-align="left"></x-input>
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
          id: '',
          doc: '',
          salesmanName: '',
          department: '',
          credat: '',
          buscat: '',
          doctype: '',
          saleArea: '',
          kunnrName: '',
          waerk: '',
          wkurs: '',
          status: ''
        },
        sealfan: '',
        kehu: '',
        hbflag: false,
        ywlist: [], // 业务类别
        xqlist: [], // 需求类型
        xsfanlist: [], // 销售范围
        huobiList: [], // 货币
        customerlist: [] // 客户
      }
    },
    watch: {
      kehu: function (val) {
        this.getkhInfo()
      }
    },
    computed: {
      ...mapGetters({
        getmateriallist: 'getmateriallist',
        getplantlist: 'getplantlist'
      }),
      xslist: function() {
        let search = this.sealfan;
        if (search) {
          return this.xsfanlist.filter(function(product) {
            return Object.keys(product).some(function(key) {
              return String(product[key]).toLowerCase().indexOf(search) > -1
            })
          })
        }
        return this.xsfanlist.length === 0 ? ['暂无数据'] : this.xsfanlist;
      }
    },
    created() {
      this.getlistInfo();
      this.getlocalTime();
    },
    methods: {
      // 获取下拉数据
      getlistInfo() {
        let _that = this;
        api.getlistData(function (res) {
          if (res) {
            console.log(res);
            // 用户信息
            _that.info.salesmanName = res.data.headVo.salesmanName
            _that.info.department = res.data.headVo.departmentName
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
              _that.xsfanlist.push(xsobj)
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
      // 货币一致
      gethbhlname () {
        let _that = this
        if (_that.getmateriallist.length > 0) {
          _that.getmateriallist.forEach(function (item) {
            if (item.waerk !== '') {
              _that.info.waerk = item.waerk
              _that.hbflag = true;
              api.getratevalue(_that.info.credat, _that.info.saleArea, _that.info.kunnrName, _that.info.waerk, function (res) {
                console.log('汇率啊数据')
                console.log(res)
                if (res) {
                  res.data.list.forEach(function (item) {
                    console.log(item)
                    _that.info.wkurs = item.UKURS
                  })
                }
              })
            }
          })
        } else {
          _that.hbflag = false;
        }
      },
      // 货币处理
      getcashname (val) {
        for (let h of this.huobiList) {
          if (val === h.key) {
            return h.value
          }
        }
      },
      // 获取当前时间
      getlocalTime () {
        let time = new Date()
        this.info.credat = time.toLocaleDateString().replace(/\//g, '-')
        console.log(this.info.credat)
      },
      // 返回
      fhinfo () {
        router.go(-1)
      },
      // 保存
      saveinfo () {
        let _that = this
        if (_that.getplantlist.length === 0) {
          whole.showTop('计划明细不能为空哦~')
          return;
        }
        let itemlist = []
        let delilist = []
        _that.getmateriallist.forEach(function (item) {
          _that.getplantlist.forEach(function (items) {
            if (item.id === items.wlid) {
              item.id = ''
              items.wlid = ''
              items.id = ''
              delilist.push(items)
            }
          })
          item.deliverylist = delilist
          itemlist.push(item)
        })
        alert(JSON.stringify(itemlist));
        let params = {
          id: _that.info.id,
          doc: _that.info.doc,
          salesmanName: _that.info.salesmanName,
          department: _that.info.department,
          credat: _that.info.credat,
          buscat: _that.info.buscat,
          doctype: _that.info.doctype,
          saleArea: _that.info.saleArea,
          kunnrName: _that.info.kunnrName,
          waerk: _that.info.waerk,
          wkurs: _that.info.wkurs,
          status: _that.info.status,
          itemlist: itemlist
        }
        api.savematerial(params, function (res) {
          console.log('看接口')
          alert(JSON.stringify(res))
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
  .sousuo_in {
    background-color: #f4f4f4;
    height: 17px
  }
  .sousuo_sp {
    display: inline-flex;
    align-items: center;
    color: #333;
  }
  .sousuo_img {
    padding-right:10px;
    display:block;
    width:14px;
    height:14px
  }
</style>
