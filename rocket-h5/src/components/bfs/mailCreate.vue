<!--
	作者：ganshengqu
	时间：2020-05-26
	描述：邮件管理。创建/编辑
-->
<template>
  <div class="create-dialog">
    <el-dialog
      title="创建/编辑"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      :before-close="dialogClose"
    >
      <!--服务消息-->
      <el-form
        ref="emailForm"
        :rules="emailFormRules"
        :model="emailForm"
        label-width="100px"
        class="clearfix"
      >
        <el-form-item label="邮件标题" prop="emailTitle">
          <el-input v-model="emailForm.emailTitle"></el-input>
        </el-form-item>
        <el-form-item label="邮件内容" :required="true">
          <!--邮件内容 emailForm.emailContent -->
          <TinymceEditor
            @getContent="getContent"
            :clearContent="clearContent"
          />
        </el-form-item>
        <el-form-item label="所属业务" prop="businessLine" class="special">
          <el-select v-model="emailForm.businessLine" placeholder="请选择">
            <el-option
              v-for="(item, index) in productList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发件人邮箱" prop="senderEmail" class="special">
          <el-select v-model="emailForm.senderEmail" placeholder="请选择">
            <el-option
              :label="item.senderMailbox"
              :value="item.senderMailbox"
              v-for="item in senderEmailList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发送类型" prop="startType" class="special_item">
          <el-radio-group v-model="emailForm.startType" size="medium">
            <el-radio border label="INSTANT">即时发送</el-radio>
            <el-radio border label="TIMING">定时发送</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户群体" :required="true" class="special_item">
          <el-radio-group v-model="importStatus" size="medium">
            <el-radio border label="1">导入名单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          class="sending_time"
          label="定时发送"
          v-if="emailForm.startType == 'TIMING'"
          prop="sendTime"
        >
          <el-date-picker
            v-model="emailForm.sendTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions"
            format="yyyy-MM-dd HH:mm"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item class="import_list" v-if="importStatus == '1'">
          <ImportList
            @getBinaryData="getBinaryData"
            purpose="email"
            importType="excel"
            requiredColumns="Email"
          />
        </el-form-item>
        <el-form-item size="large" class="dialog_bottom">
          <el-button
            type="primary"
            @click="onSubmit('emailForm')"
            :disabled="emailForm.fileUrl == ''"
          >
            提交
          </el-button>
          <el-button type="primary" @click="exportTemplate">
            导出email模板
          </el-button>
          <el-button @click="cancelDailog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.create-dialog {
  width: 100%;
  /deep/ .el-dialog__header {
    text-align: center;
    padding-bottom: 0;
  }
  /deep/ .el-dialog {
    border-radius: 5px;
  }
  /deep/ .el-dialog__body {
    padding-top: 10px;
  }
  /deep/ .el-tabs__item {
    height: 40px;
    line-height: 40px;
  }
  /deep/ .el-tabs--border-card > .el-tabs__content {
    padding-top: 25px;
  }
  /deep/ .typeDelivery {
    .el-radio {
      margin-right: 0;
    }
  }
  /deep/ .sending_time {
    width: 50%;
    min-height: 40px;
    float: left;
  }
  /deep/ .import_list {
    width: 50%;
    float: right;
    margin-bottom: 0;
    .el-form-item__content {
      margin-left: 4% !important;
    }
    .import_line {
      width: 100%;
      height: 40px;
      .file_type {
        font-size: 14px;
        color: #000000;
        margin-left: 20px;
      }
      .total_list {
        float: right;
        font-size: 14px;
        color: #000000;
      }
    }
  }
  /deep/ .dialog_bottom {
    width: 100%;
    float: left;
  }
  /deep/ .special {
    width: 40%;
    display: inline-block;
  }
  /deep/ .special_item {
    width: 40%;
    display: inline-block;
    .el-radio {
      margin-right: 0px;
    }
  }
}
</style>

