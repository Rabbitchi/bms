<template>
  <div class="uploadDiv clearfix">
    <slot></slot>
    <el-upload
      ref="uploadExcel"
      class="uploadExcel"
      drag
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .xlsx, .xls"
      multiple
      action="/"
      :limit="limit"
      :on-exceed="handleExceed"overrideHttpRequest
      :before-upload="handleBeforeUpload"
      :before-remove="handleBeforeRemove"
      :http-request="overrideHttpRequest"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        Drag files here, or
        <em>click here to select files</em>
      </div>
      <div class="el-upload__tip" slot="tip">
        <p>Can only upload excel files of no more than {{ maxSize }}MB</p>
        <!-- <p>Sheet Name should be {{ sheetName }} and contains columns below:</p>
        <p>{{ requiredColumns.toString() }}</p>-->
      </div>
    </el-upload>
    <el-button type="primary" class="uploadButton" @click="batchImportPre">
      {{ mainBtnText }}
    </el-button>
  </div>
</template>

<script>
// import XLSX from 'xlsx'
import * as XLSX from 'xlsx';
import axios from "axios";
import { uploadBMDFile} from "@/api/bas/user";
import { MessageBox, Message } from "element-ui";

export default {
  props: {
    // 上传文件的限制数量
    limit: Number,
    // excel的sheet名称
    sheetName: String,
    // 必输校验的字段
    requiredColumns: String,
    mainBtnText: {
      type: String,
      default: 'Upload'
    },
    //用户点击之后是否需要二次确认
    needConfirm: {
      type: Boolean,
      default: false
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    },
    confirmTitle: {
      type: String,
      default: 'Are you sure to upload this file?'
    },
    //体积限制，单位为 MB
    maxSize: {
      type: Number,
      default: 50
    },
    addIndex: {
      type: Boolean,
      default: false
    },
    //将需要判断表格数据是否重复的名称（例如bvn)传入
    judgeRepeatName: {
      type: String,
      default: ''
    },
    needJudgeName: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      excelFile: null,
      // 标识位，handleBeforeRemove中判断是否真正删除文件
      isDelete: false
    }
  },
  methods: {
    clearCache() {
      // 给父组件调用，用来清理缓存
      // 关闭对话框的时候清理文件列表
      this.$refs['uploadExcel'].clearFiles()
      this.excelFile = null
    },
    handleExceed(files, fileList) {
      this.$message.error(`Can only upload up to ${this.limit} files!`)
    },
    handleBeforeUpload(file) {
      // 添加文件的时候，需要检查文件
      // 1.文件格式是否为excel
      // 2.文件大小检查，excel小于等于2M
      // 3.是否添加了多个excel文件
      // isDelete标识位，校验失败返回false的时候设置为false，校验成功则设置为true，以此控制handleBeforeRemove方法是否真正删除文件
      console.log(file)
      if (
        file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel'
      ) {
        if (file.size / 1024 / 1024 <= this.maxSize) {
          if (this.excelFile != null) {
            this.$message.error(
              'Can only upload one excel file! You can delete it before uploading.'
            )
            this.isDelete = false
            return false
          } else {
            this.excelFile = file
            this.isDelete = true
          }
        } else {
          this.$message.error(
            `Excel file size should be less than or equal to ${this.maxSize}MB!`
          )
          this.isDelete = false
          return false
        }
      } else {
        this.$message.error('Can only upload excel files!')
        this.isDelete = false
        return false
      }
    },
    handleBeforeRemove(file, fileList) {
      // 是否在文件列表中删除文件
      // handleBeforeUpload如果返回false的时候，也会调用这个方法，所以需要一个标识位来控制是否真正删除文件
      if (
        this.isDelete &&
        (file.raw.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.raw.type === 'application/vnd.ms-excel')
      ) {
        this.excelFile = null
        this.$message.warning('You need to select a new excel file!')
      }

      this.isDelete = true
    },
    async overrideHttpRequest() {
      // 重写默认的上传行为
      // 但实际什么都不做，只是为了使用beforeUpload，这样可以阻止文件上传，就可以阻止文件添加到列表中
      // axios.post('/ent-web/web/v1/uploadBMDFile', this.excelFile, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // }).then(response => {
      //   // 处理响应数据
      //   console.log("response.data",response.data);
      // }).catch(error => {
      //   // 处理错误
      //   console.error(error);
      // });
      // const res = await uploadBMDFile();
      // console.log("create yingsuccessful-000", res);
    },
    batchImportPre() {
      let _this = this
      if (_this.needConfirm) {
        // 需要弹窗的确认的话，在 props 里添加弹窗标题及文案
        _this
          .$confirm(_this.confirmText, _this.confirmTitle, {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          })
          .then(() => {
            _this.batchImport()
          })
          .catch(() => {
            _this.$message({
              type: 'info',
              message: 'You canceled upload this file.'
            })
          })
      } else {
        //将选中的文件传到父组件(标签管理上传时需要用到)
        _this.$emit('getSelectFile', _this.excelFile)
        _this.batchImport()
      }
    },
    async batchImport() {
      // 上传文件
      // 1.检查文件列表中是否有且只有一个excel文件
      // 2.解析excel文件，将数据转换为json数组
      // 3.如果存在校验不通过的情况，返回错误提示；否则就开始上传文件
      if (this.excelFile == null) {
        this.$message.error('You need to select an excel file!')
        return
      }
      try {
        // 使用FormData来包装文件和其它数据
        const formData = new FormData();
        formData.append('file', this.excelFile);

        // 调用后端的API进行文件上传
      const response = await uploadBMDFile(formData);
      console.log("create yingsuccessful-000compontent",formData, response);
        // const response = await this.$http.post('/api/upload', formData, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data'
        //   }
        // });

        // 处理上传后的响应
        if (response.status && response.status === 200) {
          // 上传成功后的逻辑处理
          Message({
            message: "File uploaded successfully",
            type: "success",
            duration: 5 * 1000,
          });
          console.log('File uploaded successfully-200:', response.data);
        } else {
          // 上传失败后的逻辑处理
          console.error('File upload failed:', response.message);
        }
      } catch (error) {
        // 处理上传过程中出现的错误
        console.error('Error during file upload:', error);
      }
      }
      // this.$emit('uploadExcel', that.excelFile )
    
  }
}
</script>

<style scoped>
.uploadDiv {
  position: relative;
  margin-top: -15px;
}

.el-loading-spinner {
  top: 0;
  margin-top: 0;
}

.uploadButton {
  position: absolute;
  top: 297px;
  right: 220px;
  border-radius: 20px;
  /* float: right; */
  margin-bottom: 0;
  font-size: 16px;

}
</style>

<style>
/*
   * 这里的style不能加scoped，否则上传框的边框样式不生效
   * 为什么会这样，我也没有找到原因
   */
.uploadExcel .el-upload,
.uploadExcel .el-upload-dragger {
  width: 99%;
}
</style>
