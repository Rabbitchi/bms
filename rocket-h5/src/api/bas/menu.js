import request from '@/utils/request'

let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  // 代理
  baseURL = '/baseApi'
} else {
  baseURL = process.env.VUE_APP_BASE_URL
}

// 获取用户的菜单树
export function queryTreeByUserId(data) {
  return request({
    baseURL,
    url: '/menu/queryTreeByUserId',
    method: 'post',
    data
  })
}

// 刪除菜单
export function deleteMenuInfo(data) {
  return request({
    baseURL,
    url: '/menu/delete',
    method: 'post',
    data
  })
}

// 添加菜单
export function addMenuInfo(data) {
  return request({
    baseURL,
    url: '/menu/add',
    method: 'post',
    data
  })
}

// 菜单详情
export function getMenuInfo(data) {
  return request({
    baseURL,
    url: '/menu/detail',
    method: 'post',
    data
  })
}

// 更新菜单
export function editMenuInfo(data) {
  return request({
    baseURL,
    url: '/menu/edit',
    method: 'post',
    data
  })
}
