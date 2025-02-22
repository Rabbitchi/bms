import Layout from '@/layout/index'
import { deepClone } from '@/utils/tool'

/**
 * 因为后端返回的数据格式与前端要求的不一致，
 * 所以需要转换数据格式
 */
export function tranferRouter(menuList, topMenuName) {
  menuList.forEach((e) => {
    // 删除无用属性
    delete e.menuId
    delete e.parentMenuId
    delete e.bindPermissionId
    delete e.treeTopology
    delete e.publicFlag
    delete e.desc
    delete e.createTime
    delete e.createBy
    delete e.updateTime
    delete e.updateBy

    /*
     * 转换数据
     */
    // 组件名称
    if (e.componentName != null && e.componentName !== '') {
      e.name = e.componentName
    }
    delete e.componentName

    // 组件路径，动态匹配组件
    if (e.componentPath != null && e.componentPath !== '') {
      // 有可能存在路径匹配不到页面的情况，此时vue报错不明显
      // 所以自己写一个报错信息
      try {
        e.component = require('@/views/' + e.componentPath).default
      } catch (error) {
        console.log(
          '[' +
            e.componentPath +
            ']路径下的文件不存在，请检查页面路径是否配置错误！'
        )
      }
    } else {
      // 如果没有组件路径可能就是父级菜单
      e.component = Layout
      // 如果子路由只有一个也显示层级，否则就直接显示子路由而不提现自己了
      // 不懂啥意思可以搜一下https://panjiachen.github.io/vue-element-admin-site/zh/guide/essentials/router-and-nav.html
      e.alwaysShow = true
      // 父级菜单路由没有重定向，导航栏那里点击跳转有误，加上noRedirect
      e.redirect = 'noRedirect'
    }
    delete e.componentPath

    // 是否隐藏菜单
    if (e.hidden === 'Y') {
      e.hidden = true
    } else {
      delete e.hidden
    }

    // 菜单标题与图标
    if (
      e.icon != null &&
      e.icon !== '' &&
      e.menuName != null &&
      e.menuName !== ''
    ) {
      e.meta = {
        title: e.menuName,
        icon: e.icon
      }
    }
    if (
      e.menuName != null &&
      e.menuName !== '' &&
      (e.icon == null || e.icon === '')
    ) {
      e.meta = {
        title: e.menuName
      }
    }

    if (topMenuName) {
      e.meta.topMenuName = topMenuName
    }
    e.meta.name = e.name
    delete e.menuName
    delete e.icon
    if (e.children != null && e.children.length > 0) {
      // 存在子路由则递归
      tranferRouter(e.children, topMenuName)
    } else {
      delete e.children
    }
  })
  return menuList
}

export function tranferRouterLS(menuList) {
  // console.log('转换前的menu', menuList)
  let menuArr = deepClone(menuList)
  console.log('深拷贝的menu', menuArr)
  let tranferFn = function (item) {
    item.forEach((e) => {
      e.meta = {
        title: e.menuName,
        name: e.menuName,
        icon: 'list'
      }
      e.id = e.menuId
      e.name = e.menuName
      e.path = e.menuPath
      // let component = ''
      // if (e.name === '产品管理') {
      //   e.path = '/productMgt'
      //   component = Layout
      // } else if (e.name === '运营管理') {
      //   e.path = '/operationMgt'
      //   component = Layout
      // } else if (e.name === '产品列表') {
      //   e.path = 'productList'
      //   component = 'productMgt/productList'
      // } else if (e.name === '产品展示策略') {
      //   e.path = 'productDisplayStrategyList'
      //   component = 'operationMgt/productDisplayStrategyList'
      // } else if (e.name === 'Banner管理') {
      //   e.path = 'bannerMgtList'
      //   component = 'operationMgt/bannerMgtList'
      // } else if (e.name === '产品余额管理') {
      //   e.path = 'productBalanceMgtList'
      //   component = 'operationMgt/productBalanceMgtList'
      // }

      if (e.parentMenuId !== 0) {
        e.component = require('@/views/' + e.menuComponentPath).default
      } else {
        // 如果没有组件路径可能就是父级菜单
        e.component = Layout
        // 如果子路由只有一个也显示层级，否则就直接显示子路由而不提现自己了
        // 不懂啥意思可以搜一下https://panjiachen.github.io/vue-element-admin-site/zh/guide/essentials/router-and-nav.html
        e.alwaysShow = true
        // 父级菜单路由没有重定向，导航栏那里点击跳转有误，加上noRedirect
        e.redirect = 'noRedirect'
      }

      e.children = deepClone(e.childMenus)
      delete e.menuId
      delete e.menuName
      delete e.childMenus
      delete e.menuPath
      delete e.menuComponentPath
      if (e.children.length > 0) {
        // 存在子路由则递归
        tranferFn(e.children)
      } else {
        delete e.children
      }
    })
  }
  tranferFn(menuArr)

  console.log('转换后的menu', menuArr)
  return menuArr
}

// 添加本地路由
export function addLocalRoute(menus) {
  let addRouteFn = function (item) {
    item.forEach((e) => {
      if (e.menuPath === '/operationMgt') {
        e.childMenus.push({
          childMenus: [],
          menuComponentPath: 'bfs/product/BasicProductInformation',
          menuId: e.childMenus[e.childMenus.length - 1].menuId + 1,
          menuName: 'Basic product information',
          menuPath: 'BasicProductInformation',
          menuType: e.menuType + 1,
          parentMenuId: e.menuId,
          hidden: true
        })
      }
      if (e.menuPath === '/operationMgt') {
        e.childMenus.push({
          childMenus: [],
          menuComponentPath: 'bfs/product/OffsetSequencingMgt',
          menuId: e.childMenus[e.childMenus.length - 1].menuId + 1,
          menuName: 'Offset sequencing management',
          menuPath: 'OffsetSequencingMgt',
          menuType: e.menuType + 1,
          parentMenuId: e.menuId,
          hidden: true
        })
      }
      if (e.childMenus.length > 0) {
        addRouteFn(e.childMenus)
      }
    })
  }
  addRouteFn(menus)
  return menus
}
