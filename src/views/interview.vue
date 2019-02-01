<template>
  <div>
    <div style="height: 45px">
      <search autoFixed placeholder="请输入查询岗位或姓名"
              v-model="searchValue"
              position="absolute"
              auto-scroll-to-top top="1px"
              @on-submit="searchView">
      </search>
    </div>
    <div>
      <ul>
        <li v-for="item in meets" :key="item.id">
          <toggle v-model="item.ischeck"
                  :Bname="item.name"
                  :Bgender="item.gender==='1'?'男':'女'"
                  :Bage="item.age" :Baddress="item.noplace"
                  :Bphone="item.phone" :Bcompany="item.company"
                  :Bdeptment="item.department" :BhiringDepartment="item.hiringDepartment"
                  :Boffice="item.office" :Bsection="item.section"
                  :Bteam="item.team" :BpositionApplied="item.positionApplied+'-'+item.name"
                  :Btime="item.time" :BisHire="item.isHire==='1' ? '录取' : item.isHire==='0' ? '不录取' :''">
          </toggle>
        </li>
      </ul>

    </div>
    <!-- 下拉刷新 -->
    <infinite-loading  v-if="meets.length > 15" @infinite="yblinfiniteHandler">
    <span slot="no-more">没有更多待办了</span>
    </infinite-loading>
  </div>

</template>

<script>
  import toggle from '@/components/toggle'
  import api from 'api'
  //  import ding from '@/lib/ding'
  import {mapGetters} from 'vuex'
  import {Search} from 'vux'
  import InfiniteLoading from 'vue-infinite-loading'
  import dingUser from '@/lib/dingUser'
  import whole from '@/lib/whole'

  export default {
    components: {
      toggle,
      InfiniteLoading,
      Search
    },
    data () {
      return {
        endno: 10,
        meets: [],
        searchValue: '',
        checkids: []
      }
    },
    computed: {
      ...mapGetters({
        path: 'getddConfigPath'
      })
    },
    created() {
      this.setTitle();
      this.setRight();
      this.getData();
      //  go(-1)  并不起作用
//      this.$navigation.on('back', (to, from) => {
//        this.getData();
//        this.setRight();
//      })

//      this.startPush(); // 启动刷新
    },
    methods: {
      yblinfiniteHandler($state) {
        let _that = this;
        api.getFreshList(_that.searchValue, _that.endno, function (res) {
          if (res.data.code === true) {
            if (res.data.data.list.length > 0) {
              _that.meets = res.data.data.list;
            }
          } else if (res.data.code === '500') {
            window.alert('评价信息查询失败，请联系管理员')
          }
          _that.endno += 10;
          $state.loaded();
        });
      },
      setTitle(index) {
        let dd = window.dd;
        let config = {
          title: '报平安'
        }
        dd.ready(function () {
          dd.biz.navigation.setTitle(config);
        });
      },
      getData() {
        let _that = this;
        dingUser.getRequestAuthCode(_that.path).then((data) => {
          api.getLogin(data, function (res) {
            if (res.data.code) {
              api.getInterviewList(function (res) {
                _that.meets = res.data.data.list;
              });
            } else {
              whole.showTop('获取钉钉免登权限失败')
            }
          })
        })
      },
      searchView() {
        let _that = this;
        dingUser.getRequestAuthCode(_that.path).then((data) => {
          api.getLogin(data, function (res) {
            if (res.data.code) {
              api.getSearchList(_that.searchValue, function (res) {
                if (res.data.code === true) {
                  if (res.data.data.list.length > 0) {
                    _that.meets = res.data.data.list;
                  }
                } else if (res.data.code === '500') {
                  window.alert('搜索失败，请联系管理员')
                }
              });
            } else {
              whole.showTop('获取钉钉免登权限失败')
            }
          })
        })
      },
      setRight () {
        let _that = this;
        let dd = window.dd;
        dd.ready(function () {
          dd.biz.navigation.setRight({
            show: true, // 控制按钮显示， true 显示， false 隐藏， 默认true
            control: true, // 是否控制点击事件，true 控制，false 不控制， 默认false
            text: '评价', // 控制显示文本，空字符串表示显示默认文本
            onSuccess: function (result) {
            // 初始化 checkids
              _that.checkids = [];
              // 如果control为true，则onSuccess将在发生按钮点击事件被回调
              // 点击评价 如果 没有 数据被选中 提示 请至少选择一条数据 传递 选中人员的id
              for (var i = 0; i < _that.meets.length; i++) {
                var item = _that.meets[i];
                if (item.ischeck) {
                  _that.checkids.push(item.id);
                }
              }
              if (_that.checkids.length === 0) {
                whole.showTop('请至少选择一人进行评价')
              } else {
                // 将数据发送到跳转页面
                _that.$router.push({path: '/viewing', query: {codeData: _that.checkids}});
              }
            },
            onFail: function (err) {
            }
          });
        })
      }
    }
  };

</script>

<style lang='less' scoped>

</style>
