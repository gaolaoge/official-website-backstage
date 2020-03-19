<template>
  <div id="app">
    <layout />
  </div>
</template>

<script>
  import layout from '@/layout/index'
  export default {
  name: 'App',
  components: {
    layout
  }
}
</script>

<style lang="less">
  @succBtn: #11998e;
  @dengBtn: #c94b4b;
  @warnBtn: #eea849;
  @primBtn: #3494E6;
  #app {
    position: relative;
    .el-button.el-button--success {
      background-color: @succBtn;
      border-color: @succBtn;
    }
    .el-button.el-button--danger {
      background-color: @dengBtn;
      border-color: @dengBtn;
    }
    .el-button.el-button--warning {
      background-color: @warnBtn;
      border-color: @warnBtn;
    }
    .el-button.el-button--primary {
      background-color: @primBtn;
      border-color: @primBtn;
    }
  }
  * {
    margin: 0px;
    padding: 0px;
  }
  .im {
    position: absolute;
    top: 50vh;
    left: 50vw;
    transform: translate(-50%,-50%);

  }
</style>
