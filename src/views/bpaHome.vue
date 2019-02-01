<template>
  <div>
    <!--<x-button text="开启报平安" @click.native="processButton001" type="primary" style="margin-top: 100px"></x-button>-->
    <!--<x-button text="上报情况" @click.native="processButton004" type="primary"></x-button>-->
    <!--<x-button text="员工报平安" @click.native="processButton002" type="primary"></x-button>-->
    <x-button text="上报情况总览" @click.native="processButton003" :gradients="['#1D62F0', '#19D5FD']"></x-button>
    <x-button text="已报/未报统计" @click.native="processButton005" :gradients="['#1D62F0', '#19D5FD']"></x-button>
    <x-button text="上报异常信息统计" @click.native="processButton006" :gradients="['#1D62F0', '#19D5FD']"></x-button>
  </div>
</template>

<script>
  import {XButton} from 'vux'

  export default {
    components: {
      XButton
    },
    methods: {
      processButton001 () {
        this.$router.push({path: '/unlock', query: {}});
      },
      processButton002 () {
        this.$router.push({path: '/clockin', query: {}})
      },
      processButton003 () {
        window.location = '/bpa/tabSafetyResultsCount?dd_orientation=landscape'
        // window.location = '/tabSafetyResultsCount?dd_orientation=landscape'
      },
      processButton004 () {
        this.$router.push({path: '/safetyResultList', query: {}})
      },
      processButton005 () {
        window.location = '/bpa/tabSafetyResults?dd_orientation=landscape'
        // window.location = '/tabSafetyResults?dd_orientation=landscape'
      },
      processButton006 () {
        window.location = '/bpa/tabSafetyResultsException?dd_orientation=landscape'
        // window.location = '/tabSafetyResultsException?dd_orientation=landscape'
      }
    },
    data () {
      return {
      }
    }
  }
</script>

<style lang='less' scoped>

</style>
