import request from '@/utils/request'

let baseURL = ''
if (process.env.NODE_ENV === "development") {
  // 代理
  baseURL = '/baseApi'
} else {
  baseURL = process.env.VUE_APP_BASE_URL
}

// 登录
export function login(data) {
return request({
    baseURL,
    url: '/public/login',
    method: 'post',
    data
})
}

// 退出登录
export function logout() {
return request({
    baseURL,
    url: '/public/logout',
    method: 'post'
})
}
