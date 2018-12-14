<template>
  <div>
    <group title="计划列表" labelWidth="6.5rem" gutter="0" labelMarginRight="1rem">
      <card class="card" v-if="listDate.length > 0" v-for="(pl, index) in listDate" :key="index">
        <div class="card_header" slot="header" @click="mdevent(pl)">{{pl.jhrq}}</div>
        <div slot="content" class="card_content" @click="mdevent(pl)">
          <div class="vux-1px-r">
            <span>{{pl.wmeng}}</span>
            <br/>
            <span class="content_color">数量</span>
          </div>
          <div class="vux-1px-r">
            <span>{{pl.prgrs}}</span>
            <br/>
            <span class="content_color">期间标识</span>
          </div>
        </div>
        <div class="card_footer" slot="footer">
          <x-button type="primary" mini plain class="card_footer_but" text="删除" @click.native="del(pl)"></x-button>
        </div>
      </card>
      <div class="sznull" v-else>
        <p >空空如也~请新增BOM</p>
      </div>
    </group>
    <box gap="10px 80px">
      <flexbox>
        <flexbox-item class="item">
          <x-button text="新增" @click.native="xzevent" class="baocun" plain type="primary"></x-button>
        </flexbox-item>
        <flexbox-item class="item">
          <x-button text="保存" @click.native="saveevent" class="baocun" plain type="primary"></x-button>
        </flexbox-item>
      </flexbox>
    </box>
  </div>
</template>

<script>
  import {
    Card,
    Group,
    PopupPicker,
    XInput,
    XSwitch,
    Datetime,
    Cell,
    XNumber,
    XButton,
    Box,
    Flexbox,
    FlexboxItem
  } from 'vux'
  import router from '../router';
  import {mapGetters} from 'vuex'
  // import whole from '@/lib/whole';
  // import axios from 'axios';

  export default {
    components: {
      Card, Group, PopupPicker, XInput, XSwitch, Datetime, Cell, XNumber, XButton, Box, Flexbox, FlexboxItem
    },
    data() {
      return {
        listDate: []
      }
    },
    computed: {
      ...mapGetters({
        getlist: 'getplantlist',
        getwlid: 'getmaterialid'
      })
    },
    created() {
      this.getlistInfo();
    },
    methods: {
      // 初始化list数据
      getlistInfo () {
        if (this.getlist.length > 0) {
          let szobj = []
          for (let o of this.getlist) {
            if (o.wlid === this.getwlid) {
              szobj.push(o)
            }
          }
          this.listDate = szobj
        }
      },
      // 修改
      mdevent (pl) {
        router.push({path: '/deliveryPlan', query: {pl: JSON.stringify(pl)}})
      },
      // 删除物料
      del(p) {
        // 删除方法(找索引)
        for (let i = 0; i < this.listDate.length; i++) {
          if (this.listDate[i] === p) {
            let index = i
            // 删除方法(删除元素)
            if (index > -1) {
              this.listDate.splice(index, 1)
            }
          }
        }
        // 再执行一遍删除缓存
        for (let i = 0; i < this.getlist.length; i++) {
          if (this.getlist[i] === p) {
            let pi = i
            if (pi > -1) {
              this.getlist.splice(pi, 1)
            }
          }
        }
      },
      // 新增
      xzevent() {
        router.push({path: '/deliveryPlan'})
      },
      // 保存
      saveevent() {
        router.push({path: '/materialList'})
      }
    }
  }
</script>

<style scoped lang='less'>
  @import '~vux/src/styles/1px.less';

  .item {
    padding-left: 10px;
  }
  .baocun {
    border-radius: 99px;
    margin-top: 3rem;
    color: #E59313;
    border-color: #E59313;
  }

  .card {
    height: 130px;
  }

  .card_header {
    height: 20px;
    line-height: 20px;
    margin: 8px 0 8px;
    text-align: center;
  }

  .card_content {
    display: flex;
    height: 50px;
    margin-bottom: 8px;
  }

  .card_content > div {
    flex: 1;
    text-align: center;
    font-size: 15px;
  }

  .content_color {
    color: #cccccc;
  }

  .card_footer {
    /*border: 1px blue solid;*/
    height: 50px;
    text-align: center;
  }
  .card_footer_but {
    border-radius: 20px;
  }
  .sznull {
    text-align: center;
    font-size: 20px;
    background-color: #f4f4f4;
  }
</style>
