<template>
  <div class="wrapper">
    <el-table
      :data="list"
      style="width: 100%">
      <el-table-column
        label="序号"
        align="center"
        type="index"
        width="80">
      </el-table-column>
      <el-table-column
        prop="comname"
        label="公司名称">
      </el-table-column>
      <el-table-column
        prop="business"
        label="主要业务"
        width="240">
      </el-table-column>
      <el-table-column
        prop="contacts"
        width="140"
        label="联系人">
      </el-table-column>
      <el-table-column
        prop="identity"
        label="联系人身份"
        width="200" />
      <el-table-column
        prop="telephone"
        width="180"
        label="联系人电话" />
      <el-table-column
        prop="createtime"
        width="180"
        label="填写日期" />
    </el-table>
    <div class="t">
      <el-pagination
        layout="prev, pager, next"
        @current-change="changeIndex"
        :current-page="pageNum"
        :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import {
    joinUsList
  } from '@/api/api.js'
  import {
    computeDate
  } from '@/assets/common.js'

  export default {
    name: 'joinUsList',
    data(){
      return {
        list: [],
        total: 0,
        pageNum: 1
      }
    },
    created() {
      this.getListFun({
        pageSize: 10,
        pageIndex: 1
      })
    },
    methods: {
      changeIndex(val) {
        this.pageNum = val
        this.getListFun({
          pageSize: 10,
          pageIndex: this.pageNum
        })
      },
      getListFun(data){
        joinUsList(data)
          .then(data => {
            this.total = data.data.total
            this.list = data.data.data.map(curr => {
              curr.createtime = computeDate(curr.createtime)
              return curr
            })
          })
      }
    }
  }
</script>

<style lang="less" scoped>
  .t {
    text-align: center;
    margin-top: 60px;
  }
</style>
