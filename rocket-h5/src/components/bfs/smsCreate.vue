<!--
	作者：ganshengqu
	时间：2020-07-06
	描述：短信创建
-->
<template>
  <div class="create-dialog">
    <el-dialog
      :title="setTitle"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      :before-close="dialogClose"
      :append-to-body="false"
      :modal-append-to-body="false"
    >
      <el-form
        ref="smsCreateform"
        :rules="formRules"
        :model="formObj"
        label-width="100px"
      >
        <!-- <el-form-item label="短信标题" prop="smsTitle" class="item_sms_title" :required="true">
          <el-input v-model="formObj.smsTitle" maxlength="50" :disabled="disabledStatus"></el-input>
          <span class="word_tip">{{ formObj.smsTitle.length }}/50</span>
        </el-form-item>
        <el-form-item label="短信内容" prop="smsContent" class="item_sms_content" :required="true">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            :disabled="disabledStatus"
            maxlength="320"
            v-model="formObj.smsContent"
            :autosize="{ minRows: 2, maxRows: 4}"
          ></el-input>
          <span
            class="word_tip"
            :class="formObj.smsContent.length>160? 'changeColor': ''"
          >{{ formObj.smsContent.length }}/320</span>
        </el-form-item> -->
        <el-form-item label="短信模板" prop="smsTitle">
          <el-input
            class="showTemSms"
            v-model="formObj.smsTitle"
            placeholder="请选择"
            :disabled="true"
          >
            <el-button
              :class="{ selectSms: !disabledStatus }"
              slot="append"
              @click.stop="changeStragety"
              :disabled="disabledStatus"
            >
              选择
            </el-button>
          </el-input>
          <el-button
            size="medium"
            class="btn create-tem-btn"
            type="text"
            :disabled="disabledStatus"
            @click="previewTem"
          >
            预览
          </el-button>
          <el-button
            size="medium"
            class="btn create-tem-btn"
            type="text"
            :disabled="disabledStatus"
            @click="templateDisplay(true)"
          >
            创建短信模板
          </el-button>
        </el-form-item>
        <el-form-item label="所属业务" prop="businessLine">
          <el-select
            v-model="formObj.businessLine"
            placeholder="请选择"
            :disabled="disabledStatus"
          >
            <el-option
              v-for="(item, index) in productList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="发送渠道" prop="smsChannel">
          <el-select v-model="formObj.smsChannel" placeholder="请选择" :disabled="disabledStatus">
            <el-option label="infobip" value="infobip"></el-option>
            <el-option label="africas talking" value="africas talking"></el-option>
            <el-option label="nexmo" value="nexmo"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="发送类型" prop="startType">
          <el-radio-group
            v-model="formObj.startType"
            size="medium"
            :disabled="disabledStatus"
          >
            <el-radio border label="INSTANT">即时发送</el-radio>
            <!-- <el-radio border label="TIMING">定时发送</el-radio> -->
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="定时发送" v-if="formObj.startType=='TIMING'" prop="startTime">
          <el-date-picker
            v-model="formObj.startTime"
            :disabled="disabledStatus"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions"
            format="yyyy-MM-dd HH:mm"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item> -->
        <el-form-item v-if="!disabledStatus" label="选择名单" prop="batchNo">
          <el-button
            size="small"
            class="userSelect"
            @click.stop="selectList"
            :disabled="disabledStatus"
          >
            选择
          </el-button>
          <span class="userSelectTXT">{{ formObj.batchNo }}</span>
        </el-form-item>
        <el-form-item v-else label="用户群体" prop="userGroup">
          <el-radio-group
            v-model="formObj.userGroup"
            size="medium"
            :disabled="disabledStatus"
          >
            <el-radio border label="filted">筛选用户</el-radio>
            <el-radio border label="specified">导入名单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label
          v-if="formObj.userGroup == 'filted' && !disabledStatus"
        >
          <el-button type="primary" @click="userFiltrateClick">
            请筛选
          </el-button>
          <span
            v-if="
              formObj.userGroup == 'filted' &&
              filterUserTotal &&
              formObj.fileUrl
            "
            class="userTotal"
          >
            名单数量：&nbsp;
            <span class="bold">{{ filterUserTotal }}</span>
          </span>
        </el-form-item>
        <el-form-item
          label
          v-if="formObj.userGroup == 'specified' && !disabledStatus"
        >
          <ImportList
            @getBinaryData="getBinaryData"
            purpose="sms"
            importType="excel"
            :isUploadPhone="true"
            requiredColumns="phone"
          />
        </el-form-item>
        <el-form-item size="large">
          <el-button
            v-if="disabledStatus"
            type="primary"
            @click="onSubmit('smsCreateform')"
            :disabled="formObj.fileUrl == ''"
          >
            提交
          </el-button>
          <el-button
            v-else
            type="primary"
            @click="onSubmit('smsCreateform')"
            :disabled="formObj.batchNo == ''"
          >
            提交
          </el-button>
          <el-button @click="cancelDailog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--筛选用户弹出框-->
    <FilterUsersDailog
      :filterUserDialog="filterUserDialog"
      @filterUserDailogClose="filterUserDailogClose"
      @successFilter="successFilter"
      isSmsFilter="sms"
    />
    <!-- 创建短信模板 -->
    <createSMSDialog
      @cancelDailog="templateDisplay(false)"
      :dialogShow="createSMSDialogShow"
      @createdSuccess="getListItem"
      :actionType="actionType"
      :actionID="currentActionID"
    />
    <!-- 选择短信模板 -->
    <StragetySelector
      :stragetyType="stragetyType"
      :showDialog.sync="showDialog"
      @templateChanged="changeCurrentTemplate"
    ></StragetySelector>
    <DataListSelector
      :showDialogBatchNo.sync="showDialogBatchNo"
      @selectBatch="selectBatch"
    />
  </div>
