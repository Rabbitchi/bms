<!--
 * @Author: your name
 * @Date: 2022-05-05 10:21:11
 * @LastEditTime: 2022-05-07 16:00:08
 * @LastEditors: ruanyali yali.ruan@dexintec.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \zeus\artemis-acm\src\views\dashboard\searchForm.vue
-->
<template>
  <div class="search-form">
    <el-form :inline="true" :model="formData">
      <el-form-item
        v-for="item in searchConfig"
        :key="item.prop"
        :label="item.label"
      >
        <!-- 文本框 -->
        <el-input
          v-if="item.type == 'input'"
          :style="item.style"
          v-model="formData[item.prop]"
          :placeholder="item.placeholder || '请输入'"
          clearable
        ></el-input>
        <!-- 下拉框 -->
        <el-select
          :style="item.style"
          v-else-if="item.type == 'select'"
          v-model="formData[item.prop]"
          :placeholder="item.placeholder || '请选择'"
          clearable
          filterable
        >
          <el-option
            v-for="optionItem in item.options"
            :key="optionItem.value"
            :label="optionItem.label"
            :value="optionItem.value"
          ></el-option>
        </el-select>
        <!-- 日期 -->
        <el-date-picker
          v-else-if="item.type == 'date'"
          :style="item.style"
          v-model="formData[item.prop]"
          :placeholder="item.placeholder || '请选择'"
          type="date"
          :value-format="item.format ? item.format : 'yyyy-MM-dd'"
          :format="item.format ? item.format : 'yyyy-MM-dd'"
        ></el-date-picker>
        <!-- 月份 -->
        <el-date-picker
          v-else-if="item.type == 'month'"
          :style="item.style"
          v-model="formData[item.prop]"
          :placeholder="item.placeholder || '请选择'"
          type="month"
          :value-format="item.format ? item.format : 'yyyy-MM'"
          :format="item.format ? item.format : 'yyyy-MM'"
        ></el-date-picker>
        <!-- 年份 -->
        <el-date-picker
          v-else-if="item.type == 'year'"
          :style="item.style"
          v-model="formData[item.prop]"
          :placeholder="item.placeholder || '请选择'"
          type="year"
          :value-format="item.format ? item.format : 'yyyy'"
          :format="item.format ? item.format : 'yyyy'"
        ></el-date-picker>
        <!-- 日期范围 -->
        <el-date-picker
          v-else-if="item.type == 'datetimerange'"
          v-model="formData[item.prop]"
          :style="item.style"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :value-format="item.format ? item.format : 'yyyy-MM'"
          :format="item.format ? item.format : 'yyyy-MM'"
          align="right"
        ></el-date-picker>
        <!-- 级联 -->
        <el-cascader
          v-else-if="item.type == 'cascader'"
          :style="item.style"
          v-model="formData[item.prop]"
          :placeholder="item.placeholder || '请选择'"
          :options="item.options"
          filterable
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click.native.prevent="search">
          查询
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    searchConfig: {
      type: Array,
      default: () => []
    },
    formData: {
      type: Object,
      default: () => {}
    }
  },
  created() {},
  data() {
    return {}
  },
  methods: {
    // 搜索
    search() {
      this.$emit('search', this.formData)
    },
    // 重置
    reset() {
      let reset_form = {}
      this.searchConfig.forEach((item) => {
        if (item.defaultValue) {
          this.$set(reset_form, item.prop, item.defaultValue)
        }
      })
      this.$emit('update:formData', JSON.parse(JSON.stringify(reset_form)))
      // 重置表单之后，调用搜索方法
      this.$nextTick(() => this.$emit('reset'))
    }
  }
}
</script>
