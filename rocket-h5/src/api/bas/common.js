import request from '@/utils/request'

let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  // 代理
  baseURL = '/baseApi'
} else {
  baseURL = process.env.VUE_APP_BASE_URL
}

// 上传图片到S3的请求地址，上传图片组件中使用
export const uploadAction = baseURL + '/common/uploadImgToS3'

//文件上传
export const basFileUpload = function (data) {
  return request({
    baseURL,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: '/ls-mgr-api/admin/file/upload',
    data
  })
}

export function getEncryoptData(data) {
  return request({
    baseURL,
    url: '/encryption/encode',
    method: 'post',
    data
  })
}
