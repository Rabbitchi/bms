import store from '@/store'
// 根据配置的接口权限来判断展示和隐藏，比如按钮绑定 v-permission="['hapmt-web.vaAccount.virtualAccountImport']" 角色权限勾选了virtualAccountImport按钮就会展示
export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const roles = store.getters && store.getters.permissionList

    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value

      const hasPermission = roles.some((role) => {
        return permissionRoles.includes(role)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
  }
}
