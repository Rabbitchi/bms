/*
 * @Author: ruanyali yali.ruan@dexintec.com
 * @Date: 2022-05-07 15:06:45
 * @LastEditors: ruanyali yali.ruan@dexintec.com
 * @LastEditTime: 2022-05-09 15:38:24
 * @FilePath: \zeus\artemis-acm\src\utils\filter.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const vFilter = {
  numFilter: function (value) {
    // 截取当前数据到小数点后两位
    let realVal = Number(value).toFixed(2)
    return realVal
  },
  formatStatus(v) {
    // 格式化后台返回的status值
    let text = '-'
    switch (v) {
      case 1:
        text = '上架'
        break
      case 2:
        text = '下架'
        break
      default:
        break
    }
    return text
  }
}
export default vFilter
