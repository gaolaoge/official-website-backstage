<template>
  <div class="header-wrapper">
    <div class="logo">
      <img src="@/icons/svg/logo.svg" alt="" class="logoImg" @click="changeC">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'header_',
    data(){
      return {
        state: false
      }
    },
    methods: {
      changeC(){
        this.state = !this.state
        this.$store.commit('changeCollapse',this.state)
      }
    }
  }
</script>

<style lang="less" scoped>
  .header-wrapper {
    position: relative;
    height: 60px;
    box-shadow: 0px 0px 8px 1px rgba(0,0,0,0.12);
    width: 100vw;
    background-color: #2c3244;
    .logo {
      height: 100%;
      width: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      .logoImg {
        width: 40px;
        cursor: pointer;
      }
    }
  }
</style>
