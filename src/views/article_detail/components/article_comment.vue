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
            <van-button size="mini" type="default"  @click="onReplyShow(item)" >回复</van-button>
          </p>
        </div>
        <van-icon slot="right-icon" :name="item.is_liking ? 'like' : 'like-o' "  @click="toCommentClickLikeORUnlike(item)" />
      </van-cell>
    </van-list>

    <van-cell-group class="publish-wrap">
      <van-field clearable placeholder="请输入评论内容" v-model="commentContent" >
        <van-button slot="button" size="mini" type="info" @click="incrementCommentORReplyComment" >发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- 回复弹窗 -->
      <van-popup
      v-model="isReplyShow"
      round
      position="bottom"
      :style="{ height: '90%' }"
    >
      <van-list
        v-model="reply.loading"
        :finished="reply.finished"
        finished-text="没有更多了"
        @load="replyOnLoad"
      >
        <van-cell
          v-for="item in reply.replyList"
          :key="item.com_id.toString()"
          :title="item.content"
        />
      </van-list>
    </van-popup>
    <!-- /回复弹窗 -->
  </div>
</template>

<script>
import { gainCommentORReply, increaseCommentORReplyComment, toCommentClickLike, toCommentClickUnlike } from '@/api/request_article'

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
      commentContent: '',

      // 控制回复的弹出层显示与隐藏
      isReplyShow: false,

      // 存一下当前点击的哪个评论
      currentComment: null,

      // 回复相关的需要用到的数据
      reply: {
        loading: false,
        finished: false,
        replyList: [],
        offset: null // 存储加载下一页评论回复列表的标记
      }
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
    },

    // 对评论或评论回复点赞或者取消点赞的方法
    async toCommentClickLikeORUnlike (comment) {
      // 如果当前用户已经对此评论点过赞 则调用取消点赞请求
      if (comment.is_liking) {
        await toCommentClickUnlike(comment.com_id.toString())
        comment.is_liking = false
      } else {
        // 如果当前用户没有对此评论点过赞 则调用点赞请求
        await toCommentClickLike(comment.com_id.toString())
        comment.is_liking = true
      }
    },

    // 展示回复评论数据所用到的方法
    async replyOnLoad () {
      const { data } = await gainCommentORReply({
        type: 'c',
        source: this.currentComment.com_id.toString(),
        offset: this.reply.offset
      })

      this.reply.replyList.push(...data.data.results)

      const lastId = data.data.last_id

      if (lastId) {
        this.reply.offset = lastId
      } else {
        // 数据已全部加载结束，不需要 onLoad 了
        this.reply.finished = true
      }

      // 取消本次的 loading
      this.reply.loading = false

      // 异步更新数据
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.reply.replyList.push(this.reply.replyList.length + 1)
      //   }
      //   // 加载状态结束
      //   this.reply.loading = false

      //   // 数据全部加载完成
      //   if (this.reply.replyList.length >= 40) {
      //     this.reply.finished = true
      //   }
      // }, 500)
    },

    onReplyShow (comment) {
      this.currentComment = comment
      console.log(comment.com_id.toString())
      this.isReplyShow = true
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
