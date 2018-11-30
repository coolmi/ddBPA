<template>
  <div>
    <group title="物料需求列表" labelWidth="6.5rem" gutter="0" labelMarginRight="1rem">
      <card class="card">
        <!--:header="{title:newname}" @on-click-header="mdevent"-->
        <div class="card_header" slot="header" @click="mdevent">{{newname}}</div>
        <div slot="content" class="card_content" @click="mdevent">
          <div class="vux-1px-r">
            <span>30</span>
            <br/>
            <span class="content_color">数量</span>
          </div>
          <div class="vux-1px-r">
            <span>熟食二厂</span>
            <br/>
            <span class="content_color">工厂</span>
          </div>
        </div>
        <div class="card_footer" slot="footer">
          <x-button type="primary" mini plain class="card_footer_but" text="交货计划" @click.native="jhevent"></x-button>
          <x-button type="primary" mini plain class="card_footer_but" text="BOM" @click.native="bomevent"></x-button>
          <x-button type="primary" mini plain class="card_footer_but" text="删除"></x-button>
        </div>
      </card>
    </group>
    <box gap="10px 80px">
      <flexbox>
        <flexbox-item class="item">
          <x-button text="新增" @click.native="xzevent" class="baocun" plain type="primary"></x-button>
        </flexbox-item>
        <flexbox-item class="item">
          <x-button text="下一步" @click.native="nextevent" class="baocun" plain type="primary"></x-button>
        </flexbox-item>
      </flexbox>
    </box>
  </div>
</template>

<script>
  import {
    Group,
    PopupPicker,
    XInput,
    Datetime,
    Cell,
    Card,
    XButton,
    Box,
    Flexbox,
    FlexboxItem
  } from 'vux'
  // import whole from '@/lib/whole';
  // import axios from 'axios';
  import router from '../router';
  import vSearch from '@/components/searchChecker';

  export default {
    components: {
      Group, PopupPicker, XInput, Datetime, Cell, Card, XButton, Box, vSearch, Flexbox, FlexboxItem
    },
    data() {
      return {
        newname: '8A000567/(采)_3号鸡板腿300/350G_10KGX2'
      }
    },
    created() {
    },
    methods: {
      // 物料明细页跳转
      mdevent() {
        let _that = this;
        router.push({path: '/', query: {codeData: JSON.stringify(_that.jkData)}})
      },
      // 交货计划页跳转
      jhevent() {
        let _that = this;
        router.push({path: '/deliveryPlanList', query: {codeData: JSON.stringify(_that.jkData)}})
      },
      // BOM页跳转
      bomevent() {
        let _that = this;
        router.push({path: '/bomList', query: {codeData: JSON.stringify(_that.jkData)}})
      },
      xzevent() {
        let _that = this;
        router.push({path: '/', query: {codeData: JSON.stringify(_that.jkData)}})
      },
      nextevent() {
        let _that = this;
        router.push({path: '/materialHeader', query: {codeData: JSON.stringify(_that.jkData)}})
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
    margin: 5px 0 2px 40px;
    /*border-bottom: #cccccc 1px solid;*/
  }

  .card_content {
    display: flex;
    height: 50px;
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
</style>
