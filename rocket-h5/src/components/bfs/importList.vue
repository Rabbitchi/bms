<!--
	作者：ganshengqu
	时间：2020-06-05
	描述：文件导入
-->
<!--
	文件描述：
	(1).该组件是用于文件的上传S3（包括excel上传、图片的上传）根据importType传入的值判断；
	(2).使用该组件，将文件上传到s3，需要根据业务模板选择上传S3地址（根据isOms判断是不是OMS模块中使用的，oms中使用/file/fileUpload，其他地方使用/bas/file/fileUpload）
-->
<!--eslint-disable-->
<template>
  <div class="oms-import-list">
    <el-upload class="upload-demo" 
      ref="uploadFile" 
      :action="uploadListUrl" 
      :limit="1" 
      :on-exceed="handleExceed"    
      :on-remove="handleRemove" 
      :http-request="uploadSectionFile"
      :before-upload="handleBeforeUpload"
      :before-remove="handleBeforeRemove">
      <!--处理excel-->
      <div v-if="importType == 'excel'" style="text-align: left;">
        <el-button size="small" v-if="btnShow">{{ buttonText }}</el-button>
        <div slot="tip" class="el-upload__tip" v-if="purpose == 'push' && isUploadPhone && isOms">
          请上传包含用户电话号码Excel文档，支持xlsx和xls格式，限8M文件</div>
        <div slot="tip" class="el-upload__tip" v-else-if="purpose == 'push' && isOms">
          请上传包含用户uid和firebase_token的Excel文档，支持xlsx和xls格式,限8M</div>
        <div slot="tip" class="el-upload__tip" v-else-if="isOms && purpose == 'ad'">支持xlsx和xls格式,限8M</div>
        <div slot="tip" class="el-upload__tip" v-else-if="isOms">请上传包含用户邮箱的Excel文档，支持xlsx和xls格式,限8M</div>
      </div>
      <!--处理图片-->
      <div v-else class="img_wrap">
        <!--遮罩层-->
        <div class="mask_layer" v-if="dealImg">
          <i class="el-icon-delete" @click.stop="deleteImg"></i>
        </div>
        <img :src="dealImg" v-if="dealImg" />
        <i class="el-icon-plus" v-else></i>
      </div>
    </el-upload>
  </div>
