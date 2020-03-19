<template>
  <div class="layout-wrapper">
    <Header />
    <Navbar />
    <appMain />
    <im class="im"/>
  </div>
</template>

<script>
  import { Header,Navbar,appMain } from './components'
  import im from '@/components/im'
  export default {
    name: 'layout',
    data(){
      return {

      }
    },
    components: {
      Header,
      Navbar,
      appMain,
      im
    }
  }
</script>

<style lang="less" scoped>
  .layout-wrapper {
    display: flex;
    flex-wrap: wrap;
    .im {
      position: absolute;
      z-index: 2;
      top: 50vh;
      left: 50vw;
      transform: translate(-50%,-50%);
    }
  }
</style>
