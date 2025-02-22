import request from '@/utils/request'

let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  // 代理
  baseURL = '/baseApi'
} else {
  baseURL = process.env.VUE_APP_BASE_URL
}

// 查询用户组树
export function queryTreeList() {
  return request({
    baseURL,
    url: '/group/queryTreeList',
    method: 'post'
  })
}

// 查询用户组详细信息
export function getGroupInfoByGroupId(data) {
  return request({
    baseURL,
    url: '/group/getGroupInfoByGroupId',
    method: 'post',
    data
  })
}

// 新增用户组
export function add(data) {
  return request({
    baseURL,
    url: '/group/add',
    method: 'post',
    data
  })
}

// 修改用户组详细信息
export function edit(data) {
  return request({
    baseURL,
    url: '/group/edit',
    method: 'post',
    data
  })
}

// 删除用户组
export function deleteUserGroup(data) {
  return request({
    baseURL,
    url: '/group/delete',
    method: 'post',
    data
  })
}

// 修改用户组详细信息
export function join(data) {
  return request({
    baseURL,
    url: '/group/join',
    method: 'post',
    data
  })
}

// 设置用户组权限
export function groupLinkPermission(data) {
  return request({
    baseURL,
    url: 'group/linkPermission',
    method: 'post',
    data
  })
}

// 设置用户组权限
export function detach(data) {
  return request({
    baseURL,
    url: 'group/detach',
    method: 'post',
    data
  })
}