</template>

<style lang="scss" scoped>
.create-dialog {
  width: 100%;
  .item_sms_title {
    position: relative;
    .word_tip {
      position: absolute;
      right: 20px;
      top: 0;
    }
  }
  .item_sms_content {
    position: relative;
    .word_tip {
      position: absolute;
      right: 0px;
      bottom: -34px;
    }
    .changeColor {
      color: #e6a23c;
    }
  }
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
  .userTotal {
    margin-left: 40px;
    .bold {
      font-weight: 600;
    }
  }
  /deep/ .el-textarea.is-disabled .el-textarea__inner {
    color: #666;
  }
  /deep/ .el-select,
  .showTemSms {
    width: 80%;
  }
  .create-tem-btn {
    margin-left: 10px;
  }
}
.el-date-picker {
  .el-button--text {
    display: none !important;
    color: red;
  }
}
.selectSms.el-button {
  background-color: #409eff;
  color: #fff;
  border-radius: 0;
}
.userSelect {
  font-size: 14px;
  color: #606266;
}
.userSelectTXT {
  margin-left: 10px;
}
</style>

<script>
import FilterUsersDailog from '@/components/bfs/filterUsersDailog'
import ImportList from '@/components/bfs/importList'
import { mapGetters } from 'vuex'
import { pushsmsPushAdd } from '@/api/bfs/letterManagement'
import CreateSMSDialog from '@/components/mkt/TemplateDialog/createSMSDialog'
import { querySMSTemplateList } from '@/api/mkt/template.js'
import StragetySelector from '@/components/mkt/StragetySelector'
import { getProduct } from '@/api/mkt/stragety.js'
import DataListSelector from '@/components/bfs/dataListSelector'
export default {
  components: {
    FilterUsersDailog,
    ImportList,
    CreateSMSDialog,
    StragetySelector,
    DataListSelector
  },
  props: {
    dialogShow: {
      type: Boolean,
      default: false
    },
    disabledStatus: {
      type: Boolean,
      default: false
    },
    checkRowObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      productList: [],
      actionType: 'create',
      showDialog: false, // 是否显示=》选择模板
      showDialogBatchNo: false, // 选择名单弹窗
      stragetyType: null,
      queryConditions: {
        // 短信模板列表：参数
        page: {
          pageNum: 1,
          pageSize: 1000,
          totalRecord: 0
        },
        data: {
          product: [],
          updateBy: '',
          name: ''
        }
      },
      smsTemplateList: [], // 短信模板：列表
      createSMSDialogShow: false, // 创建短信模板
      currentActionID: '',
      //创建共用一个接口（绑定统一表单对象）
      formObj: {
        smsTitle: '',
        smsContent: '',
        businessLine: '',
        product: '',
        // smsChannel: '',
        templateCode: '',
        startTime: '',
        userGroup: '',
        // fileUrl: "",
        batchNo: '',
        createUser: '',
        jumpType: '',
        startType: ''
      },
      fileName: '',
      //筛选用总数
      filterUserTotal: null,
      //服务消息筛选
      filterUserDialog: false,
      //短信校验规则
      formRules: {
        // smsTitle: [{ validator: validateTitle, trigger: "blur" }],
        // smsContent: [{ validator: validateContent, trigger: "blur" }],
        smsTitle: [
          { required: true, message: '请选择短信模板', trigger: 'change' }
        ],
        businessLine: [
          { required: true, message: '请选择所属业务', trigger: 'change' }
        ],
        // smsChannel: [
        //   { required: true, message: "请选择发送渠道", trigger: "change" }
        // ],
        startType: [
          { required: true, message: '请选择发送类型', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择发送时间', trigger: 'change' }
        ],
        userGroup: [
          { required: true, message: '请选择用户群体', trigger: 'change' }
        ]
      },
      // 设置只能选择当前日期及之后的日期
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7 //如果没有后面的-8.64e7就是不可以选择今天的
        }
      }
    }
  },
  computed: {
    ...mapGetters(['name']),
    setTitle() {
      if (this.disabledStatus) {
        return '查看'
      } else {
        return '创建'
      }
    }
  },
  watch: {
    disabledStatus: {
      handler(val, oldVal) {
        if (val) {
          this.formObj = this.checkRowObj
          // 需要返回短信id才能预览
          // this.currentActionID = this.formObj.id
          // console.log(this.formObj)
          // console.log(this.formObj.id)
        } else {
          //将原始对象的值
          this.formObj = this.$options.data().formObj
        }
        //清空触发的表单校验
        if (this.$refs['smsCreateform'] !== undefined) {
          this.$refs['smsCreateform'].resetFields()
        }
      },
      deep: true, //true 深度监听
      immediate: true //立即执行
    },
    dialogShow(val) {
      if (val) this.getProduct()
    }
  },
  activated() {
    if (this.$route.query.closeDialog) {
      this.actionType = 'create'
      this.createSMSDialogShow = false
      // 存在bug，刷新之后，还是会执行当前代码，点击创建按钮，仍然会从缓存取数据，而不是清空后的弹窗
      // smsTestDetial页面回来之后，默认填上模板信息，接口没有返回信息，从缓存中拿
      // let row = JSON.parse(sessionStorage.getItem('sms-test-content'))
      // console.log(row)
      // // smsTitle 标题、smsContent 内容、此外新接口需要模板code：templateCode
      // this.currentActionID = row.categoryId
      // this.formObj.smsTitle = row.name
      // this.formObj.smsContent = row.content
      // this.formObj.templateCode = row.templateCode
      // this.formObj.businessLine = row.product
    }
  },
  mounted() {
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
    // 创建短信模板（显示隐藏）
    templateDisplay(show) {
      this.actionType = 'create'
      this.createSMSDialogShow = show
    },
    // 选择按钮
    changeStragety() {
      // 短信模板，此处固定sms
      this.stragetyType = 'SMS'
      this.showDialog = true
    },
    // 预览
    previewTem() {
      if (this.currentActionID) {
        this.stragetyType = 'SMS'
        this.actionType = 'preview'
        this.createSMSDialogShow = true
      } else {
        this.$message({
          message: '请先选择模板再进行预览操作',
          type: 'error'
        })
      }
    },
    // 选择名单
    selectList() {
      this.showDialogBatchNo = true
    },
    selectBatch(row) {
      if (row) {
        this.formObj.batchNo = row.batchNo
        console.log(this.formObj)
        this.$message({
          message: '选择成功',
          type: 'success'
        })
      }
    },
    // 选择短信模板
    changeCurrentTemplate(row) {
      // this.currentTemplate = row
      this.currentActionID = row.id
      this.formObj.smsTitle = row.name
      this.formObj.smsContent = row.content
      this.formObj.templateCode = row.templateCode
      this.formObj.product = row.product
      // this.formObj.businessLine = row.product
      // smsTitle 标题、smsContent 内容、此外新接口需要模板code：templateCode
      console.log(this.formObj)
      console.log(row)
    },
    onSubmit(formName) {
      console.log(this.formObj)
      // 原接口需要的参数：smsTitle 标题、smsContent 内容、此外新接口需要模板code：templateCode
      // businessLine 所属业务
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.savePushMsg()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取短信模板列表
    getListItem: function () {
      if (this.$route.path === '') {
        return
      }
      querySMSTemplateList(this.queryConditions)
        .then((res) => {
          if (res.data) {
            this.smsTemplateList = res.data
          }
        })
        .catch((e) => {})
    },
    cancelDailog() {
      console.log(this.formObj)
      this.$emit('cancelDailog', false)
      if (this.$refs['smsCreateform'] !== undefined) {
        this.$refs['smsCreateform'].resetFields()
      }
    },
    dialogClose() {
      this.$emit('cancelDailog', false)
      if (this.$refs['smsCreateform'] !== undefined) {
        this.$refs['smsCreateform'].resetFields()
      }
    },
    //请求创建接口
    savePushMsg() {
      let _this = this
      _this.formObj.createUser = _this.name
      let data = {
        page: {
          pageNum: 1,
          pageSize: 50,
          startIndex: 0,
          totalPage: 0,
          totalRecord: 0
        },
        data: _this.formObj
      }
      pushsmsPushAdd(data)
        .then((res) => {
          console.log(res)
          //提交成功时，清空弹窗数据
          let obj = _this.formObj
          Object.keys(obj).forEach((key) => (obj[key] = ''))
          _this.$emit('createdSuccess', false)
          //toast提示
          _this.$message({
            message: '创建成功',
            type: 'success'
          })
          //清空弹窗触发change的校验
          _this.$refs['smsCreateform'].resetFields()
        })
        .catch((e) => {
          console.log('error')
        })
    },
    //筛选用户
    userFiltrateClick() {
      this.filterUserDialog = true
    },
    //服务消息，筛选用户
    filterUserDailogClose() {
      this.filterUserDialog = false
    },
    //筛选成功
    successFilter(data) {
      this.filterUserDialog = false
      this.formObj.fileUrl = data.filterResult
      this.filterUserTotal = data.userCount
    },
    //获取上传的excel表，返回的url
    getBinaryData(data) {
      this.formObj.fileUrl = data.fileUrl
      this.fileName = data.fileName
    }
  }
}
</script>
