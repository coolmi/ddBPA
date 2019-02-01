<template>
  <div class="b-box">
    <group gutter="0" class="b-group">
      <cell :title="BpositionApplied" is-link
            :border-intent="false"
            :arrow-direction="showContent ? 'up' : 'down'"
            @click.native="showContent = !showContent"
            :class="showContent ? 'b-cell':''"
            class="bcell">
        <img slot="icon" width="20" style="display:block;margin-right:5px;"
             :src="isCheck ? '/static/check.png' : '/static/nocheck.png'" @click="ckeckView" >

      </cell>
      <div class="slide" :class="showContent ? 'animate' : ''">
        <ul class="bul" >
          <li style="display: none"><span class="bspan1">id</span><span class="bspan2">{{Bid}}</span></li>
          <li class="blist"><span class="bspan1">姓名</span><span class="bspan2">{{Bname}}</span></li>
          <li class="blist"><span class="bspan1">性别</span><span class="bspan2">{{Bgender}}</span></li>
          <li class="blist"><span class="bspan1">年龄</span><span class="bspan2">{{Bage}}</span></li>
          <li class="blist"><span class="bspan1">地址</span><span class="bspan2">{{Baddress}}</span></li>
          <li class="blist"><span class="bspan1">电话</span><span class="bspan2">{{Bphone}}</span></li>
          <li class="blist"><span class="bspan1">产业公司</span><span class="bspan2">{{Bcompany}}</span></li>
          <li class="blist"><span class="bspan1">事业部</span><span class="bspan2">{{Bdeptment}}</span></li>
          <li class="blist"><span class="bspan1">部门</span><span class="bspan2">{{BhiringDepartment}}</span></li>
          <li class="blist"><span class="bspan1">科室</span><span class="bspan2">{{Boffice}}</span></li>
          <li class="blist"><span class="bspan1">工段</span><span class="bspan2">{{Bsection}}</span></li>
          <li class="blist"><span class="bspan1">班组</span><span class="bspan2">{{Bteam}}</span></li>
          <li class="blist"><span class="bspan1">岗位</span><span class="bspan2">{{BpositionApplied}}</span></li>
          <li class="blist"><span class="bspan1">面试时间</span><span class="bspan2">{{Btime}}</span></li>
          <li class="blist"><span class="bspan1">面试结果</span><span class="bspan2">{{BisHire}}</span></li>
        </ul>
      </div>
    </group>
  </div>
</template>

<script>
  import {Group, Cell, Search} from 'vux'

  export default {
    name: 'toggle',
    props: {
      Bname: String,
      Bgender: String,
      Bage: String,
      Baddress: String,
      Bphone: String,
      Bcompany: String,
      Bdeptment: String,
      BhiringDepartment: String,
      Boffice: String,
      Bsection: String,
      Bteam: String,
      BpositionApplied: String,
      Btime: String,
      BisHire: String,
      Bid: String
    },
    components: {
      Group,
      Cell,
      Search
    },
    data () {
      return {
        showContent: false,
        isCheck: false
      }
    },
    methods: {
      ckeckView() {
        let _that = this;
        _that.isCheck = !_that.isCheck;
        /**
         *        此处与cell 的@click.native 相加那么点击img 不会改变是否显示详细列表
         *        by zbm 2018-01-05 10:53:47
         */
        _that.showContent = !_that.showContent;
        //  向父组件传值
        _that.$emit('input', _that.isCheck);
      }
    }
  }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
    list-style: none;
    text-decoration: none;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    font-size: 62.5%;
  }

  .b-box {
    width: 100%;
    height: 100%;
  }

  .bcell {
    font-size: 14px;
    border-bottom: 1px solid #e5e5e5;
    margin: 0;
  }

  .slide {
    padding: 0px 20px;
    overflow: hidden;
    max-height: 0;
    transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
  }

  .animate {
    max-height: 9999px;
    transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
    transition-delay: 0s;
  }

  .bul {
    width: 100%;
    border: 1px solid #e5e5e5;
    margin-bottom: 5px;
    margin-top: -1px;
  }

  .blist {
    width: 100%;
    height: 30px;
    display: flex;
  }

  .blist span {
    display: flex;
    align-items: center;
    font-size: 12px;
  }

  .bspan1 {
    justify-content: center;
    color: #999;
    width: 20%;
    margin: 5px 10px 5px 0px;
    border-right: 1px solid #e5e5e5;
  }

  .bspan2 {
    justify-content: flex-start;
    width: 70%;
    height: 100%;
    text-align: left;
    overflow: hidden;
  }

  .bimgbox {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-around;
    margin-bottom: 10px;
  }

  .bimgbox img {
    width: 100px;
  }

  .bimgbox p {
    font-size: 10px;
  }

  .bspan3 {
    color: #b48243;
  }

  .weui-cells:before {
    content: none !important;
  }

  .b-cell {
    background-color: #f4f4f4;
  }
</style>
