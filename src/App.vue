<template>
  <div id="app">

    <p id="sole">Please start your performance</p>
    <!-- 一个路由规则只服务于一个组件 -->

    <!-- 更灵活的方式,,,组件缓存 -->
    <keep-alive :include="['tabbar']">
      <router-view></router-view>
    </keep-alive>
    <!-- /更灵活的方式,,,组件缓存 -->
  </div>
</template>

<script>
export default {
  name: 'APPLICATION'
}
</script>

<style lang="less">
#sole{
  color:purple;
  text-align: center;
  font-size: 0.6rem;
}
</style>
