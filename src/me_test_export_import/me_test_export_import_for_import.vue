<template>
  <div class="test_container">
    <!-- <p>这是b的数据:   {{b}}</p> -->
    <!-- <p>这是a的数据:   {{a}}</p> -->
    <p>这是b的数据:   {{bbb}}</p>
    <p>这是a的数据:   {{aaa}}</p>
    <p>这是c的数据:   {{c}}</p>
  </div>
</template>

<script>

// import { b, a } from './me_test_export_import_for_export'
import { b as bbb, a as aaa } from './me_test_export_import_for_export'
// 测试结论 : 什么按需导入不按需导入的,,,就是个导入的形式罢了,,,给大家说 我这是按需导入  就是用{}这种形式导入罢了
// 给大家说这不是按需导入 就是默认导入把了  直接起个变量的名字而已

// 一个是默认导出  一个是指定成员导出
// 默认导出就使用一个变量接受,,,接受到的数据类型就是传递过来的数据类型
// 指定成成员导出  就必须使用导出的那个成员的变量名去接受  想改成别的变量的名字的话 使用as 关键字(其实还不是关键字)
// import c from './me_test_export_import_for_export'

export default {
  data () {
    return {
      // b,
      // a
      bbb,
      aaa
      // c
    }
  },
  created () {
    this.bbb = '我是修改后的b数据11111'
    console.log(this.c)
  }
}
</script>

<style lang="less" scoped>

</style>
