<template>
  <el-dialog :title="title" :visible="showDialog" @close="closeUploadExcel">
    <upload-excel
      ref="UploadExcel"
      :limit="limit"
      :sheet-name="sheetName"
      :required-columns="requiredColumns"
      @uploadExcel="uploadExcel"
    >
      <slot></slot>
    </upload-excel>
    <div v-if="templateUrl" class="excel-template" @click="downloadTemplate()">
      Template file download
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:showDialog', false)">Cancel</el-button>
    </div>
  </el-dialog>
</template>

<script>
import UploadExcel from './UploadExcel'

export default {
  components: { UploadExcel },
  props: {
    title: {
      type: String,
      default: ''
    },
    showDialog: {
      type: Boolean,
      default: false
    },
    requiredColumns: {
      type: String
    },
    sheetName: {
      type: String
    },
    limit: {
      type: Number
    },
    templateUrl: {
      type: String
    }
  },
  methods: {
    closeUploadExcel() {
      // 关闭对话框的时候，调用上传子组件的清理缓存的方法
      this.$refs['UploadExcel'].clearCache()
      this.$emit('update:showDialog', false)
    },
    downloadTemplate() {
      if (this.templateUrl) {
        const url = this.templateUrl
        const a = document.createElement('a')
        a.download = 'template.xlsx'
        a.href = url
        a.click()
      }
    },
    uploadExcel(sheetJson, loading) {
      this.$emit('uploadExcel', sheetJson, loading)
    }
  }
}
</script>

<style lang="scss" scoped>
.excel-template {
  text-align: center;
  color: #409eff;
  margin-top: 50px;
  cursor: pointer;
  position: absolute;
  bottom: 30px;
  z-index: 100;
}
</style>
