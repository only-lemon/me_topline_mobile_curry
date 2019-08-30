<template>
  <div class="search_result_container">
    <!-- 每一个组件对应上一个自己的route,,,router管理着route们,,, -->
    <van-nav-bar left-arrow @click-left="$router.back()" :title="$route.params.keyword + ' 的搜索结果'"></van-nav-bar>
    <van-list v-model="articleSearchResultLoading" :finished="articleSearchResultFinished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in articleSearchResultList" :key="item.art_id" :title="item.title" />
    </van-list>
  </div>
</template>

<script>
// console.log('-------------hahhah----------------')
// console.log(this.asdasd)
// console.log('-------------hahhah----------------')
import { gainArticleSearchResult } from '@/api/request_search'

export default {
  data () {
    return {
      articleSearchResultList: [],
      articleSearchResultLoading: false,
      articleSearchResultFinished: false,

      // 维护起来要搜索第几页的数据 默认为1
      page: 1
    }
  },

  created () {
    console.log('-------------此处包裹的是属于当前组件的路由对象------------------')
    console.log(this.$route)
    console.log('-------------此处包裹的是属于当前组件的路由对象------------------')
  },

  methods: {
    async onLoad () {
      // 获取真实数据
      /* 第一层是响应对象 先从响应对象中拿到响应主体 再从响应主体中拿到响应文章 */
      const { data: { data: articleSearchResult } } = await gainArticleSearchResult({
        page: this.page,
        per_page: 10,
        q: this.$route.params.keyword
      })
      if (!articleSearchResult.results.length) this.articleSearchResultFinished = true
      else {
        this.articleSearchResultList.push(...articleSearchResult.results)

        this.page++
      }
      this.articleSearchResultLoading = false
      // console.log(articleSearchResult)

      // this.articleSearchResultLoading = false

      // 异步更新数据 ---> 示例代码
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
    }
  }
}
</script>

<style lang="less" scoped>
</style>>
