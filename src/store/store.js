import Vue from 'vue'
import Vuex from 'vuex'
import { setUser, getUser } from '@/api/storage_user_token'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: getUser()

  },
  mutations: {
    setUser (state, user) {
      state.user = user

      // 存储用户token到本地存储防止用户刷新token丢失
      setUser(user)
    }

  },
  actions: {

  }
})