<script>
import TinymceEditor from '@/components/TinymceEditor'
import ImportList from '@/components/bfs/importList'
import { mapGetters } from 'vuex'
import { createMarketingEmail } from '@/api/bfs/letterManagement'
import { getProduct } from '@/api/mkt/stragety.js'
export default {
  components: { TinymceEditor, ImportList },
  props: {
    dialogShow: {
      type: Boolean,
      default: false
    },
    senderEmailList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data() {
    return {
      productList: [],
      emailForm: {
        emailTitle: '',
        emailContent: '',
        businessLine: '',
        senderEmail: '',
        startType: '',
        sendTime: '',
        creater: '',
        fileUrl: '',
        userGroup: ''
      },
      importStatus: '',
      emailFormRules: {
        emailTitle: [
          { required: true, message: '请输入邮件标题', trigger: 'blur' },
          { min: 1, trigger: 'blur' }
        ],
        emailContent: [
          { required: true, message: '请填写邮件内容', trigger: 'blur' },
          { min: 1, trigger: 'blur' }
        ],
        businessLine: [
          { required: true, message: '请选择所属业务', trigger: 'change' }
        ],
        senderEmail: [
          { required: true, message: '请选择发件人邮箱', trigger: 'change' }
        ],
        startType: [
          { required: true, message: '请选择发送类型', trigger: 'change' }
        ],
        sendTime: [
          { required: true, message: '请选择发送时间', trigger: 'change' }
        ],
        userGroup: [
          { required: true, message: '请选择用户群体', trigger: 'change' }
        ]
      },
      clearContent: false,
      // 设置只能选择当前日期及之后的日期
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7 //如果没有后面的-8.64e7就是不可以选择今天的
        }
      }
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  watch: {
    //监听发送类型，当选中即时发送时，sendTime赋值当前时间
    'emailForm.startType'(value) {
      if (value === 'INSTANT') {
        this.emailForm.sendTime = this.formatTime()
        console.log(this.emailForm.sendTime)
      }
    },
    dialogShow(val) {
      if (val) this.getProduct()
    }
  },
  created() {
    // this.productList = [
    //   "PalmCredit",
    //   "EasyBuy",
    //   "NewCredit",
    //   "Xcrosscash",
    //   "Xcash",
    //   "PC-XCross",
    //   "EB-XCross"
    // ]
    // this.getProduct();
  },
  methods: {
    // 获取业务线枚举
    getProduct() {
      let arr = JSON.parse(sessionStorage.getItem('omsProList'))
      if (arr && arr.length > 0) {
        this.productList = arr
      } else {
        getProduct().then((res) => {
          this.productList = res.data
          sessionStorage.setItem('omsProList', JSON.stringify(this.productList))
          // JSON.parse(sessionStorage.getItem('omsProList'))
        })
      }
    },
    //导出模板
    exportTemplate() {
      import('@/vendor/Export2Excel')
        .then((excel) => {
          const tHeader = ['Email', 'uid', 'cid']
          const filterVal = ['Email', 'uid', 'cid']
          let responseData = [{ uid: '', cust_id: '', firebase_token: '' }]
          const data = this.formatJson(filterVal, responseData)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'Email模板'
          })
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    formatJson(filterVal, jsonData) {
      console.log(filterVal)
      console.log(jsonData)
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j]
        })
      )
    },
    formatTime() {
      const formatNumber = (n) => {
        n = n.toString()
        return n[1] ? n : '0' + n
      }
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      return (
        [year, month, day].map(formatNumber).join('-') +
        ' ' +
        [hour, minute].map(formatNumber).join(':')
      )
    },
    //获取上传的excel表，返回的url
    getBinaryData(data) {
      this.emailForm.fileUrl = data.fileUrl
    },
    onSubmit(formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.emailForm.creater = _this.name
          let data = {
            data: _this.emailForm,
            page: {
              pageNum: 1,
              pageSize: 50,
              startIndex: 0,
              totalPage: 0,
              totalRecord: 0
            }
          }
          createMarketingEmail(data)
            .then((res) => {
              console.log(res)
              _this.clearDailogData()
              _this.$emit('createdSuccess', false)
            })
            .catch((e) => {
              console.log('error')
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //清空弹窗数据
    clearDailogData() {
      //清空弹窗校验
      let _this = this
      let obj = _this.emailForm
      Object.keys(obj).forEach((key) => (obj[key] = ''))
      _this.$refs['emailForm'].resetFields()
      _this.importStatus = ''
      _this.clearContent = true
    },
    cancelDailog() {
      this.$emit('cancelDailog', false)
      this.clearDailogData()
    },
    dialogClose() {
      this.$emit('cancelDailog', false)
      this.clearDailogData()
    },
    getContent(content) {
      this.emailForm.emailContent = content
    }
  }
}
</script>
