<template>
  <div class="not-login">
    <div class="circle" @click="$router.push({ name: 'login' })">
      <span>登录</span>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less">
.not-login {
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  .circle {
    width: 50px;
    height: 50px;
    padding: 20px;
    background-color: red;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 20px;
  }
}
</style>
