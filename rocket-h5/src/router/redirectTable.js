//  对于某些详情页涉及到权限问题，当退出登录重新登录后不应该重新定向到原来的页面，所以这个table对象控制部分详情页的映射
export const redirectTable = {
  '/collection/taskprocessing': '/collection/taskview'
}
