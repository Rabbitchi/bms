import { login, logout } from '@/api/public/public'
import { loginPd, getLoginMenuInfo } from '@/api/operating/login'
// import { getLoginUserInfo } from '@/api/bas/user'
import { tranferRouterLS, addLocalRoute } from '@/utils/router.js'
import { constantRoutes, notFoundRoutes } from '@/router'
import router from '@/router'

import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  loginName: '',
  avatar: '',
  // 用户当前角色
  currRoleId: null,

  // 用户角色列表
  roleList: [],
  // 用户权限列表
  permissionList: [],

  adminInfo: null,
  adminName: '', // 管理员名字
  // 路由信息
  // key-moduleName, value-routerList
  routeMap: '',
  // 所有的路由信息
  // tagsView需要使用这个，其他地方是没有用到的
  routes: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
    state.loginName = userInfo.loginName
    state.avatar = userInfo.avatarUrl
  },
  SET_ROLE_LIST: (state, roleList) => {
    state.roleList = roleList
  },
  SET_PERMISSION_LIST: (state, permissionList) => {
    state.permissionList = permissionList
  },

  // 设置用户角色
  SET_CURR_ROLE_ID: (state, currRoleId) => {
    state.currRoleId = currRoleId
  },
  // 设置用户信息
  SET_ADMIN_INFO: (state, adminInfo) => {
    state.adminInfo = adminInfo
    state.adminName = adminInfo.adminName
    state.loginName = adminInfo.adminName
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
  // 用户登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    let param = {
      data: {
        adminName: username.trim(),
        pwd: password
      }
    }
    return new Promise((resolve, reject) => {
      loginPd(param)
        .then((response) => {
          console.log('login')
          const { data } = response
          console.log(data)
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // 用户登录后，获取用户信息和菜单信息
  getAfterLoginInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getLoginMenuInfo({ data: {} })
        .then((response) => {
          /*const response = {
            status: { code: 0, msg: 'SUCCESS' },
            data: {
              adminVo: {
                aid: 'aid_1',
                adminName: 'Admin',
                role: 1,
                cp_id: 'cp_1',
                create_time: 1650531897323
              },
              menus: [
                {
                  menuId: 102,
                  menuName: 'Product Factory',
                  menuType: 1,
                  parentMenuId: 0,
                  childMenus: [
                    {
                      menuId: 102001,
                      menuName: 'interest rate table',
                      menuType: 2,
                      parentMenuId: 102,
                      childMenus: [],
                      menuPath: 'InterestRateTable',
                      menuComponentPath: 'bfs/product/InterestRateTable'
                    },
                    {
                      menuId: 102001,
                      menuName: 'Product Management',
                      menuType: 2,
                      parentMenuId: 102,
                      childMenus: [],
                      menuPath: 'ProductManagement',
                      menuComponentPath: 'bfs/product/ProductManagement'
                    },
                    {
                      menuId: 102002,
                      menuName: 'Cust level management',
                      menuType: 2,
                      parentMenuId: 102,
                      childMenus: [],
                      menuPath: 'CustLevelManagement',
                      menuComponentPath: 'bfs/product/CustLevelManagement'
                    },
                    {
                      menuId: 102003,
                      menuName: 'Additional Rules Management',
                      menuType: 2,
                      parentMenuId: 102,
                      childMenus: [],
                      menuPath: 'AdditionalRulesManagement',
                      menuComponentPath: 'bfs/product/AdditionalRulesManagement'
                    },
                    {
                      menuId: 102004,
                      menuName: 'Contact management',
                      menuType: 3,
                      parentMenuId: 103,
                      childMenus: [],
                      menuPath: 'ContactManagement',
                      menuComponentPath: 'bfs/product/ContactManagement'
                    },
                    {
                      menuId: 102005,
                      menuName: 'Offset management',
                      menuType: 5,
                      parentMenuId: 105,
                      childMenus: [],
                      menuPath: 'OffsetManagement',
                      menuComponentPath: 'bfs/product/OffsetManagement'
                    },
                    {
                      menuId: 102006,
                      menuName: 'Late Repayment Penalty table',
                      menuType: 6,
                      parentMenuId: 106,
                      childMenus: [],
                      menuPath: 'LateRepaymentPenaltyTable',
                      menuComponentPath: 'bfs/product/LateRepaymentPenaltyTable'
                    },
                    {
                      menuId: 102007,
                      menuName: 'Penalty interest table',
                      menuType: 7,
                      parentMenuId: 107,
                      childMenus: [],
                      menuPath: 'PenaltyInterestTable',
                      menuComponentPath: 'bfs/product/PenaltyInterestTable'
                    },
                    {
                      menuId: 102008,
                      menuName: 'Accttype',
                      menuType: 8,
                      parentMenuId: 108,
                      childMenus: [],
                      menuPath: 'Accttype',
                      menuComponentPath: 'bfs/product/Accttype'
                    }
                  ],
                  menuPath: '/operationMgt',
                  menuComponentPath: ''
                }
              ]
            }
          }*/
          const { data } = response
          if (!data) {
            reject('Verification failed, please Login again.')
          }
          console.log('menu and userinfo response data', data)
          let { adminVo, menus } = data
          commit('SET_CURR_ROLE_ID', adminVo.role)
          commit('SET_ADMIN_INFO', adminVo)

          let totalMenu = addLocalRoute(menus)
          let routes = []
          let newmenu = tranferRouterLS(totalMenu)
          routes = routes.concat(newmenu)
          commit(
            'SET_ROUTES',
            routes.concat(constantRoutes).concat(notFoundRoutes)
          )
          router.addRoutes(routes)
          console.log('登录接口返回的菜单数据', menus)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // 从 token 登录
  loginFromToken({ commit }, value) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', value)
      setToken(value)
      resolve()
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_USER_INFO', { loginName: '', avatarUrl: '' })
      commit('SET_CURR_ROLE_ID', '')
      removeToken()
      resetRouter()
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      removeToken()
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
