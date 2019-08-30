<template>
  <div class="search_container">
    <form action="/">
      <van-search
        v-model="searchContent"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch(searchContent)"
        @cancel="onCancel"
      />
    </form>

    <!-- 搜索建议选项分组 -->
    <van-cell-group v-if="suggestionOptions.length">
      <van-cell icon="search" v-for="item in suggestionOptions" :key="item">
        <!-- 啊,对,突然想起来模板字符串也是es6的新特性,,, -->
        <span slot="title" v-html="highLight(item)" @click="onSearch(item)"></span>
      </van-cell>
    </van-cell-group>

    <!-- 历史记录分组 -->
    <van-cell-group v-else>
      <van-cell title="历史记录">
        <div v-show="ISDelete">
          <span style="margin-right: 10px;" @click="historyRecord = []">全部删除</span>
          <span @click="ISDelete = false">完成</span>
        </div>
        <van-icon v-show="!ISDelete" slot="right-icon" name="delete" style="line-height: inherit;"  @click="ISDelete = true" />
      </van-cell>
      <van-cell :title="item" v-for="item in historyRecord" :key="item">
        <van-icon v-show="ISDelete" slot="right-icon" name="clear" style="line-height: inherit;" @click="DeleteHistoryRecord(item)" />
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
      suggestionOptions: [],

      // 管理历史记录信息的数据
      historyRecord: JSON.parse(window.localStorage.getItem('historyRecord')) || [],

      // 控制历史记录选项是否有删除的按钮数据
      ISDelete: false

    }
  },

  watch: {

    // 函数防抖写法
    searchContent: debounce(async function (newValue) {
      if (!newValue.trim().length) {
        this.suggestionOptions = []
        return
      }
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
    }, 500),

    // 监听存历史记录数据的数组的变化,一有变化则就更新下本地存储数据
    historyRecord () {
      // 调用一下把历史记录存储到本地存储的方法
      this.historyRecordSave2Local()
    }

  },

  methods: {
    // 点击搜索组件的搜索按钮触发的事件处理程序
    onSearch (searchContent) {
      // 本组件中的vantUI框架组件中的搜索框组件左面的搜索按钮点击是不会触发事件处理程序的,,,之前我还以为是不好使呢,,,原来是这样,,,
      // 是怎么样呢,,,在pc上输入完内容后回车就会出触发此事件处理程序,,,在手机上点击键盘上搜索按钮也可以触发,,,
      console.log('搜索操作')
      if (!this.searchContent.trim().length) return

      // 存历史记录  ---> 得存到本地存储的方式去进行存储历史记录数据
      // window.localStorage.setItem("键","值")
      // 如果历史记录已经存在则把这个历史记录先删除掉再添加到最前面  如果不存在直接放到最前面
      const result = this.historyRecord.findIndex(item => item === searchContent)
      // console.log(result)
      if (result === -1) {
        // 说明我这个数据不再当前数组里,那么就把它加到最前面
        this.historyRecord.unshift(searchContent)

        // 调用一下把历史记录存储到本地存储的方法
        this.historyRecordSave2Local()
      } else {
        // 当前数据在我这个数组里,则先把它删除掉,再添加到最前面
        this.historyRecord.splice(result, 1)
        this.historyRecord.unshift(searchContent)

        // 调用一下把历史记录存储到本地存储的方法
        this.historyRecordSave2Local()
      }

      // 跳转到搜索结果组件
      this.$router.push({ path: `/search/${searchContent}` })
    },

    // 点击搜索组件的取消按钮触发的事件处理程序
    onCancel () {
      console.log('取消操作')
      this.$router.back()
    },

    // 搜索关键字高亮显示
    highLight (str) {
      return str
        .toLowerCase()
        .split(this.searchContent)
        .join(`<span style="color: hotpink;">${this.searchContent}</span>`)
    },

    // 存历史记录数据到本地存储
    historyRecordSave2Local () {
      window.localStorage.setItem('historyRecord', JSON.stringify(this.historyRecord))
    },

    // 删除当前点击的历史记录数据
    DeleteHistoryRecord (currentRecord) {
      const deleteIndex = this.historyRecord.findIndex(item => item === currentRecord)
      // console.log(deleteIndex)
      this.historyRecord.splice(deleteIndex, 1)
    }

  }
}
</script>

<style lang="less" scoped>
</style>>
