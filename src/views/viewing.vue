<template>
  <div>
    <group labelWidth='6rem' gutter='0' labelMarginRight='1rem' >
      <selector v-model="isoffer" title="是否录用" :options="plainList"></selector>
      <x-textarea v-if="isoffer ==='0'" title='拒录原因' name='reason' v-model='reason' placeholder=""
                  :max="200"></x-textarea>
      <x-button class="servicebtn" text="取消" @click.native="goHistory"></x-button>
      <x-button class="servicebtn" text="确定" @click.native="applyView"></x-button>
    </group>
  </div>
</template>

<script>
  import {XButton, Group, XTextarea, Selector} from 'vux'
  import axios from 'axios'
  import dingUser from '@/lib/dingUser'
  import api from 'api'
  import whole from '@/lib/whole'
  import {mapGetters} from 'vuex'
  export default {
    components: {
      XButton,
      Group,
      XTextarea,
      Selector
    },
    data () {
      return {
        reason: '',
        isoffer: '',
        checkids: [],
        plainList: [{key: '0', value: '不录用'}, {key: '1', value: '录用'}]
      }
    },
    computed: {
      ...mapGetters({
        path: 'getddConfigPath'
      })
    },
    created() {
      this.setRight();
      let _that = this;
      _that.checkids = _that.$route.query.codeData;
    },
    methods: {
      goHistory() {
        let _that = this;
        _that.$router.go(-1);
      },
      applyView() {
        let _that = this;
        var params = new URLSearchParams();
        //  传递三个参数  1 是否录用 2 原因 3 选中的条目id 为什么还需要权限验证
        params.append('ishire', _that.isoffer);
        params.append('reason', _that.reason);
        params.append('id', _that.checkids);
        dingUser.getRequestAuthCode(_that.path).then((data) => {
          api.getLogin(data, function (res) {
            if (res.data.code) {
              axios.post('/authapi/interviewSchedule/interviewSchedule/interEval4dd', params)
                .then((res) => {
                  //  保存成功 返回true  检查调用的接口放入后台
                  if (res.data.code === true) {
                    whole.showTop('评价成功');
                    _that.$router.push({path: '/'});
                  } else {
                    whole.showTop(res.data.data.message);
                  }
                }).catch((error) => {
                return Promise.reject(error)
              });
            } else {
              whole.showTop('获取钉钉免登权限失败')
            }
          })
        })
      },
      setRight () {
        let dd = window.dd;
        dd.ready(function () {
          dd.biz.navigation.setRight({
            show: false, // 控制按钮显示， true 显示， false 隐藏， 默认true
            control: false, // 是否控制点击事件，true 控制，false 不控制， 默认false
            text: '评价', // 控制显示文本，空字符串表示显示默认文本
            onSuccess: function (result) {
            },
            onFail: function (err) {
            }
          });
        })
      }
    }
  }
</script>

<style scoped lang='less'>
  @import '~vux/src/styles/1px.less';

  .servicebtn {
    margin: 0 auto;
    margin-top: 15px;
    margin-bottom: 15px;
    box-sizing: border-box;
    text-align: center;
    line-height: 30px;
    color: #66bca4;
    font-size: 14px;
    width: 90%;
    height: 30px;
    border: none;
    border: 1px solid #E5E5E5;
    background-color: #ffffff;
    border-radius: 15px;
  }

</style>

