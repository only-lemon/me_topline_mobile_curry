import axios from 'axios'
import store from '@/store/store'
import JSONBig from 'json-bigint'

const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})

// 配置不使用axios默认json.parse去处理后端响应回来的jsjon字符串
instance.defaults.transformResponse = [(data) => {
  try {
    return JSONBig.parse(data)
  } catch (e) {
    return data
  }
}]

// -------------------------------------------------------------------------------

// 配置axios的请求拦截器,,,
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  const { user } = store.state
  if (user) config.headers.Authorization = `Bearer ${user.token}`
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// -------------------------------------------------------------------------------

// 配置axios的响应拦截器,,,
instance.interceptors.response.use(function (response) {
  // Do something with response data
  return response

  // 如果响应结果对象中有 data，则直接返回这个 data 数据
  // 如果响应结果对象中没有 data，则不作任何处理，直接原样返回这个数据
  // return response.data.data || response.data
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})

// -------------------------------------------------------------------------------

export default instance
