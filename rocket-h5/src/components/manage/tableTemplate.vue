<!--
 * @Author: your name
 * @Date: 2022-05-05 11:09:31
 * @LastEditTime: 2022-05-10 17:25:11
 * @LastEditors: ruanyali yali.ruan@dexintec.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \zeus\artemis-acm\src\views\dashboard\tableTemplate.vue
-->
<template>
  <section>
    <!-- 其他操作 -->
    <section
      style="margin-bottom: 22px"
      v-if="handlerBtnConfig && handlerBtnConfig.length > 0"
    >
      <template v-for="item in handler_config">
        <el-button
          :type="item.type"
          :key="item.index"
          v-bind="{ ...item }"
          @click="
            item.handler(
              {
                page_index: table_config.pagination_config.page_index,
                page_size: table_config.pagination_config.page_size,
                ...form_data
              },
              multipleSelection
            )
          "
        >
          {{ item.label }}
        </el-button>
      </template>
    </section>
    <!-- 列表 -->
    <section>
      <el-table
        ref="table"
        :border="table_config.border"
        :data="tableData"
        :stripe="table_config.stripe"
        :height="table_config.height"
        :max-height="table_config.maxHeight"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
        :default-sort="table_config.defaultSort"
      >
        <!-- template循环的时候不需要key值 -->
        <template v-for="item in this.table_config.thead">
          <!-- 多选列 -->
          <el-table-column
            v-if="item.type == 'selection'"
            type="selection"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            v-bind="{ ...item }"
            :show-overflow-tooltip="table_config.showOverflowTooltip"
          ></el-table-column>
          <!-- 列的类型为function ，适用于一些禁用启用的字体展示-->
          <el-table-column
            v-else-if="item.type == 'function'"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            v-bind="{ ...item }"
            :show-overflow-tooltip="table_config.showOverflowTooltip"
          >
            <template slot-scope="scope">
              <!-- 下面的渲染也可以写成v_html形式，这样就可以识别一些换行符，callback的参数把当前行，以及当前字段都返回了 -->
              <!-- <span v-html="item.callback && item.callback(scope.row, scope.row[item.prop])"></span> -->
              <span>
                {{
                  item.callback &&
                  item.callback(scope.row, scope.row[item.prop])
                }}
              </span>
            </template>
          </el-table-column>
          <!-- 当使用插槽的时候， 适用于一些其他标签在表格中的展示 -->
          <el-table-column
            v-else-if="item.type == 'slot'"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            v-bind="{ ...item }"
            :show-overflow-tooltip="table_config.showOverflowTooltip"
          >
            <template slot-scope="scope">
              <slot :name="item.slotName" :row="scope.row"></slot>
            </template>
          </el-table-column>
          <!-- 为普通文本的时候 -->
          <el-table-column
            v-else
            :key="item.prop"
            :label="item.label"
            v-bind="{ ...item }"
            :show-overflow-tooltip="table_config.showOverflowTooltip"
          ></el-table-column>
        </template>
      </el-table>
    </section>
    <section
      class="pagination-container"
      v-if="table_config.pagination_config.isShow"
    >
      <el-pagination
        v-if="table_config.pagination_config.total > 0"
        :background="table_config.pagination_config.background"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="table_config.pagination_config.page_index"
        :page-sizes="table_config.pagination_config.page_sizes"
        :page-size="table_config.pagination_config.page_size"
        :layout="table_config.pagination_config.layout"
        :total="table_config.pagination_config.total"
        :prev-text="table_config.pagination_config.prevText"
        :next-text="table_config.pagination_config.nextText"
        :small="table_config.pagination_config.small"
      ></el-pagination>
    </section>
  </section>
</template>

