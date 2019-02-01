<template>
  <div class="listnews">
    <div class="nimgbox" v-if="showImage">
      <img :src=ImgUrl class="nimg">
    </div>
    <div class="ncontent">
      <p class="ntitle">{{Title}}</p>
      <div class="truenews">
        <div class="n-truenews">
          <p>{{Ntype}} </p>
          <p>&nbsp;&nbsp;{{Ntime}}</p>
        </div>
        <p class="n-click">点击量:{{NClickTime}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'flatcard',
    props: {
      ImgUrl: String,
      Title: String,
      Ntype: String,
      Ntime: String,
      NClickTime: Number,
      showImage: Boolean
    }
  };

</script>

<style lang="less" scoped>
  @import '~vux/src/styles/1px.less';


  .listnews{
    width: 90%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-bottom:10px;
    border-bottom:1px solid #e5e5e5;
  }
  .nimgbox{
    width: 30%;
    height: 70px;
    margin-right: 10px;
  }
  .nimg{
    width: 100%;
    height: 100%;
  }
  .ncontent{
    width: 70%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
  }
  .ntitle{
    width: 100%;
    font-size: 14px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    line-height: 18px;
  }
  .truenews{
    width: 100%;
    display: flex;
    color: #a4a4a4;
    line-height: 50%;
    justify-content: space-between;
  }
  .n-truenews{
    width: 60%;
    height:100%;
    display:flex;
    align-items: center;
    font-size: 12px;
  }
  .n-click{
    width: 40%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }
</style>
