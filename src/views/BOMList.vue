<template>
  <div>
    <group title="计划列表" labelWidth="6.5rem" gutter="0" labelMarginRight="1rem">
      <card class="card">
        <!--:header="{title:newname}" @on-click-header="mdevent"-->
        <div class="card_header" slot="header" @click="mdevent">{{certificate}}</div>
        <div slot="content" class="card_content" @click="mdevent">
          <div class="vux-1px-r">
            <span>30</span>
            <br/>
            <span class="content_color">单吨用量</span>
          </div>
          <div class="vux-1px-r">
            <span>原料</span>
            <br/>
            <span class="content_color">组件类型</span>
          </div>
        </div>
        <div class="card_footer" slot="footer">
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
  // import whole from '@/lib/whole';
  // import axios from 'axios';
  import router from '../router';

  export default {
    components: {
      Card, Group, PopupPicker, XInput, XSwitch, Datetime, Cell, XNumber, XButton, Box, Flexbox, FlexboxItem
    },
    data() {
      return {
        certificate: '物料'
      }
    },
    created() {
    },
    methods: {
      mdevent () {
        let _that = this;
        router.push({path: '/bom', query: {codeData: JSON.stringify(_that.jkData)}})
      },
      xzevent() {
        let _that = this;
        router.push({path: '/bom', query: {codeData: JSON.stringify(_that.jkData)}})
      },
      saveevent() {
        let _that = this;
        router.push({path: '/materialList', query: {codeData: JSON.stringify(_that.jkData)}})
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
    /*border-bottom: #cccccc 1px solid;*/
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
</style>
