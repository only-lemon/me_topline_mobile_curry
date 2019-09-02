<template>
  <div class="page-user-chat">
    <!-- 导航栏 -->
    <van-nav-bar
      fixed
      left-arrow
      @click-left="$router.back()"
      title="小智同学"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <!-- 消息列表 -->
    <van-cell-group class="message-list" ref="message-list">
      <van-cell
        :title="`${item.name}: ${item.content}`"
        v-for="item in messages"
        :key="item.timestamp"
      >
      </van-cell>
    </van-cell-group>
    <!-- /消息列表 -->

    <!-- 发布评论 -->
    <van-cell-group class="publish-wrap">
      <van-field
        v-model="inputMessage"
        placeholder="请输入聊天内容"
      >
        <van-button
          slot="button"
          size="mini"
          type="info"
          @click="onSendMessage"
        >发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布评论 -->
  </div>
</template>

<script>
import io from 'socket.io-client'

export default {
  name: 'ChatIndex',
  data () {
    return {
      inputMessage: '',
      socket: null,
      messages: JSON.parse(window.localStorage.getItem('chat-messages')) || []
    }
  },

  watch: {
    messages () {
      // 将消息列表滚动到最底部
      const messageList = this.$refs['message-list']
      messageList.scrollTop = messageList.scrollHeight
      // messageList.scrollTo(0, messageList.scrollHeight)
      window.localStorage.setItem('chat-messages', JSON.stringify(this.messages))
      // this.$nextTick(() => {
      //   messageList.scrollTo(0, messageList.scrollHeight)
      // })
    }
  },

  created () {
    this.initSocket()
  },

  methods: {
    onSendMessage () {
      const inputMessage = this.inputMessage.trim()

      if (!inputMessage.length) {
        return
      }

      // 通过 Socket 发送聊天消息
      this.socket.emit('message', {
        msg: inputMessage,
        timestamp: Date.now()
      })

      // 将发送的消息展示到页面中
      this.messages.push({
        name: 'Hello',
        photo: 'http://toutiao.meiduo.site/FgO8dDDWVfDkR6uPDc6RZFpmMuS-',
        content: inputMessage,
        timestamp: Date.now()
      })

      // 清空文本框
      this.inputMessage = ''
    },

    initSocket () {
      // http://ttapi.research.itcast.cn
      const socket = io('http://ttapi.research.itcast.cn', {
        query: {
          token: this.$store.state.user.token
        }
      })

      this.socket = socket

      socket.on('connect', () => {
        console.log('建立与服务器实时通信的连接成功...')
      })

      socket.on('message', data => {
        this.messages.push({
          name: 'World',
          photo: 'http://toutiao.meiduo.site/Fkj6tQi3xJwVXi1u2swCElotfdCi',
          content: data.msg,
          timestamp: data.timestamp
        })
      })

      // 发送消息
      // socket.emit()

      // 接收消息
      // socket.on('xxx', data => {})
    }
  }
}
</script>

<style lang="less" scoped>
.message-list {
  margin-top: 46px;
}

.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}
</style>
