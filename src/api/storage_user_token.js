/**
 * 封装存储 or 获取用户token信息的apI模块
 */

const USER_KEY = 'user'

// 存储用户token方法
export var setUser = (user) =>
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))

// 获取用户token方法
export var getUser = () => JSON.parse(window.localStorage.getItem(USER_KEY))

// 抹除用户token方法   --->   退出登录时调用的方法
export var deleteUser = () => window.localStorage.removeItem(USER_KEY)
