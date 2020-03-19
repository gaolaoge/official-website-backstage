<template>
  <div class="keyWords-wrapper">
    <div class="operate">
      <el-button type="success"  @click="addTagBtnFun">
        添加
      </el-button>
      <el-button type="danger" @click="deleteBtnFun">
        删除
      </el-button>
      <el-input class="keywordsSearch" placeholder="资讯标题/关键字" v-model="searchVal" />
      <el-button type="primary" @click="searchBtn">检索</el-button>
    </div>
    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column
        type="selection"
        fixed="left"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="keywords"
        label="关键字"
        show-overflow-tooltip="true"
        width="260">
      </el-table-column>
      <el-table-column
        prop="quote"
        label="是否被引用"
        align="center"
        width="100">
      </el-table-column>
      <el-table-column
        prop="user"
        label="创建人"
        show-overflow-tooltip="true"
        width="120">
      </el-table-column>
      <el-table-column
        prop="date"
        label="录入时间"
        width="220">
      </el-table-column>
      <el-table-column label="操作" min-width="40">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="warning"
            @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="tablePageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {
    addTag,
    getList,
    deleteTag,
    editTag,
    searchKey
  } from '@/api/api.js'
  import { computeDate } from "../assets/common";

  export default {
    name: 'keyWords',
    data(){
      return {
        tableData: [
          // {
          //   date: '2016-05-02 22:17:56',
          //   keywords: '王小虎',
          //   quote: '隐藏',
          //   user: '高歌',
          // },
        ],
        currentPage: 1,       //当前第几页
        multipleSelection: [],  //已选中项
        newTabVal: '',
        searchVal: '',
        tableTotal: 0,
        tablePageSize: 10,   //每页多少条数据
      }
    },
    methods: {
      handleSizeChange(val) {
        this.tablePageSize = val
        this.getListFun({
          size: this.tablePageSize,
          page: 1
        })
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getListFun({
          size: this.tablePageSize,
          page: this.currentPage
        })
      },
      // 多选
      handleSelectionChange(val){
        this.multipleSelection = val
      },
      // 添加tag弹窗
      addTagBtnFun(){
        this.$prompt('添加关键字', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(({ value }) => {
            this.newTabVal = value
            this.addTagFun()
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '取消添加'
            })
          })
      },
      // 添加tag
      addTagFun(){
        addTag({
          name: this.newTabVal
        })
          .then(data => {
            if(data.data.code == 201){
              this.$message({
                message: '关键字添加成功',
                type: 'success'
              })
              this.getListFun({
                size: this.tablePageSize,
                page: 1
              })
            }else if(data.data.code == 101){
              this.$message({
                message: '关键字已存在，添加失败',
                type: 'warning'
              })
            }
          })
      },
      //获取列表
      getListFun(data){
        getList(data)
          .then(data => {
            if(data.data.code == 200){
              this.pushData(data.data.data)
              this.tableTotal = data.data.total
            }
          })
      },
      // 删除
      deleteBtnFun(){
        if(!this.multipleSelection.length){
          this.$message({
            message: '没有选中项',
            type: 'warning'
          })
          return false
        }

        this.$confirm('此操作将永久删除该关键字, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {

            let t = this.multipleSelection.map(curr => {
              return curr.id
            })
            deleteTag(t)
              .then(data => {
                if(data.data.code == 204){
                  this.$message({
                    message: '删除成功',
                    type: 'success'
                  })
                  this.getListFun()
                }
              })

          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      },
      // 编辑
      handleEdit(rowData){
        this.$prompt('修改关键字', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: rowData.keywords,
          inputValidator: (da) => da == rowData.keywords ? false : true,
          inputErrorMessage: '关键字文本并未改变，无需提交'
        })
          .then(({ value }) => {

            editTag(rowData.id,{'name':value})
              .then(data => {
                if(data.data.code == 200)
                  this.getListFun()
              })

          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '取消修改'
            })
          })
      },
      // 搜索
      searchBtn(){
        if(!this.searchVal) return false
        searchKey({
          name: this.searchVal,
          pageSize: this.tablePageSize,
          index: 1
        })
          .then(data => {
            if(data.data.code == 200){
              if(data.data.total != 0){
                this.$message({
                  message: '查询成功',
                  type: 'success'
                })
                this.pushData(data.data.data)
                this.currentPage = 1
                this.searchVal = ''
              }else{
                this.$message({
                  message: '未匹配到结果',
                  type: 'warning'
                })
              }
            }
          })
      },
      // 数据录入列表
      pushData(data){
        this.tableData = data.map(curr => {
          return {
            date: computeDate(curr.createtime),
            keywords: curr.name,
            quote: curr.flag == 0 ? '隐藏' : '显示',
            user: curr.createby + '',
            id: curr.id
          }
        })
      }
    },
    created() {
      this.getListFun({
        size: this.tablePageSize,
        page: 1
      })
    }
  }
</script>

<style lang="less" scoped>
  .keyWords-wrapper {
    .pagination {
      margin-top: 40px;
      text-align: center;
    }
    .operate {
      box-sizing: border-box;
      padding: 4px;
      margin-bottom: 8px;
      border-radius: 3px;
      .keywordsSearch {
        margin-left: 14px;
        width: 400px;
      }
    }
  }
  /deep/.cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .base {
    text-align: center;
    .input_ {
      width: 400px;
    }
  }

</style>
