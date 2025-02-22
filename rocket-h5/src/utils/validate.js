/**
 * 公用验证方法
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 是否为手机号
 * @param str
 * @returns {boolean}
 */
export function isMobile(str) {
  return /^([7-9][0-1])\d{8}$/.test(str)
}

/**
 * 验证手机号格式
 * @param rule
 * @param value
 * @param callback
 */
export const validateMobile = (rule, value, callback) => {
  if (value == null || value === '' || isMobile(value)) {
    callback()
  } else {
    callback(
      new Error(
        'Phone number should begin with 7/8/9, followed by 0/1, and continue with eight digits'
      )
    )
  }
}

/**
 * 验证BVN格式
 * @param rule
 * @param value
 * @param callback
 */
export const validateBvn = (rule, value, callback) => {
  if (value == null || value === '' || /^\d{11}$/.test(value)) {
    callback()
  } else {
    callback(new Error('BVN type is number, size is 11'))
  }
}

/**
 * 验证是否为正整数
 * @param rule
 * @param value
 * @param callback
 */
export const validateInt = (rule, value, callback) => {
  if (value == null || value === '' || /^\d*$/.test(value)) {
    callback()
  } else {
    callback(new Error('type is number'))
  }
}

/**
 * 验证是否为BigDecimal
 * @param rule
 * @param value
 * @param callback
 */
export const validateBigDecimal = (rule, value, callback) => {
  if (value == null || value === '' || /^\d{1,16}(\.\d{0,6}|0)?$/.test(value)) {
    callback()
  } else {
    callback(new Error('type is bigDecimal'))
  }
}

/**
 * 验证Email格式
 * @param rule
 * @param value
 * @param callback
 */
export const validateEmail = (rule, value, callback) => {
  if (
    value == null ||
    value === '' ||
    /^(([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8}))+(,(([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})))*$/.test(
      value
    )
  ) {
    callback()
  } else {
    callback(new Error('type is email'))
  }
}

/**
 * 图片的数量校验，只需要校验min就行
 * @param VueInstance Vue实例
 * @return callback(rule, value, callback) => void
 */
export const validateImgSize = (VueInstance) => (rule, value, callback) => {
  const field = rule.field
  const min = VueInstance.$refs[field].$options.propsData.min
  const length = VueInstance.$refs[field].imgFileList.length
  if (length < min) {
    callback(new Error('At least ' + min + ' images should be uploaded'))
  } else {
    callback()
  }
}
