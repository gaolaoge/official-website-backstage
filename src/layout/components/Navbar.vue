<template>
  <div class="navbar-wrapper" :class="[{'shut': isCollapse}]">
    <el-menu
      default-active="1-1"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
      background-color="#303A54"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-data-line"></i>
          <span>行业资讯</span>
        </template>
        <el-menu-item index="1-1" @click="$router.push('/')">资讯列表</el-menu-item>
        <el-menu-item index="1-2" @click="$router.push('/keyWordsList')">关键字列表</el-menu-item>

      </el-submenu>
      <el-menu-item index="2" @click="$router.push('/joinUsList')">
        <i class="el-icon-menu"></i>
        <span slot="title">加入我们</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'navbar',
    data(){
      return {
        // isCollapse: false,      //导航是否收起
      }
    },
    methods: {
      handleOpen(){

      },
      handleClose(){

      }
    },
    computed: {
      ...mapState(['isCollapse'])
    }
  }
</script>

<style lang="less" scoped>
  .navbar-wrapper {
    width: 220px;
    height: calc(100vh - 60px);
    background-color: #303A54;
    flex-grow: 0;
    transition:  0.3s;
    &.shut {
      width: 65px;
      span,
      li {
        font-size: 0px!important;
      }
    }
  }
  /deep/.el-menu {
    border: 0px!important;
  }
</style>
