import axios from 'axios'
import store from '@/store/store'
import JSONBig from 'json-bigint'
import router from '@/router/router'

// token没有失效的情况下去向后端后台发送请求的,,,1号对象
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})

// 用来解决token过期时,我需要另外一个axios创建出来的对象帮我去发这次请求,,,这次的请求目的是帮我带回来新的token信息,,,
// 请求新的token数据也是一个单独的接口,有个单独的url路径,地址,path,,,,
// 为什么要使用一个新的axios创建出来的对象去帮我发送这次请求呢,,,因为之前创建出来的那个对象身上已经有配置好的一些其他的东西
// 例如,token没有失效的情况下,使用一号对象帮我去发请求,因为在它身上已经配置好拦截器,基地址等等,,,而不用一号对象发送请求的情况下
// 只有一种情况,也只用2号对象发这一个一种请求(就是请求新的token),,,so,,如果这两种情况下(情况1: token没有失效的情况下正常的请求,)
// 情况2: token失效的情况下请求新的token的请求,,,  如果这两种情况下都是用1号请求对象去发送请求的话,,,还要做复杂的判断,,,不是不可以
// 实现,,而是,,,,体现出来的就是要多写好多好多的代码,,,体现不出来的就是,,,逻辑上更加复杂,,,明明有更好的解决办法,,,
// 就是创建一个新的对象出来,,,这就是面向对象编程的思想的好处,,,这就是对象概念存在的好处,存在的意义,,,每个对象都是一个个独立的个体,
// 自己有自己的属性和行为,,,彼此之间互不影响,,,各自工作,,,各自做自己的事情,,,但众多对象大家之间又能相互配合共同完成一个复杂的工作,,,

// 再创建出来一个专门用来获取新的token,发送获取新的token的请求,,,的一个,,,对象,,,2号对象
const refreshTokenInstance = axios.create({
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
}, async function (error) {
  // Do something with response error
  const { user } = store.state
  // Do something with response error

  if (error.response && error.response.status === 401) {
    // 是否有 refresh_token，没有直接跳转登录页
    if (!user || !user.refresh_token) {
      // 在 JavaScript 模块中获取当前路由对象
      // 如果是 a 页面，那么 currentRoute 就是 a 页面的 $route
      // 如果是 n 页面，那么 currentRoute 就是 n 页面的 $route
      console.log(router.currentRoute)
      router.push({
        name: 'login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
    } else {
      // 如果有，请求获取新的 token，存储到容器中
      const { data } = await refreshTokenInstance({
        method: 'PUT',
        url: '/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })

      // 将请求到的新的 token 更新到容器中
      store.commit('setUser', {
        token: data.data.token,
        refresh_token: user.refresh_token
      })

      console.log('---------------------此处包裹的是: error错误对象的config属性上记录的是: 这一次失败的请求此次请求的配置信息数据------------')
      console.log(error.config)
      console.log('---------------------此处包裹的是: error错误对象的config属性上记录的是: 这一次失败的请求此次请求的配置信息数据------------')

      // 把原来失败的请求继续发出去
      return instance(error.config)
    }
  }

  return Promise.reject(error)
})

// -------------------------------------------------------------------------------

export default instance
