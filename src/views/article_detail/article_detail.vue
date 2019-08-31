<template>
  <div class="article-container">
    <van-nav-bar fixed left-text="返回" @click-left="$router.back()" title="文章详情"></van-nav-bar>
    <van-loading class="article-loading" v-if="loading"/>
    <div class="detail" v-else-if="article.title">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="2rem" height="2rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate}}</p>
        </div>
        <van-button
          round
          size="small"
          :type="article.is_followed ? 'default' : 'info'"
          :loading="isFollowLoading"
          @click="ISFollow"

        >{{ article.is_followed ? '已关注' : '+ 关注' }}</van-button>
      </div>
      <div class="content" v-html="article.content"></div>
      <div class="zan">
        <van-button round size="small" hairline type="primary" plain icon="good-job-o">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" hairline type="danger" plain icon="delete">不喜欢</van-button>
      </div>
    </div>
    <div class="error" v-else>
      <p>网络超时，点击 <a href="#" @click.prevent="loadArticleDetail">刷新</a> 试一试。</p>
    </div>
    <!-- 文章评论组件 -->
      <article-comment></article-comment>
    <!-- /文章评论组件 -->
  </div>
</template>

<script>
import { gainArticleDetail } from '@/api/request_article'
import { subscriptionUser, cancelSubscriptionUser } from '@/api/request_user'
import ARTICLE_COMMENT from '@/views/article_detail/components/article_comment'

export default {
  name: 'ArticleIndex',

  // 挂载当前组件内使用的局部组件
  components: {
    articleComment: ARTICLE_COMMENT
  },

  data () {
    return {

      loading: true,
      article: {},
      isFollowLoading: false

    }
  },

  created () {
    this.loadArticleDetail()
  },

  methods: {
    async loadArticleDetail () {
      this.loading = true
      const { data: { data: gainArticleDetailResult } } = await gainArticleDetail(this.$route.params.articleID)
      // console.log('----------------下面包裹的是新闻文章详情数据-------------------------------')
      // console.log(gainArticleDetailResult)
      // console.log('----------------下面包裹的是新闻文章详情数据-------------------------------')
      this.article = gainArticleDetailResult
      this.loading = false
    },

    // 关注用户 or 取消关注用户
    async ISFollow () {
      this.isFollowLoading = true
      if (this.article.is_followed) {
        // 已关注逻辑
        // this.article.is_followed = false 控制视图效果的给用户看的按钮的颜色不一样文字不一样让用户真的以为是关注了还是没关注
        this.article.is_followed = false
        await cancelSubscriptionUser(this.article.aut_id)
      } else {
        // 未关注逻辑
        // this.article.is_followed = true 控制视图效果的给用户看的按钮的颜色不一样文字不一样让用户真的以为是关注了还是没关注
        this.article.is_followed = true
        await subscriptionUser(this.article.aut_id)
      }
      this.isFollowLoading = false
    }
  }

}
</script>

<style scoped lang='less'>
.article-container{
  position: absolute;
  left: 0;
  top: 0;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
}

.article-loading {
  padding-top: 100px;
  text-align: center;
}
.van-nav-bar__text{
  color: #ee19fa
}
.error{
  padding-top: 100px;
  text-align: center;
}
.detail {
  padding: 50px 10px;
  .title {
    font-size: 16px;
  }
  .zan{
    text-align: center;
    margin-top: 30px;
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.3;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
  }
}
</style>
