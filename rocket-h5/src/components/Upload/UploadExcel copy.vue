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
      :on-exceed="handleExceed"
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
      default: 5
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
    overrideHttpRequest() {
      // 重写默认的上传行为
      // 但实际什么都不做，只是为了使用beforeUpload，这样可以阻止文件上传，就可以阻止文件添加到列表中
       // 使用 Axios 发送文件到后端 API
    
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
    batchImport() {
      // 上传文件
      // 1.检查文件列表中是否有且只有一个excel文件
      // 2.解析excel文件，将数据转换为json数组
      // 3.如果存在校验不通过的情况，返回错误提示；否则就开始上传文件
      if (this.excelFile == null) {
        this.$message.error('You need to select an excel file!')
        return
      }

      // 显示Loading遮罩，全屏遮罩，避免其他操作
      const loading = this.$loading({
        lock: true,
        text: 'Verify and upload the file, please wait'
      })

      // 错误信息
      let errorMsg = ''

      // 因为reader.onload方法中this指向会变化，所以需要另存一个this
      let that = this

      // 读取excel文件，并开始校验
      let reader = new FileReader()
      reader.readAsArrayBuffer(this.excelFile)
      reader.onload = function (e) {
        let data = e.target.result
        let workbook = XLSX.read(data, { type: 'array' })
        // 将sheet中的数据转换为json对象
        //let sheetIndex = workbook.SheetNames.indexOf(that.sheetName);
        let sheetJson = XLSX.utils.sheet_to_json(
          workbook.Sheets[workbook.SheetNames[0]],
          { dateNF: 'YYYY-MM-DD' }
        )
        // 检查excel数据是否正确
        if (sheetJson.length < 1) {
          // 如果没有读取到数据，就需要提示excel格式不正确了
          loading.close()
          that.$alert(
            "Can't get data from excel, please check if excel data and sheet name meets the demand",
            'error',
            {
              confirmButtonText: 'Confirm',
              dangerouslyUseHTMLString: true
            }
          )
          return
        }
        // 必输校验的数组，前端传过来的逗号分隔eg:aaa,bbb
        if (that.requiredColumns !== undefined && that.requiredColumns !== null) {
          let requiredColumnsString = that.requiredColumns.toString();
          let requiredColumnsArray = requiredColumns.split(',')

          // 继续处理 requiredColumnsString
        } else {
          console.error('that.requiredColumns is undefined or null');
          // 处理未定义或null的情况
        }
        // let requiredColumns = that.requiredColumns.toString()
        // let requiredColumnsArray = requiredColumns.split(',')
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

        // 判断重复数据
        // 通过将 sheetjson stringify 之后来判断
        // 此时的 sheetjson 数据已经经过上一步格式化，字段也都一致，故用直接 stringify 的方式来做，否则需要深拷贝
        //判断是否需要在这里去重，默认是
        if (that.needJudgeName) {
          let newJsonCheckRepeat = []
          sheetJson.forEach((arr) => {
            newJsonCheckRepeat.push(JSON.stringify(arr))
          })
          let sheetWithoutRepeat = Array.from(new Set(newJsonCheckRepeat))
          console.log(sheetWithoutRepeat)
          console.log(newJsonCheckRepeat)
          //判断某条数据是否全部重复
          if (sheetWithoutRepeat.length !== sheetJson.length) {
            loading.close()
            that.$alert(
              'You have duplicate data in Excel, please check it',
              'Error',
              {
                confirmButtonText: 'Confirm'
              }
            )
            return
          }
          //如果只是某一列重复，需要指定单独判断(如判断bvn)
          if (that.judgeRepeatName) {
            let RepeatName = that.judgeRepeatName
            let obj = {}
            let repeatBvn = []
            newJsonCheckRepeat = newJsonCheckRepeat.reduce((cur, next) => {
              let checkValue = JSON.parse(next)
              obj[checkValue[RepeatName]]
                ? repeatBvn.push(checkValue[RepeatName])
                : (obj[checkValue[RepeatName]] = true && cur.push(checkValue))
              return cur
            }, []) // 设置cur默认类型为数组，并且初始值为空的数组
            if (repeatBvn.length > 0) {
              loading.close()
              that.$alert(
                RepeatName + ':' + ' ' + repeatBvn[0] + ' 有重复数据',
                'error',
                {
                  confirmButtonText: 'Confirm',
                  dangerouslyUseHTMLString: true
                }
              )
              return
            }
          }
        }
        // 添加唯一 id，后台报错用
        if (that.addIndex) {
          sheetJson.forEach((ele, index) => (ele.num = index + 2))
        }

        // 如果错误信息为空，则表示校验通过
        if (errorMsg.length > 0) {
          loading.close()
          that.$alert(errorMsg, 'error', {
            confirmButtonText: 'Confirm',
            dangerouslyUseHTMLString: true,
            customClass: 'uploadExcel_messagebox'
          })
        } else {
          that.$emit('uploadExcel', sheetJson, loading)
        }
      }
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
.uploadExcel .el-upload,
.uploadExcel .el-upload-dragger {
  width: 100%;
}
</style>
