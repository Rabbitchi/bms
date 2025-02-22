<template>
  <el-upload
    list-type="text"
    :disabled="disabled"
    :action="action"
    :limit="max"
    :file-list="value"
    :http-request="handleUpload"
    :before-upload="handleBeforeUpload"
    :on-remove="handleRemove"
    :on-error="handleError"
    :on-exceed="handleExceed"
  >
    <el-button
      slot="trigger"
      icon="el-icon-folder"
      type="primary"
      :disabled="disabled"
    >
      Upload
    </el-button>
  </el-upload>
</template>

<script>
import { getUploadURL } from '@/api/aad/common'
import request from '@/utils/request'

export default {
  props: {
    //  上传文件列表，格式见src/components/Upload/UploadImageToS3
    value: {
      type: Array,
      default: () => []
    },
    //  是否禁止操作
    disabled: {
      type: Boolean,
      default: false
    },
    //  上传文件类型
    //  类型有则采用，无则自动判断
    fileType: {
      type: String
    },
    // 允许上传文件的最大数量
    max: {
      type: Number,
      default: 1
    },
    //  允许上传文件的最小数量
    min: {
      type: Number,
      default: 1
    },
    // 允许上传的文件大小
    maxSize: {
      type: Number
    }
  },
  data() {
    return {
      action: '', //  上传服务器的地址由接口获取
      variable: {} // 用于存放不用来展示的变量
    }
  },

  methods: {
    //  获取上传URL
    getUrl: function (name) {
      console.log(name)
      return new Promise((resolve, reject) => {
        if (!this.fileType) {
          if (/\.(gif|jpe?g|tiff|png|webp|bmp)$/i.test(name)) {
            this.fileType = 'IMAGES'
          } else if (/\.(pdf)$/i.test(name)) {
            this.fileType = 'PDF'
          } else {
            reject()
          }
        }
        const data = {
          data: {
            fileName: name,
            fileCategory: this.fileType
          }
        }
        getUploadURL(data)
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    handleBeforeUpload: function () {},

    //  自定义上传方式
    handleUpload: async function (obj) {
      const file = obj.file
      const name = file.name
      const res = await this.getUrl(name)
      const { data = {} } = res
      const { uploadUrl = '', objectKey = '' } = data
      const url = URL.createObjectURL(file)
      Object.assign(this.variable, { objectKey, url })
      // 图片数据转换后调用图片上传方法
      // 这句话只能放在方法里，因为reader.result是异步的，等数据读取完再调用方法
      request({
        url: uploadUrl,
        data: file,
        method: 'put',
        onUploadProgress: (progressEvent) => {
          // progressEvent.loaded:已上传文件大小
          // progressEvent.total:被上传文件的总大小
          // 因为我们上传的是字符串，所以非常快，于是就直接写个99算了，留一分等后台返回
          progressEvent.percent =
            (progressEvent.loaded / progressEvent.total) * 99
          obj.onProgress(progressEvent, file)
        }
      }).then((response) => {
        // 请求返回后调用上传成功方法
        this.handleSuccess(response, file)
      })
    },

    //  错误事件监听
    handleError: function () {
      this.$message.error('')
    },

    //  上传成功事件监听
    handleSuccess: function (response, file) {
      // 页面成功上传后，将图片的名称和url添加到原有的图片列表中
      const { objectKey = '', url = '' } = this.variable
      const splitArray = objectKey.split('/')
      const name = splitArray[splitArray.length - 1]
      this.$emit('success', {
        name: file.name,
        file: name,
        url: url,
        objectKey: objectKey
      })
      // this.$emit(
      //   "input",
      //   this.value.concat([
      //     {
      //       name: file.name,
      //       url
      //     }
      //   ])
      // );
    },

    //  删除文件监听
    handleRemove: function (file, fileList) {
      // 删除图片后重新赋值
      this.$emit('input', fileList)
      this.$emit('remove', file)
      console.log(file, fileList)
    },

    handleExceed: function () {
      this.$message.error(`Can only upload up to ${this.max} files!`)
    }
  }
}
</script>
