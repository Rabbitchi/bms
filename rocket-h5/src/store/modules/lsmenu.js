import { constantRoutes, notFoundRoutes } from '@/router'
import { tranferRouter } from '@/utils/router'
import router from '@/router'

const state = {}

const mutations = {}

const actions = {
  // 从后台获取菜单
  generateRoutesLS({ commit }, routes) {
    console.log('ls 格式化menu', routes)
    router.addRoutes(routes.concat(routes))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
