<template>
  <div>
    <van-nav-bar title="首页" />
    <van-tabs v-model="activeChannelIndex">
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <!--
          下拉刷新组件
          v-model="isLoading" 用来控制刷新的 loading 效果
          @refresh 刷新的事件
          当它触发了 refresh 事件的时候，它自动会把 loading 设置为 true
          我们要做的是：在刷新处理方法中发请求，请求结束以后，将 loading 设置为 false
         -->
        <van-pull-refresh v-model="channel.pullLoading" @refresh="onRefresh">
          <!--
            列表组件（提供了上拉加载更多功能）
            v-model="loading" 用来控制加载的 loading 状态
            finished 用来控制是否加载结束
              如果为 false，则可以再次触发 onLoad 加载更多
              如果为 true，则不再触发 onLoad 去加载更多了
            finished-text 配置数据加载完毕之后的提示文本
            当它加载更多的时候，它会触发 load 事件
           -->
          <van-list
            v-model="channel.loading"
            :finished="channel.finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell
              v-for="article in channel.articles"
              :key="article.art_id"
              :title="article.title"
            >
              <div slot="label">
                <van-grid :border="false" :column-num="3">
                  <van-grid-item v-for="(img, index) in article.cover.images" :key="index">
                    <van-image height="80" :src="img" />
                  </van-grid-item>
                </van-grid>
                <div class="article-item-label">
                  <span>{{ article.aut_name }}</span>
                  <span>{{ article.comm_count }}评论</span>
                  <span>{{ article.pubdate | relativeTime }}</span>
                </div>
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { gainUserChannels } from '@/api/request_user'
import { gianCurrentChannelArticles } from '@/api/request_channel_article'

export default {
  name: 'HomeIndex',
  data () {
    return {
      activeChannelIndex: 0,
      // list: [],
      // loading: false,
      // finished: false,
      // count: 0,
      // isLoading: false,

      // 获取当前用户的所有频道列表
      channels: []
    }
  },

  computed: {
    currentChannel () {
      return this.channels[this.activeChannelIndex]
    }
  },

  async created () {
    // 拉取当前登录用户的频道列表数据
    // 此处加上await意思是 :  我也不知道我解释的对不对,,知识点有点模糊了
    // 意思是 :  等待this.gainCurrentUserChannels() 函数体里面的异步代码执行完再执行这个gainCurrentUserChannels方法
    await this.loadChannels()
  },

  methods: {
    async loadChannels () {
      const { data } = await gainUserChannels()
      data.data.channels.forEach(channel => {
        channel.articles = [] // 存储频道的文章列表
        channel.finished = false // 存储频道是否加载完毕的状态
        channel.loading = false // 存储频道的上拉加载更多的 loading 状态
        channel.pullLoading = false // 存储频道的下拉刷新的 loading 状态
        channel.timestamp = null // 存储当前频道加载下一页数据的时间戳标志（页码）
      })
      this.channels = data.data.channels
    },

    async onLoad () {
      const { currentChannel } = this
      const { data } = await gianCurrentChannelArticles({
        channel_id: currentChannel.id,
        timestamp: currentChannel.timestamp || Date.now(),
        with_top: 1
      })

      const { results, pre_timestamp: pretimeStamp } = data.data

      // 将获取到的文章列表添加到当前频道中
      currentChannel.articles.push(...results)

      if (pretimeStamp) {
        // 更新时间戳  更新这个时间戳是为了请求前一页历史数据
        // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        currentChannel.timestamp = pretimeStamp
      } else {
        currentChannel.finished = true // 没有数据了，不需要 onLoad 了
      }

      // 本次加载更多 OK 了，将本次的 loading 设置为 false
      currentChannel.loading = false
    },

    // onLoad () {
    //   const { currentChannel } = this
    //   // 异步更新数据
    //   setTimeout(() => {
    //     for (let i = 0; i < 10; i++) {
    //       currentChannel.articles.push(currentChannel.articles.length + 1)
    //     }
    //     // 加载状态结束（本次）
    //     currentChannel.loading = false

    //     // 数据全部加载完成
    //     if (currentChannel.articles.length >= 40) {
    //       currentChannel.finished = true
    //     }
    //   }, 500)
    // },

    async onRefresh () {
      const { currentChannel } = this
      const { data } = await gianCurrentChannelArticles({
        channel_id: currentChannel.id,
        // 刷新的业务逻辑是把时间戳改成当前的现在的时间,后端就能根据当前的时间戳获取到最新发布的频道文章

        timestamp: Date.now(),
        with_top: 1
      })

      // 下拉刷新，将每次拿到的数据放到当前频道的文章的顶部
      currentChannel.articles.unshift(...data.data.results)

      // 写到此处出现个问题: 问题是狂发请求,,,一直发请求,逻辑上的代码是没错的,,,应该是因为我没有吧内容渲染到页面
      // 被组件检测到没有内容填满当前页,,,就会一直给我触发load事件去要内容想填满当前页,,,但是恰巧我没渲染
      // 所以就会一直给我狂发请求,,,,  代码逻辑是没错的,,,,  接下来就是写一下样式,,,, 来把请求回来的指定数量的频道文章数据渲染在当前页面上,,,,
      // 现在在我没写样式的HTML结构的情况下只要打开this.loading = false代码 就会一直狂发请求,,,原因如上注释解释,,,

      // 想多了也想错了,,,,狂发请求的原因是我每次都覆盖请求回来的文章数据了,,,导致数组中的数据达不到两屏幕数据的条数
      // 组件就会一直帮你发请求拿数据,组件想要的是够加载两屏幕的数据,就不会再帮你自动发请求拿数据,,,
      // 而我每次都把上一次的数据给覆盖掉了,,,导致只有一屏的数据,,,所以达不到组件的要求,,,就会一直帮你发,,,

      // 本次获取当前频道文章数据加载状态结束  本次请求当前频道文章数量数据加载完毕

      // 数据加载完毕，将当前频道的下拉刷新 loading 关闭
      currentChannel.pullLoading = false

      this.$toast('刷新成功')
    }
  }
}
</script>

<style>
.article-item-label span {
  margin-right: 5px;
}
</style>
