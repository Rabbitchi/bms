<!--
 * @Author: ruanyali yali.ruan@dexintec.com
 * @Date: 2022-05-05 15:53:06
 * @LastEditors: ruanyali yali.ruan@dexintec.com
 * @LastEditTime: 2022-05-10 11:36:08
 * @FilePath: \zeus\artemis-acm\src\views\dashboard\component\headerShow.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script>
export default {
  name: 'HeaderTitle',
  functional: true,
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { title } = context.props
    const vnodes = []
    if (title) {
      // eslint-disable-next-line jsx-quotes
      vnodes.push(
        // eslint-disable-next-line prettier/prettier
        <p slot='title' class='header-text'>
          {title}
        </p>
      )
    }
    return vnodes
  }
}
</script>
<style lang="scss" scoped>
.header-text {
  height: 60px;
  line-height: 60px;
  padding-left: 20px;
  box-sizing: border-box;
  font-size: 20px;
  color: gray;
  border-bottom: dashed 1px grey;
  margin-bottom: 20px;
}
</style>
