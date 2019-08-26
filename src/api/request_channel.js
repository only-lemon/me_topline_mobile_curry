/**
 *
 *        此模块用来封装请求和频道相关的数据的方法
 *
 */

import instance from '@/utility/request_config_axios'

// 拉取当前频道数据发送的请求的方法
// 拉取当前登录用户的频道列表数据的要发送的请求的方法
export const gainUserChannels = () => {
  return instance({
    url: '/app/v1_0/user/channels',
    method: 'get'
    // 此请求不需要传参
    // data: {}
  })
}

// 获取全部频道列表数据需要发送的请求的方法
export const gainAllChannels = () => {
  return instance({
    url: '/app/v1_0/channels',
    method: 'get'
  })
}
