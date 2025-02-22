import request from '@/utils/request'

let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  // 代理
  baseURL = '/baseApi'
} else {
  baseURL = process.env.VUE_APP_BASE_URL
}

// 根据groupId获取权限树
export function queryTreeByGroupId(data) {
  return request({
    baseURL,
    url: '/permission/queryTreeByGroupId',
    method: 'post',
    data
  })
}

// 根据groupId获取权限列表
export function queryListByGroupId(data) {
  return request({
    baseURL,
    url: '/permission/queryListByGroupId',
    method: 'post',
    data
  })
}

// 通过userId获取权限树
export function queryPermissionTreeByUserId(data) {
  return request({
    baseURL,
    url: '/permission/queryTreeByUserId',
    method: 'post',
    data
  })
}

// 通过roleId获取权限树
export function queryPermissionTreeByRoleId(data) {
  return request({
    baseURL,
    url: '/permission/queryTreeByRoleId',
    method: 'post',
    data
  })
}

// 通过roleId获取权限列表
export function queryPermissionListByRoleId(data) {
  return request({
    baseURL,
    url: '/permission/queryListByRoleId',
    method: 'post',
    data
  })
}

// 同步权限列表
export function syncPermission(data) {
  return request({
    baseURL,
    url: '/permission/syncPermission',
    method: 'post',
    data
  })
}

// 查询权限同步进度
export function queryPermissionSyncProgress(data) {
  return request({
    baseURL,
    url: '/permission/queryPermissionSyncProgress',
    method: 'post',
    data
  })
}
