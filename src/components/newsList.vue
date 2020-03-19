<template>
  <div class="newsList-wrapper">
    <div class="operate">
      <el-button type="success" @click="dialogFormVisible = true">
        添加
      </el-button>
      <el-button type="danger" @click="deleteNews">
        删除
      </el-button>
      <el-input class="keywordsSearch" placeholder="资讯标题/关键字" v-model="inputKeyword"/>
      <el-button type="primary" @click="searchKey">检索</el-button>
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
        prop="tit"
        label="资讯标题"
        show-overflow-tooltip="true"
        width="400">
      </el-table-column>
      <el-table-column
        prop="date"
        label="录入时间"
        width="220">
      </el-table-column>
      <el-table-column
        prop="keywords"
        label="关键字"
        show-overflow-tooltip="true"
        width="260">
      </el-table-column>
      <el-table-column
        prop="state"
        label="状态"
        width="100">
      </el-table-column>
      <el-table-column
        prop="top"
        label="置顶"
        align="center"
        width="100">
      </el-table-column>
      <el-table-column
        prop="user"
        label="创建人"
        show-overflow-tooltip="true"
        width="120">
      </el-table-column>
      <el-table-column label="操作" min-width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="viewNews(scope.$index, scope.row)">查看</el-button>
          <el-button
            size="mini"
            type="warning"
            @click="editNews(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalVal">
      </el-pagination>
    </div>

    <!--添加-->
    <el-dialog title="添加资讯（所有选项皆为必填项）"
               :visible.sync="dialogFormVisible"
               @open="openWin"
               top="50px">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="资讯标题">
          <el-input v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="关键字">
          <el-select v-model="form.keywordValue">
            <el-option v-for="item,index in keywordList" :key="index" :label="item.name" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示/隐藏">
          <el-switch v-model="form.hide"></el-switch>
        </el-form-item>
        <el-form-item label="是否置顶">
          <el-switch v-model="form.setTop"></el-switch>
        </el-form-item>
        <el-form-item label="排序">
          <el-input type="text" v-model="form.sortList" class="sortList" :disabled="form.setTop"></el-input>
        </el-form-item>
        <el-form-item label="首图">
          <input type="file" ref="file"></input>
        </el-form-item>
        <el-form-item label="活动形式">
          <div ref="editorElem"></div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--查看-->
    <el-dialog title="资讯预览" :visible.sync="dialogViews" top="64px" class="dialogViews">
      <section class="viewSection">
        <div class="banner">
          <img :src="viewNewdForm.first" alt="">
        </div>
        <header>
          <h5>
            {{ viewNewdForm.title }}
          </h5>
        </header>
        <p>
          关键字：
          {{ viewNewdForm.keywordName }}
        </p>
        <article v-html="viewNewdForm.content">
        </article>
      </section>
    </el-dialog>

    <!--编辑-->
    <el-dialog title="资讯编辑"
               :visible.sync="dialogedit"
               top="64px"
               @open="openEdit"
               class="dialogViews">
      <el-form ref="form" :model="editNewdForm" label-width="80px" class="editForm">
        <el-form-item label="资讯标题">
          <el-input v-model="editNewdForm.title" clearable></el-input>
        </el-form-item>
        <el-form-item label="关键字">
          <el-select v-model="editNewdForm.keywordName">
            <el-option v-for="item,index in keywordList" :key="index" :label="item.name" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示">
          <el-switch v-model="editNewdForm.hide"></el-switch>
        </el-form-item>
        <el-form-item label="是否置顶">
          <el-switch v-model="editNewdForm.roof"></el-switch>
        </el-form-item>
        <el-form-item label="排序">
          <el-input type="text" v-model="editNewdForm.sort" class="sortList" :disabled="editNewdForm.roof"></el-input>
        </el-form-item>
        <el-form-item label="原首图">
          <img :src="editNewdForm.first" alt="" style="width: 200px;">
        </el-form-item>
        <el-form-item label="修改首图">
          <input type="file" ref="editNewsFormFile"></input>
        </el-form-item>
        <el-form-item label="活动形式">
          <div ref="editorElem2"></div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editNewsFun">修改</el-button>
          <el-button @click="dialogedit = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getNewsList,
    pushNews,
    getList,
    deleteNews,
    viewsNews,
    editNews
  } from "../api/api";
  import { computeDate } from "../assets/common";
  import E from "wangeditor"

  export default {
    name: 'newsList',
    data(){
      return {
        tableData: [
          // {
          //   tit: '占位标题',
          //   date: '2016-05-02',
          //   keywords: '王小虎',
          //   state: '隐藏',
          //   user: '高歌',
          //   top: '否'
          // }
        ],
        currentPage: 1,
        multipleSelection: null,         //多选结果
        dialogFormVisible: false,        //添加资讯
        dialogViews: false,              //查看资讯
        dialogedit: false,               //编辑资讯
        form: {
          name: '',
          keywordValue: null,        //关键字在列表中的INDEX
          hide: false,               //隐藏/显示
          setTop: false,             //设顶
          sortList: '1',               //排序
          blob: '',                  //首图
          desc: ''                   //描述
        },
        searchVal: '',
        inputKeyword: '',      //关键字检索
        keywordList: [],       //关键字列表
        pageSize: 10,          //每页多少条数据
        editor: null,
        editorContent: '',
        totalVal: 0,
        viewNewdForm: {

        },
        editNewdForm: {

        }
      }
    },
    watch: {
      'form.setTop': function(val) {
        if(val) {
          this.form.sortList = 0
        }else {
          this.form.sortList = 1
        }
      },
      'form.sortList': function(val) {
        if(val !== '')
          this.form.sortList = val.split('').filter(curr => /[0-9]/.test(curr) ).join('')
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pageSize = val
        this.getNewsListFun({
          size: this.pageSize,
          page: this.currentPage,
          name: this.inputKeyword,
          hide: ''
        })
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getNewsListFun({
          size: this.pageSize,
          page: this.currentPage,
          name: this.inputKeyword,
          hide: ''
        })
      },
      handleSelectionChange(val){
        this.multipleSelection = val
      },
      // 添加新资讯
      onSubmit(){
        var reader = new FileReader(),
            self_ = this
        reader.readAsDataURL(this.$refs.file.files[0])
        reader.addEventListener('load',e => {
          self_.form.blob = e.target.result
          pushNews({
            title: self_.form.name,                                             //标题
            keywordId: self_.keywordList[self_.form.keywordValue].id,           //关键字ID
            keywordName: self_.keywordList[self_.form.keywordValue].name,       //关键字文本
            hide: self_.form.hide ? 1 : 0,                                      //是否隐藏 01
            roof: self_.form.setTop ? 0 : 1,                                    //是否置顶 0是置顶
            sort:self_.form.sortList == 0 ? 0 : Math.abs(self_.form.sortList),  //排序 置顶时为0  其它状态大于等于1
            first: self_.form.blob,                                             //img
            content: self_.form.desc                                            //正文
          })
            .then(data => {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.currentPage = 1
              this.getNewsListFun({
                size: this.pageSize,
                page: this.currentPage,
                name: '',
                hide: ''
              })
              this.form = {
                name: '',
                keywordValue: null,
                hide: false,
                setTop: false,
                sortList: false,
                blob: '',
                desc: ''
              }
              this.editor.txt.clear()
              this.$refs.file.value = ''
            })
        })
      },
      // 关键字查询
      searchKey(){
        if(!this.inputKeyword) {
          this.$message({
            message: '关键字为空',
            type: 'warning'
          })
          return false
        }
        this.getNewsListFun({
          size: 10,
          page: 1,
          name: this.inputKeyword,
          hide: ''
        })
          .then(data => {
            this.inputKeyword = ''
          })
      },
      getListFun(){
        getList({
          size: 999,
          page: 1
        })
          .then(data => {
            this.keywordList = data.data.data

          })
      },
      getNewsListFun(data){
        getNewsList(data)
          .then(data => {
            this.totalVal = data.data.total
            this.tableData = data.data.data.map(curr => {
              return {
                  id: curr.id,
                  tit: curr.title,
                  date: computeDate(curr.createtime),
                  keywords: curr.keywordName,
                  keywordsId: curr.keywordId,
                  state: curr.hide == 0 ? '否' : '是',
                  top: curr.roof == 0 ? '是' : '否',
                  user: curr.createby,
                  imgUrl: curr.first,
                  t: curr.content
              }
            })

          })
      },
      openEdit(){
        setTimeout(() => {
          if(this.$refs.editorElem2.innerHTML){
            this.editor.txt.html(this.editNewdForm.content)
            return false
          }
          this.editor = new E(this.$refs.editorElem2)
          this.editor.customConfig.onchange = html => {
            this.editNewdForm.content = html;
          }
          this.editor.customConfig.menus = [
            // 菜单配置
            'head', // 标题
            'bold', // 粗体
            'fontSize', // 字号
            'fontName', // 字体
            'italic', // 斜体
            'underline', // 下划线
            'strikeThrough', // 删除线
            'foreColor', // 文字颜色
            'backColor', // 背景颜色
            'link', // 插入链接
            'list', // 列表
            'justify', // 对齐方式
            'quote', // 引用
            'emoticon', // 表情
            'image', // 插入图片
            'table', // 表格
            'code', // 插入代码
            'undo', // 撤销
            'redo' // 重复
          ]
          this.editor.create()
          this.editor.txt.html(this.editNewdForm.content)
        },0)
      },
      openWin(){
        setTimeout(() => {
          if(this.$refs.editorElem.innerHTML){
            return false
          }
          this.editor = new E(this.$refs.editorElem)
          this.editor.customConfig.onchange = html => {
            this.form.desc = html;
          }
          this.editor.customConfig.menus = [
            // 菜单配置
            'head', // 标题
            'bold', // 粗体
            'fontSize', // 字号
            'fontName', // 字体
            'italic', // 斜体
            'underline', // 下划线
            'strikeThrough', // 删除线
            'foreColor', // 文字颜色
            'backColor', // 背景颜色
            'link', // 插入链接
            'list', // 列表
            'justify', // 对齐方式
            'quote', // 引用
            'emoticon', // 表情
            'image', // 插入图片
            'table', // 表格
            'code', // 插入代码
            'undo', // 撤销
            'redo' // 重复
          ];
          this.editor.create();
        },0)
      },
      // 删除资讯
      deleteNews(){

        this.$confirm('此操作将永久删除选中资讯, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {

            let list = this.multipleSelection.map(curr => {
              return curr.id
            })
            deleteNews(list)
              .then(data => {
                if(data.data.code == 204){
                  this.$message({
                    message: '删除成功',
                    type: 'success'
                  })
                  this.getNewsListFun({
                    size: this.pageSize,
                    page: this.currentPage,
                    name: '',
                    hide: ''
                  })
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
      // 查看
      viewNews(index,data){
        viewsNews(data.id)
          .then(data => {
            this.viewNewdForm = data.data.data
            this.dialogViews = true
          })
      },
      // 编辑
      editNews(index,data){
        viewsNews(data.id)
          .then(data => {
            this.editNewdForm = data.data.data
            data.data.data.hide == 1 || data.data.data.hide == true ? this.editNewdForm.hide = true : this.editNewdForm.hide = false
            data.data.data.roof == 0 || data.data.data.roof == true ? this.editNewdForm.roof = true : this.editNewdForm.roof = false
            this.editNewdForm['oldkeyId'] = data.data.data.keywordId
            this.editNewdForm['oldkeyname'] = data.data.data.keywordName
            this.dialogedit = true
          })
      },
      // 确认修改
      editNewsFun() {

        var reader = new FileReader(),
            self_ = this
        if(this.$refs.editNewsFormFile.files[0]) {
          reader.readAsDataURL(this.$refs.editNewsFormFile.files[0])
          reader.addEventListener('load', e => {
            self_.editNewdForm.first = e.target.result
            send()
          })
        }else {
          send()
        }
        function send(){
          console.log(self_.editNewdForm.roof)
          self_.editNewdForm.hide = self_.editNewdForm.hide ? 1 : 0                                             //是否隐藏 01
          self_.editNewdForm.roof = self_.editNewdForm.roof ? 0 : 1                                             //是否置顶 0是置顶
          console.log(self_.editNewdForm.roof)
          self_.editNewdForm.sort = self_.editNewdForm.sort == 0 ? 0 : Math.abs(self_.editNewdForm.sort)        //排序 置顶时为0  其它状态大于等于1
          if(self_.editNewdForm.keywordName !== self_.editNewdForm.oldkeyname) {
            self_.editNewdForm.keywordId = self_.keywordList[self_.editNewdForm.keywordName].id
            self_.editNewdForm.keywordName = self_.keywordList[self_.editNewdForm.keywordName].name
          }
          console.log(self_.editNewdForm)
          editNews(self_.editNewdForm)
            .then(data => {
              self_.dialogedit = false
              self_.editNewdForm = false
            })
        }

      }
    },
    created() {
      // 获取关键字列表
      this.getListFun()
      this.getNewsListFun({
        size: this.pageSize,
        page: this.currentPage,
        name: '',
        hide: ''
      })
    },
    mounted() {

    }
  }
</script>

<style lang="less" scoped>
  .newsList-wrapper {
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
  .viewSection {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    flex-direction: column;
    width: 100%;
    .banner {
      width: 100%;
      img {
        width: 100%;
      }
    }
    header {
      font-size: 32px;
      line-height: 2.2em;
    }
    p,
    article {
      width: 100%;
      margin-bottom: 20px;
    }
  }
  .dialogViews {
    .editForm {
      padding: 8px 16px;
      height: 600px;
      overflow-y: scroll;



      &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 8px;
      }
      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(102, 89, 89, 0.2);
        background: #9e9797;
      }
      &::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(138, 129, 129, 0.2);
        border-radius: 10px;
        background: rgb(226, 221, 221);
      }
    }
  }


  /deep/.cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  /deep/.w-e-text-container {
    height: 200px!important;
  }
  .sortList {
    width: 120px;
  }
</style>
