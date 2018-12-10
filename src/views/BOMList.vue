<template>
  <div>
    <group title="BOM列表" labelWidth="6.5rem" gutter="0" labelMarginRight="1rem">
      <card v-if="flag === '1'" v-for="(pl, index) in getlist" :key="index">
        <div class="card_header" slot="header" @click="mdevent(pl)">{{pl.wl}}</div>
        <div slot="content" class="card_content" @click="mdevent(pl)">
          <div class="vux-1px-r">
            <span>{{pl.pernum}}</span>
            <br/>
            <span class="content_color">单吨用量</span>
          </div>
          <div class="vux-1px-r">
            <span>{{pl.type}}</span>
            <br/>
            <span class="content_color">组件类型</span>
          </div>
        </div>
        <div class="card_footer" slot="footer">
          <x-button type="primary" mini plain class="card_footer_but" text="删除"></x-button>
        </div>
      </card>
      <div class="sznull" v-if="flag === '0'">
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
        wlid: '',
        flag: '0',
        listDate: []
      }
    },
    computed: {
      ...mapGetters({
        getlist: 'getbomlist'
      })
    },
    created() {
      alert(JSON.stringify(this.getlist))
      this.wlid = JSON.parse(this.$route.query.id);
      alert('wlid')
      alert(this.wlid)
      if (this.getlist.length > 0) {
        for (let o of this.getlist) {
          if (o.wlid === this.wlid) {
            this.listDate.push(o)
            this.flag = '1'
          } else {
            this.flag = '0'
          }
        }
      } else {
        this.flag = '0'
      }
    },
    methods: {
      // 修改BOM页
      mdevent (pl) {
        let bomobj = {pl: pl, wlid: this.wlid}
        router.push({path: '/bom', query: {bomobj: JSON.stringify(bomobj)}})
      },
      // 新增bom
      xzevent() {
        alert('新增')
        alert(this.wlid)
        router.push({path: '/bom', query: {wlid: JSON.stringify(this.wlid)}})
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
  .sznull {
    text-align: center;
    font-size: 20px;
    background-color: #f4f4f4;
    border: none;
  }
</style>