</template>
<script>
import XLSX from 'xlsx'
import { basFileUpload } from '@/api/bas/common'
export default {
  components: {},
  props: {
    purpose: {
      type: String,
      default: ''
    },
    isUploadPhone: {
      type: Boolean,
      default: false
    },
    //判断是否是oms系统的上传
    isOms: {
      type: Boolean,
      default: true
    },
    //改变按钮的文案
    buttonText: {
      type: String,
      default: '导入'
    },
    importType: {
      type: String,
      default: ''
    },
    // 必输校验的字段
    requiredColumns: {
      type: String,
      default: ''
    },
    //接收父组件传过来的图片（返显）
    getParentImg: {
      type: String,
      default: ''
    },
    //体积限制，单位为 MB
    maxSize: {
      type: Number,
      default: 8
    }
  },
  data() {
    return {
      excelFile: null,
      uploadListUrl: '',
      uploadData: {
        file: '',
        purpose: this.purpose
      },
      img_url: '',
      btnShow: true
    }
  },
  computed: {
    //处理图片
    dealImg() {
      if (this.getParentImg && !this.img_url) {
        return this.getParentImg
      } else {
        return this.img_url
      }
    }
  },
  watch: {},
  created() {
    //需要判断是否是oms模块的文件上传
    if (this.isOms) {
      this.uploadListUrl = process.env.VUE_APP_OMS_API + '/file/fileUpload'
    } else {
      const host = window.location.host
      const baseURL = `https://${host}`
      // this.uploadListUrl = process.env.VUE_APP_BAS_API + 'bas/file/upload'
      this.uploadListUrl = baseURL + 'bas/file/upload'
    }
  },
  methods: {
    //父组件调用上传文件接口，上传失败时，调用这个方法，删除页面选定文件显示
    removeUploadFile() {
      this.clearImgEvent()
    },
    clearImgEvent() {
      this.$refs.uploadFile.clearFiles()
      this.handleRemove()
    },
    //关闭弹窗时，清除显示的图片
    clearChildrenImg() {
      this.clearImgEvent()
    },
    handleExceed(files, fileList) {
      if (this.excelFile != null) {
        this.$message.error(`Can only upload up to 1 files!`)
      }
    },
    handleBeforeUpload(file) {
      let _this = this
      //检查文件格式 仅支持上传图片格式
      if (file.type.indexOf('image') === -1) {
        _this.$message.error('仅支持上传图片格式!')
        return false
      }
      //检查文件的大小
      if (file.size / 1024 / 1024 <= _this.maxSize) {
        if (_this.excelFile != null) {
          _this.$message.error(
            'Can only upload one excel file! You can delete it before uploading.'
          )
          return false
        } else {
          //获取到本地文件
          _this.excelFile = file
          _this.btnShow = false
        }
      } else {
        let tipMsg =
          'File size should be less than or equal to' + _this.maxSize + 'MB!'
        this.$message.error(tipMsg)
        return false
      }
    },
    uploadSectionFile(params) {
      let _this = this
      let file = params.file
      //excel需要做以下判断，email时不需要校验
      if (_this.importType === 'excel') {
        //错误信息
        let errorMsg = ''
        let reader = new FileReader()
        reader.readAsArrayBuffer(_this.excelFile)
        reader.onload = function (e) {
          let data = e.target.result
          let workbook = XLSX.read(data, { type: 'array' })
          // 将sheet中的数据转换为json对象
          let sheetJson = XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]]
          )
          // 检查excel数据是否正确
          if (sheetJson.length < 1) {
            // 如果没有读取到数据，就需要提示excel格式不正确了
            _this.$alert(
              "Can't get data from excel, please check if excel data and sheet name meets the demand",
              'error',
              {
                confirmButtonText: 'Confirm',
                dangerouslyUseHTMLString: true
              }
            )
            return false
          }
          // 必输校验的数组，前端传过来的逗号分隔eg:aaa,bbb
          let requiredColumns = _this.requiredColumns.toString()
          let requiredColumnsArray = requiredColumns.split(',')
          // 去除一下空格
          for (let i in requiredColumnsArray) {
            requiredColumnsArray[i] = requiredColumnsArray[i].trim()
          }
          for (let i in sheetJson) {
            requiredColumnsArray.forEach((value) => {
              if (value) {
                if (
                  sheetJson[i][value] === undefined ||
                  sheetJson[i][value] === ''
                ) {
                  errorMsg =
                    errorMsg +
                    'line' +
                    (parseInt(i) + 2) +
                    ' : ' +
                    value +
                    ' cannot be empty <br/>'
                }
              }
            })
          }
          // 如果错误信息为空，则表示校验通过
          if (errorMsg.length > 0) {
            _this.$alert(errorMsg, 'error', {
              confirmButtonText: 'Confirm',
              dangerouslyUseHTMLString: true,
              callback: (action) => {
                //删除页面显示的上传文件显示
                _this.clearImgEvent()
              }
            })
          } else {
            //验证都通过，才请求接口
            _this.uploadFileEvent(file)
          }
        }
      } else {
        //本地读取图片回显
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (result) => {
          _this.img_url = result.target.result
        }
        //调用接口上传图片
        _this.uploadFileEvent(file)
      }
    },
    uploadFileEvent(file) {
      let _this = this
      let formData = new FormData()
      formData.append('file', file)
      basFileUpload(formData)
        .then((res) => {
          _this.$emit('getBinaryData', {
            fileUrl: res.data.file_url,
            fileName: file.name,
            absoluteUrl: res.data.absoluteUrl
          })
        })
        .catch((e) => {
          console.log('error')
        })
    },
    handleBeforeRemove(file, fileList) {
      // 是否在文件列表中删除文件
      // handleBeforeUpload如果返回false的时候，也会调用这个方法，所以需要一个标识位来控制是否真正删除文件
      if (
        file.raw.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.raw.type === 'application/vnd.ms-excel'
      ) {
        this.excelFile = null
        this.btnShow = true
        this.$message.warning('You need to select a new excel file!')
      }
    },
    handleRemove() {
      this.excelFile = null
      this.btnShow = true
      this.img_url = ''
      //删除清空
      this.$emit('getBinaryData', {
        fileUrl: '',
        fileName: '',
        absoluteUrl: ''
      })
      //清除选定图片时，取消父组件带过来的，需要返显的图片（在短信管理模块)
      this.$emit('cancelPictureShow', false)
    },
    deleteImg() {
      this.clearImgEvent()
    }
  }
}
</script>

<style lang="scss" scoped>
.oms-import-list {
  width: 100%;

  /deep/ .el-upload-list__item:first-child {
    margin-top: 0;
  }

  /deep/ .el-upload__tip {
    margin-top: 0;
    color: red;
  }

  .mask_layer {
    cursor: auto;
    display: none;
    width: 100%;
    height: 100%;
    background: #000000;
    opacity: 0.6;
    position: absolute;
    left: 0;
    top: 0;

    .el-icon-delete {
      font-size: 30px;
      color: #ffffff;
      position: relative;
      z-index: 10;
      cursor: pointer;
    }
  }

  .img_wrap:hover .mask_layer {
    display: block;
  }

  .img_wrap {
    width: 150px;
    height: 150px;
    border: 1px dashed #c1c1c1;
    border-radius: 10px;
    overflow: hidden;
    line-height: 150px;
    text-align: center;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .el-button {
      border: 0;
      outline: none;
    }
  }

  /deep/ .el-upload-list .el-upload-list__item {
    background-color: #f5f7fa;
    padding: 3px 10px;
    border-radius: 8px;
  }

  /deep/
    .el-upload-list
    .el-upload-list__item
    .el-upload-list__item-status-label {
    top: 5px;
  }

  /deep/ .el-upload-list .el-upload-list__item .el-icon-close {
    top: 5px;
  }

  /deep/ .el-upload-list--text {
    margin-top: -5px;
    margin-bottom: 5px;
  }
}
</style>
