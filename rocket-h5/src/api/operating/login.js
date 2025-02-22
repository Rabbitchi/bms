// http://10.200.10.114:8080

import request from '@/utils/request'

let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  // 代理
  baseURL = '/baseApi'
} else {
  baseURL = process.env.VUE_APP_BASE_URL
}

export function loginPd(data) {
  return request({
    baseURL,
    url: '/pfs-web/auth/login',
    method: 'post',
    data
  })
}

// 登录后获取菜单信息
export function getLoginMenuInfo(data) {
  return request({
    baseURL,
    url: '/pfs-web/admin/info',
    method: 'post',
    data
  })
}
