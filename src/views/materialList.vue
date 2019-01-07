<template>
  <div>
    <group title="询单明细列表" v-if="getlist.length > 0" labelWidth="6.5rem" gutter="0" labelMarginRight="1rem">
      <card class="card" v-for="(pl, index) in getlist" :key="index">
        <div slot="content" class="card_content" @click="mdevent(pl)">
          <div class="vux-1px-r">
            <span>{{pl.material}}</span>
            <br/>
            <span class="content_color">物料</span>
          </div>
          <div class="vux-1px-r">
            <span>{{pl.zmeng}}</span>
            <br/>
            <span class="content_color">数量</span>
          </div>
        </div>
        <div class="card_footer" slot="footer">
          <x-button type="primary" mini plain class="card_footer_but" text="交货计划" @click.native="jhevent(pl.id)"></x-button>
          <!--<x-button type="primary" mini plain class="card_footer_but" text="BOM" @click.native="bomevent(pl.id)"></x-button>-->
          <x-button type="primary" mini plain class="card_footer_but" text="删除" @click.native="del(pl)"></x-button>
        </div>
      </card>
    </group>
    <group v-else title="询单明细列表" labelWidth="6.5rem" gutter="0" labelMarginRight="1rem">
      <p class="sznull">空空如也~请新增计划!</p>
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
  import whole from '@/lib/whole';
  import {mapGetters} from 'vuex'
  import router from '../router';

  export default {
    components: {
      Group, PopupPicker, XInput, Datetime, Cell, Card, XButton, Box, Flexbox, FlexboxItem
    },
    data() {
      return {
        tplantList: []
      }
    },
    computed: {
      ...mapGetters({
        getlist: 'getmateriallist',
        getplantlist: 'getplantlist'
      })
    },
    created() {
      // alert(JSON.stringify(this.getlist))
      console.log(this.getplantlist);
    },
    methods: {
      // 单个物料详情跳转
      mdevent(pl) {
        router.push({path: '/', query: {pl: JSON.stringify(pl)}})
      },
      // 交货计划页跳转
      jhevent(id) {
        this.$store.dispatch('addmaterialid', id)
        router.push({path: '/deliveryList'})
      },
      // 删除方法(找索引)
      shan (p) {
        for (let i = 0; i < this.getlist.length; i++) {
          if (this.getlist[i] === p) {
            return i;
          }
        }
        return -1;
      },
      // 删除方法(删除元素)
      // 删除物料
      del(p) {
        let index = this.shan(p)
        if (index > -1) {
          this.getlist.splice(index, 1)
          this.$store.dispatch('savemateriallist', this.getlist)
        }
      },
      // 新增物料
      xzevent() {
        router.push({path: '/'})
      },
      // 下一步
      nextevent() {
        let _that = this
        // let malen = _that.getlist.length
        // if (_that.getplantlist.length > 0) {
        //   let i = 1
        //   for (let p = 0; p < _that.getplantlist.length; p++) {
        //     for (let j = 1; j < _that.getplantlist.length; j++) {
        //       if (_that.getplantlist[p].wlid !== _that.getplantlist[j].wlid) {
        //         i++
        //       }
        //     }
        //   }
        //   if (malen !== i) {
        //     whole.showTop('计划明细不能为空哦~')
        //     return;
        //   } else {
        //     router.push({path: '/materialHeader'})
        //   }
        // } else {
        //   whole.showTop('计划明细不能为空哦~')
        //   return;
        // }
        if (_that.getplantlist.length > 0) {
            router.push({path: '/materialHeader'})
        } else {
          whole.showTop('计划明细不能为空哦~')
          return;
        }
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
    height: 120px;
  }

  .card_header {
    height: 20px;
    line-height: 20px;
    margin: 5px 0 2px;
    text-align: center;
    /*border-bottom: #cccccc 1px solid;*/
  }

  .card_content {
    display: flex;
    height: 60px;
    /*margin-bottom: 3px;*/
    margin-top: 5px;
    /*border: 1px red solid;*/
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
    height: 30px;
    line-height: 30px;
    text-align: center;
    /*margin-bottom: 30px;*/
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
