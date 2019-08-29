<template>
  <div class="search_container">
    <form action="/">
      <van-search
        v-model="searchContent"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch"
        @cancel="onCancel"
      />
    </form>

    <van-cell-group>
      <van-cell icon="search" v-for="item in suggestionOptions" :key="item">
         <span slot="title" v-html="highLight(item)"></span>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { gainSuggestions } from '@/api/request_search'
import { debounce } from 'lodash'

export default {
  name: 'searchComponent',

  data () {
    return {
      // 搜索框双向绑定的文本数据
      searchContent: '',

      // 后台后端获取到的联想建议选项数据
      suggestionOptions: []
    }
  },

  watch: {

    // 函数防抖写法
    searchContent: debounce(async function (newValue) {
      if (!newValue.trim().length) return 1
      const {
        data: { data: suggestionOptions }
      } = await gainSuggestions(newValue)
      // console.log(searchContentResult)
      // console.log(suggestionOptions)
      this.suggestionOptions = suggestionOptions.options

      // 原先的写法
      // async searchContent (newValue) {
      //   if (!newValue) return
      //   const {
      //     data: { data: suggestionOptions }
      //   } = await gainSuggestions(newValue)
      //   // console.log(searchContentResult)
      //   // console.log(suggestionOptions)
      //   this.suggestionOptions = suggestionOptions.options
      // }
    }, 500)

  },

  methods: {
    // 点击搜索组件的搜索按钮触发的事件处理程序
    onSearch () {
      console.log('搜索操作')
    },

    // 点击搜索组件的取消按钮触发的事件处理程序
    onCancel () {
      console.log('取消操作')
    },

    // 搜索关键字高亮显示
    highLight (str) {
      return str.toLowerCase().split(this.searchContent)
        .join(`<span style="color: hotpink;">${this.searchContent}</span>`)
    }
  }

}
</script>

<style lang="less" scoped>
</style>>
