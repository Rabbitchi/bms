<template>
  <div class="upload-file">
    <el-upload
      class="upload-file-uploader"
      ref="uploadFile"
      :action="action"
      :headers="headers"
      :multiple="multiple"
      :data="data"
      :name="name"
      :with-credentials="withCredentials"
      :show-file-list="showFileList"
      :drag="drag"
      :accept="accept"
      :list-type="listType"
      :auto-upload="autoUpload"
      :file-list="fileList"
      :disabled="disabled"
      :limit="limit"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      :on-progress="handleProgress"
      :on-change="handleChange"
      :before-upload="handleBeforeUpload"
      :before-remove="handleBeforeRemove"
      :on-exceed="handleExceed"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <!-- 上传提示 -->
      <div class="el-upload__tip text-center" slot="tip" v-if="showTip">
        请上传
        <template v-if="fileSize">
          大小不超过
          <b style="color: #f56c6c">{{ fileSize }}MB</b>
        </template>
        <template v-if="accept">
          格式为
          <b style="color: #f56c6c">{{ accept }}</b>
        </template>
        的文件
      </div>
    </el-upload>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'FileUpload',
  props: {
    //上传的地址
    action: {
      type: String,
      default: process.env.VUE_APP_BASE_API + '/common/upload'
    },
    //设置上传的请求头部
    headers: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {
        Authorization: 'Bearer ' + getToken()
      }
    },
    //是否支持多选文件
    multiple: {
      type: Boolean,
      default: false
    },
    //上传时附带的额外参数
    data: {
      type: Object,
      default: null
    },
    //上传的文件字段名
    name: {
      type: String,
      default: 'file'
    },
    //支持发送 cookie 凭证信息
    withCredentials: {
      type: Boolean,
      default: false
    },
    //是否显示已上传文件列表
    showFileList: {
      type: Boolean,
      default: true
    },
    //是否启用拖拽上传
    drag: {
      type: Boolean,
      default: true
    },
    //接受上传的文件类型（thumbnail-mode 模式下此参数无效）
    accept: {
      type: String,
      default: '.doc, .docx, .xls, .xlsx, .ppt, .txt, .pdf, .png, .jpg, .jpeg'
    },
    //文件列表的类型  text/picture/picture-card
    listType: {
      type: String,
      default: 'text'
    },
    //是否在选取文件后立即进行上传
    autoUpload: {
      type: Boolean,
      default: true
    },
    //上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
    // fileList: {
    //   type: Array,
    //   default: () => [],
    // },
    //是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    //最大允许上传个数
    limit: {
      type: Number,
      default: 1
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 5
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      //设置上传的请求头部
      // headers: {
      //   Authorization: 'Bearer ' + getToken(),
      // },
      fileList: [],
      butDis: true
    }
  },
  computed: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.accept || this.fileSize)
    }
  },
  methods: {
    //点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      window.open(file.url)
    },
    //文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      const findex = this.fileList.map((f) => f.name).indexOf(file.name)
      if (findex > -1) {
        this.fileList.splice(findex, 1)
      }
    },
    // 文件上传成功时的钩子
    handleUploadSuccess(res, file) {
      console.log('上传成功', res)
      this.$message.success('上传成功')
      let attName = res.attName
      let attDir = res.fileName
      let attUrl = res.url
      let attSize = res.attSize
      let attType = res.attType
      this.fileList.push({
        name: attName,
        url: attUrl,
        size: attSize,
        type: attType,
        dir: attDir
      })
    },
    // 文件上传失败时的钩子
    // eslint-disable-next-line handle-callback-err
    handleUploadError(err) {
      this.$message.error('上传失败, 请重试')
    },
    //文件上传时的钩子
    handleProgress(event, file, fileList) {},
    //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    handleChange(file, fileList) {
      this.butDis = false
    },
    //上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    handleBeforeUpload(file) {
      // 校检文件类型
      if (this.accept) {
        //文件后缀名
        let fileExtension = ''
        if (file.name.lastIndexOf('.') > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1)
        }
        let isTypeOk = this.accept.indexOf(fileExtension) > -1
        if (!isTypeOk) {
          this.$message.error(`文件格式不正确, 请上传${this.accept}格式文件!`)
          return false
        }
      }
      // 校检文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize
        if (!isLt) {
          this.$message.error(`上传文件大小不能超过 ${this.fileSize} MB!`)
          return false
        }
      }
      return true
    },
    //删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。
    handleBeforeRemove(file, fileList) {},
    // 文件个数超出
    handleExceed() {
      this.$message.error(`上传文件数量不能超过 ${this.limit} 个!`)
    },
    // 提交上传文件
    submitFile() {
      this.$emit('submitFile', this.fileList)
      this.closeFileUpload()
    },
    //关闭弹框
    closeFileUpload() {
      this.butDis = true
      this.fileList = []
      this.$emit('closeFileUpload')
    }
  }
}
</script>
<style scoped lang="scss">
.upload-file-uploader {
  margin-bottom: 5px;
}

.upload-file-list .el-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
}

.upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}

.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}
</style>
