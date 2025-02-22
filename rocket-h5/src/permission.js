import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
//  迫于接口挂了，注释掉路由守卫，保证页面可以不依赖权限控制进入
const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async (to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // 用户登录后获取用户信息
//           // await store.dispatch('user/getLoginUserInfo')
//           // 获取用户菜单
//           // await store.dispatch('menu/generateRoutes', store.getters.token)

//           await store.dispatch('user/getAfterLoginInfo')

//           // hack method to ensure that addRoutes is complete
//           // set the replace: true, so the navigation will not leave a history record
//           next({ ...to, replace: true })
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.fullPath}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.fullPath}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach((to, from) => {
//   // finish progress bar
//   store.dispatch('app/changeTheme', to.meta.topMenuName)
//   store.dispatch('menu/switchModule', to.meta.topMenuName)
//   NProgress.done()
// })
