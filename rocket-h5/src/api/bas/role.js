import request from '@/utils/request'

let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  // 代理
  baseURL = '/baseApi'
} else {
  baseURL = process.env.VUE_APP_BASE_URL
}

// 获取登录角色拥有的角色列表
export function queryMyRoleList(data) {
  return request({
    baseURL,
    url: '/role/queryMyRoleList',
    method: 'post',
    data
  })
}

// 获取登录角色拥有的角色列表
export function pageList(data) {
  return request({
    baseURL,
    url: '/role/pageList',
    method: 'post',
    data
  })
}

// 添加角色
export function addRoleInfo(data) {
  return request({
    baseURL,
    url: '/role/add',
    method: 'post',
    data
  })
}
// 修改角色
export function editRoleInfo(data) {
  return request({
    baseURL,
    url: '/role/edit',
    method: 'post',
    data
  })
}

// 删除角色
export function deleteRoleInfo(data) {
  return request({
    baseURL,
    url: '/role/delete',
    method: 'post',
    data
  })
}
// 角色关联权限
export function roleLinkPermission(data) {
  return request({
    baseURL,
    url: '/role/linkPermission',
    method: 'post',
    data
  })
}

// 通过userId获取角色列表
export function queryRoleListByUserId(data) {
  return request({
    baseURL,
    url: '/role/queryRoleListByUserId',
    method: 'post',
    data
  })
}

// 切换用户角色
export function switchRole(data) {
  return request({
    baseURL,
    url: '/role/switchRole',
    method: 'post',
    data
  })
}
