<template>
  <van-popup
    :style="{ height: '90%' }"
    :value="value"
    @input="$emit('input', $event)"
    position="bottom"
    round
    @click-overlay="closeToken = false"
  >
    <van-cell icon="cross"  @click="$emit('input', false)" />
    <van-cell title="我的频道" label="点击进入频道">
      <van-button
        round
        type="danger"
        size="small"
        @click="closeToken = !closeToken"
      >{{closeToken?"完成":"编辑"}}</van-button>
    </van-cell>
    <van-grid>
      <!-- 其实在这里我已经加上了控制文本颜色变化的类名了,,只不过这个组件是有嵌套关系的,,,虽然样式有继承性 -->
      <!-- 但是在这里我并没有影响到子代元素的文本颜色的变化,,,我也不知道为啥,,, -->
      <!-- 那就是用另一种方式咯,,,van-grid-item给有预留插槽,,我们可以自定义文字代替组件内部原本的spanDOM结构 -->
      <!-- 用我们自己的DOM结构,,,这样在自己的DOM结构上 我们判断加上自己的控制文本颜色的类名即可,,, -->
      <van-grid-item
        v-for="(item,index) in myChannels"
        :key="item.id"
        :class="{_activeChannelIndex:activeChannelIndex===index}"
        :text="item.name"
        @click="deleteORskipChannel(item,index)"
      >
        <!-- 奇奇怪怪的,,,为啥我加上了这句代码就搞的字体自己也变大了,,,虽然颜色是有了,,,我的xx图标奇奇怪怪的没了,,,无语 -->
        <!-- 此问题不在这上面纠结浪费时间了,,,问老师吧,,,不是啥有意义去研究考虑的问题,,,没必要在这上花费太多的时间,,, -->
        <!-- <span class="grid-text" :class="{_activeChannelIndex:activeChannelIndex===index}">{{ item.name }}</span> -->
        <van-icon v-if="closeToken" slot="icon" class="close-icon" name="close" />
      </van-grid-item>
    </van-grid>

    <van-cell title="推荐频道" label="点击添加频道" />
    <van-grid>
      <van-grid-item
        v-for="item in recommendChannel"
        :key="item.id"
        :text="item.name"
        @click="_addUserChannel(item)"
      />
    </van-grid>
  </van-popup>
</template>

<script>
import { gainAllChannels, deleteUserChannel, addUserChannel } from '@/api/request_channel'
import { mapState } from 'vuex'

export default {
  name: 'ChannelEdit',
  data () {
    return {
      // 控制编辑频道组件的显示与隐藏
      // editChannelShow: true,

      // 控制我的频道上面的X按钮的显示与隐藏
      closeToken: false,

      // 全部频道数据
      allChannels: []
    }
  },

  computed: {
    ...mapState(['user']),

    // 拿到推荐频道数据
    recommendChannel () {
      // 先得到我的频道列表的所有的频道 id
      const id = this.myChannels.map(channel => channel.id)

      // 过滤出来推荐频道数据
      const recommendChannelResult = this.allChannels.filter(channel => {
        return !id.includes(channel.id)
      })

      return recommendChannelResult
    }
  },

  created () {
    this.loadAllChannels()
  },

  // 配置选项之接收父组件传递过来的数据
  props: {
    myChannels: {
      type: Array,
      default: () => []
    },
    value: {
      type: Boolean,
      default: false
    },
    activeChannelIndex: {
      type: Number
    }
  },
  methods: {

    // 获取当前用户所有的频道数据的方法
    async loadAllChannels () {
      const { data } = await gainAllChannels()
      const channels = data.data.channels
      channels.forEach(channel => {
        channel.articles = [] // 存储频道的文章列表
        channel.finished = false // 存储频道是否加载完毕的状态
        channel.loading = false // 存储频道的上拉加载更多的 loading 状态
        channel.pullLoading = false // 存储频道的下拉刷新的 loading 状态
        channel.timestamp = null // 存储当前频道加载下一页数据的时间戳标志（页码）
      })
      this.allChannels = data.data.channels

      // 测试点击遮罩层能否触发事件处理程序  先把这段代码放在这里面吧  因为在外面注释掉的话是没办法收起来代码的,,,不收起来写功能的时候看着难受,,,
      // print () {
      //   console.log('你是不是点击遮罩层区域啦你!!!')
      // }
    },

    // 删除或者跳转频道   <--->  ↓ 我的频道操作对应的方法 ↓
    async deleteORskipChannel (channel, index) {
      // 在closeToken为false的情况下是跳转频道  为true的情况下是删除频道
      if (this.closeToken) {
        // 页面显示上看着删除了用户频道数据
        this.myChannels.splice(index, 1)

        // 登录与否对应的处理业务的逻辑是不同的
        if (this.user) {
          console.log('已经登录')
          // 当然这里得要真正的向后台发送请求删除用户频道数据
          // 真实后台删除用户频道数据
          await deleteUserChannel(channel.id)
        } else {
          console.log('未登录')

          // 没有登录,,,保存到本地存储
          window.localStorage.setItem('channels', JSON.stringify(this.myChannels))
        }
      } else {
        // console.log(66666666)
        // 触发一个自定义事件把索引带过去带到父组件中去
        this.$emit('skipChannel', index)

        // 关闭弹出层在父组件中关闭
      }
    },

    // 从推荐频道数据中来添加到我的频道中去的方法
    async _addUserChannel (channel) {
      // 页面显示上看着添加了用户频道数据
      this.myChannels.push(channel)

      // 登录与否对应的处理业务的逻辑是不同的
      if (this.user) {
        // console.log(55555555)
        // 直接向后台发送请求添加到当前用户频道数据上   <--->   真实操作,操作到后台数据上
        await addUserChannel(channel.id, this.myChannels.length)

        //  -----------------------------------------------
      } else { // 我就想在上下各留一个空行,,,自动修复语法校验代码风格还不让留,,,那我就制不了你了,,,呵呵呵,,,
        //  -----------------------------------------------

        // 没有登录,,,则保存到本地存储
        window.localStorage.setItem('channels', JSON.stringify(this.myChannels))
      }

      // 又发现了一个有意思的现象,,,这是因为back end后后端接口出现的问题和我们front end前端没有关系
      // 什么有意思的现象呢就是当这个用户曾经添加过这个频道时尽管他后来又删除了这频道数据
      // 但是在后端的逻辑中他就认为这个关注的频道还存在并没有删除这个频道在当前用户的数据中
      // 后端给的解释是 : 409 已存在用户关注的频道，冲突
      // 所以我要想让用户看到你确实已经添加了关注了此频道,,,就把这句代码放在还没出错之前  要么就try catch 一下
      // 最正确的做法就是catch一下,,,因为恰巧这个业务逻辑里面发送请求回来后面不需要再做任何事情了,,,也就是没有运行的代码了
      // 没有运行的语句了,,,
    }

  }
}
</script>

<style lang="less" scoped>
.close-icon {
  position: absolute;
  right: 0;
  top: 0;
}
._activeChannelIndex{
  color: red
}
</style>