<script>
// import { GetTableData } from "@/api/common";
// import SearchForm from "@/common/SearchForm/index.vue";
// import { handleListParams } from "@/utils/util.js";
export default {
  name: 'TableTemplate',
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    searchConfig: {
      type: Array,
      default: () => []
    },
    handlerBtnConfig: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    }
  },
  created() {
    this.loadData()
  },
  data() {
    return {
      // 下面是列表的配置文件
      table_config: {
        showOverflowTooltip: true, // 是否超出隐藏
        border: true, // 是否有边框
        stripe: false, // 是否显示斑马线形式
        height: undefined, // 表格高度
        maxHeight: undefined, // 表格的最大高度
        defaultSort: undefined, // 排序的默认规则
        thead: [
          // 表头的配置项
          {
            // lable: "", // 表头文字
            // porp: "", // 对应的prop
            // type: "", // type有function(回调形式,用于处理由0,1或者true,false展示的禁用启用等其他文字) slot(自定义插槽) selection(多选框),如果需要需要的话,可以通过回调的形式处理
            // slotName: "", // 当type为slot时,改字段为必填,
            // width: "", // 宽度
            // align: "", // 对齐方式
            // fixed: "", // 是否固定
            // sortable: "",  // 三种模式,默认为false  false 不排序 true当前数据进行拍序  custom 自定义排序方法与sort-change一起使用,
          }
        ],
        url: '', // 表格请求的地址
        pagination_config: {
          // 下面是分页的配置
          isShow: true, // 是否展示
          background: true, // 是否展示背景色
          small: false, // 是否为小型分页
          prevText: '', // 上一页箭头可以替换的文字
          nextText: '', // 下一页箭头可以替换的问题
          page_size: 10,
          page_index: 1,
          pageSizes: [10, 20, 30, 40, 50], // 选择分页请求的个数
          layout: 'total, sizes, prev, pager, next, jumper', // 分页的全部功能
          total: 0
        }
      },
      loading: false,
      multipleSelection: [],
      form_data: {}, // 搜索表单
      handler_config: [] // 操作按钮的配置
    }
  },
  methods: {
    // 初始话form表单
    initForm(searchConfig) {
      searchConfig.forEach((item) => {
        if (item.defaultValue) {
          this.$set(this.form_data, item.prop, item.defaultValue)
        }
      })
    },
    // 初始化table配置
    initConfig() {
      for (let key in this.config) {
        if (Object.keys(this.table_config).includes(key)) {
          if (key === 'pagination_config') {
            this.table_config[key] = {
              ...this.table_config[key],
              ...this.config[key]
            }
          } else {
            this.table_config[key] = this.config[key]
          }
        }
      }
      // 初始化配置之后，获取列表
      // console.log("初始化table");
    },
    // 获取列表
    loadData(paramsData = {}) {
      this.loading = true
      let url = this.table_config.url
      let params = {}
      // 下面处理一下请求的参数
      // 如果分页存在的话 加上分页参数
      if (this.table_config.pagination_config.isShow) {
        params = {
          ...params,
          ...{
            page_size: this.table_config.pagination_config.page_size,
            page_index: this.table_config.pagination_config.page_index
          }
        }
      }
      // 如果排序存在的话,加上默认排序参数
      if (this.table_config.defaultSort) {
        params = {
          ...params,
          ...{
            sort: this.table_config.defaultSort.prop,
            sortType: this.table_config.defaultSort.order
          }
        }
      }
      // 如果有搜索表单的话，加上表单数据
      if (this.searchConfig.length > 0) {
        params = { ...params, ...this.form_data }
      }
      // 处理传进来的参数
      params = { ...params, ...paramsData }
      // GetTableData(url, params) // 不使用这个的原因是，要处理参数。比如把时间数组处理成字符串。
      //   GetTableData(url, handleListParams(params, this.searchConfig))
      //     .then((res) => {
      //       if (res.code == 200) {
      //         this.table_data = res.data;
      //       }
      //       this.table_data = res.rows;
      //       this.table_config.pagination_config.total = res.total;
      //     })
      //     .finally(() => (this.loading = false));
    },
    // page_size改变
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val)
    },
    // page_index改变
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val)
    },
    // 多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 远程排序事件
    sortChange({ prop, order }) {
      this.loadData({
        sort: prop,
        sortType: order
      })
    }
  },
  watch: {
    // 下面是进行初始化设置，以及初始化form_data数据。必须设置immediate为true,这样我们才可以在created钩子函数中，使用初始值
    searchConfig: {
      handler(newVal) {
        this.initForm(newVal)
      },
      immediate: true,
      deep: true
    },
    config: {
      handler(newVal) {
        this.initConfig(newVal)
      },
      immediate: true,
      deep: true
    },
    handlerBtnConfig: {
      handler(newVal) {
        this.handler_config = newVal
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-container {
  text-align: right;
  margin: 20px;
}
</style>
