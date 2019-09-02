<template>
  <div class="user_center_container">

    <!-- 用户未登录展示的组件 -->
    <unlogin       v-if="!user" ></unlogin>
    <!-- /用户未登录展示的组件 -->

    <!-- 用户已经登录展示的组件 -->
    <userhadlogin  v-else ></userhadlogin>
    <!-- /用户已经登录展示的组件 -->

    <!-- 个人中心组件,个人中心页下的下半部分 -->
    <van-cell-group>
      <van-grid clickable>
        <van-grid-item icon="star" text="我的收藏" />
        <van-grid-item icon="chat" text="我的评论" />
        <van-grid-item icon="like" text="我的点赞" />
        <van-grid-item icon="browsing-history" text="浏览历史" />
      </van-grid>
    </van-cell-group>
    <van-cell-group>
      <van-cell title="消息通知" is-link />
      <van-cell title="用户反馈" is-link />
      <van-cell title="小智同学" is-link @click="$router.push('/chat')" />
      <van-cell title="系统设置" is-link to="/settings" />
    </van-cell-group>
    <!-- /个人中心组件,个人中心页下的下半部分 -->
  </div>
</template>

<script>
import { mapState } from 'vuex'

import UNLOGIN from '@/views/user_center/components/un_login'
import USERHADLOGIN from '@/views/user_center/components/userHadLogin'
export default {
  name: 'userCenter',
  components: {
    unlogin: UNLOGIN,
    userhadlogin: USERHADLOGIN
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style lang="less" scoped>
</style>>
