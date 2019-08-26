/**
 *        此模块用来封装请求和用户相关的数据的方法
 */

import instance from '@/utility/request_config_axios'

// 用户点击登录对应发送的请求方法   --->   获取用户登录信息
export var login = (requestParams) => {
  return instance({
    url: '/app/v1_0/authorizations',
    method: 'post',
    data: requestParams
  })
}

// 拉取当前登录用户的频道列表数据的要发送的请求的方法
export const gainUserChannels = () => {
  return instance({
    url: '/app/v1_0/user/channels',
    method: 'get'
    // 此请求不需要传参
    // data: {}
  })
}
