<template>
  <div>
    <group title="需求抬头" labelWidth="6.5rem" gutter="0" labelMarginRight="1rem">
      <cell title="需求编号" v-model="info.doc" value-align="left"></cell>
      <cell title="业务员" v-model="info.salesmanName" value-align="left"></cell>
      <cell title="销售部门" v-model="info.department" value-align="left"></cell>
      <datetime title="创建时间" v-model="info.credat" format="YYYY-MM-DD"></datetime>
      <selector title="业务类别" placeholder="请选择" v-model="info.buscat" :options="ywlist"></selector>
      <selector title="需求类型" v-model="info.doctype" :options="xqlist" readonly></selector>
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
      <selector title="货币" placeholder="请选择" v-model="info.waerk" :options="huobiList" @on-change="getHLname"></selector>
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
          doctype: 'AN',
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
      // 拿到默认货币和汇率
      gethbhlname () {
        let _that = this
        api.getratevalue(_that.info.credat, _that.info.saleArea, _that.info.kunnrName, 'CNY', function (res) {
          console.log(res)
          if (res) {
            res.data.list.forEach(function (item) {
              console.log(item)
              _that.info.waerk = 'CNY'
              _that.info.wkurs = item.UKURS
            })
          }
        })
      },
      // 获取汇率
      getHLname () {
        let _that = this
        api.getratevalue(_that.info.credat, _that.info.saleArea, _that.info.kunnrName, _that.info.waerk, function (res) {
          console.log(res)
          if (res) {
            res.data.list.forEach(function (item) {
              console.log(item)
              _that.info.wkurs = item.UKURS
            })
          }
        })
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
        if (_that.info.salesmanName === '') {
          whole.showTop('读取业务员姓名失败...请联系管理员!')
          return;
        }
        if (_that.info.department === '') {
          whole.showTop('读取销售部门失败...请联系管理员!')
          return;
        }
        if (_that.info.buscat === '') {
          whole.showTop('业务类别不能为空哦~')
          return;
        }
        if (_that.info.doctype === '') {
          whole.showTop('需求类型不能为空哦~')
          return;
        }
        if (_that.info.saleArea === '') {
          whole.showTop('销售范围不能为空哦~')
          return;
        }
        if (_that.info.kunnrName === '') {
          whole.showTop('客户姓名不能为空哦~')
          return;
        }
        if (_that.info.waerk === '') {
          whole.showTop('货币不能为空哦~')
          return;
        }
        if (_that.info.wkurs === '') {
          whole.showTop('汇率不能为空哦~')
          return;
        }
        let itemlist = []
        let delilist = []
        let itemnum = 1
        _that.getmateriallist.forEach(function (item) {
          _that.getplantlist.forEach(function (items) {
            if (item.id === items.wlid) {
              items.wlid = ''
              items.id = ''
              delilist.push(items)
            }
          })
          item.id = ''
          item.itemno = itemnum++
          item.deliveryList = delilist
          itemlist.push(item)
        })
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
          status: '1',
          itemList: itemlist
        }
        console.log(params)
        api.savematerial(params, function (res) {
          console.log(res);
          if (res.data.code) {
            whole.showTop('保存成功了呦~')
            // _that.$store.dispatch('clearmateriallist')
            // _that.$store.dispatch('clearplantlist')
            // router.push({path: '/'})
          } else {
            whole.showTop('保存失败,请重试吧~')
          }
        })
      },
      // 提交
      tjinfo () {
        let _that = this
        if (_that.info.salesmanName === '') {
          whole.showTop('读取业务员姓名失败...请联系管理员!')
          return;
        }
        if (_that.info.department === '') {
          whole.showTop('读取销售部门失败...请联系管理员!')
          return;
        }
        if (_that.info.buscat === '') {
          whole.showTop('业务类别不能为空哦~')
          return;
        }
        if (_that.info.doctype === '') {
          whole.showTop('需求类型不能为空哦~')
          return;
        }
        if (_that.info.saleArea === '') {
          whole.showTop('销售范围不能为空哦~')
          return;
        }
        if (_that.info.kunnrName === '') {
          whole.showTop('客户姓名不能为空哦~')
          return;
        }
        if (_that.info.waerk === '') {
          whole.showTop('货币不能为空哦~')
          return;
        }
        if (_that.info.wkurs === '') {
          whole.showTop('汇率不能为空哦~')
          return;
        }
        let itemlist = []
        let delilist = []
        let itemnum = 1
        _that.getmateriallist.forEach(function (item) {
          _that.getplantlist.forEach(function (items) {
            if (item.id === items.wlid) {
              items.wlid = ''
              items.id = ''
              delilist.push(items)
            }
          })
          item.id = ''
          item.itemno = itemnum++
          item.deliveryList = delilist
          itemlist.push(item)
        })
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
          status: '2',
          itemList: itemlist
        }
        console.log(params)
        api.savematerial(params, function (res) {
          console.log(res);
          if (res.data.code) {
            whole.showTop('提交成功了呦~')
            _that.$store.dispatch('clearmateriallist')
            _that.$store.dispatch('clearplantlist')
            router.push({path: '/'})
          } else {
            whole.showTop('保存失败,请重试吧~')
          }
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
