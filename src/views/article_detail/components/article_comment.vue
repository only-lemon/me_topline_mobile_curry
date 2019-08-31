<template>
  <div>
    <van-list
      v-model="articleCommentLoading"
      :finished="articleCommentFinished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="item in articleCommentList"
        :key="item.com_id.toString()"
      >
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px;"
          :src="item.aut_photo"
        />
        <span style="color: #466b9d;" slot="title">{{item.aut_name}}</span>
        <div slot="label">
          <p style="color: #363636;">{{item.content}}</p>
          <p>
            <span style="margin-right: 10px;">{{item.pubdate | relativeTime}}</span>
            <van-button size="mini" type="default">回复</van-button>
          </p>
        </div>
        <van-icon slot="right-icon" name="like-o" />
      </van-cell>
    </van-list>

    <van-cell-group class="publish-wrap">
      <van-field clearable placeholder="请输入评论内容" v-model="commentContent" >
        <van-button slot="button" size="mini" type="info" @click="incrementCommentORReplyComment" >发布</van-button>
      </van-field>
    </van-cell-group>
  </div>
</template>

<script>
import { gainCommentORReply, increaseCommentORReplyComment } from '@/api/request_article'

export default {
  name: 'articleComment',
  props: {},
  data () {
    return {
      articleCommentList: [],
      articleCommentLoading: false,
      articleCommentFinished: false,

      // 控制获取评论数据的偏移量,,,值为评论id,,,表示从此id的数据向后取,,,不传表示从第一页开始读取数据
      // 第一次请求数据时offset为null,不传递,则正好表示从第一页开始读取数据,等数据来了在把最后一个的评论id设置给offset,表示下一次请求,请求从这个评论id内容之后的评论数据
      offset: null,

      // 获取的评论数据个数,,,不传表示采用后端服务设定的默认每页数据量
      // 这个参数在此就不传了,每次获取回来后端设置的默认每页的数据量就行了
      limit: null,

      // 对此文章输入的评论内容
      commentContent: ''
    }
  },

  methods: {

    // 加载对当前文章的评论数据
    async onLoad () {
      // 向后台后端获取对当前文章评论的数据
      const {
        data: { data: gainCommentORReplyResult }
      } = await gainCommentORReply({
        type: 'a',
        source: this.$route.params.articleID,
        offset: this.offset,
        limit: this.limit
      })
      this.articleCommentList.push(...gainCommentORReplyResult.results)

      // 判断一下看看还有没有评论了,没有的话就articleCommentFinished置为true 表示数据已经全部加载完毕,没有更多了
      if (!gainCommentORReplyResult.last_id) {
        this.articleCommentFinished = true
      }

      // console.log(gainCommentORReplyResult)
      this.articleCommentLoading = false

      // 更新,请求,下一页,评论数据,所需要,传递的,参数
      this.offset = gainCommentORReplyResult.last_id

      // 异步更新数据
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1)
      //   }
      //   // 加载状态结束
      //   this.loading = false

      //   // 数据全部加载完成
      //   if (this.list.length >= 40) {
      //     this.finished = true
      //   }
      // }, 500)
    },

    // 添加对当前文章的评论  or  对当前文章的评论进行回复
    async incrementCommentORReplyComment () {
      const { data: { data: increaseCommentORReplyCommentResult } } = await increaseCommentORReplyComment({
        target: this.$route.params.articleID, // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
        content: this.commentContent, // 评论内容
        art_id: null // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
      })
      // console.log(increaseCommentORReplyCommentResult)

      this.articleCommentList.unshift(increaseCommentORReplyCommentResult.new_obj)

      // 清空输入框内容
      this.commentContent = ''
    }
  }
}
</script>

<style scoped lang='less'>
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.van-list {
  margin-bottom: 45px;
}
</style>
