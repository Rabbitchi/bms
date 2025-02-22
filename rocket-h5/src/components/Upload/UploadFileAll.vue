<!--
	可扩展文件类型，上传文件file，非json
-->
<template>
  <div class="uploadDiv clearfix">
    <slot></slot>
    <el-upload
      ref="uploadFiles"
      class="uploadFiles"
      drag
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .xlsx, .xls"
      multiple
      action="/"
      :limit="limit"
      :on-exceed="exceedLimit"
      :on-change="fileChange"
      :on-remove="fileRemove"
      :http-request="stopAction"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        Drag files here, or
        <em>click here to select files</em>
      </div>
      <div class="el-upload__tip" slot="tip">
        <p>Can only upload excel files of no more than {{ maxSize }}MB</p>
      </div>
    </el-upload>
    <el-button type="primary" class="uploadButton" @click="submit">
      {{ btnText }}
    </el-button>
  </div>
</template>

<script>
export default {
  props: {
    // 上传文件的限制数量
    limit: Number,
    btnText: {
      type: String,
      default: 'Upload'
    },
    //体积限制，单位为 MB
    maxSize: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      fileArr: []
    }
  },
  methods: {
    // 超出限制数量
    exceedLimit(files, fileList) {
      this.$message.error(`Can only upload up to ${this.limit} files!`)
    },
    // 添加文件回调
    fileChange(file, fileList) {
      if (
        file.raw.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.raw.type === 'application/vnd.ms-excel'
      ) {
        if (file.size / 1024 / 1024 <= this.maxSize) {
          this.fileArr = fileList
        } else {
          this.$message.error(
            `Excel file size should be less than or equal to ${this.maxSize}MB!`
          )
          this.$refs.uploadFiles.handleRemove(file)
        }
      } else {
        this.$message.error('Can only upload excel files!')
        this.$refs.uploadFiles.handleRemove(file)
      }
    },
    // 删除回调
    fileRemove(file, fileList) {
      this.fileArr = fileList
      console.log(fileList)
    },
    // 阻止上传默认提交行为
    stopAction() {
      // 必选，阻止action提交
    },
    submit() {
      console.log(this.fileArr)
      if (this.fileArr.length === 0) {
        this.$message.error('You need to select an excel file!')
        return
      }
      // 返回文件
      this.$emit('uploadData', this.fileArr)
    }
  }
}
</script>

<style scoped>
.uploadDiv {
  margin-top: -15px;
}

.el-loading-spinner {
  top: 0;
  margin-top: 0;
}

.uploadButton {
  float: right;
  margin-bottom: 0;
}
</style>

<style>
/*
   * 这里的style不能加scoped，否则上传框的边框样式不生效
   * 为什么会这样，我也没有找到原因
   */
.uploadFiles .el-upload,
.uploadFiles .el-upload-dragger {
  width: 100%;
}
</style>
