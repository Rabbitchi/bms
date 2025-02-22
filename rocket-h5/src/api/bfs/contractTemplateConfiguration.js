import request from '@/utils/request'

let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  //代理
  baseURL = '/baseApi'
} else {
  // eslint-disable-next-line no-unused-vars
  baseURL = process.env.VUE_APP_BASE_URL
}

//合同列表查询
export function contractList(data) {
  return request({
    baseURL,
    url: '/pfs-web/contract/list',
    method: 'post',
    data
  })
}

//添加合同
export function contractSave(data) {
  return request({
    baseURL,
    url: '/pfs-web/contract/save',
    method: 'post',
    data
  })
}

//编辑合同
export function contractEdit(data) {
  return request({
    baseURL,
    url: '/pfs-web/contract/edit',
    method: 'post',
    data
  })
}

//删除合同
export function contractDelete(data) {
  return request({
    baseURL,
    url: '/pfs-web/contract/delete',
    method: 'post',
    data
  })
}
