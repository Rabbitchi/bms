import { queryTreeByUserId } from '@/api/bas/menu'
import { constantRoutes, notFoundRoutes } from '@/router'
import { tranferRouter } from '@/utils/router'
import router from '@/router'

const state = {
  // 当前模块名称
  currModuleName: '',
  // 模块列表
  moduleNameList: [],
  // 路由信息
  // key-moduleName, value-routerList
  routeMap: '',
  // 所有的路由信息
  // tagsView需要使用这个，其他地方是没有用到的
  routes: []
}

const mutations = {
  SET_CURR_MODULE_NAME: (state, moduleName) => {
    state.currModuleName = moduleName
  },
  SET_PARENTS_CHILDREN_TREE: (state, tree) => {
    state.parentChildrenTree = tree
  },
  SET_MODULE_NAME_LIST: (state, moduleNameList) => {
    state.moduleNameList = moduleNameList
  },
  SET_ROLE_MAP: (state, routeMap) => {
    // 不能直接传入复杂json对象，所以使用json字符串保存
    state.routeMap = JSON.stringify(routeMap)
  },
  SET_ROUTES: (state, routes) => {
    state.routes = routes
  }
}

const actions = {
  // 从后台获取菜单
  generateRoutes({ commit }, token) {
    return new Promise((resolve, reject) => {
      // 查询用户菜单
      queryTreeByUserId(token)
        .then((response) => {
          const { data } = response
          const moduleNameList = []
          const routeMap = {}
          let routes = []
          // 菜单树的根节点是root，我们的有效菜单从它的子节点开始
          const menuArray = data.children // 三个模块的菜单 system tm tm-beta
          for (const index in menuArray) {
            const item = menuArray[index]
            // 保存模块名称列表
            //过滤palmcredit暂时不需要的菜单入口 .trim()
            if (
              item.menuName !== 'SIMS' &&
              item.menuName.trim() !== 'CNCS' &&
              item.menuName !== 'LAF' &&
              item.menuName !== 'UW'
            ) {
              moduleNameList.push(item.menuName)
            }
            // 取出每个模块的菜单
            const moduleChildrenList = item.children
            // 转换菜单数据
            const moduleMenuArray = tranferRouter(
              moduleChildrenList,
              item.menuName
            )

            // 保存模块与菜单的map集合
            routeMap[item.menuName] = moduleMenuArray
            routes = routes.concat(moduleMenuArray)
          }
          commit('SET_PARENTS_CHILDREN_TREE', menuArray)
          commit('SET_CURR_MODULE_NAME', moduleNameList[0])
          commit('SET_MODULE_NAME_LIST', moduleNameList)
          commit('SET_ROLE_MAP', routeMap)
          commit(
            'SET_ROUTES',
            routes.concat(constantRoutes).concat(notFoundRoutes)
          )

          /*
           * 为什么要把404路由单独拆分出来，因为从后台加载动态路由保存到vuex中，当浏览器刷新后，vuex中的数据会全部丢失
           * 此时动态路由信息不存在，所以刷新后匹配不到路径，最终跳转到了404页面。
           *
           * 现在的解决方法就是将404路由拆分，等到动态路由加载后再进行挂载，这样就能够找到页面。
           * TODO 这种解决方法有一个缺陷是，如果真的访问一个不存在的页面，是不会跳转到404页面的，这个问题需要自己手动再匹配一次路径（后期再修复）
           *
           * ps：这种方法没有引入缓存，那么每一次刷新都会重新拉取客户信息和路由信息
           *     如果想要修改成刷新不改变路由信息，客户重新登录才改变，可以修改成使用sessionStorage缓存登录时获取的信息，
           *     刷新时先检查缓存是否存在，缓存存在用缓存，不存在才请求后台，退出登录时清空所有缓存
           *
           * 这里有一个知识点是，router在vue实例化时必须要挂载完毕，所以如果不拆分404路由，那么不存在的路径一定会先匹配到404，而不是等待动态路由的添加
           */

          // 将后台的动态路由全部挂载到router中
          router.addRoutes(routes.concat(notFoundRoutes))

          resolve()
        })
        .catch((e) => {
          reject(e)
        })
    })
  },

  // 切换模块
  switchModule({ commit }, moduleName) {
    return new Promise((resolve) => {
      commit('SET_CURR_MODULE_NAME', moduleName || 'SYSTEM')
      // 没有模块时（点击 dashboard），跳转 system 模块
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
