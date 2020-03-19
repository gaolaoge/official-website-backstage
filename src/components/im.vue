<template>
  <div class="im-wrapper">
    <!--替换此DOM内结构-->
    <div class="dialogueBase" ref="chat-base" v-html="DOMTree"></div>
    <div class="info" v-if="!lock">
      <span>
        即时通讯
      </span>
    </div>
    <div class="from-item">
      <el-input type="text" v-model="inputValNow" :disabled="!lock"/>
      <el-button @click="pushMessage" class="sendBtn">发送</el-button>
    </div>
    <div class="navbar">
      <ul>
        <li v-for="item,index in userList" :key="index" @click="switchLi(item.id)" :class="[{'news': item.news}]">
          <div class="imgBase">
            <img :src="item.imgUrl" alt="">
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'im',
    data(){
      return {
        websocket: null,
        inputValNow: '',
        inputValLast: '',
        flagNum: 0,
        id: null,
        flagStateList: {},
        usersImgList: [
          require('@/assets/timg.jpg')
        ],
        DOMTree: '',           //显示状态的对话结构
        userList: [            //用户列表
          // {
          //   id: '123',
          //   imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1583926683388&di=b4dfc64f7f4c3686c83489e4c3a5c39f&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F18%2F01%2F18%2F17e9d8107a370c1d8cbcb5bb1c957b6d.jpg%2521%2Ffwfh%2F804x804%2Fquality%2F90%2Funsharp%2Ftrue%2Fcompress%2Ftrue',
          //   dom: `<p>诶嘿1</p>`
          // }
        ],
        activeUserIndex: 0,    //当前展示用户索引
        lock: false,           //筛选初次打开对话框（需要导入用户ID）
      }
    },
    created() {
      this.websocket = new WebSocket(`ws://192.168.1.95:8080/websocket/kefu`)

      this.websocket.onopen = () => {

        // 收到消息
        this.websocket.onmessage = event => {
          if(JSON.parse(event.data)['code'] === 20000)
            return false

          // 筛选是否新建对话框
          let id_ = null,                                                    //发送当前消息的用户的id
              userListIndex = null,                                         //发送当前消息的用户在userList中的索引
              newUserId = JSON.parse(event.data)['data']['fromUser'],
              d = this.userList.findIndex(curr => {
                return curr.id == newUserId
              })
          if(d >= 0){
            //已有记录用户
            id_ = this.userList[d]['id']
            userListIndex = d
          }else{
            //新用户
            id_ = newUserId
            this.userList.push({
              id: id_,
              imgUrl: this.usersImgList[0],
              dom: ``,
              news: true
            })
            userListIndex = this.userList.length - 1
          }

          let Html = `<div class="chat-message__service">
                        <div class="chatContent">
                          ${JSON.parse(event.data)['data']['msg']}
                        </div>
                      </div>`

          this.userList[userListIndex]['dom'] += Html

          if(this.activeUserIndex == userListIndex && this.lock){
            this.DOMTree = this.userList[this.activeUserIndex]['dom']
          }

          console.log('用户收到信息',event)
        }

        this.websocket.onerror = event => {
          console.log('errror',enent)
        }
      }
    },
    methods: {
      // 发送
      pushMessage(){

        if(!this.lock){
          this.$message({
            message: '未选定用户',
            type: 'warning'
          })
          return false
        }

        // 判断是否为空
        if(!this.inputValNow){
          this.$message({
            message: '内容为空，无法发送',
            type: 'warning'
          })
          return false
        }

        this.inputValLast = this.inputValNow
        this.inputValNow = ''

        // 发送消息
        this.websocket.send(JSON.stringify(
          {
            type: 1,
            fromUser: "kefu",
            toUser: this.id,
            msg: this.inputValLast,
            flag: ++ this.flagNum
          }))

        // 消息flag推进状态管理数组
        this.flagStateList[this.flagNum] = false

        let ti = `<div class="chat-message__me">
                    <div class="chatContent">
                      ${this.inputValLast}
                    </div>
                  </div>`
        this.userList[this.activeUserIndex].dom += ti
        this.DOMTree = this.userList[this.activeUserIndex]['dom']

      },
      // 切换对话
      switchLi(userId){
        this.lock = true  //就用一次

        this.activeUserIndex = this.userList.findIndex(curr => {
          return curr.id == userId
        })

        this.DOMTree = this.userList[this.activeUserIndex].dom
        this.id = this.userList[this.activeUserIndex].id + ''
        this.userList[this.activeUserIndex].news = false
      }
    }
  }
</script>

<style lang="less" scoped>
  .im-wrapper {
    position: relative;
    width: 380px;
    height: 600px;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
    background-color: rgba(256,256,256,0.9);
    border-radius: 5px;
    padding: 8px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    display: none;
    .dialogueBase {
      width: 100%;
      height: 94%;
      background-color: rgba(256,256,256,0.72);
      margin-bottom: 8px;
      border-radius: 3px;
      padding: 8px;
      box-sizing: border-box;
      overflow-x: hidden;
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
        background: rgba(158,151,151,0.6);
      }
      &::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(138, 129, 129, 0.2);
        border-radius: 10px;
        background: rgba(226, 221, 221, 0.4);
      }
      /deep/.chat-message__me {
        display: flex;
        justify-content: flex-end;
        padding: 2px 0px;
        .chatContent {
          display: inline-block;
          background-color: #4958f7;
          color: #fefdff;
          font-size: 15px;
          padding: 10px 22px 10px 12px;
          border-radius: 10px 2px 10px 10px;
          max-width: 100%;
          line-height: 26px;
        }
      }
      /deep/.chat-message__service {
        display: flex;
        justify-content: flex-start;
        padding: 2px 0px;
        .ic {
          border-radius: 50%;
          overflow: hidden;
          margin-right: 8px;
          width: 40px;
          height: 40px;
          box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.27);
          .iic {
            width: 40px;
          }
        }
        .chatContent {
          display: inline-block;
          background-color: #f1f3f5;
          color: #424242;
          font-size: 15px;
          padding: 10px 22px 10px 12px;
          border-radius: 2px 10px 10px 10px;
          max-width: 100%;
          line-height: 26px;
          box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.07);
        }
      }
    }
    .info {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 94%;
      font-size: 20px;
      font-weight: 600;
      color: rgba(18,18,18,0.41);
    }
    .from-item {
      display: flex;
      width: 100%;
      .sendBtn {
        margin-left: 8px;
      }
    }
    .navbar {
      position: absolute;
      left: -50px;
      top: 0px;
      width: 40px;
      height: 100%;
      ul {
        margin-left: -4px;
        li {
          padding: 3px;
          position: relative;
          list-style: none;
          width: 40px;
          height: 40px;
          margin-bottom: 12px;
          cursor: pointer;
          box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.27);
          background-color: rgba(256,256,256,1);
          transition: all 0.2s;
          border-radius: 50%;
          .imgBase {
            height: 100%;
            width: 100%;
            border-radius: 50%;
            overflow: hidden;
            img {
              width: 100%;
            }
          }
          &:hover {
            box-shadow: 0px 0px 6px 1px rgba(201,75,75,0.47);
          }
          &.news::after {
              content: '';
              position: absolute;
              width: 8px;
              height: 8px;
              background-color: tomato;
              border-radius: 50%;
              top: 0px;
              right: 0px;
          }
        }
      }
    }
  }
</style>
