<template>
  <van-popup
    :style="{ height: '90%' }"
    v-model="editChannelShow"
    position="bottom"
    round
  >
    <van-cell icon="cross" />
    <van-cell title="我的频道" label="点击进入频道">
      <van-button
        round
        type="danger"
        size="small"
        @click="closeToken = !closeToken"
      >{{closeToken?"完成":"编辑"}}</van-button>
    </van-cell>
    <van-grid>
      <van-grid-item
        v-for="item in myChannels"
        :key="item.id"
        :text="item.name"
      >
        <van-icon v-if="closeToken"
          slot="icon"
          class="close-icon"
          name="close"
        />
      </van-grid-item>
    </van-grid>

    <van-cell title="推荐频道" label="点击添加频道" />
    <van-grid>
      <van-grid-item
        v-for="item in recommendChannel"
        :key="item"
        :text="item.name"
      />
    </van-grid>
  </van-popup>
</template>

<script>
import { gainAllChannels } from '@/api/request_channel'

export default {
  name: 'ChannelEdit',
  data () {
    return {

      // 控制编辑频道组件的显示与隐藏
      editChannelShow: true,

      // 控制我的频道上面的X按钮的显示与隐藏
      closeToken: false,

      // 全部频道数据
      allChannels: []
    }
  },

  computed: {

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
    }
  },
  methods: {

    // 获取当前用户所有的频道数据的方法
    async loadAllChannels () {
      const { data } = await gainAllChannels()
      this.allChannels = data.data.channels
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
</style>
