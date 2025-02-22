<template>
  <el-tabs
    v-model="activeName"
    type="card"
    style="margin-top: 5px"
    @tab-remove="removeTab"
  >
    <!-- 页面主面板，一般放list页面 -->
    <el-tab-pane
      :label="defaultTabName"
      :name="defaultTabName"
      class="elTabPane"
    >
      <slot :addtab="addTab"></slot>
    </el-tab-pane>
    <!-- 其他页面，动态引用 -->
    <el-tab-pane
      :closable="true"
      v-for="item in tabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
      class="elTabPane"
    >
      <!-- 动态组件 -->
      <component
        :ref="item.name"
        :is="item.content"
        :param="item.param"
        @removeTab="removeTab"
      ></component>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
// 此处引用自己编写的组件时请使用相对路径
export default {
  props: {
    defaultTabName: String
  },

  data() {
    return {
      tabs: [],
      activeName: ''
    }
  },

  created() {
    this.activeName = this.defaultTabName
  },

  methods: {
    // 提供给子组件的方法
    /*
     * 新增一个tab页
     * const tab = {
     *   title: 'create', // tab的标题
     *   name: 'create', // tab的别名，要求在tabs中唯一
     *   content: Create, // tab页面中的组件
     *   param: {}  // 传递到子组件的参数
     * }
     * this.$emit('addTab', tab)
     */
    addTab(tab) {
      // 先判断tab是否已经存在，不存在的才新增
      let addFlag = true
      for (const i in this.tabs) {
        if (tab.name === this.tabs[i].name) {
          addFlag = false
        }
      }
      if (addFlag) {
        this.tabs.push(tab)
      }
      this.activeName = tab.name
    },
    /*
     * 删除一个tab页面，callback字段传入执行哪个回调函数
     * callback非必填
     * this.$emit('removeTab', 'create', 'callback')
     */
    removeTab(tabName, callback) {
      // 查找并删除某个tab
      for (const i in this.tabs) {
        if (tabName === this.tabs[i].name) {
          this.tabs.splice(i, 1)
          break
        }
      }
      // 删除后回到default页面
      this.activeName = this.defaultTabName

      // 执行回调函数
      if (callback === 'refresh') {
        this.$emit('refresh')
      }
    }
  }
}
</script>

<style scoped>
.elTabPane {
  /* max-height: 782px;*/
  overflow-y: auto;
}
</style>
