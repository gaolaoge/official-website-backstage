<template>
  <div class="appMain-wrapper">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'appMain',
    data(){
      return {

      }
    }
  }
</script>

<style lang="less" scoped>
  .appMain-wrapper {
    flex-grow: 1;
    flex-shrink: 1;
    width: 100px;             //占位尺寸 无效宽度
    transition: width 0.3s;
    padding: 8px;
  }
</style>
